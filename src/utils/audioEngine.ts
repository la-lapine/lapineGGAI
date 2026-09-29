// Real Web Audio API synthesizer for vintage lo-fi ambient tracks and sweet rabbit game sound effects
import { AudioTrack } from '../types';

export const TRACK_LIST: AudioTrack[] = [
  {
    id: 1,
    title: 'southbound',
    artist: 'Artemas',
    audioUrl: '/audio/Artemas - southbound (official visualizer) - Artemas.mp3'
  },
  {
    id: 2,
    title: 'Gimme More',
    artist: 'Britney Spears',
    audioUrl: '/audio/Britney Spears - Gimme More (Official HD Video) - BritneySpearsVEVO.mp3'
  },
  {
    id: 3,
    title: 'Toxic',
    artist: 'Britney Spears',
    audioUrl: '/audio/Britney Spears - Toxic (Official HD Video) - BritneySpearsVEVO.mp3'
  },
  {
    id: 4,
    title: 'Everything is romantic',
    artist: 'Charli xcx',
    audioUrl: '/audio/Charli xcx - Everything is romantic (official lyric video) - Charli xcx.mp3'
  },
  {
    id: 5,
    title: 'LET THE WORLD BURN',
    artist: 'Chris Grey',
    audioUrl: '/audio/Chris Grey - LET THE WORLD BURN (Official Lyric Video) - Chris Grey.mp3'
  },
  {
    id: 6,
    title: 'Dark Paradise',
    artist: 'Lana Del Rey',
    audioUrl: '/audio/Dark Paradise - Lana Del Rey.mp3'
  },
  {
    id: 7,
    title: 'Training Season (Live)',
    artist: 'Dua Lipa',
    audioUrl: '/audio/Dua Lipa - Training Season (Live from the Royal Albert Hall) [Official Performance Video] - Dua Lipa.mp3'
  },
  {
    id: 8,
    title: 'UNETHICAL',
    artist: 'Faouzia',
    audioUrl: '/audio/Faouzia - UNETHICAL (Official Music Video) - Faouzia.mp3'
  },
  {
    id: 9,
    title: 'On The Floor',
    artist: 'Jennifer Lopez, Pitbull',
    audioUrl: '/audio/Jennifer Lopez, Pitbull - On The Floor (Official Music Video) - JenniferLopezVEVO.mp3'
  },
  {
    id: 10,
    title: 'Born To Die',
    artist: 'Lana Del Rey',
    audioUrl: '/audio/Lana Del Rey - Born To Die - LanaDelReyVEVO.mp3'
  },
  {
    id: 11,
    title: 'Brooklyn Baby',
    artist: 'Lana Del Rey',
    audioUrl: '/audio/Lana Del Rey - Brooklyn Baby (Official Audio) - LanaDelReyVEVO.mp3'
  },
  {
    id: 12,
    title: 'Doin\' Time',
    artist: 'Lana Del Rey',
    audioUrl: '/audio/Lana Del Rey - Doin\' Time - LanaDelReyVEVO.mp3'
  },
  {
    id: 13,
    title: 'Ultraviolence',
    artist: 'Lana Del Rey',
    audioUrl: '/audio/Lana Del Rey - Ultraviolence (Audio) - LanaDelReyVEVO.mp3'
  },
  {
    id: 14,
    title: 'Legendary Lovers',
    artist: 'Katy Perry',
    audioUrl: '/audio/Legendary Lovers - Katy Perry.mp3'
  },
  {
    id: 15,
    title: 'When Did You Get Hot',
    artist: 'Sabrina Carpenter',
    audioUrl: '/audio/Sabrina Carpenter - When Did You Get Hot (Official Lyric Video) - SabrinaCarpenterVEVO.mp3'
  },
  {
    id: 16,
    title: 'Sad Girl',
    artist: 'Lana Del Rey',
    audioUrl: '/audio/Lana Del Rey - Sad Girl - Lana Del Rey.mp3'
  },
  {
    id: 17,
    title: 'Salvatore',
    artist: 'Lana Del Rey',
    audioUrl: '/audio/Salvatore - Lana Del Rey.mp3'
  },
  {
    id: 18,
    title: 'Can\'t Remember to Forget You',
    artist: 'Shakira ft. Rihanna',
    audioUrl: '/audio/Shakira - Can\'t Remember to Forget You (Official Video) ft. Rihanna - shakiraVEVO.mp3'
  },
  {
    id: 19,
    title: 'back to friends',
    artist: 'sombr',
    audioUrl: '/audio/sombr - back to friends (official video) - sombr.mp3'
  },
  {
    id: 20,
    title: 'undressed',
    artist: 'sombr',
    audioUrl: '/audio/sombr - undressed (official lyric video) - sombr.mp3'
  },
  {
    id: 21,
    title: 'we never dated',
    artist: 'sombr',
    audioUrl: '/audio/sombr - we never dated (official lyric video) - sombr.mp3'
  },
  {
    id: 22,
    title: 'Moth To A Flame',
    artist: 'Swedish House Mafia, The Weeknd',
    audioUrl: '/audio/Swedish House Mafia and The Weeknd - Moth To A Flame (Official Lyric Video) - SHMVEVO.mp3'
  },
  {
    id: 23,
    title: 'A Little Death',
    artist: 'The Neighbourhood',
    audioUrl: '/audio/The Neighbourhood - A Little Death (Official Audio) - TheNeighbourhoodVEVO.mp3'
  },
  {
    id: 24,
    title: 'Afraid',
    artist: 'The Neighbourhood',
    audioUrl: '/audio/The Neighbourhood - Afraid (Official Audio) - TheNeighbourhoodVEVO.mp3'
  },
  {
    id: 25,
    title: 'Sweater Weather',
    artist: 'The Neighbourhood',
    audioUrl: '/audio/The Neighbourhood - Sweater Weather (Official Video) - TheNeighbourhoodVEVO.mp3'
  },
  {
    id: 26,
    title: 'After Hours',
    artist: 'The Weeknd',
    audioUrl: '/audio/The Weeknd - After Hours (Audio) - The Weeknd.mp3'
  },
  {
    id: 27,
    title: 'Call Out My Name',
    artist: 'The Weeknd',
    audioUrl: '/audio/The Weeknd - Call Out My Name (Official Audio) - The Weeknd.mp3'
  },
  {
    id: 28,
    title: 'House Of Balloons / Glass Table Girls',
    artist: 'The Weeknd',
    audioUrl: '/audio/The Weeknd - House Of Balloons _ Glass Table Girls - The Weeknd.mp3'
  },
  {
    id: 29,
    title: 'One Of The Girls',
    artist: 'The Weeknd, JENNIE, Lily-Rose Depp',
    audioUrl: '/audio/The Weeknd, JENNIE, Lily-Rose Depp - One Of The Girls (Official Video) - TheWeekndVEVO.mp3'
  },
  {
    id: 30,
    title: 'The Abyss',
    artist: 'The Weeknd, Lana Del Rey',
    audioUrl: '/audio/The Weeknd, Lana Del Rey - The Abyss (Audio) - TheWeekndVEVO.mp3'
  }
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.6;
  private currentTrackIndex: number = 0;
  private currentTime: number = 0;
  private loop: boolean = false;
  private shuffle: boolean = false;
  private timer: number | null = null;
  private musicInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private listeners: Set<() => void> = new Set();
  private hasInitialized: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public tryAutoPlayOnFirstInteraction() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    try {
      this.initContext();
      this.play();
    } catch {
      // Browsers require gesture
    }
  }

  public getCurrentTrack(): AudioTrack {
    return TRACK_LIST[this.currentTrackIndex] || TRACK_LIST[0];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getLoop(): boolean {
    return this.loop;
  }

  public getShuffle(): boolean {
    return this.shuffle;
  }

  public togglePlay() {
    this.initContext();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public play() {
    this.initContext();
    this.isPlaying = true;
    this.startMusicSynthesizer();
    this.startTimeTracker();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    this.stopMusicSynthesizer();
    this.stopTimeTracker();
    this.notify();
  }

  public nextTrack() {
    this.currentTime = 0;
    if (this.shuffle) {
      let nextIndex = Math.floor(Math.random() * TRACK_LIST.length);
      if (nextIndex === this.currentTrackIndex && TRACK_LIST.length > 1) {
        nextIndex = (nextIndex + 1) % TRACK_LIST.length;
      }
      this.currentTrackIndex = nextIndex;
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % TRACK_LIST.length;
    }
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public prevTrack() {
    this.currentTime = 0;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + TRACK_LIST.length) % TRACK_LIST.length;
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public selectTrack(index: number) {
    if (index >= 0 && index < TRACK_LIST.length) {
      this.currentTrackIndex = index;
      this.currentTime = 0;
      this.play();
    }
  }

  public toggleLoop() {
    this.loop = !this.loop;
    this.notify();
  }

  public toggleShuffle() {
    this.shuffle = !this.shuffle;
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.volume > 0) this.isMuted = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public seek(seconds: number) {
    const track = this.getCurrentTrack();
    this.currentTime = Math.max(0, Math.min(track.duration, seconds));
    this.notify();
  }

  private startTimeTracker() {
    this.stopTimeTracker();
    this.timer = window.setInterval(() => {
      if (!this.isPlaying) return;
      const track = this.getCurrentTrack();
      this.currentTime += 1;
      if (this.currentTime >= track.duration) {
        if (this.loop) {
          this.currentTime = 0;
        } else {
          this.nextTrack();
        }
      }
      this.notify();
    }, 1000);
  }

  private stopTimeTracker() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Melodic lo-fi chords synthesizer
  private startMusicSynthesizer() {
    this.stopMusicSynthesizer();
    if (!this.ctx || !this.masterGain) return;

    const track = this.getCurrentTrack();
    // Notes mappings
    const chordProgressions: Record<string, number[][]> = {
      C_MAJ: [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 349.23], // G7
      ],
      A_MIN: [
        [220.0, 261.63, 329.63, 392.0],
        [174.61, 220.0, 261.63, 329.63],
        [261.63, 329.63, 392.0, 523.25],
        [196.0, 246.94, 293.66, 392.0],
      ],
      F_MAJ: [
        [174.61, 220.0, 261.63, 329.63],
        [146.83, 174.61, 220.0, 261.63],
        [130.81, 164.81, 196.0, 246.94],
        [196.0, 246.94, 293.66, 349.23],
      ],
      G_MAJ: [
        [196.0, 246.94, 293.66, 392.0],
        [164.81, 196.0, 246.94, 293.66],
        [130.81, 164.81, 196.0, 261.63],
        [146.83, 185.0, 220.0, 293.66],
      ],
      D_MIN: [
        [146.83, 174.61, 220.0, 261.63],
        [174.61, 220.0, 261.63, 349.23],
        [130.81, 164.81, 196.0, 261.63],
        [220.0, 261.63, 329.63, 440.0],
      ],
    };

    const chords = chordProgressions[track.scale] || chordProgressions['C_MAJ'];
    let chordIndex = 0;
    const beatInterval = (60 / track.bpm) * 1000 * 2; // Chord every 2 beats

    const playChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const notes = chords[chordIndex % chords.length];
      chordIndex++;

      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08); // Arpeggiated soft entry

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(1, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + beatInterval / 1000 * 0.95);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + beatInterval / 1000);
      });
    };

    playChord();
    this.musicInterval = window.setInterval(playChord, beatInterval);
  }

  private stopMusicSynthesizer() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Sound effects
  public playCrunchSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playBubbleSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playPurrSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  }

  public playEggCrackSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.15, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }

  public playCoinSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    [987.77, 1318.51].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  public playSparkleLevelUpSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // Chime ascending arpeggio with high twinkle
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.14, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.5);
    });
  }

  public playLevelUpSound() {
    this.playSparkleLevelUpSound();
  }

  public playChimeSound() {
    this.playCoinSound();
  }

  public playThudSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playSlotTickSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playSlotWinSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.12, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.4);
    });
  }
}

export const audioEngine = new AudioEngine();
