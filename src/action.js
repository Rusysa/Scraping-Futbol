const { whatsappTargetNumber } = require("./config");
const { scrapeMatches } = require("./scraper");
const { initializeBot } = require("./bot");
const { sendMatchSummary } = require("./bot/messages");

const STARTUP_TIMEOUT_MS = 60 * 1000; // 60 segundos para establecer la sesión

console.log("Iniciando ejecución única para GitHub Actions...");

// Si la sesión de WhatsApp no está en caché, el cliente mostrará un QR y
// esperará indefinidamente. Este timeout previene que el job de CI se bloquee.
const startupTimeout = setTimeout(() => {
  console.error(
    "\n❌ Error: Tiempo de espera agotado. La sesión de WhatsApp no está disponible.",
  );
  console.error(
    "   Por favor, ejecuta el bot localmente con 'npm start' para generar",
  );
  console.error(
    "   la sesión, y asegúrate de que el caché 'wwebjs-auth' esté disponible en GitHub Actions.",
  );
  process.exit(1);
}, STARTUP_TIMEOUT_MS);

initializeBot(async (client) => {
  // La sesión se estableció correctamente, cancelamos el timeout de arranque
  clearTimeout(startupTimeout);

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
