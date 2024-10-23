#!/usr/bin/env node
// download.js
import fs from "fs"
const { Command } = require('commander');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');

const program = new Command();

program
  .version('1.0.0')
  .description('YouTube to MP3 downloader')
  .option('-u, --url <url>', 'YouTube video URL')
  .option('-o, --output <output>', 'Output file name', 'output.mp3')
  .option('-d --directory <directory>','Output file directory','Outputs')
  .parse(process.argv);

const options = program.opts();
console.log(options)

if (!options.url) {
  console.error('Please provide a YouTube video URL using the -u or --url option.');
  process.exit(1);
}



const outputPathDirectory = path.resolve(options.directory);

if(!fs.existsSync(outputPathDirectory)){
  console.error('The specified output directory does not exist.');
  process.exit(1);
}

const videoUrl = options.url;
const outputPath = path.join(options.directory,options.output)

const stream = ytdl(videoUrl, { quality: 'highestaudio' });

ffmpeg(stream)
  .setFfmpegPath(ffmpegStatic)
  .audioBitrate(128)
  .toFormat('mp3')
  .on('end', () => {
    console.log('Conversion finished');
  })
  .on('error', (err : Error) => {
    console.error('An error occurred:', err.message);
  })
  .save(outputPath);
