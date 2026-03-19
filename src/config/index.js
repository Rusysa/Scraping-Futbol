require("dotenv").config();

module.exports = {
  whatsappTargetNumber: process.env.WHATSAPP_TARGET_NUMBER,
  scrapeSchedule: process.env.SCRAPE_SCHEDULE || "0 8 * * *",
  targetLeagues: process.env.TARGET_LEAGUES
    ? process.env.TARGET_LEAGUES.split(",").map((l) => l.trim().toLowerCase())
    : ["liga mx", "liga bbva mx", "selección mexicana"],
  daysToScrape: process.env.DAYS_TO_SCRAPE
    ? parseInt(process.env.DAYS_TO_SCRAPE, 10)
    : 7,
};
