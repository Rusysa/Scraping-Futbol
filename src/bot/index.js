const axios = require("axios");

/**
 * Crea una instancia liviana del bot de Telegram.
 * No requiere sesión de navegador ni QR: solo el token del bot.
 *
 * Cómo obtener el token:
 *   1. Abre Telegram y busca @BotFather
 *   2. Ejecuta /newbot y sigue las instrucciones
 *   3. Copia el token que te da y guárdalo en la variable TELEGRAM_BOT_TOKEN
 *
 * Cómo obtener el chat ID:
 *   1. Envíale un mensaje a tu bot desde Telegram
 *   2. Visita: https://api.telegram.org/bot<TU_TOKEN>/getUpdates
 *   3. Copia el valor de "id" dentro de "chat"
 *   4. Guárdalo en la variable TELEGRAM_CHAT_ID
 */
function createBot(token) {
  if (!token) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN no está configurado. Revisa tu archivo .env o los Secrets de GitHub.",
    );
  }

  const apiBase = `https://api.telegram.org/bot${token}`;

  return {
    /**
     * Envía un mensaje de texto al chat indicado.
     * @param {string|number} chatId  - ID del chat destino
     * @param {string}        text    - Contenido del mensaje
     * @param {object}        options - Opciones adicionales de la API de Telegram
     */
    sendMessage: async (chatId, text, options = {}) => {
      const url = `${apiBase}/sendMessage`;
      const payload = {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        ...options,
      };

      const response = await axios.post(url, payload);
      return response.data;
    },
  };
}

module.exports = { createBot };
