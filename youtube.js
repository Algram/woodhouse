const fs = require('fs');
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
  // TODO Add proper support for options
  const video = youtubeDl(`http://www.youtube.com/watch?v=${videoId}`,
    // Optional arguments passed to youtube-dl.
    ['-x', '--audio-format=mp3', '-f bestaudio'],
    // Additional options can be given for calling `child_process.execFile()`.
    {
      cwd: __dirname
    });

  // Will be called when the download starts.
  video.on('info', info => {
    let filename = info._filename; // eslint-disable-line no-underscore-dangle
    filename = filename
                .replace('.webm', '')
                .substring(0, filename.length - 17);

    if (options.filename) {
      filename = options.filename;
    }

    video.pipe(fs.createWriteStream(`downloads/${filename}.mp3`));
  });
}

module.exports = {
  searchByVideoName,
  download
};
