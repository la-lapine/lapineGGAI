import React, { useState, useEffect } from 'react';
import { audioEngine, TRACK_LIST } from '../utils/audioEngine';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Minimize2,
  Disc3,
  ListMusic,
  Sparkles,
} from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [, setTick] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const isPlaying = audioEngine.getIsPlaying();
  const isMuted = audioEngine.getIsMuted();
  const volume = audioEngine.getVolume();
  const currentTime = audioEngine.getCurrentTime();
  const isLoop = audioEngine.getLoop();
  const isShuffle = audioEngine.getShuffle();
  const currentTrack = audioEngine.getCurrentTrack();
  const currentTrackIndex = audioEngine.getCurrentTrackIndex();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioEngine.seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioEngine.setVolume(Number(e.target.value));
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 select-none">
      {/* Expanded Pop-up Player Menu */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Trình phát nhạc lofi"
          className="mb-3 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-xl border border-sky-300/40 dark:border-sky-700/40 text-slate-800 dark:text-slate-100 transition-all duration-300 animate-in fade-in zoom-in-95"
        >
          {/* Top bar with Minimize */}
          <div className="flex items-center justify-between pb-3 border-b border-sky-200/50 dark:border-sky-800/40">
            <div className="flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-sky-500 animate-spin-slow" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                Usagi Lofi Radio
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  showPlaylist
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-800'
                }`}
                title="Danh sách bài hát"
              >
                <ListMusic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors"
                title="Thu nhỏ"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body: Player view or Playlist view */}
          {showPlaylist ? (
            <div className="py-3 max-h-56 overflow-y-auto space-y-1.5 pr-1">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">
                Danh sách bài hát ({TRACK_LIST.length})
              </div>
              {TRACK_LIST.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => audioEngine.selectTrack(idx)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    idx === currentTrackIndex
                      ? 'bg-sky-500/15 dark:bg-sky-400/20 text-sky-700 dark:text-sky-200 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {idx === currentTrackIndex && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    )}
                    <span className="truncate">{track.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatTime(track.duration)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center">
              {/* Mini Vinyl Art Center */}
              <div className="relative w-24 h-24 my-1">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 p-2 shadow-md flex items-center justify-center border-2 border-slate-700 ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-pink-300 flex items-center justify-center border border-white/40">
                    <span className="text-[10px]">🐰</span>
                  </div>
                </div>
              </div>

              {/* Track Metadata */}
              <div className="text-center mt-2 w-full px-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-sky-600 dark:text-sky-300 truncate">
                  {currentTrack.artist}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 italic">
                  {currentTrack.description}
                </p>
              </div>

              {/* Time scrub bar */}
              <div className="w-full mt-3 px-1">
                <input
                  type="range"
                  min={0}
                  max={currentTrack.duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-sky-200 dark:bg-sky-950/80 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  onClick={() => audioEngine.toggleShuffle()}
                  className={`p-2 rounded-lg transition-colors ${
                    isShuffle
                      ? 'text-sky-500 bg-sky-100 dark:bg-sky-900/40'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title="Xáo trộn (Shuffle)"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => audioEngine.prevTrack()}
                  className="p-2 text-slate-700 dark:text-slate-200 hover:text-sky-600 transition-colors"
                  title="Bài trước"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => audioEngine.togglePlay()}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                  title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => audioEngine.nextTrack()}
                  className="p-2 text-slate-700 dark:text-slate-200 hover:text-sky-600 transition-colors"
                  title="Bài tiếp"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={() => audioEngine.toggleLoop()}
                  className={`p-2 rounded-lg transition-colors ${
                    isLoop
                      ? 'text-sky-500 bg-sky-100 dark:bg-sky-900/40'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title="Lặp lại (Loop)"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 mt-3 w-3/4">
                <button
                  onClick={() => audioEngine.toggleMute()}
                  className="text-slate-500 dark:text-slate-400 hover:text-sky-600 transition-colors"
                  title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-sky-200 dark:bg-sky-950 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Vinyl Record Button (Bottom-Left Corner) */}
      <div className="flex items-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Mở trình phát nhạc lofi"
          className="group relative flex items-center focus:outline-none"
        >
          {/* Subtle soft backdrop glow */}
          <div
            className={`absolute -inset-1 rounded-full transition-all duration-300 ${
              isPlaying ? 'bg-sky-400/30 blur-sm scale-105' : 'bg-sky-400/10 blur-xs'
            }`}
          />

          {/* Vinyl Disc (clean, aesthetic, no exposed song title when minimized) */}
          <div
            className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-slate-900 p-1.5 border-2 border-sky-300 dark:border-sky-500 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
            title="Bấm để mở trình phát nhạc lofi la Lapine"
          >
            {/* Vinyl grooves */}
            <div className="w-full h-full rounded-full border border-slate-700 flex items-center justify-center">
              {/* Center label */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 to-pink-300 flex items-center justify-center text-[10px] shadow-inner">
                🐰
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
