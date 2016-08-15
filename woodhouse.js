const Bot = require('node-telegram-bot-api');
const spotify = require('./spotify');
const config = require('./config.json');

const youtube = require('./youtube');

const TOKEN = config.key;
// const MESSAGE_STR = process.argv[2];

const WH = new Bot(TOKEN, { polling: true });

// Matches /shutdown [whatever]
WH.onText(/\/shutdown (.+)/, (msg, match) => {
  const fromId = msg.from.id;

  switch (match[1]) {
    case 'rpizero': {
      WH.sendMessage(fromId, 'Shutting down Raspberry Pi Zero..');
      break;
    }
    default: {
      WH.sendMessage(fromId, "Sorry, I don't know that machine");
    }
  }
});

WH.onText(/\/getTracks (.+)/, (msg, match) => {
  const fromId = msg.from.id;

  spotify.getLikedSongs(data => {
    WH.sendMessage(fromId, data);

    for (const item of data) {
      console.log('beep',item);
      youtube.searchByVideoName(item, data => {
        youtube.download(data[0].id);
      });
    }
  });
});
