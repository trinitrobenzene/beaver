import { log } from 'console';
import FFT from 'fft.js';

const RANGE = [40, 80, 120, 180, 300];

/**
 * Tính toán FFT của một tập tin âm thanh và trả về một mảng các giá trị độ lớn tương ứng với các tần số.
 * @param audioData Dữ liệu âm thanh đầu vào.
 * @param fftSize Kích thước của FFT.
 * @returns Mảng các giá trị độ lớn tương ứng với các tần số.
 */
export function performFFT(
  audioData: Float32Array,
  fftSize: number,
): Float32Array {
  const f = new FFT(fftSize);
  const out = f.createComplexArray();

  f.realTransform(out, audioData);
  f.completeSpectrum(out);

  /* console.log(out);

  const magnitudes = new Float32Array(fftSize / 2);
  for (let i = 0; i < fftSize / 2; i++) {
    const re = out[i][0];
    const im = out[i][1];
    magnitudes[i] = Math.sqrt(re * re + im * im);
  } */

  return Float32Array.from(out);
}

/**
 * Tạo mã hash từ các tần số.
 * @param p1 Tần số thứ nhất.
 * @param p2 Tần số thứ hai.
 * @param p3 Tần số thứ ba.
 * @param p4 Tần số thứ tư.
 * @returns Mã hash.
 */
export function hash(p1: number, p2: number, p3: number, p4: number): number {
  const FUZ_FACTOR = 2;
  return (
    Math.round((p4 - (p4 % FUZ_FACTOR)) * 1e6) +
    Math.round((p3 - (p3 % FUZ_FACTOR)) * 1e4) +
    Math.round((p2 - (p2 % FUZ_FACTOR)) * 1e2) +
    Math.round(p1 - (p1 % FUZ_FACTOR))
  );
}

/**
 * Tìm vị trí tương ứng với tần số.
 * @param freq Tần số cần tìm vị trí.
 * @returns Vị trí tương ứng.
 */
export function getIndex(freq: number): number {
  for (let i = 0; i < RANGE.length; i++) {
    if (freq < RANGE[i]) {
      return i;
    }
  }
  return RANGE.length;
}

export function normalizeAudioData(audioData: Float32Array) {
  const max = Math.max(...audioData);
  const threshold = 1.0;
  for (let i = 0; i < audioData.length; i++) {
    audioData[i] = (audioData[i] / max) * threshold;
  }
  return audioData;
}

function findPeaksInRange(spectrum: number[], range: [number, number]): number[] {
  const peaks: number[] = [];
  const [startFreq, endFreq] = range;

  for (let i = startFreq; i <= endFreq; i++) {
    if (spectrum[i] > spectrum[i - 1] && spectrum[i] > spectrum[i + 1]) {
      peaks.push(i);
    }
  }

  return peaks;
}

// function foo(spectrum: number[]): number[] {
//   const lowRange = [30, 40]; // Khoảng tần số thấp
//   const midRange = [120, 180]; // Khoảng tần số trung
//   const highRange = [180, 300]; // Khoảng tần số cao

//   const fingerprint: number[] = [];

//   // Tạo fingerprint từ các khoảng tần số quan trọng
//   const lowRangePeaks = findPeaksInRange(spectrum, lowRange);
//   const midRangePeaks = findPeaksInRange(spectrum, midRange);
//   const highRangePeaks = findPeaksInRange(spectrum, highRange);

//   // Gộp các cực đại vào fingerprint
//   fingerprint.push(...lowRangePeaks);
//   fingerprint.push(...midRangePeaks);
//   fingerprint.push(...highRangePeaks);

//   return fingerprint;
// }

/**
 * Chuyển đổi âm thanh thành vân tay âm thanh (audio fingerprint).
 * @param audioData Dữ liệu âm thanh đầu vào.
 * @returns Vân tay âm thanh dưới dạng chuỗi.
 */
export function generateAudioFingerprint(audioData: Float32Array): string {
  const points: number[][] = [];
  const highscores: number[][] = [];
  const freqBinCount = 256;

  for (let t = 0; t < audioData.length / freqBinCount; t++) {
    // const frequencies: number[] = [];

    for (let freq = 40; freq < 300; freq++) {
      // Tính toán magnitude
      const mag = Math.log(Math.abs(audioData[t * freqBinCount + freq]) + 1);

      // Lấy vị trí tương ứng với tần số
      const index = getIndex(freq);

      // Lưu giá trị magnitude cao nhất và tần số tương ứng
      /* if (!highscores[t]) {
        highscores[t] = new Array(RANGE.length).fill(0);
      } */
      if (mag > highscores[t][index]) {
        points[t][index] = freq;
      }

      console.log(points[t][index]);
    }

    // Tạo mã hash từ các tần số
    const h = hash(points[t][0], points[t][1], points[t][2], points[t][3]);
    console.log(h);
  }

  // Tạo vân tay âm thanh từ mã hash
  const fingerprint = points
    .map((p) => hash(p[0], p[1], p[2], p[3]).toString())
    .join(',');

  return fingerprint;
}
