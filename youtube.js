const fs = require('fs');
const path = require('path');
const google = require('googleapis');
const youtube = google.youtube('v3');
const youtubeStream = require('youtube-audio-stream');
const config = require('./config.json');

function searchByVideoName(query, cb) {
  const params = {
    auth: config.youtube.key,
    part: 'snippet',
    q: query,
    type: 'video'
  };

  youtube.search.list(params, (err, data) => {
    const videos = [];

    for (const item of data.items) {
      const video = {
        id: item.id.videoId,
        title: item.snippet.title
      };

      videos.push(video);
    }
    cb(videos);
  });
}

function download(videoId, options = {
  filename: null,
  path: 'downloads',
  audioOnly: false
}) {
  /* youtubeDl(`http://www.youtube.com/watch?v=${videoId}`, {
    filter: 'audioonly'
  })
  .pipe(fs.createWriteStream(path.join(
    options.path,
    `${options.filename}.mp3`
  )));*/

  const requestUrl = `http://www.youtube.com/watch?v=${videoId}`;
  try {
    youtubeStream(requestUrl)
    .pipe(fs.createWriteStream(path.join(
      options.path,
      `${options.filename}.mp3`
    )));
  } catch (exception) {
    console.log(exception);
  }
}

module.exports = {
  searchByVideoName,
  download
};
