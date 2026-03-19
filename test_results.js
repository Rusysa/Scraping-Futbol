const axios = require('axios');
async function scrapeResults() {
  try {
    const today = new Date();
    // Get past 4 days (Thursday to Sunday/Monday)
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
        results.push({
          fecha: new Date(event.date).toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City', weekday: 'long', day: '2-digit', month: '2-digit' }),
          equipos: `${home.team.name} ${home.score} - ${away.score} ${away.team.name}`,
          competicion: 'Liga MX'
        });
      }
    }
    console.log(results);
  } catch (err) { console.error(err); }
}
scrapeResults();
