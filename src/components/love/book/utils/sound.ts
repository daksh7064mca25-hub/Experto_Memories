/**
 * Realistic Paper Page Turn Sound Synthesizer
 * Uses Web Audio API to generate authentic, organic paper rustle & friction sounds.
 * Zero external audio files required, zero latency, 100% offline and license-safe.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playPageTurnSound(isMuted: boolean = false) {
  if (isMuted || typeof window === "undefined") return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // 140ms organic paper swish duration
    const duration = 0.14;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channelData = buffer.getChannelData(0);

    // Generate filtered pinkish noise with exponential friction profile
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const decay = Math.exp(-progress * 3.5);
      // Dual-frequency texture simulating heavy parchment friction
      const randomNoise = Math.random() * 2 - 1;
      const paperTexture = Math.sin(progress * Math.PI * 18) * 0.2;
      channelData[i] = (randomNoise * 0.8 + paperTexture) * decay;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Bandpass filter centered around 1600Hz (warm paper rustle)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1600, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.4, ctx.currentTime);

    // Subtle pitch sweep as the page swings
    bandpass.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + duration);

    // Highpass to eliminate any rumble
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(350, ctx.currentTime);

    // Gain envelope with smooth attack and gentle decay
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Connect node graph
    noiseSource.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch (e) {
    // Graceful fallback if audio context is blocked by user agent
  }
}

/**
 * Realistic Hardcover Book Opening Sound Synthesizer
 * Simulates heavy leather spine flex, soft binding creak, and heavy parchment sweep.
 */
export function playBookOpenSound(isMuted: boolean = false) {
  if (isMuted || typeof window === "undefined") return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = 0.45;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const decay = Math.exp(-progress * 2.8);
      const creakTexture = Math.sin(progress * Math.PI * 34) * 0.15;
      const noise = (Math.random() * 2 - 1) * 0.45;
      data[i] = (noise + creakTexture) * decay;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(850, ctx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
  } catch (e) {
    // Graceful fallback
  }
}
