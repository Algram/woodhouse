var config = require('./config.json');
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : config.spotify_id,
  clientSecret : config.spotify_secret,
  redirectUri : 'http://www.example.com/callback'
});
