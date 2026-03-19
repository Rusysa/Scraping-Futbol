const cron = require("node-cron");
const {
  telegramBotToken,
  telegramChatId,
  scrapeSchedule,
} = require("./config");
const { scrapeMatches } = require("./scraper");
const { createBot } = require("./bot");
const { sendMatchSummary } = require("./bot/messages");

console.log("Iniciando el servicio de Scraper de Fútbol con Telegram...");

const bot = createBot(telegramBotToken);

console.log(`Programando tarea de envío con horario: ${scrapeSchedule}`);

cron.schedule(scrapeSchedule, async () => {
  console.log("Ejecutando tarea programada de scraping...");
  const matches = await scrapeMatches();
  await sendMatchSummary(bot, telegramChatId, matches);
});

// Envío inmediato para probar si las variables de entorno están correctamente configuradas.
console.log("Ejecutando un envío de prueba inicial...");
scrapeMatches().then((matches) => {
  sendMatchSummary(bot, telegramChatId, matches);
});
