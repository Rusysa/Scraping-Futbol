const axios = require("axios");
const cheerio = require("cheerio");
const { targetLeagues, daysToScrape } = require("../config");

async function scrapeMatches() {
  const url = "https://www.futbolenvivomexico.com/";
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "es-MX,es;q=0.9",
      },
    });

    const $ = cheerio.load(data);
    const matches = [];
    let currentLeague = "";
    let currentDay = "";
    let dayCount = 0;

    $("tr").each((i, el) => {
      const $el = $(el);

      if ($el.hasClass("cabeceraTabla")) {
        dayCount++;
        // Limpiamos el texto del encabezado, ej: "Partidos de hoy lunes, 16/03/2026" -> "Lunes, 16/03/2026"
        currentDay = $el
          .text()
          .trim()
          .replace(/^Partidos de hoy /i, "")
          .replace(/^Mañana /i, "");
        // Capitalizamos la primera letra
        currentDay = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);
      } else if ($el.hasClass("cabeceraCompericion")) {
        currentLeague = $el.text().trim();
      } else if (dayCount <= daysToScrape) {
        const leagueLower = currentLeague.toLowerCase();

        // Si targetLeagues está vacío, devuelve todas. Si no, filtra. También excluye las femenil.
        const isTargetLeague =
          (targetLeagues.length === 0 ||
            targetLeagues.some((l) => leagueLower.includes(l))) &&
          !leagueLower.includes("femenil");

        if (isTargetLeague) {
          const time = $el.find("td.hora").text().trim();
          const local = $el
            .find("td.local")
            .text()
            .trim()
            .replace(/\n/g, "")
            .replace(/  +/g, " ");
          const visitor = $el
            .find("td.visitante")
            .text()
            .trim()
            .replace(/\n/g, "")
            .replace(/  +/g, " ");

          const channels = [];
          $el.find("td.canales ul.listaCanales li").each((j, li) => {
            let channelName = $(li)
              .text()
              .trim()
              .replace(": VER PARTIDO", "")
              .replace("(Ver gratis)", "")
              .trim();
            if (channelName) channels.push(channelName);
          });

          if (time && local && visitor) {
            matches.push({
              fecha: currentDay,
              hora: time,
              equipos: `${local} vs ${visitor}`,
              canal: channels.join(", ") || "Por confirmar",
              competicion: currentLeague,
            });
          }
        }
      }
    });

    return matches;
  } catch (error) {
    console.error(
      "Error al realizar el scraping en futbolenvivomexico:",
      error.message,
    );
    return [];
  }
}

async function scrapeResults() {
  try {
    const today = new Date();
    const past = new Date(today);
    past.setDate(past.getDate() - 4);
    
    const formatDate = d => d.toISOString().split('T')[0].replace(/-/g, '');
    const startDate = formatDate(past);
    const endDate = formatDate(today);
    
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/mex.1/scoreboard?dates=${startDate}-${endDate}`;
    const { data } = await axios.get(url);
    const results = [];
    
    for (const event of data.events || []) {
      if (event.status.type.name === 'STATUS_FULL_TIME') {
        const home = event.competitions[0].competitors[0];
        const away = event.competitions[0].competitors[1];
        
        let fecha = new Date(event.date).toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City', weekday: 'long', day: '2-digit', month: '2-digit' });
        fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);
        
        results.push({
          fecha: fecha,
          hora: "Finalizado",
          equipos: `${home.team.name} ${home.score} - ${away.score} ${away.team.name}`,
          canal: "Resultado",
          competicion: 'Liga MX'
        });
      }
    }
    return results;
  } catch (error) {
    console.error("Error al obtener resultados de ESPN:", error.message);
    return [];
  }
}

module.exports = { scrapeMatches, scrapeResults };
