const config = require('./config.json');
const path = require('path');
const google = require('googleapis');
const youtube = google.youtube('v3');
const ffmpeg = require('fluent-ffmpeg');
const youtubeDl = require('youtube-dl');

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
  path: 'downloads',
  audioOnly: false
}) {
  return new Promise((resolve, reject) => {
    const url = `http://www.youtube.com/watch?v=${videoId}`;
    let format = 'mp4';
    if (options.audioOnly) {
      format = 'mp3';
    }

    // TODO Add proper support for options
    const video = youtubeDl(url,
      // Optional arguments passed to youtube-dl.
      ['--format=18'],
      // Additional options can be given for calling `child_process.execFile()`.
      { cwd: __dirname });

    // Will be called when the download starts.
    video.on('info', info => {
      let filename = info.filename;
      filename = filename
                  .replace('.mp4', '')
                  .substring(0, filename.length - 16);

      if (options.filename) {
        filename = options.filename;
      }

      // Convert to audio
      ffmpeg({ source: video })
        .on('end', () => {
          resolve();
        })
        .toFormat(format)
        .save(path.join(options.path, `${filename}.${format}`));
    });
  });
}


module.exports = {
  searchByVideoName,
  download
};
