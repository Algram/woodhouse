const fs = require('fs');
const path = require('path');
const google = require('googleapis');
const youtube = google.youtube('v3');
const youtubeDl = require('youtube-dl');
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
    console.log(videos);
    cb(videos);
  });
}

function download(videoId, options) {
  const video = youtubeDl(`http://www.youtube.com/watch?v=${videoId}`,
    // Optional arguments passed to youtube-dl.
    ['-x', '--audio-format=mp3', '-f bestaudio'],
    // Additional options can be given for calling `child_process.execFile()`.
    {
      cwd: __dirname
    });

  // Will be called when the download starts.
  video.on('info', info => {
    console.log('Download started');
    console.log('filename:', info.filename);
    console.log('size:', info.size);

    video.pipe(fs.createWriteStream(`${info.filename}.mp3`));
  });
}

module.exports = {
  searchByVideoName: searchByVideoName,
  download: download
};
