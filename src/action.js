const { whatsappTargetNumber } = require("./config");
const { scrapeMatches } = require("./scraper");
const { initializeBot } = require("./bot");
const { sendMatchSummary } = require("./bot/messages");

console.log("Iniciando ejecución única para GitHub Actions...");

initializeBot(async (client) => {
  console.log("Cliente de WhatsApp listo. Obteniendo partidos de la semana...");
  try {
    const matches = await scrapeMatches();
    await sendMatchSummary(client, whatsappTargetNumber, matches);

    console.log("Proceso completado. Cerrando en 5 segundos...");
    // Damos 5 segundos para asegurar que el mensaje fue enviado por la red antes de matar el proceso
    setTimeout(() => {
      console.log("Ejecución finalizada.");
      process.exit(0);
    }, 5000);
  } catch (error) {
    console.error("Error en la ejecución:", error);
    process.exit(1);
  }
});
