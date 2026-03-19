const cron = require("node-cron");
const { whatsappTargetNumber, scrapeSchedule } = require("./config");
const { scrapeMatches } = require("./scraper");
const { initializeBot } = require("./bot");
const { sendMatchSummary } = require("./bot/messages");

console.log("Iniciando el servicio de Scraper de Fútbol...");

initializeBot((client) => {
  console.log(`Programando tarea de envío con horario: ${scrapeSchedule}`);

  cron.schedule(scrapeSchedule, async () => {
    console.log("Ejecutando tarea programada de scraping...");
    const matches = await scrapeMatches();
    await sendMatchSummary(client, whatsappTargetNumber, matches);
  });

  // Envío inmediato para probar si hay variables de entorno correctamente configuradas.
  console.log("Ejecutando un envío de prueba inicial...");
  scrapeMatches().then((matches) => {
    sendMatchSummary(client, whatsappTargetNumber, matches);
  });
});
