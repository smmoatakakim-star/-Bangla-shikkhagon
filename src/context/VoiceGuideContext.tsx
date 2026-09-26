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
          title: 'স্বাগতম — বাংলা শিক্ষাগর',
          text: 'আসসালামু আলাইকুম। আমাদের শিক্ষামূলক ওয়েবসাইটে আপনাকে স্বাগতম। এখানে আপনি আপনার শ্রেণি নির্বাচন করে বিভিন্ন বিষয়ের পড়াশোনা, MCQ, পরীক্ষা ও শিক্ষামূলক উপকরণ ব্যবহার করতে পারবেন। শুরু করতে আপনার শ্রেণি নির্বাচন করুন।',
        };

      case 'classes':
        return {
          id: 'classes',
          title: 'শ্রেণি নির্বাচন গাইড',
          text: 'আপনি শ্রেণি নির্বাচন বিভাগে আছেন। ৬ষ্ঠ থেকে ১২শ শ্রেণি এবং এসএসসি ও এইচএসসি পর্যন্ত আপনার পছন্দের শ্রেণিটি বেছে নিন।',
        };

      case 'subjects': {
        const clsId = pageParams?.classId;
        const clsObj = classes.find((c) => c.id === clsId);
        const clsName = clsObj ? clsObj.name : 'আপনার শ্রেণি';

        if (clsId === 'ssc') {
          return {
            id: 'subjects-ssc',
            title: 'এসএসসি একাডেমি গাইড',
            text: 'আপনি এসএসসি একাডেমি বিভাগে প্রবেশ করেছেন। বিজ্ঞান, মানবিক ও ব্যবসায় শাখার ১৭টি বিষয়ের মধ্য থেকে আপনার প্রয়োজনীয় বিষয়টি বেছে নিন।',
          };
        }
        if (clsId === 'hsc') {
          return {
            id: 'subjects-hsc',
            title: 'এইচএসসি একাডেমি গাইড',
            text: 'আপনি এইচএসসি একাডেমি বিভাগে প্রবেশ করেছেন। একাদশ ও দ্বাদশ শ্রেণির ২১টি বিষয়ের মধ্য থেকে আপনার প্রয়োজনীয় বিষয়টি বেছে নিন।',
          };
        }
        if (clsId === 'class-8') {
          return {
            id: 'subjects-class-8',
            title: 'অষ্টম শ্রেণি গাইড',
            text: 'আপনি এখন অষ্টম শ্রেণির বিভাগে প্রবেশ করেছেন। এখান থেকে আপনার প্রয়োজনীয় বিষয় নির্বাচন করুন। আপনি বাংলা, ইংরেজি, গণিত, বিজ্ঞানসহ বিভিন্ন বিষয়ের শিক্ষামূলক কনটেন্ট ব্যবহার করতে পারবেন। শুরু করতে আপনার পছন্দের বিষয়টিতে চাপ দিন।',
          };
        }
        if (clsId === 'class-6') {
          return {
            id: 'subjects-class-6',
            title: 'ষষ্ঠ শ্রেণি গাইড',
            text: 'আপনি এখন ষষ্ঠ শ্রেণির বিভাগে প্রবেশ করেছেন। এখান থেকে আপনার প্রয়োজনীয় বিষয় নির্বাচন করুন। আপনি বাংলা, ইংরেজি, গণিত, বিজ্ঞানসহ বিভিন্ন বিষয়ের শিক্ষামূলক কনটেন্ট ব্যবহার করতে পারবেন। শুরু করতে আপনার পছন্দের বিষয়টিতে চাপ দিন।',
          };
        }
        if (clsId === 'class-7') {
          return {
            id: 'subjects-class-7',
            title: 'সপ্তম শ্রেণি গাইড',
            text: 'আপনি এখন সপ্তম শ্রেণির বিভাগে প্রবেশ করেছেন। এখান থেকে আপনার প্রয়োজনীয় বিষয় নির্বাচন করুন। আপনি বাংলা, ইংরেজি, গণিত, বিজ্ঞানসহ বিভিন্ন বিষয়ের শিক্ষামূলক কনটেন্ট ব্যবহার করতে পারবেন। শুরু করতে আপনার পছন্দের বিষয়টিতে চাপ দিন।',
          };
        }
        if (clsId === 'class-9') {
          return {
            id: 'subjects-class-9',
            title: 'নবম শ্রেণি গাইড',
            text: 'আপনি এখন নবম শ্রেণির বিভাগে প্রবেশ করেছেন। এখান থেকে আপনার প্রয়োজনীয় বিষয় নির্বাচন করুন। বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখার প্রয়োজনীয় বিষয়টিতে চাপ দিন।',
          };
        }
        if (clsId === 'class-10') {
          return {
            id: 'subjects-class-10',
            title: 'দশম শ্রেণি গাইড',
            text: 'আপনি এখন দশম শ্রেণির বিভাগে প্রবেশ করেছেন। এখান থেকে আপনার প্রয়োজনীয় বিষয় নির্বাচন করুন। এসএসসি ও বোর্ড পরীক্ষার সকল বিষয়ের শিক্ষামূলক কনটেন্ট ব্যবহার করতে আপনার পছন্দের বিষয়টিতে চাপ দিন।',
          };
        }
        if (clsId === 'class-11') {
          return {
            id: 'subjects-class-11',
            title: 'একাদশ শ্রেণি গাইড',
            text: 'আপনি এখন একাদশ শ্রেণির বিভাগে প্রবেশ করেছেন। এইচএসসি পরীক্ষার বিজ্ঞান, মানবিক ও ব্যবসায় শাখার প্রয়োজনীয় পাঠ ও কুইজ থেকে পছন্দের বিষয়টি বেছে নিন।',
          };
        }
        if (clsId === 'class-12') {
          return {
            id: 'subjects-class-12',
            title: 'দ্বাদশ শ্রেণি গাইড',
            text: 'আপনি এখন দ্বাদশ শ্রেণির বিভাগে প্রবেশ করেছেন। এইচএসসি ফাইনাল ও বোর্ড পরীক্ষার সকল বিষয়ের শিক্ষামূলক কনটেন্ট থেকে পছন্দের বিষয়টি বেছে নিন।',
          };
        }
        return {
          id: `subjects-${clsId || 'all'}`,
          title: `${clsName} বিষয় গাইড`,
          text: `আপনি এখন ${clsName} বিভাগে প্রবেশ করেছেন। এখান থেকে আপনার প্রয়োজনীয় বিষয়টি নির্বাচন করে পড়াশোনা শুরু করুন।`,
        };
      }

      case 'chapters': {
        const subId = pageParams?.subjectId;
        const subObj = subjects.find((s) => s.id === subId);
        const subName = subObj ? subObj.name : 'এই বিষয়ের';
        return {
          id: `chapters-${subId || 'all'}`,
          title: `${subName} অধ্যায় গাইড`,
          text: 'আপনি এই বিষয়ের অধ্যায়গুলো দেখতে পারবেন। আপনার পছন্দের অধ্যায় নির্বাচন করুন।',
        };
      }

      case 'lesson': {
        const lesId = pageParams?.lessonId;
        const chapter = chapters.find((ch) => ch.id === pageParams?.chapterId);
        const chTitle = chapter ? chapter.title : 'এই অধ্যায়ের';
        return {
          id: `lesson-${lesId || 'view'}`,
          title: 'পাঠ্যক্রম পাঠ গাইড',
          text: `আপনি ${chTitle} বিস্তারিত পাঠে আছেন। প্রতিটি অংশ মনোযোগ দিয়ে পড়ুন এবং প্রয়োজন হলে কুইজ অনুশীলন করুন।`,
        };
      }

      case 'quiz':
        return {
          id: 'quiz-list',
          title: 'কুইজ তালিকা গাইড',
          text: 'আপনি কুইজ তালিকায় আছেন। যে বিষয়ের কুইজ দিয়ে নিজেকে যাচাই করতে চান, সেই কুইজটি শুরু করুন।',
        };

      case 'quiz_play':
        return {
          id: 'quiz-play',
          title: 'পরীক্ষা ও কুইজ গাইড',
          text: 'এখন পরীক্ষা শুরু করুন। প্রতিটি প্রশ্নের উত্তর দেওয়ার পর পরবর্তী প্রশ্নে যান।',
        };

      case 'exam_prep':
        return {
          id: 'exam-prep',
          title: 'পরীক্ষা প্রস্তুতি গাইড',
          text: 'এখন পরীক্ষা শুরু করুন। প্রতিটি প্রশ্নের উত্তর দেওয়ার পর পরবর্তী প্রশ্নে যান।',
        };

      case 'question_bank': {
        return {
          id: 'question-bank',
          title: 'MCQ প্রশ্নব্যাংক গাইড',
          text: 'আপনি এখন MCQ বিভাগে আছেন। প্রতিটি প্রশ্ন ভালোভাবে পড়ে সঠিক উত্তর নির্বাচন করুন।',
        };
      }

      case 'model_tests':
        return {
          id: 'model-tests',
          title: 'মডেল টেস্ট গাইড',
          text: 'আপনি এখন মডেল টেস্ট বিভাগে আছেন। সময় মেনে পূর্ণাঙ্গ পরীক্ষা দিন এবং আপনার পরীক্ষার প্রস্তুতি যাচাই করুন।',
        };

      case 'daily_quiz':
      case 'daily_practice':
      case 'mixed_quiz':
        return {
          id: 'daily-quiz',
          title: 'দৈনিক কুইজ গাইড',
          text: 'আজকের কুইজে আপনাকে স্বাগতম। প্রতিটি প্রশ্ন মনোযোগ দিয়ে পড়ে সঠিক উত্তর নির্বাচন করুন।',
        };

      case 'wrong_questions':
        return {
          id: 'wrong-questions',
          title: 'ভুল প্রশ্ন সংশোধন গাইড',
          text: 'ভুল প্রশ্ন সংশোধন বিভাগে স্বাগতম। পূর্বে ভুল করা প্রশ্নগুলো সঠিক ব্যাখ্যাসহ পুনরায় অনুশীলন করে দুর্বলতা দূর করুন।',
        };

      case 'bookmarked_questions':
        return {
          id: 'bookmarked-questions',
          title: 'সংরক্ষিত প্রশ্ন গাইড',
          text: 'সংরক্ষিত প্রশ্ন তালিকায় স্বাগতম। আপনার পছন্দের ও গুরুত্বপূর্ণ প্রশ্নগুলো একনজরে রিভিশন দিন।',
        };

      case 'ssc_dashboard':
        return {
          id: 'ssc-dashboard',
          title: 'এসএসসি একাডেমি গাইড',
          text: 'এসএসসি একাডেমিতে আপনাকে স্বাগতম। বিজ্ঞান, মানবিক ও ব্যবসায় শাখার ১৭টি বিষয়ের পূর্ণাঙ্গ অধ্যায়ভিত্তিক পাঠ, MCQ ও মডেল টেস্ট এখানে পাবেন।',
        };

      case 'hsc_dashboard':
        return {
          id: 'hsc-dashboard',
          title: 'এইচএসসি একাডেমি গাইড',
          text: 'এইচএসসি একাডেমিতে আপনাকে স্বাগতম। একাদশ ও দ্বাদশ শ্রেণির ২১টি বিষয়ের ১ম ও ২য় পত্রের পূর্ণাঙ্গ প্রস্তুতি নিন।',
        };

      case 'formula_bank':
        return {
          id: 'formula-bank',
          title: 'ডিজিটাল সূত্রভাণ্ডার গাইড',
          text: 'ডিজিটাল সূত্রভাণ্ডারে আপনাকে স্বাগতম। গণিত, পদার্থ ও রসায়নের প্রয়োজনীয় সূত্রগুলো একনজরে দেখে নিন।',
        };

      case 'ai_chat':
        return {
          id: 'ai-chat',
          title: 'AI শিক্ষা সহায়ক গাইড',
          text: 'এআই শিক্ষা সহায়কে আপনাকে স্বাগতম। পড়াশোনার যেকোনো কঠিন প্রশ্ন বা সমস্যা আমাকে লিখে বা ছবি তুলে জিজ্ঞাসা করুন।',
        };

      case 'grammar_master':
        return {
          id: 'grammar-master',
          title: 'ব্যাকরণ মাস্টার গাইড',
          text: 'ব্যাকরণ মাস্টার বিভাগে আপনাকে স্বাগতম। বাংলা ও ইংরেজি ব্যাকরণের গুরুত্বপূর্ণ নিয়ম ও কুইজ অনুশীলন করুন।',
        };

      case 'curriculum_audit':
        return {
          id: 'curriculum-audit',
          title: 'কারিকুলাম অডিট গাইড',
          text: 'কারিকুলাম অডিট ড্যাশবোর্ডে স্বাগতম। সকল শ্রেণির পাঠ্যক্রম ও MCQ প্রশ্নভাণ্ডারের সামগ্রিক স্ট্যাটাস এখানে দেখা যাবে।',
        };

      case 'posts':
        return {
          id: 'posts',
          title: 'কমিউনিটি স্টাডি গ্রুপ গাইড',
          text: 'বাংলা শিক্ষাগর স্টাডি গ্রুপে আপনাকে স্বাগতম। সহপাঠী ও শিক্ষকদের সাথে শিক্ষামূলক আলোচনা ও প্রশ্ন শেয়ার করুন।',
        };

      case 'create_post':
        return {
          id: 'create-post',
          title: 'প্রশ্ন পোস্ট গাইড',
          text: 'নতুন আলোচনার পোস্ট লিখুন। পড়াশোনা সংক্রান্ত প্রশ্ন বা টিপস সহপাঠীদের সাথে শেয়ার করুন।',
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
