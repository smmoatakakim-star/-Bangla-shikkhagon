import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from './AppContext';

export interface VoiceGuideMessage {
  id: string;
  title: string;
  text: string;
  source?: string;
}

interface VoiceGuideContextType {
  isVoiceEnabled: boolean;
  isSpeaking: boolean;
  currentMessage: VoiceGuideMessage | null;
  toggleVoice: () => void;
  replay: () => void;
  stop: () => void;
  speak: (text: string, title?: string, force?: boolean) => void;
  voiceRate: number;
  setVoiceRate: (rate: number) => void;
  dismissMessage: () => void;
  isSupported: boolean;
}

const VoiceGuideContext = createContext<VoiceGuideContextType | undefined>(undefined);

const STORAGE_KEY_VOICE_ENABLED = 'bsh_voice_guide_enabled';
const STORAGE_KEY_VOICE_RATE = 'bsh_voice_guide_rate';

// Play a gentle, pleasant dual-tone chime before speech begins
function playGentleChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    // Tone 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.04, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.13);

    // Tone 2: G#5 (830.61 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.08);
    gain2.gain.setValueAtTime(0.045, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.23);
  } catch {
    // AudioContext blocked or not supported - silently ignore
  }
}

export const VoiceGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPage, pageParams, classes, subjects, chapters } = useApp();

  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOICE_ENABLED);
      return saved !== null ? saved === 'true' : true; // Default ON as requested
    } catch {
      return true;
    }
  });

  const [voiceRate, setVoiceRateState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOICE_RATE);
      return saved ? parseFloat(saved) : 0.92;
    } catch {
      return 0.92;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<VoiceGuideMessage | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const lastSpokenKeyRef = useRef<string>('');
  const pendingSpeechRef = useRef<{ text: string; title: string; id: string } | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const userInteractedRef = useRef<boolean>(false);

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Contextual Guidance Generator: maps page + params to natural Bengali voice guidance
  const getContextGuidance = useCallback((): { title: string; text: string; id: string } | null => {
    switch (currentPage) {
      case 'home':
        return {
          id: 'home',
          title: 'নির্দেশিকা — বাংলা শিক্ষাগর',
          text: 'আসসালামু আলাইকুম। শুরু করতে আপনার শ্রেণি নির্বাচন করুন।',
        };

      case 'classes':
        return {
          id: 'classes',
          title: 'শ্রেণি নির্বাচন গাইড',
          text: 'শুরু করতে আপনার শ্রেণি নির্বাচন করুন।',
        };

      case 'subjects': {
        const clsId = pageParams?.classId;
        const clsObj = classes.find((c) => c.id === clsId);
        const clsName = clsObj ? clsObj.name : 'আপনার শ্রেণি';

        if (clsId === 'ssc') {
          return {
            id: 'subjects-ssc',
            title: 'এসএসসি একাডেমি গাইড',
            text: 'আপনি এসএসসি একাডেমি বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
          };
        }
        if (clsId === 'hsc') {
          return {
            id: 'subjects-hsc',
            title: 'এইচএসসি একাডেমি গাইড',
            text: 'আপনি এইচএসসি একাডেমি বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
          };
        }
        if (clsId === 'class-8') {
          return {
            id: 'subjects-class-8',
            title: 'অষ্টম শ্রেণি গাইড',
            text: 'আপনি অষ্টম শ্রেণির বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
          };
        }
        if (clsId === 'class-6') {
          return {
            id: 'subjects-class-6',
            title: 'ষষ্ঠ শ্রেণি গাইড',
            text: 'আপনি ষষ্ঠ শ্রেণির বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
          };
        }
        if (clsId === 'class-7') {
          return {
            id: 'subjects-class-7',
            title: 'সপ্তম শ্রেণি গাইড',
            text: 'আপনি সপ্তম শ্রেণির বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
          };
        }
        if (clsId === 'class-9') {
          return {
            id: 'subjects-class-9',
            title: 'নবম শ্রেণি গাইড',
            text: 'আপনি নবম শ্রেণির বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
          };
        }
        if (clsId === 'class-10') {
          return {
            id: 'subjects-class-10',
            title: 'দশম শ্রেণি গাইড',
            text: 'আপনি দশম শ্রেণির বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
          };
        }
        if (clsId === 'class-11' || clsId === 'class-12') {
          return {
            id: `subjects-${clsId}`,
            title: `${clsName} গাইড`,
            text: `আপনি ${clsName} বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।`,
          };
        }
        return {
          id: `subjects-${clsId || 'all'}`,
          title: `${clsName} বিষয় গাইড`,
          text: `আপনি ${clsName} বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।`,
        };
      }

      case 'chapters': {
        const subId = pageParams?.subjectId;
        const subObj = subjects.find((s) => s.id === subId);
        const subName = subObj ? subObj.name : 'বিষয়';
        return {
          id: `chapters-${subId || 'all'}`,
          title: `${subName} অধ্যায় গাইড`,
          text: 'এই বিষয়ের অধ্যায়গুলো এখান থেকে নির্বাচন করুন।',
        };
      }

      case 'lesson': {
        const lesId = pageParams?.lessonId;
        const chapter = chapters.find((ch) => ch.id === pageParams?.chapterId);
        const chTitle = chapter ? chapter.title : 'পাঠ';
        return {
          id: `lesson-${lesId || 'view'}`,
          title: 'পাঠ গাইড',
          text: `${chTitle} পাঠের বিস্তারিত মনোযোগ দিয়ে পড়ুন।`,
        };
      }

      case 'quiz':
        return {
          id: 'quiz-list',
          title: 'কুইজ তালিকা গাইড',
          text: 'কুইজ শুরু করতে Start বাটনে চাপ দিন।',
        };

      case 'quiz_play':
        return {
          id: 'quiz-play',
          title: 'পরীক্ষা ও কুইজ গাইড',
          text: 'প্রশ্নটি পড়ে সঠিক উত্তর নির্বাচন করুন।',
        };

      case 'exam_prep':
        return {
          id: 'exam-prep',
          title: 'পরীক্ষা প্রস্তুতি গাইড',
          text: 'প্রশ্নটি পড়ে সঠিক উত্তর নির্বাচন করুন।',
        };

      case 'question_bank': {
        return {
          id: 'question-bank',
          title: 'MCQ প্রশ্নব্যাংক গাইড',
          text: 'প্রশ্নটি পড়ে সঠিক উত্তর নির্বাচন করুন।',
        };
      }

      case 'model_tests':
        return {
          id: 'model-tests',
          title: 'মডেল টেস্ট গাইড',
          text: 'কুইজ শুরু করতে Start বাটনে চাপ দিন।',
        };

      case 'daily_quiz':
      case 'daily_practice':
      case 'mixed_quiz':
        return {
          id: 'daily-quiz',
          title: 'দৈনিক কুইজ গাইড',
          text: 'কুইজ শুরু করতে Start বাটনে চাপ দিন।',
        };

      case 'wrong_questions':
        return {
          id: 'wrong-questions',
          title: 'ভুল প্রশ্ন সংশোধন গাইড',
          text: 'পূর্বে ভুল করা প্রশ্নগুলো সঠিক ব্যাখ্যাসহ পুনরায় অনুশীলন করুন।',
        };

      case 'bookmarked_questions':
        return {
          id: 'bookmarked-questions',
          title: 'সংরক্ষিত প্রশ্ন গাইড',
          text: 'আপনার পছন্দের ও গুরুত্বপূর্ণ প্রশ্নগুলো এখান থেকে রিভিশন দিন।',
        };

      case 'ssc_dashboard':
        return {
          id: 'ssc-dashboard',
          title: 'এসএসসি একাডেমি গাইড',
          text: 'আপনি এসএসসি একাডেমি বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
        };

      case 'hsc_dashboard':
        return {
          id: 'hsc-dashboard',
          title: 'এইচএসসি একাডেমি গাইড',
          text: 'আপনি এইচএসসি একাডেমি বিভাগে আছেন। এখন আপনার পছন্দের বিষয় নির্বাচন করুন।',
        };

      case 'formula_bank':
        return {
          id: 'formula-bank',
          title: 'ডিজিটাল সূত্রভাণ্ডার গাইড',
          text: 'গণিত, পদার্থ ও রসায়নের প্রয়োজনীয় সূত্রগুলো একনজরে দেখে নিন।',
        };

      case 'ai_chat':
        return {
          id: 'ai-chat',
          title: 'AI শিক্ষা সহায়ক গাইড',
          text: 'পড়াশোনার যেকোনো প্রশ্ন লিখে সরাসরি উত্তর জেনে নিন।',
        };

      case 'grammar_master':
        return {
          id: 'grammar-master',
          title: 'ব্যাকরণ মাস্টার গাইড',
          text: 'বাংলা ও ইংরেজি ব্যাকরণের গুরুত্বপূর্ণ নিয়ম ও কুইজ অনুশীলন করুন।',
        };

      case 'curriculum_audit':
        return {
          id: 'curriculum-audit',
          title: 'কারিকুলাম অডিট গাইড',
          text: 'সকল শ্রেণির পাঠ্যক্রম ও প্রশ্নভাণ্ডারের স্ট্যাটাস এখান থেকে দেখে নিন।',
        };

      case 'posts':
        return {
          id: 'posts',
          title: 'কমিউনিটি স্টাডি গ্রুপ গাইড',
          text: 'সহপাঠীদের সাথে শিক্ষামূলক আলোচনা ও প্রশ্ন শেয়ার করুন।',
        };

      case 'create_post':
        return {
          id: 'create-post',
          title: 'প্রশ্ন পোস্ট গাইড',
          text: 'নতুন শিক্ষামূলক প্রশ্ন বা পড়ার টিপস লিখে পোস্ট করুন।',
        };

      case 'login':
        return {
          id: 'login',
          title: 'লগইন পেজ গাইড',
          text: 'লগইন পেজে আপনাকে স্বাগতম। আপনার অ্যাকাউন্টে সাইন ইন করে পড়ার অগ্রগতি সংরক্ষণ করুন।',
        };

      case 'profile':
        return {
          id: 'profile',
          title: 'প্রোফাইল গাইড',
          text: 'আপনার প্রোফাইলে স্বাগতম। এখানে আপনার পড়াশোনার পরিসংখ্যান ও কুইজের স্কোর দেখতে পারবেন।',
        };

      case 'search':
        return {
          id: 'search',
          title: 'অনুসন্ধান গাইড',
          text: 'অনুসন্ধান ফলাফলে আপনাকে স্বাগতম। আপনার কাঙ্ক্ষিত পাঠ ও কুইজ খুঁজে নিন।',
        };

      case 'quiz_result':
        return {
          id: 'quiz-result',
          title: 'ফলাফল ও পর্যালোচনা গাইড',
          text: 'আপনার পরীক্ষার ফলাফল প্রস্তুত হয়েছে। আপনার প্রাপ্ত নম্বর ও সঠিক উত্তরগুলো পর্যালোচনা করে নিন।',
        };

      default:
        return null;
    }
  }, [currentPage, pageParams, classes, subjects, chapters]);

  // Main speech invocation engine
  const executeSpeech = useCallback(
    (text: string, title = 'এআই ভয়েস গাইড', id = 'msg') => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      const synth = window.speechSynthesis;
      if (synth.paused) {
        synth.resume();
      }
      synth.cancel();

      // Set current display message with subtitle
      setCurrentMessage({ id, title, text });
      setIsSpeaking(true);

      // Play soft chime
      playGentleChime();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceRate;
      utterance.pitch = 1.0;
      utterance.lang = 'bn-BD';

      // Pick best Bengali voice if available
      const voices = synth.getVoices();
      const bengaliVoice = voices.find((v) => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return (
          lang.startsWith('bn') ||
          lang.includes('bd') ||
          lang.includes('bengali') ||
          lang.includes('bangla') ||
          name.includes('bengali') ||
          name.includes('bangla')
        );
      });
      if (bengaliVoice) {
        utterance.voice = bengaliVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        userInteractedRef.current = true;
        pendingSpeechRef.current = null;
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        // If not allowed (browser autoplay policy), save in pendingSpeechRef
        if (e.error === 'not-allowed') {
          pendingSpeechRef.current = { text, title, id };
          setIsSpeaking(false);
          return;
        }
        if (e.error === 'canceled' || e.error === 'interrupted') {
          setIsSpeaking(false);
          return;
        }
        setIsSpeaking(false);
      };

      activeUtteranceRef.current = utterance;

      try {
        synth.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis note:', err);
        setIsSpeaking(false);
      }
    },
    [voiceRate]
  );

  // External trigger speak
  const speak = useCallback(
    (text: string, title = 'এআই ভয়েস গাইড', force = false) => {
      if (!isVoiceEnabled && !force) return;
      executeSpeech(text, title, 'manual-' + Date.now());
    },
    [isVoiceEnabled, executeSpeech]
  );

  // Replay current message
  const replay = useCallback(() => {
    if (!isVoiceEnabled) {
      setIsVoiceEnabled(true);
      try {
        localStorage.setItem(STORAGE_KEY_VOICE_ENABLED, 'true');
      } catch {}
    }
    const guidance = currentMessage || getContextGuidance();
    if (guidance) {
      executeSpeech(guidance.text, guidance.title, guidance.id);
    }
  }, [isVoiceEnabled, currentMessage, getContextGuidance, executeSpeech]);

  // Save voice enabled state
  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_VOICE_ENABLED, String(next));
      } catch {}

      if (!next) {
        // Voice is turned OFF: stop immediately and clear message
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
      } else {
        // Voice is turned ON: speak current page guidance immediately
        const guidance = getContextGuidance();
        if (guidance) {
          setTimeout(() => {
            executeSpeech(guidance.text, guidance.title, guidance.id);
          }, 120);
        }
      }
      return next;
    });
  }, [getContextGuidance, executeSpeech]);

  const setVoiceRate = useCallback((rate: number) => {
    setVoiceRateState(rate);
    try {
      localStorage.setItem(STORAGE_KEY_VOICE_RATE, String(rate));
    } catch {}
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const dismissMessage = useCallback(() => {
    stop();
    setCurrentMessage(null);
  }, [stop]);

  // Handle Autoplay permission unlock: register user gesture listener
  useEffect(() => {
    const handleFirstGesture = () => {
      userInteractedRef.current = true;
      if (pendingSpeechRef.current && isVoiceEnabled) {
        const { text, title, id } = pendingSpeechRef.current;
        pendingSpeechRef.current = null;
        executeSpeech(text, title, id);
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });
    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [isVoiceEnabled, executeSpeech]);

  // When voices become ready asynchronously in browser
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const handleVoicesChanged = () => {
      synth.getVoices();
    };
    synth.addEventListener('voiceschanged', handleVoicesChanged);
    return () => {
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  // Page Navigation Voice Trigger Effect: only triggers when navigating to a new page/context
  useEffect(() => {
    const guidance = getContextGuidance();
    if (!guidance) return;

    // Unique page signature so we don't repeat on same page re-renders
    const currentKey = `${currentPage}_${JSON.stringify(pageParams || {})}`;
    if (lastSpokenKeyRef.current === currentKey) {
      return;
    }
    lastSpokenKeyRef.current = currentKey;

    if (!isVoiceEnabled) {
      // Keep message for subtitle card if user wants, but don't speak
      setCurrentMessage(guidance);
      return;
    }

    // Small delay to allow the new page DOM to mount smoothly
    const timer = setTimeout(() => {
      if (userInteractedRef.current) {
        executeSpeech(guidance.text, guidance.title, guidance.id);
      } else {
        // Pending speech for first user interaction (browser autoplay compliance)
        pendingSpeechRef.current = guidance;
        setCurrentMessage(guidance);
        // Try speak in case browser allows it (e.g. within iframe or user permission already granted)
        executeSpeech(guidance.text, guidance.title, guidance.id);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [currentPage, pageParams, isVoiceEnabled, getContextGuidance, executeSpeech]);

  return (
    <VoiceGuideContext.Provider
      value={{
        isVoiceEnabled,
        isSpeaking,
        currentMessage,
        toggleVoice,
        replay,
        stop,
        speak,
        voiceRate,
        setVoiceRate,
        dismissMessage,
        isSupported,
      }}
    >
      {children}
    </VoiceGuideContext.Provider>
  );
};

export const useVoiceGuide = (): VoiceGuideContextType => {
  const context = useContext(VoiceGuideContext);
  if (!context) {
    throw new Error('useVoiceGuide must be used within a VoiceGuideProvider');
  }
  return context;
};
