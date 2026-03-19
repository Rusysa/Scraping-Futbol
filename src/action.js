const { telegramBotToken, telegramChatId } = require("./config");
const { scrapeMatches, scrapeResults } = require("./scraper");
const { createBot } = require("./bot");
const { sendMatchSummary } = require("./bot/messages");

console.log("Iniciando ejecución única para GitHub Actions...");

async function main() {
  try {
    const bot = createBot(telegramBotToken);
    console.log("Bot de Telegram listo. Obteniendo partidos de la semana...");

    const mxDate = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
    const isMonday = new Date(mxDate).getDay() === 1;

    const matches = await scrapeMatches();
    
    let results = [];
    if (isMonday) {
      console.log("Es lunes. Obteniendo resultados de los últimos partidos...");
      results = await scrapeResults();
    }

    await sendMatchSummary(bot, telegramChatId, { matches, results });

    console.log("Ejecución finalizada.");
    process.exit(0);
  } catch (error) {
    console.error("Error en la ejecución:", error);
    process.exit(1);
  }
}

main();
