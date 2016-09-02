const config = require('./config.json');
const md5 = require('./lib/fritzbox_md5');
const request = require('request');
const cheerio = require('cheerio');



function getActiveDevices() {
  request('http://fritz.box', (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const challengePosStart = body.indexOf('"challenge":') + 14;
      const challengePosEnd = body.indexOf(',', challengePosStart) - 1;
      const challenge = body.substring(challengePosStart, challengePosEnd);

      console.log(challenge);
      console.log(md5.hex('test'));

      //let $ = cheerio.load(body);


    }
  });
}

getActiveDevices();
