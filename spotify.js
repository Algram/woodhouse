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

function getSongsFromSharePlaylist(cb) {
  API.getPlaylist(config.spotify.username, config.spotify.syncPlaylistId)
  .then(data => {
    const tracks = [];
    for (const item of data.body.tracks.items) {
      const fullName = `${item.track.artists[0].name} - ${item.track.name}`;
      tracks.push(fullName);
    }

    cb(tracks);
  }, err => {
    console.log('Something went wrong!', err);
    cb("Couldn't get tracks");
  });
}


module.exports = {
  getSongsFromSharePlaylist
};
