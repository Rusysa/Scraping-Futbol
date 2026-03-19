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
  const mxDate = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
  const isMonday = new Date(mxDate).getDay() === 1;

  const matches = await scrapeMatches();
  
  let results = [];
  if (isMonday) {
    const { scrapeResults } = require("./scraper");
    results = await scrapeResults();
  }

  await sendMatchSummary(bot, telegramChatId, { matches, results });
}, {
  timezone: "America/Mexico_City"
});

// Envío inmediato para probar si las variables de entorno están correctamente configuradas.
console.log("Ejecutando un envío de prueba inicial...");
scrapeMatches().then(async (matches) => {
  const mxDate = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
  const isMonday = new Date(mxDate).getDay() === 1;
  let results = [];
  if (isMonday) {
    const { scrapeResults } = require("./scraper");
    results = await scrapeResults();
  }
  sendMatchSummary(bot, telegramChatId, { matches, results });
});
