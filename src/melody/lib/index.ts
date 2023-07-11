import { performFFT, generateAudioFingerprint } from './utils';
import { readFile } from 'fs/promises';
import { Lame } from 'node-lame';

class MelodyAnalytic {
  /* context: any;

  constructor() {
    this.context = new AudioContext();
  } */

  /** get audio file from path */
  async readAudioFile(filePath: string) {
    try {
      const decoder = new Lame({
        output: 'buffer',
      }).setFile(filePath);

      const buffer = await decoder.decode();
      if (buffer) return decoder.getBuffer();
    } catch (error) {
      throw Error('Error at read audio file');
    }
  }

  async main() {
    const buffer = await this.readAudioFile('./music/safe_and_sound.mp3');
    const audio32Array = Float32Array.from(buffer);
    const fftSize = 2048;
    const magnitudes = performFFT(audio32Array, fftSize);
    const fingerprint = generateAudioFingerprint(magnitudes);
    // console.log(finge);

    /* // Tạo bản sao của AudioBuffer trong ngữ cảnh ngoại tuyến
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: audioData.numberOfChannels,
      length: audioData.length,
      sampleRate: audioData.sampleRate,
    });

    const copiedBuffer = offlineContext.createBuffer(
      audioData.numberOfChannels,
      audioData.length,
      audioData.sampleRate,
    );
    copiedBuffer.copyToChannel(audioData.getChannelData(0), 0);

    // Tạo đối tượng AnalyserNode và kết nối vào OfflineAudioContext
    const analyserNode = offlineContext.createAnalyser();
    const fftSize = 2048; // Kích thước FFT
    analyserNode.fftSize = fftSize;
    const sourceNode = offlineContext.createBufferSource();
    sourceNode.buffer = copiedBuffer;
    sourceNode.connect(analyserNode);
    analyserNode.connect(offlineContext.destination);

    // Bắt đầu phát lại và kết thúc khi hoàn thành
    sourceNode.start();
    await offlineContext.startRendering();

    // Lấy dữ liệu tần số từ AnalyserNode
    const frequencyData = new Float32Array(analyserNode.fftSize / 2);
    analyserNode.getFloatFrequencyData(frequencyData);

    // Thực hiện phân tích FFT
    const fftResult = performFFT(frequencyData);
    console.log(fftResult); */
  }
}

export const melodyAnalytic = new MelodyAnalytic();
