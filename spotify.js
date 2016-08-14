const SpotifyWebApi = require('spotify-web-api-node');
const config = require('./config.json');

const API = new SpotifyWebApi({
  clientId: config.spotify.id,
  clientSecret: config.spotify.secret
});

function getLikedSongs() {
  API.getPlaylist(config.spotify.username, config.spotify.likedFromRadioId)
  .then(data => {
    for (const item of data.body.tracks.items) {
      console.log('addedAt', item.added_at);
      console.log('name', item.track.name);
      console.log('mainArtist', item.track.artists[0].name);
    }
  }, err => {
    console.log('Something went wrong!', err);
  });
}

// Retrieve an access token.
API.clientCredentialsGrant()
  .then(data => {
    // Save the access token so that it's used in future calls
    API.setAccessToken(data.body.access_token);
    getLikedSongs();
  }, err => {
        console.log('Something went wrong when retrieving an access token', err);
  });
