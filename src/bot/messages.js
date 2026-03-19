function formatMatchesMessage({ matches = [], results = [] }) {
  if ((!matches || matches.length === 0) && (!results || results.length === 0)) {
    return "No se encontraron partidos en los próximos días ni resultados recientes.";
  }

  // Separar los partidos de Necaxa
  const isNecaxa = (match) => match.equipos.toLowerCase().includes("necaxa");
  
  const necaxaUpcoming = (matches || []).filter(isNecaxa);
  const otherUpcoming = (matches || []).filter((m) => !isNecaxa(m));
  
  const necaxaResults = (results || []).filter(isNecaxa);
  const otherResults = (results || []).filter((m) => !isNecaxa(m));

  let message = "⚽ *Partidos de la Semana* ⚽\n\n";

  // Mostrar primero todo lo relacionado a Necaxa (Resultados y Próximos)
  if (necaxaResults.length > 0 || necaxaUpcoming.length > 0) {
    message += `⚡ *¡Rayos del Necaxa!* ⚡\n`;
    message += `➖➖➖➖➖➖➖➖➖➖\n`;
    
    necaxaResults.forEach((match) => {
      message += `🏆 *${match.competicion}* (Resultado)\n`;
      message += `📅 ${match.fecha}\n`;
      message += `🕒 ${match.hora} | ${match.equipos}\n\n`;
    });

    necaxaUpcoming.forEach((match) => {
      message += `🏆 *${match.competicion}*\n`;
      message += `📅 ${match.fecha}\n`;
      message += `🕒 ${match.hora} | ${match.equipos}\n`;
      message += `📺 ${match.canal}\n\n`;
    });
  }

  // Agrupar los resultados restantes
  if (otherResults.length > 0) {
    message += `✅ *Resultados Recientes* ✅\n`;
    message += `➖➖➖➖➖➖➖➖➖➖\n`;
    otherResults.forEach((match) => {
      message += `🏆 *${match.competicion}*\n`;
      message += `📅 ${match.fecha}\n`;
      message += `🕒 ${match.hora} | ${match.equipos}\n\n`;
    });
  }

  // Agrupar los próximos partidos restantes por fecha
  if (otherUpcoming.length > 0) {
    const matchesByDate = otherUpcoming.reduce((acc, match) => {
      if (!acc[match.fecha]) {
        acc[match.fecha] = [];
      }
      acc[match.fecha].push(match);
      return acc;
    }, {});

    for (const [fecha, games] of Object.entries(matchesByDate)) {
      message += `📅 *${fecha}*\n`;
      message += `➖➖➖➖➖➖➖➖➖➖\n`;

      games.forEach((match) => {
        message += `🏆 *${match.competicion}*\n`;
        message += `🕒 ${match.hora} | ${match.equipos}\n`;
        message += `📺 ${match.canal}\n\n`;
      });
    }
  }

  message += "🏁 _¡Disfruta la semana de fútbol\\!_";
  return message;
}

async function sendMatchSummary(bot, chatId, data) {
  if (!chatId) {
    console.error(
      "Error: Por favor, configura TELEGRAM_CHAT_ID en el archivo .env",
    );
    return;
  }

  const payload = Array.isArray(data) ? { matches: data, results: [] } : data;
  const message = formatMatchesMessage(payload);

  try {
    await bot.sendMessage(chatId, message);
    console.log("Resumen de partidos enviado exitosamente por Telegram.");
  } catch (error) {
    console.error("Error al enviar mensaje por Telegram:", error.message);
    if (error.response?.data) {
      console.error("Respuesta de la API de Telegram:", error.response.data);
    }
  }
}

module.exports = { formatMatchesMessage, sendMatchSummary };