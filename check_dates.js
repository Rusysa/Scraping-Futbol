const axios = require('axios');
const cheerio = require('cheerio');
axios.get('https://www.futbolenvivomexico.com/').then(({data}) => {
  const $ = cheerio.load(data);
  $('tr.cabeceraTabla').each((i, el) => console.log($(el).text().trim()));
});
