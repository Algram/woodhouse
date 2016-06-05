var Bot = require('node-telegram-bot-api');
var config = require('./config.json');

var TOKEN = config.key;
var MESSAGE_STR = process.argv[2];

var bot = new Bot(TOKEN, {polling: true});

// Matches /shutdown [whatever]
bot.onText(/\/shutdown (.+)/, function (msg, match) {
  console.log('asd');
  var fromId = msg.from.id;

  switch (match[1]) {
    case 'rpizero':
      var resp = match[1];
      bot.sendMessage(fromId, "Shutting down Raspberry Pi Zero..");

      break;
    default:
      bot.sendMessage(fromId, "Sorry, I don't know that machine");
  }
});

/*setTimeout(function() {
    process.exit();
}, 10000);*/
