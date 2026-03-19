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

  message += "🏁 _¡Disfruta la semana de fútbol!_";
  return message;
}

async function sendMatchSummary(client, targetNumber, matches) {
  const message = formatMatchesMessage(matches);

  if (!targetNumber || targetNumber.includes("X")) {
    console.error(
      "Error: Por favor, configura WHATSAPP_TARGET_NUMBER en el archivo .env",
    );
    return;
  }

  // Intenta obtener el ID correcto del número en los servidores de WhatsApp
  let chatId = targetNumber;
  if (!targetNumber.includes("@")) {
    try {
      const numberId = await client.getNumberId(targetNumber);
      if (numberId) {
        chatId = numberId._serialized;
      } else {
        // En México a veces se requiere agregar un '1' después del '52'
        const altNumberId = await client.getNumberId(
          targetNumber.replace(/^52/, "521"),
        );
        if (altNumberId) {
          chatId = altNumberId._serialized;
        } else {
          chatId = targetNumber + "@c.us";
        }
      }
    } catch (e) {
      chatId = targetNumber + "@c.us";
    }
  }

  try {
    await client.sendMessage(chatId, message);
    console.log("Resumen de partidos enviado exitosamente.");
  } catch (error) {
    console.error("Error al enviar mensaje por WhatsApp:", error.message);
  }
}

module.exports = { formatMatchesMessage, sendMatchSummary };
