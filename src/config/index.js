require("dotenv").config();

module.exports = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  scrapeSchedule: process.env.SCRAPE_SCHEDULE || "0 18 * * *",
  targetLeagues: process.env.TARGET_LEAGUES
    ? process.env.TARGET_LEAGUES.split(",").map((l) => l.trim().toLowerCase())
    : ["liga mx", "liga bbva mx", "selección mexicana"],
  daysToScrape: process.env.DAYS_TO_SCRAPE
    ? parseInt(process.env.DAYS_TO_SCRAPE, 10)
    : 7,
};
