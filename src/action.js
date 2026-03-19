const { telegramBotToken, telegramChatId } = require("./config");
const { scrapeMatches } = require("./scraper");
const { createBot } = require("./bot");
const { sendMatchSummary } = require("./bot/messages");

console.log("Iniciando ejecución única para GitHub Actions...");

async function main() {
  try {
    const bot = createBot(telegramBotToken);
    console.log("Bot de Telegram listo. Obteniendo partidos de la semana...");

    const matches = await scrapeMatches();
    await sendMatchSummary(bot, telegramChatId, matches);

    console.log("Ejecución finalizada.");
    process.exit(0);
  } catch (error) {
    console.error("Error en la ejecución:", error);
    process.exit(1);
  }
}

main();
