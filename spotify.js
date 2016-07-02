var config = require('./config.json');
var SpotifyWebApi = require('spotify-web-api-node');


/*var scopes = ['user-library-read'];
var state = 'some-state-of-my-choice';*/

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  redirectUri: 'https://example.com/callback',
  clientId: config.spotify_id,
  clientSecret: config.spotify_secret
});

/*var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
console.log(authorizeURL);*/

// The code that's returned as a query parameter to the redirect URI
var code = config.spotify_auth;

// Retrieve an access token and a refresh token
spotifyApi.authorizationCodeGrant(code)
  .then(function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

/*// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    init();


  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

function init() {
  // Get the authenticated user
  spotifyApi.getMe()
    .then(function(data) {
      console.log('Some information about the authenticated user', data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}*/
