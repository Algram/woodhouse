const FritzBoxAPI = require('fritz-box').default;

const config = require('./config.json');

function showHome() {
  const fb = new FritzBoxAPI({
    username: 'admin',
    password: config.fritzbox,
    host: 'fritz.box'
  });
}

showHome();
