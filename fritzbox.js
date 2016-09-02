const config = require('./config.json');
const crypto = require('crypto');
const request = require('request');


function getActiveDevices() {
  // TODO
}

function getFritzBoxData() {
  return new Promise((resolve, reject) => {
    request('http://fritz.box', (err, res, firstBody) => {
      if (err) reject(Error(err));

      const challengePosStart = firstBody.indexOf('"challenge":') + 14;
      const challenge = firstBody.substring(challengePosStart, challengePosStart + 8);

      let paramResponse = `${challenge}-${config.fritzbox.password}`;

      // Hash paramResponse
      const md5 = crypto.createHash('md5');
      md5.update(paramResponse, 'ucs2'); // 16 - Unicode
      const digest = md5.digest('hex');

      paramResponse = `${challenge}-${digest}`;

      const options = {
        url: 'http://fritz.box',
        form: {
          response: paramResponse,
          lp: 'netDev',
          username: ''
        }
      };

      request.post(options, (err, res, secondBody) => {
        if (err) reject(Error(err));

        const sessionIdPosStart = secondBody.indexOf('"sid":') + 8;
        const sessionId = secondBody.substring(sessionIdPosStart, sessionIdPosStart + 16);

        const options = {
          url: 'http://fritz.box/data.lua',
          form: {
            sid: sessionId,
            lang: 'en',
            page: 'netDev',
            type: 'all',
            xhr: 1,
            no_sidrenew: ''
          }
        };

        request.post(options, (err, res, thirdBody) => {
          if (err) reject(Error(err));

          const thirdBodyParsed = JSON.parse(thirdBody);
          resolve(thirdBodyParsed.data);
        });
      });
    });
  });
}

module.exports = {
  getFritzBoxData,
  getActiveDevices
};
