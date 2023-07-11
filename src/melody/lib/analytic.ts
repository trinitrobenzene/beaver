import FFT from 'fft.js';

// Hàm phân tích FFT
function performFFT(soundData: Float32Array) {
  // fftSize = 1024
  const fftSize = soundData.length;
  const f = new FFT(fftSize);
  const out = f.createComplexArray();

  f.realTransform(out, soundData);
  f.completeSpectrum(out);

  return out;
}

// Hàm hash
function hash(p1: number, p2: number, p3: number, p4: number): number {
  const FUZ_FACTOR = 2;

  return (
    (p4 - (p4 % FUZ_FACTOR)) * 100000000 +
    (p3 - (p3 % FUZ_FACTOR)) * 100000 +
    (p2 - (p2 % FUZ_FACTOR)) * 100 +
    (p1 - (p1 % FUZ_FACTOR))
  );
}

function getIndex(freq: number): number {
  const RANGE = [40, 80, 120, 180, 300];
  let i = 0;
  while (RANGE[i] < freq) {
    i++;
  }
  return i;
}

// Hàm chuyển đổi âm thanh thành vân tay âm thanh (audio fingerprint)
function generateAudioFingerprint(soundData: Float32Array): string {
  const points: number[][] = [];
  const highscores: number[][] = [];

  for (let t = 0; t < soundData.length; t++) {
    const frequencies: number[] = [];

    for (let freq = 40; freq < 300; freq++) {
      // Thực hiện tính toán magnitude
      const mag = Math.log(Math.abs(soundData[t][freq]) + 1);

      // Lấy index của range tương ứng
      const index = getIndex(freq);

      // Lưu giá trị magnitude cao nhất và tần số tương ứng
      if (!highscores[t]) {
        highscores[t] = [];
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

export { performFFT, hash, getIndex, generateAudioFingerprint };
