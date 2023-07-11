// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require('fluent-ffmpeg');
// let track = './music/safe_and_sound.mp3'; //your path to source file

export const convert = (path: string) => {
  ffmpeg(path)
    .toFormat('wav')
    .on('error', (err) => {
      console.log('An error occurred: ' + err.message);
    })
    .on('progress', (progress) => {
      // console.log(JSON.stringify(progress));
      console.log('Processing: ' + progress.targetSize + ' KB converted');
    })
    .on('end', () => {
      console.log('Processing finished !');
    })
    .save('./music/hello.wav');
};
