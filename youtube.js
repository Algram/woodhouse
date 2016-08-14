const fs = require('fs');
const path = require('path');
const google = require('googleapis');
const youtube = google.youtube('v3');
const youtubeDl = google.youtube('youtube-dl');
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

function download(videoId, options) {
  const video = youtubeDl(`http://www.youtube.com/watch?v=${videoId}`,
  // Optional arguments passed to youtube-dl.
  ['--extract-audio', 'audio-format=mp3'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });

  // Will be called when the download starts.
  video.on('info', info => {
    console.log('Download started');
    console.log('filename:', info.filename);
    console.log('size:', info.size);
  });

  video.pipe(path.join(options.downloadDir, fs.createWriteStream(`${videoId}.mp3`)));
}

module.exports = {
  searchByVideoName: searchByVideoName,
  download: download
};
