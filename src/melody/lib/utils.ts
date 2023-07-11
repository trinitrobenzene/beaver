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
    const frequencies: number[] = [];

    for (let freq = 40; freq < 300; freq++) {
      // Tính toán magnitude
      const mag = Math.log(Math.abs(audioData[t * freqBinCount + freq]) + 1);

      // Lấy vị trí tương ứng với tần số
      const index = getIndex(freq);

      // Lưu giá trị magnitude cao nhất và tần số tương ứng
      if (!highscores[t]) {
        highscores[t] = new Array(RANGE.length).fill(0);
      }
      if (!frequencies[index] || mag > highscores[t][index]) {
        highscores[t][index] = mag;
        frequencies[index] = freq;
      }
    }

    // Tạo mã hash từ các tần số
    const h = hash(
      frequencies[0],
      frequencies[1],
      frequencies[2],
      frequencies[3],
    );

    points[t] = frequencies;
  }

  // Tạo vân tay âm thanh từ mã hash
  const fingerprint = points
    .map((p) => hash(p[0], p[1], p[2], p[3]).toString())
    .join(',');

  return fingerprint;
}
