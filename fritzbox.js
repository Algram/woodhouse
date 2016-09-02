const config = require('./config.json');
const crypto = require('crypto');
const request = require('request');


function getActiveDevices() {
  request('http://fritz.box', (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const challengePosStart = body.indexOf('"challenge":') + 14;
      const challengePosEnd = body.indexOf(',', challengePosStart) - 1;
      const challenge = body.substring(challengePosStart, challengePosEnd);

      let paramResponse = `${challenge}-${config.fritzbox.password}`;

      // Hash paramResponse
      const md5 = crypto.createHash('md5');
      md5.update(paramResponse, 'ucs2'); // 16 - Unicode
      const digest = md5.digest('hex');

      paramResponse = `${challenge}-${digest}`;

      request.post( {url:'http://fritz.box', form: {
        response: paramResponse,
        lp: 'netDev',
        username: ''
      } }, (err, httpResponse, body) => {
        const sessionIdPosStart = body.indexOf('"sid":') + 8;
        const sessionId = body.substring(sessionIdPosStart, sessionIdPosStart + 16);

        console.log(sessionIdPosStart, sessionId);

        request.post({ url: 'http://fritz.box/data.lua',
        form: {
          sid: sessionId,
          lang: 'en',
          page: 'netDev',
          type: 'all',
          xhr: 1,
          no_sidrenew: ''
        } }, (err,httpResponse,body) => {
          console.log(body);
        });
      });
    }
  });
}

function getFritzBoxData() {

}

getActiveDevices();
