const SpotifyWebApi = require('spotify-web-api-node');
const config = require('./config.json');

const API = new SpotifyWebApi({
  clientId: config.spotify.id,
  clientSecret: config.spotify.secret
});

// Retrieve an access token.
API.clientCredentialsGrant()
  .then(data => {
    // Save the access token so that it's used in future calls
    API.setAccessToken(data.body.access_token);
  }, err => {
    console.log('Something went wrong when retrieving an access token', err);
  });

function getLikedSongs(cb) {
  API.getPlaylist(config.spotify.username, config.spotify.likedFromRadioId)
  .then(data => {
    for (const item of data.body.tracks.items) {
      console.log('addedAt', item.added_at);
      console.log('name', item.track.name);
      console.log('mainArtist', item.track.artists[0].name);
      cb(item.track.name);
    }
  }, err => {
    console.log('Something went wrong!', err);
    cb("Couldn't get tracks");
  });
}

module.exports = {
  getLikedSongs: getLikedSongs
};
