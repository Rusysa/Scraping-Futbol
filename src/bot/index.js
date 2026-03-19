const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

function initializeBot(onReady) {
  const client = new Client({
    // Utilizamos LocalAuth para guardar la sesión y no tener que escanear el QR cada vez
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  client.on("qr", (qr) => {
    console.log("Escanea este código QR con WhatsApp para iniciar sesión:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Cliente de WhatsApp listo.");
    if (onReady) onReady(client);
  });

  client.on("disconnected", (reason) => {
    console.log("Cliente desconectado", reason);
  });

  client.initialize();
  return client;
}

module.exports = { initializeBot };
