var Bot = require('telegram-api');
var Message = require('telegram-api/types/Message');
var File = require('telegram-api/types/File');
var config = require('./config.json');

var CHAT_ID = config.chatid;
var MESSAGE_STR = process.argv[2];

var bot = new Bot({
  token: config.key
});

bot.start();

var answer = new Message().text(MESSAGE_STR).to(CHAT_ID);

bot.send(answer);

setTimeout(function() {
    process.exit();
}, 10000);
