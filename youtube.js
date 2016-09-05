const config = require('./config.json');
const path = require('path');
const fs = require('fs');
const google = require('googleapis');

const youtube = google.youtube('v3');
const ffmpeg = require('fluent-ffmpeg');
const youtubeDl = require('youtube-dl');


function exists(filename, cb) {
  fs.access(filename, fs.F_OK, (err) => {
    if (!err) {
      cb(true);
    } else {
      cb(false);
    }
  });
}

function searchByVideoName(query) {
  return new Promise((resolve, reject) => {
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
      resolve(videos);
    });
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
      let filename = info._filename;
      filename = filename
                  .replace('.mp4', '')
                  .substring(0, filename.length - 16);

      if (options.filename) {
        filename = options.filename;
      }

      const filePath = path.join(options.path, `${filename}.${format}`);

      exists(filePath, (doesExist) => {
        if (!doesExist) {
          // Convert to audio
          ffmpeg({ source: video })
          .on('end', () => {
            resolve();
          })
          .toFormat(format)
          .save(filePath);
        } else {
          resolve();
        }
      });
    });
  });
}


module.exports = {
  searchByVideoName,
  download
};
