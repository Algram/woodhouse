const Bot = require('node-telegram-bot-api');
const spotify = require('./spotify');
const youtube = require('./youtube');
const fritzbox = require('./fritzbox');

const config = require('./config.json');

const TOKEN = config.telegram.key;
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

WH.onText(/\/showHome/, () => {
  // TODO add fritzbox support to identify via wifi
});

WH.onText(/\/syncSpotify/, () => {
  spotify.getSongsFromSharePlaylist(songs => {
    for (const item of songs) {
      youtube.searchByVideoName(item, data => {
        // Download first video in the results list
        const options = {
          filename: item,
          path: 'downloads',
          audioOnly: true
        };

        youtube.download(data[0].id, options);
      });
    }
  });
});
