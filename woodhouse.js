const Bot = require('node-telegram-bot-api');
const spotify = require('./spotify');
const youtube = require('./youtube');

const config = require('./config.json');

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

WH.onText(/\/syncSpotify/, () => {
  spotify.getLikedSongs(songs => {
    for (const item of songs) {
      youtube.searchByVideoName(item, data => {
        // Download first video in the results list
        const options = {
          filename: item,
          audioOnly: true
        };

        youtube.download(data[0].id, options);
      });
    }
  });
});
