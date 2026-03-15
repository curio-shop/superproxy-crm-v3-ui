import { Icon } from '@iconify/react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Presentation, formatDuration } from '../data/mockPresentations';

interface PresentationViewerProps {
  presentation: Presentation;
  onClose: () => void;
}

export default function PresentationViewer({ presentation, onClose }: PresentationViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHoveringPlayer, setIsHoveringPlayer] = useState(false);
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const controlsTimeoutRef = useRef<number>();

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= presentation.duration) {
            setIsPlaying(false);
            return presentation.duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, presentation.duration, playbackSpeed]);

  useEffect(() => {
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const progress = (currentTime / presentation.duration) * 100;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[250] bg-slate-950 flex items-center justify-center"
      onMouseEnter={() => setIsHoveringPlayer(true)}
      onMouseLeave={() => setIsHoveringPlayer(false)}
      onMouseMove={handleMouseMove}
    >
      <button
        onClick={onClose}
        className={`absolute top-8 right-8 z-20 p-2 hover:bg-white/5 rounded-full transition-all duration-300 group ${
          showControls || isHoveringPlayer ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <Icon icon="solar:close-circle-linear" className="w-7 h-7 text-white/60 group-hover:text-white transition-colors" />
      </button>

      <div
        className="relative w-full h-full max-w-[90vw] max-h-[85vh] cursor-pointer"
        onClick={handlePlayPause}
      >
        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img
            src={presentation.thumbnailUrl}
            alt={presentation.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="group">
                <Icon
                  icon="solar:play-circle-line"
                  className="w-24 h-24 text-white/80 group-hover:text-white transition-all duration-300 group-hover:scale-110"
                />
              </button>
            </div>
          )}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 via-slate-950/60 to-transparent transition-all duration-300 ${
          showControls || isHoveringPlayer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <div className="px-10 pt-8 pb-6">
            <div
              className="relative group/timeline mb-6"
              onMouseEnter={() => setIsHoveringTimeline(true)}
              onMouseLeave={() => setIsHoveringTimeline(false)}
            >
              <div className={`h-1 bg-white/10 rounded-full overflow-hidden transition-all ${isHoveringTimeline ? 'h-1.5' : 'h-1'}`}>
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-150 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-xl transition-all ${isHoveringTimeline ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={presentation.duration}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={handlePlayPause}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Icon icon="solar:pause-linear" className="w-6 h-6 text-white" />
                  ) : (
                    <Icon icon="solar:play-linear" className="w-6 h-6 text-white" />
                  )}
                </button>

                <div className="flex items-center gap-5">
                  <div
                    className="relative flex items-center gap-3"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-white/10 rounded-xl transition-all"
                    >
                      {isMuted || volume === 0 ? (
                        <Icon icon="solar:volume-cross-linear" className="w-5 h-5 text-white/80" />
                      ) : (
                        <Icon icon="solar:volume-loud-linear" className="w-5 h-5 text-white/80" />
                      )}
                    </button>
                    <div className={`transition-all duration-200 overflow-hidden ${showVolumeSlider ? 'w-28 opacity-100' : 'w-0 opacity-0'}`}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          setVolume(Number(e.target.value));
                          if (Number(e.target.value) > 0) setIsMuted(false);
                        }}
                        className="w-28 accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <span className="text-sm font-medium text-white/80 select-none tracking-wide">
                    {formatDuration(currentTime)} <span className="text-white/40 mx-1">/</span> {formatDuration(presentation.duration)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 rounded-xl transition-all text-sm font-medium text-white/80 hover:text-white"
                  >
                    <Icon icon="solar:speed-linear" className="w-5 h-5" />
                    {playbackSpeed}x
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full mb-3 right-0 bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 py-2 min-w-[110px]">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            setShowSpeedMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-all ${
                            playbackSpeed === speed ? 'text-blue-400 font-semibold' : 'text-white/80'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all">
                  <Icon icon="solar:full-screen-linear" className="w-5 h-5 text-white/80" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
