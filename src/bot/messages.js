function formatMatchesMessage(matches) {
  if (!matches || matches.length === 0) {
    return "No se encontraron partidos en los próximos días para las ligas seleccionadas.";
  }

  // Agrupar partidos por fecha
  const matchesByDate = matches.reduce((acc, match) => {
    if (!acc[match.fecha]) {
      acc[match.fecha] = [];
    }
    acc[match.fecha].push(match);
    return acc;
  }, {});

  let message = "⚽ *Partidos de la Semana* ⚽\n\n";

  for (const [fecha, games] of Object.entries(matchesByDate)) {
    message += `📅 *${fecha}*\n`;
    message += `➖➖➖➖➖➖➖➖➖➖\n`;

    games.forEach((match) => {
      message += `🏆 *${match.competicion}*\n`;
      message += `🕒 ${match.hora} | ${match.equipos}\n`;
      message += `📺 ${match.canal}\n\n`;
    });
  }

  message += "🏁 _¡Disfruta la semana de fútbol\\!_";
  return message;
}

async function sendMatchSummary(bot, chatId, matches) {
  if (!chatId) {
    console.error(
      "Error: Por favor, configura TELEGRAM_CHAT_ID en el archivo .env",
    );
    return;
  }

  const message = formatMatchesMessage(matches);

  try {
    await bot.sendMessage(chatId, message);
    console.log("Resumen de partidos enviado exitosamente por Telegram.");
  } catch (error) {
    console.error("Error al enviar mensaje por Telegram:", error.message);
    if (error.response?.data) {
      console.error("Respuesta de la API de Telegram:", error.response.data);
    }
  }
}

module.exports = { formatMatchesMessage, sendMatchSummary };
