import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, X, Sparkles, Mic, Sliders, Play, Square } from 'lucide-react';
import { useVoiceGuide } from '../context/VoiceGuideContext';

export const VoiceGuideWidget: React.FC = () => {
  const {
    isVoiceEnabled,
    isSpeaking,
    currentMessage,
    toggleVoice,
    replay,
    stop,
    voiceRate,
    setVoiceRate,
    dismissMessage,
    isSupported,
  } = useVoiceGuide();

  // Expanded card state vs compact dock pill
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Auto-expand when a new message arrives or speech begins
  useEffect(() => {
    if (currentMessage && isVoiceEnabled) {
      setIsExpanded(true);
    }
  }, [currentMessage?.id, isVoiceEnabled]);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      id="voice-guide-widget-container"
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 max-w-[calc(100vw-24px)] sm:max-w-md pointer-events-auto select-none font-sans"
    >
      {/* 1. Expanded Guidance Card */}
      {isExpanded && currentMessage ? (
        <div
          id="voice-guide-card"
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 dark:border-emerald-500/40 rounded-2xl shadow-xl shadow-emerald-950/10 p-3 sm:p-4 text-slate-800 dark:text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 relative overflow-hidden"
        >
          {/* Top animated accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition ${
                  isSpeaking
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {isVoiceEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block leading-tight">
                    {currentMessage.title || 'বাংলা এআই ভয়েস গাইড'}
                  </span>
                  {isSpeaking && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block mr-0.5" />
                      কথা বলছে...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-1">
              <button
                id="voice-guide-toggle-settings-btn"
                onClick={() => setShowSettings(!showSettings)}
                title="ভয়েস সেটিংস"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              <button
                id="voice-guide-minimize-btn"
                onClick={() => setIsExpanded(false)}
                title="মিনিমাইজ করুন"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subtitle / Spoken Text Display */}
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-h-36 overflow-y-auto">
            <p className="whitespace-pre-line">{currentMessage.text}</p>
          </div>

          {/* Soundwave animation bar when speaking */}
          {isSpeaking && (
            <div className="flex items-center justify-center gap-1 py-1.5">
              {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: `${h * 14}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                  className="w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce"
                />
              ))}
            </div>
          )}

          {/* Settings panel toggle */}
          {showSettings && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 animate-in fade-in">
              <span className="font-medium">ভয়েস গতি:</span>
              <div className="flex items-center gap-1">
                {[
                  { label: 'ধীর', rate: 0.8 },
                  { label: 'স্বাভাবিক', rate: 0.95 },
                  { label: 'দ্রুত', rate: 1.15 },
                ].map((s) => (
                  <button
                    key={s.rate}
                    onClick={() => setVoiceRate(s.rate)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                      Math.abs(voiceRate - s.rate) < 0.05
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Controls Bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {/* Play / Replay button */}
              <button
                id="voice-guide-replay-btn"
                onClick={replay}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                title="আবার শুনুন"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>আবার শুনুন</span>
              </button>

              {/* Stop button when speaking */}
              {isSpeaking && (
                <button
                  id="voice-guide-stop-btn"
                  onClick={stop}
                  className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1"
                  title="বন্ধ করুন"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>থামান</span>
                </button>
              )}
            </div>

            {/* Voice On / Off Toggle Button */}
            <button
              id="voice-guide-toggle-btn"
              onClick={toggleVoice}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isVoiceEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
              title={isVoiceEnabled ? 'ভয়েস বন্ধ করুন' : 'ভয়েস চালু করুন'}
            >
              {isVoiceEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🔊 Voice On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                  <span>🔇 Voice Off</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* 2. Compact Floating Pill / Badge */
        <div className="flex items-center gap-1.5">
          <button
            id="voice-guide-floating-pill"
            onClick={() => {
              setIsExpanded(true);
              if (!isSpeaking) {
                replay();
              }
            }}
            className={`group px-3 py-2 rounded-2xl shadow-lg backdrop-blur-md border transition-all flex items-center gap-2 cursor-pointer ${
              isVoiceEnabled
                ? 'bg-emerald-600/95 hover:bg-emerald-700 text-white border-emerald-400/40 shadow-emerald-950/20'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700 shadow-black/20'
            }`}
            title="ভয়েস গাইড খুলুন"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isSpeaking ? 'bg-white text-emerald-700 animate-spin' : 'bg-white/20 text-white'
              }`}
            >
              {isVoiceEnabled ? (
                <Volume2 className="w-3 h-3" />
              ) : (
                <VolumeX className="w-3 h-3 text-slate-400" />
              )}
            </div>

            <span className="text-xs font-bold">
              {isVoiceEnabled ? (isSpeaking ? 'ভয়েস চলছে...' : '🔊 Voice On') : '🔇 Voice Off'}
            </span>

            {isVoiceEnabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping ml-0.5" />
            )}
          </button>

          {/* Quick Mute/Unmute toggle directly beside pill */}
          <button
            id="voice-guide-quick-toggle-btn"
            onClick={toggleVoice}
            className={`p-2 rounded-2xl shadow-md border transition ${
              isVoiceEnabled
                ? 'bg-white dark:bg-slate-800 text-emerald-600 border-slate-200 dark:border-slate-700'
                : 'bg-white dark:bg-slate-800 text-rose-500 border-slate-200 dark:border-slate-700'
            }`}
            title={isVoiceEnabled ? 'ভয়েস বন্ধ করুন (Voice Off)' : 'ভয়েস চালু করুন (Voice On)'}
          >
            {isVoiceEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
