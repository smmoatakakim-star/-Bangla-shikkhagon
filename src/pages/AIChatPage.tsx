import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  FileText,
  Calculator,
  Target,
  Bookmark,
  ThumbsUp,
  Share2,
  ChevronRight,
  GraduationCap,
  Layers,
  ArrowRight,
  Lightbulb,
  Zap,
  Image as ImageIcon,
  X as XIcon,
  Paperclip,
  Volume2,
  Square,
  VolumeX,
  Mic,
  MicOff,
  User,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Smile,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId, AIChatMessage, AIChatMode } from '../types';
import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from '../data/curriculumData';
import { isRawHtmlDocument, sanitizeAiDirectAnswer, cleanTextForSpeech } from '../utils/banglaUtils';
import { chatWithAiTeacher, generateEducationalFallbackAnswer } from '../services/aiService';
import { AIQuickAnswerTab } from '../components/ai/AIQuickAnswerTab';
import { AINotesTab } from '../components/ai/AINotesTab';
import { AIMcqGeneratorTab } from '../components/ai/AIMcqGeneratorTab';

const SUGGESTED_PROMPTS = [
  { text: 'ভগ্নাংশ কী ও কত প্রকার?', classId: 'class-6', subjectId: 'math', tag: 'গণিত' },
  { text: '🌱 সালোকসংশ্লেষণ সহজে বুঝিয়ে দাও', classId: 'class-6', subjectId: 'science', tag: 'বিজ্ঞান' },
  { text: '📐 পিথাগোরাসের উপপাদ্যটি কী ও কীভাবে প্রমাণ করতে হয়?', classId: 'class-8', subjectId: 'math', tag: 'জ্যামিতি' },
  { text: '🍎 নিউটনের ৩য় সূত্র বাস্তব উদাহরণ দিয়ে ব্যাখ্যা করো', classId: 'class-9', subjectId: 'physics', tag: 'পদার্থ' },
  { text: '🇬🇧 ইংরেজি Tense মনে রাখার সহজ শর্টকাট কৌশল', classId: 'class-7', subjectId: 'english', tag: 'ইংরেজি' },
  { text: '🔬 Class 8 বিজ্ঞান ৩য় অধ্যায় (ব্যাপন ও অভিস্রবণ)-এর সারসংক্ষেপ', classId: 'class-8', subjectId: 'science', tag: 'অধ্যায় নোট' },
  { text: '⚡ ওহমের সূত্র ও বর্তনীর তুল্যরোধ নির্ণয়ের নিয়ম', classId: 'class-10', subjectId: 'physics', tag: 'পদার্থ' },
];

/**
 * Inline markdown parser for clean bold/italic/code text
 */
const parseInlineMarkdown = (content: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-emerald-950 dark:text-emerald-200">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-slate-700 dark:text-slate-300">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono border border-slate-200 dark:border-slate-700"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? parts : content;
};

/**
 * Structured academic formatter for AI Teacher messages
 */
const renderFormattedAiContent = (text: string) => {
  if (isRawHtmlDocument(text)) {
    return (
      <p className="text-rose-600 dark:text-rose-400 font-medium">
        দুঃখিত, উত্তরটি লোড হতে সমস্যা হয়েছিল। অনুগ্রহ করে প্রশ্নটি পুনরায় করুন।
      </p>
    );
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-2.5 text-slate-800 dark:text-slate-100 text-[14.5px] sm:text-[15.5px] leading-relaxed tracking-normal font-sans select-text">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Markdown headings
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h4
              key={idx}
              className="text-base sm:text-[17px] font-bold text-emerald-800 dark:text-emerald-300 pt-2 pb-1 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center gap-2"
            >
              <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span>{parseInlineMarkdown(headerText)}</span>
            </h4>
          );
        }

        // Educational Highlight Callout cards (💡, 📌, ⚠️, 🎯, 👉)
        if (
          trimmed.startsWith('💡') ||
          trimmed.startsWith('📌') ||
          trimmed.startsWith('⚠️') ||
          trimmed.startsWith('🎯') ||
          trimmed.startsWith('👉')
        ) {
          const icon = trimmed.slice(0, 2);
          const body = trimmed.slice(2).trim();
          return (
            <div
              key={idx}
              className="p-3 my-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-100 text-sm font-medium flex items-start gap-2.5 shadow-xs"
            >
              <span className="text-base shrink-0 select-none">{icon}</span>
              <div className="flex-1 leading-relaxed">{parseInlineMarkdown(body)}</div>
            </div>
          );
        }

        // Bullet point items (•, -, *)
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[•\-*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-2.5 shrink-0" />
              <div className="flex-1">{parseInlineMarkdown(content)}</div>
            </div>
          );
        }

        // Numbered steps (1., 2., ১., ২.)
        const numberedMatch = trimmed.match(/^([0-9১-৯]+)[.)]\s*(.*)$/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const content = numberedMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 py-0.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mt-0.5 shrink-0 px-1 border border-emerald-200/60 dark:border-emerald-800">
                {num}
              </span>
              <div className="flex-1">{parseInlineMarkdown(content)}</div>
            </div>
          );
        }

        // Normal paragraph line
        return <p key={idx}>{parseInlineMarkdown(line)}</p>;
      })}
    </div>
  );
};

export const AIChatPage: React.FC = () => {
  const { pageParams } = useApp();

  // Active Main Feature Tab
  const [activeMainTab, setActiveMainTab] = useState<'chat' | 'quick_answer' | 'notes' | 'mcqs'>(
    (pageParams?.tab as any) || 'chat'
  );

  // Selected filters/context
  const [selectedClass, setSelectedClass] = useState<ClassId>(pageParams?.classId || 'class-8');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(pageParams?.subjectId || 'science');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(pageParams?.chapterId || '');
  const [activeMode, setActiveMode] = useState<AIChatMode>('general');

  // Mobile Settings Drawer toggle
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  // Input & state
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedNotes, setSavedNotes] = useState<Record<string, boolean>>({});

  // Audio Speech Synthesis for AI Teacher response
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Voice-to-Text Microphone Recording
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Image Upload state
  const [selectedImage, setSelectedImage] = useState<{
    dataUrl: string;
    file: File;
    name: string;
    mimeType: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop voice synthesis
  const handleStopVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
  };

  // Speak AI message on demand
  const handleListen = (msgId: string, rawText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজার ভয়েস প্লেব্যাক সাপোর্ট করে না।');
      return;
    }

    if (speakingMsgId === msgId) {
      handleStopVoice();
      return;
    }

    handleStopVoice();

    const spokenText = cleanTextForSpeech(rawText);
    if (!spokenText) return;

    const synth = window.speechSynthesis;
    if (synth.paused) {
      synth.resume();
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = synth.getVoices();
    const bnVoice = voices.find((v) => {
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
    if (bnVoice) {
      utterance.voice = bnVoice;
    }

    utterance.onstart = () => {
      setSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setSpeakingMsgId((current) => (current === msgId ? null : current));
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Speech error:', e);
      }
      setSpeakingMsgId((current) => (current === msgId ? null : current));
    };

    try {
      synth.speak(utterance);
      setSpeakingMsgId(msgId);
    } catch (err) {
      console.warn('Speech synthesis call failed:', err);
      setSpeakingMsgId(null);
    }
  };

  // Toggle voice recognition
  const handleToggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('আপনার ডিভাইসে সরাসরি ভয়েস টাইপিং সুবিধা নেই। গুগল ক্রোম (Google Chrome) ব্রাউজারে চেষ্টা করুন।');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        console.warn('Voice recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Voice recognition initialization failed:', err);
      setIsListening(false);
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Messages list with persistent local cache
  const [messages, setMessages] = useState<AIChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bsh_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed
            .filter((m) => m && typeof m.text === 'string' && !isRawHtmlDocument(m.text))
            .map((m) =>
              m.sender === 'assistant'
                ? { ...m, text: sanitizeAiDirectAnswer(m.text) || m.text }
                : m
            );
          if (cleaned.length > 0) {
            try {
              localStorage.setItem('bsh_ai_chat_history', JSON.stringify(cleaned));
            } catch {}
            return cleaned;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `**AI শিক্ষক — ডিজিটাল ক্লাসরুম** 🎓\n\nস্বাগতম! আমি তোমাদের এনসিটিবি (NCTB) পাঠ্যক্রমভিত্তিক সার্বক্ষণিক এআই শিক্ষক।\n\n৬ষ্ঠ থেকে ১০ম শ্রেণির গণিত, বিজ্ঞান, ইংরেজি, বাংলা বা পদার্থবিজ্ঞানের যেকোনো জটিল অঙ্ক, সূত্র বা পাঠ্যবইয়ের প্রশ্ন সরাসরি লিখে বা ছবি তুলে পাঠাতে পারো।\n\n💡 *নিচের যেকোনো জনপ্রিয় প্রশ্নে ক্লিক করো অথবা নিচে তোমার প্রশ্ন লিখে পাঠাও।*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: [
          'ভগ্নাংশ কী ও কত প্রকার?',
          'সালোকসংশ্লেষণ সহজে বুঝিয়ে দাও',
          'পিথাগোরাসের উপপাদ্যটি কী?',
          'Class 8 বিজ্ঞানের গুরুত্বপূর্ণ নোট দাও',
        ],
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial param query if passed from other pages
  useEffect(() => {
    if (pageParams?.query && typeof pageParams.query === 'string') {
      setInputText(pageParams.query);
      if (pageParams.classId) setSelectedClass(pageParams.classId);
      if (pageParams.subjectId) setSelectedSubject(pageParams.subjectId);
      if (pageParams.chapterId) setSelectedChapterId(pageParams.chapterId);
    }
  }, [pageParams]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bsh_ai_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Auto scroll down
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Filter available subjects and chapters
  const currentClassSubjects = ALL_SUBJECTS.filter((s) => s.classId === selectedClass);
  const currentChapters = ALL_CHAPTERS.filter(
    (c) => c.classId === selectedClass && c.subjectId === selectedSubject
  );
  const currentChapterObj = currentChapters.find((c) => c.id === selectedChapterId);

  // Handle image attachment
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)।');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage({
        dataUrl: event.target?.result as string,
        file,
        name: file.name,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Guard against duplicate / concurrent submissions
  const inFlightRef = useRef(false);

  // Send message
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if ((!textToSend && !selectedImage) || loading || inFlightRef.current) return;

    inFlightRef.current = true;
    const currentImage = selectedImage;
    setSelectedImage(null);

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend || 'অনুগ্রহ করে এই ছবিটিতে থাকা প্রশ্ন বা সমীকরণটি সমাধান ও বিস্তারিত ব্যাখ্যা করুন।',
      imageUrl: currentImage?.dataUrl,
      imageBase64: currentImage?.dataUrl,
      imageMimeType: currentImage?.mimeType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextInfo: {
        classId: selectedClass,
        subjectId: selectedSubject,
        chapterTitle: currentChapterObj?.title,
        mode: activeMode,
      },
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const chatMessages = newMessages.map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.text,
        imageBase64: m.imageBase64,
        imageMimeType: m.imageMimeType,
      }));

      const contextParam = {
        classId: selectedClass,
        subjectId: selectedSubject,
        chapterTitle: currentChapterObj?.title || '',
        mode: activeMode,
      };

      let aiReply = await chatWithAiTeacher(chatMessages, contextParam);

      if (isRawHtmlDocument(aiReply)) {
        aiReply = '';
      }
      aiReply = sanitizeAiDirectAnswer(aiReply);

      if (!aiReply || !aiReply.trim()) {
        const assistantMessage: AIChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'AI থেকে কোনো উত্তর পাওয়া যায়নি। অনুগ্রহ করে পুনরায় প্রশ্নটি পাঠান।',
          isError: true,
          errorDetail: 'The AI service returned an empty response. Please retry.',
          retryPrompt: textToSend,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        return;
      }

      const assistantMessage: AIChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: aiReply,
        isError: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextInfo: {
          classId: selectedClass,
          subjectId: selectedSubject,
          chapterTitle: currentChapterObj?.title,
          mode: activeMode,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.warn('AI chat error caught:', err);
      const errMsg = err?.message || String(err);
      let userFriendlyMsg = 'দুঃখিত, উত্তর প্রস্তুত করার সময় সমস্যা দেখা দিয়েছে।';
      let errorDetail = '';

      if (errMsg.toLowerCase().includes('network') || errMsg.toLowerCase().includes('failed to fetch')) {
        userFriendlyMsg = 'ইন্টারনেট সংযোগ বিঘ্নিত হয়েছে।';
        errorDetail = 'দয়া করে আপনার ইন্টারনেট কানেকশন বা ফায়ারওয়াল চেক করে পুনরায় পাঠান।';
      } else if (errMsg.includes('429') || errMsg.toLowerCase().includes('quota')) {
        userFriendlyMsg = 'AI সার্ভিসের দৈনিক কোটা সাময়িকভাবে পূর্ণ হয়েছে।';
        errorDetail = 'কিছুক্ষণ পর পুনরায় প্রশ্নটি পাঠান।';
      } else if (errMsg.includes('api-not-enabled')) {
        userFriendlyMsg = 'AI শিক্ষক উত্তর প্রস্তুত করতে সাময়িক জটিলতা অনুভব করছে।';
        errorDetail = 'অনুগ্রহ করে প্রশ্নটি পুনরায় পাঠান অথবা পৃষ্ঠাটি রিফ্রেশ করুন।';
      } else {
        errorDetail = errMsg.slice(0, 120);
      }

      const assistantMessage: AIChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: userFriendlyMsg,
        isError: true,
        errorDetail,
        retryPrompt: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextInfo: {
          classId: selectedClass,
          subjectId: selectedSubject,
          chapterTitle: currentChapterObj?.title,
          mode: activeMode,
        },
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  const handleClearChat = () => {
    if (window.confirm('আপনি কি পূর্ববর্তী সমস্ত চ্যাট হিস্ট্রি মুছে ফেলতে চান?')) {
      const resetMsg: AIChatMessage = {
        id: 'msg-welcome-fresh',
        sender: 'assistant',
        text: `নতুন আলোচনা শুরু হয়েছে। আপনার যেকোনো পড়ালেখার বিষয় নিয়ে প্রশ্ন করতে পারেন!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([resetMsg]);
      localStorage.removeItem('bsh_ai_chat_history');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSaveNote = (id: string) => {
    setSavedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerateMCQ = async () => {
    const topic = currentChapterObj ? currentChapterObj.title : `${selectedSubject} বিষয়`;
    const prompt = `অনুগ্রহ করে "${topic}"-এর ওপর ৪টি অপশন ও বিশদ ব্যাখ্যাসহ ৫টি গুরুত্বপূর্ণ বহুনির্বাচনী (MCQ) প্রশ্ন তৈরি করুন।`;
    setActiveMode('mcq');
    handleSendMessage(prompt);
  };

  return (
    <div id="ai-chat-page-root" className="pb-16 max-w-6xl mx-auto px-2 sm:px-4">
      {/* Top Academic Header Banner */}
      <div
        id="ai-chat-header-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl mb-6 border border-emerald-700/40"
      >
        {/* Subtle Educational Chalkboard / Constellation Overlay */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/40 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/40 backdrop-blur-xs rounded-[14px] flex items-center justify-center text-white">
                  <GraduationCap className="w-7 h-7 text-emerald-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ডিজিটাল পাঠশালা • NCTB ও NCERT পাঠ্যক্রম অনুমোদিত</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>AI শিক্ষক ও শিক্ষা সহায়ক</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 font-medium">
                    v2.5 Smart
                  </span>
                </h1>
              </div>
            </div>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
              যেকোনো অধ্যায়ের জটিল বিষয়, গণিতের নিখুঁত সমাধান, বিজ্ঞানের সূত্রের বাস্তব ব্যাখ্যা এবং দ্রুত নোট
              তৈরি করার জন্য তোমার ব্যক্তিগত এআই শিক্ষক।
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="ai-chat-new-conversation-btn"
              onClick={handleClearChat}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition backdrop-blur-sm shadow-sm"
              title="নতুন আলোচনা শুরু করুন"
            >
              <RotateCcw className="w-4 h-4 text-emerald-300" />
              <span>নতুন আলোচনা</span>
            </button>

            <button
              id="ai-quick-notes-btn"
              onClick={() => setActiveMainTab('notes')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>নোট জেনারেটর</span>
            </button>
          </div>
        </div>

        {/* 4-Tab Main Switcher */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setActiveMainTab('chat')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'chat'
                ? 'bg-white text-emerald-950 shadow-md ring-2 ring-emerald-300/50'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>AI শিক্ষক চ্যাট (Chat)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('quick_answer')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'quick_answer'
                ? 'bg-white text-emerald-950 shadow-md ring-2 ring-emerald-300/50'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>১-ক্লিকে উত্তর (Quick)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('notes')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'notes'
                ? 'bg-white text-emerald-950 shadow-md ring-2 ring-emerald-300/50'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>নোট সামারি (Notes)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('mcqs')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'mcqs'
                ? 'bg-white text-emerald-950 shadow-md ring-2 ring-emerald-300/50'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Target className="w-4 h-4 text-teal-500" />
            <span>MCQ কুইজ প্র্যাকটিস</span>
          </button>
        </div>
      </div>

      {/* Render Active Feature Tab */}
      {activeMainTab === 'quick_answer' && <AIQuickAnswerTab />}
      {activeMainTab === 'notes' && <AINotesTab />}
      {activeMainTab === 'mcqs' && <AIMcqGeneratorTab />}

      {/* Main AI Chat Interface Container */}
      {activeMainTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Mobile Settings Accordion Toggle Button (Visible on mobile/tablet only) */}
          <div className="lg:hidden col-span-1">
            <button
              type="button"
              onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>পড়ার বিষয় ও শ্রেণি নির্ধারণ:</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-xs">
                  {selectedClass.replace('class-', '')}ম • {currentClassSubjects.find((s) => s.id === selectedSubject)?.name}
                </span>
              </div>
              {mobileSettingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Context & Study Controls Sidebar */}
          <aside
            id="ai-context-sidebar"
            className={`${
              mobileSettingsOpen ? 'block' : 'hidden'
            } lg:block lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-5 transition-all`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>পড়ার বিষয় ও প্রেক্ষাপট</span>
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800">
                স্মার্ট ফোকাস
              </span>
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                শ্রেণি পছন্দ করো
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {ALL_CLASSES.map((cls) => {
                  const isSelected = selectedClass === cls.id;
                  const label =
                    cls.id === 'ssc'
                      ? 'SSC'
                      : cls.id === 'hsc'
                      ? 'HSC'
                      : `${cls.numericGrade}ষ্ঠ`;
                  return (
                    <button
                      key={cls.id}
                      id={`select-class-${cls.id}`}
                      onClick={() => {
                        setSelectedClass(cls.id);
                        setSelectedChapterId('');
                      }}
                      className={`py-2 px-1 text-xs font-bold rounded-xl transition text-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                          : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                বিষয় পছন্দ করো
              </label>
              <div className="relative">
                <select
                  id="ai-subject-dropdown"
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value as SubjectId);
                    setSelectedChapterId('');
                  }}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                  {currentClassSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.banglaName || sub.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Chapter Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                নির্দিষ্ট অধ্যায় (ঐচ্ছিক)
              </label>
              <div className="relative">
                <select
                  id="ai-chapter-dropdown"
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                  <option value="">-- সম্পূর্ণ সিলেবাস বা সাধারণ প্রশ্ন --</option>
                  {currentChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Learning Modes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                শিক্ষণ পদ্ধতি (Study Mode)
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'general', label: '📖 সাধারণ জিজ্ঞাসা ও সহজ ব্যাখ্যা', desc: 'সহজ ভাষায় পড়া বুঝিয়ে নেওয়া' },
                  { id: 'notes', label: '📝 রিভিশন নোট ও পয়েন্ট সামারি', desc: 'পরীক্ষার মূল পয়েন্ট ও সারসংক্ষেপ' },
                  { id: 'mcq', label: '❓ MCQ তৈরি ও প্র্যাকটিস', desc: 'অপশন ও নির্ভুল ব্যাখ্যাসহ কুইজ' },
                  { id: 'math_steps', label: '📐 অঙ্কের ধাপভিত্তিক সমাধান', desc: 'Step-by-step নিয়ম ও সূত্র' },
                  { id: 'exam_tips', label: '🎯 সৃজনশীল পরীক্ষার টিপস', desc: 'পরীক্ষায় বেশি নম্বর পাওয়ার কৌশল' },
                ].map((m) => {
                  const isActive = activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      id={`ai-mode-${m.id}`}
                      onClick={() => setActiveMode(m.id as AIChatMode)}
                      className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{m.label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                          {m.desc}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0 shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                id="ai-sidebar-generate-mcqs-btn"
                onClick={handleGenerateMCQ}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>৫টি কুইজ MCQ তৈরি করো</span>
              </button>
            </div>
          </aside>

          {/* Right Chat Panel: Modern Classroom Studio */}
          <section
            id="ai-chat-main-window"
            className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden h-[750px] max-h-[85vh] relative"
          >
            {/* Active Class & Topic Context Top Bar */}
            <div
              id="ai-chat-context-bar"
              className="px-4 sm:px-6 py-3.5 bg-slate-50/90 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2 z-10"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {selectedClass.replace('class-', '')}ম শ্রেণি
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {currentClassSubjects.find((s) => s.id === selectedSubject)?.name}
                    </span>
                    {currentChapterObj && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="truncate max-w-[150px] sm:max-w-xs text-slate-600 dark:text-slate-300">
                          {currentChapterObj.title}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {/* Global Audio Indicator / Stop Voice */}
                {speakingMsgId && (
                  <button
                    id="ai-chat-global-stop-voice-btn"
                    onClick={handleStopVoice}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition text-xs shadow-md animate-pulse"
                    title="ভয়েস বন্ধ করুন"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>ভয়েস থামাও</span>
                  </button>
                )}

                <button
                  id="ai-chat-clear-history-top-btn"
                  onClick={handleClearChat}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 flex items-center gap-1.5 transition text-xs font-semibold"
                  title="চ্যাট হিস্ট্রি পরিষ্কার করুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">পরিষ্কার</span>
                </button>

                <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/50 dark:border-emerald-800/60 hidden sm:inline-block">
                  {activeMode === 'general'
                    ? 'সাধারণ মোড'
                    : activeMode === 'notes'
                    ? 'নোট মোড'
                    : activeMode === 'mcq'
                    ? 'MCQ মোড'
                    : activeMode === 'math_steps'
                    ? 'অঙ্ক সমাধান'
                    : 'সাজেশন'}
                </span>
              </div>
            </div>

            {/* Chat Messages Area with Subtle Academic Notebook/Graph Background */}
            <div
              id="ai-messages-container"
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative bg-slate-50/60 dark:bg-slate-950/50"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(16, 185, 129, 0.07) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              {/* Subtle ambient lighting inside chat canvas */}
              <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    id={`ai-message-${msg.id}`}
                    className={`flex gap-3 sm:gap-3.5 relative z-10 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* AI Teacher Avatar */}
                    {!isUser && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm ring-2 ring-emerald-500/20 mt-1">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div className="max-w-[88%] sm:max-w-[80%] space-y-2">
                      {/* Sender Meta Header */}
                      <div
                        className={`flex items-center gap-2 text-[11px] font-semibold ${
                          isUser ? 'justify-end text-emerald-800 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {!isUser && (
                          <>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              AI শিক্ষক
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {msg.contextInfo?.chapterTitle && (
                              <span className="text-emerald-700 dark:text-emerald-400 truncate max-w-[150px]">
                                {msg.contextInfo.chapterTitle}
                              </span>
                            )}
                          </>
                        )}
                        {isUser && (
                          <>
                            <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                            <span className="font-bold">আপনি (শিক্ষার্থী)</span>
                          </>
                        )}
                        {!isUser && <span className="text-slate-400 font-normal ml-auto">{msg.timestamp}</span>}
                      </div>

                      {/* Message Bubble Card */}
                      <div
                        className={`p-4 sm:p-5 rounded-3xl text-sm leading-relaxed transition-all shadow-xs ${
                          isUser
                            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-tr-xs shadow-md shadow-emerald-950/10'
                            : msg.isError
                            ? 'bg-rose-50/90 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-tl-xs'
                            : 'bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-tl-xs border-l-4 border-l-emerald-500 shadow-sm'
                        }`}
                      >
                        {/* Attached Image if present in message */}
                        {msg.imageUrl && (
                          <div className="mb-3">
                            <img
                              src={msg.imageUrl}
                              alt="সংযুক্ত পাঠ্যবই বা অঙ্কের ছবি"
                              className="max-h-64 rounded-2xl object-contain bg-slate-900/10 dark:bg-black/30 border border-white/20 shadow-sm"
                            />
                          </div>
                        )}

                        {/* Error state presentation with Retry button */}
                        {msg.isError ? (
                          <div className="space-y-3">
                            <div className="flex items-start gap-2.5">
                              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="font-bold text-rose-900 dark:text-rose-200 text-sm">
                                  {msg.text}
                                </p>
                                {msg.errorDetail && (
                                  <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
                                    {msg.errorDetail}
                                  </p>
                                )}
                              </div>
                            </div>

                            {msg.retryPrompt && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  id={`retry-btn-${msg.id}`}
                                  onClick={() => handleSendMessage(msg.retryPrompt)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>পুনরায় চেষ্টা করুন (Retry)</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ) : isUser ? (
                          <div className="whitespace-pre-wrap font-sans font-normal text-[15px] leading-relaxed text-white select-text">
                            {msg.text}
                          </div>
                        ) : (
                          renderFormattedAiContent(msg.text)
                        )}
                      </div>

                      {/* Educational Action Bar for AI response */}
                      {!isUser && !msg.isError && (
                        <div className="flex items-center gap-2 px-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-1">
                          {/* 🔊 Audio Listen / ⏹ Stop Voice */}
                          {speakingMsgId === msg.id ? (
                            <button
                              id={`stop-voice-btn-${msg.id}`}
                              onClick={handleStopVoice}
                              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-2 transition font-bold text-xs shadow-md animate-pulse"
                              title="অডিও বন্ধ করুন"
                            >
                              <div className="flex items-center gap-0.5 h-3">
                                <span className="w-1 bg-white rounded-full animate-bounce h-3" />
                                <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.2s] h-2" />
                                <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.4s] h-3.5" />
                              </div>
                              <span>⏹ ভয়েস থামাও</span>
                            </button>
                          ) : (
                            <button
                              id={`listen-btn-${msg.id}`}
                              onClick={() => handleListen(msg.id, msg.text)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1.5 transition font-semibold text-xs shadow-xs"
                              title="বাংলা অডিও শুনুন"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>🔊 শুনুন (Listen)</span>
                            </button>
                          )}

                          {/* 📋 Copy Response */}
                          <button
                            id={`copy-btn-${msg.id}`}
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition font-medium"
                            title="উত্তর কপি করুন"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 font-bold">কপি হয়েছে!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>কপি</span>
                              </>
                            )}
                          </button>

                          {/* 🔖 Save to Notebook */}
                          <button
                            id={`bookmark-note-btn-${msg.id}`}
                            onClick={() => toggleSaveNote(msg.id)}
                            className={`px-2.5 py-1.5 rounded-xl border transition flex items-center gap-1.5 font-medium ${
                              savedNotes[msg.id]
                                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                            title="নোটবুকে সংরক্ষণ করুন"
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${savedNotes[msg.id] ? 'fill-current text-amber-500' : ''}`}
                            />
                            <span>{savedNotes[msg.id] ? 'সংরক্ষিত' : 'সেভ'}</span>
                          </button>

                          {/* 👍 Helpful Reaction */}
                          <button
                            id={`like-btn-${msg.id}`}
                            onClick={() => toggleLike(msg.id)}
                            className={`px-2 py-1.5 rounded-xl transition flex items-center gap-1 ${
                              likedMap[msg.id]
                                ? 'text-emerald-600 font-bold'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                            title="সহায়ক উত্তর"
                          >
                            <ThumbsUp
                              className={`w-3.5 h-3.5 ${likedMap[msg.id] ? 'fill-current text-emerald-600' : ''}`}
                            />
                            <span>{likedMap[msg.id] ? 'ধন্যবাদ' : 'উপকারী'}</span>
                          </button>
                        </div>
                      )}

                      {/* Suggested Followups */}
                      {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {msg.suggestedFollowups.map((item, idx) => (
                            <button
                              key={idx}
                              id={`followup-${msg.id}-${idx}`}
                              onClick={() => handleSendMessage(item)}
                              className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 shadow-xs transition flex items-center gap-1 font-medium"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{item}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Student Avatar */}
                    {isUser && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1 ring-2 ring-slate-300/30">
                        <User className="w-5 h-5 text-slate-200" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Live Academic Thinking Indicator */}
              {loading && (
                <div id="ai-chat-loading-indicator" className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl rounded-tl-xs shadow-sm space-y-2 border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" />
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold ml-1">
                        AI শিক্ষক পাঠ্যক্রম ও সূত্র বিশ্লেষণ করে উত্তর সাজাচ্ছেন...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel */}
            <div
              id="ai-quick-prompts-tray"
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>জনপ্রিয় পড়ালেখার জিজ্ঞাসা:</span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">যেকোনো বিষয়ে ক্লিক করুন</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    id={`suggested-prompt-${idx}`}
                    onClick={() => {
                      setSelectedClass(p.classId as ClassId);
                      setSelectedSubject(p.subjectId as SubjectId);
                      handleSendMessage(p.text);
                    }}
                    className="whitespace-nowrap px-3.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-800 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition shadow-2xs flex items-center gap-1.5"
                  >
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      {p.tag}
                    </span>
                    <span>{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Input Area: Modern Floating Card Style */}
            <div
              id="ai-chat-input-area"
              className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800"
            >
              {/* Image Preview Thumbnail if attached */}
              {selectedImage && (
                <div className="flex items-center gap-3 p-2.5 mb-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                  <img
                    src={selectedImage.dataUrl}
                    alt="preview"
                    className="w-12 h-12 object-cover rounded-xl border border-emerald-300 dark:border-emerald-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 truncate">
                      {selectedImage.name}
                    </p>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      ছবি সংযুক্ত হয়েছে • AI প্রশ্নটি বিশ্লেষণ করবে
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition"
                    title="ছবি বাতিল করুন"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Listening Banner if Speech Recognition active */}
              {isListening && (
                <div className="flex items-center justify-between p-2 mb-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>ভয়েস শোনা হচ্ছে... স্পষ্ট বাংলায় আপনার প্রশ্নটি বলুন</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    className="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[11px]"
                  >
                    থামুন
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 sm:gap-2.5"
              >
                {/* Hidden Image input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Image attachment button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 rounded-2xl border transition flex items-center justify-center shrink-0 ${
                    selectedImage
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  title="অঙ্ক বা সমীকরণের ছবি তুলুন/আপলোড করুন"
                >
                  <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </button>

                {/* Voice-to-Text Microphone button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`p-3 rounded-2xl border transition flex items-center justify-center shrink-0 ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-600 shadow-md animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  title={isListening ? 'ভয়েস ইনপুট বন্ধ করুন' : 'মুখে বাংলায় প্রশ্ন বলুন (Voice Type)'}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>

                {/* Textarea Input */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    id="ai-chat-textarea"
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      selectedImage
                        ? 'ছবি সম্পর্কে কোনো নির্দেশনা থাকলে লিখুন (বা সরাসরি পাঠান)...'
                        : 'তোমার প্রশ্ন লিখুন (যেমন: সালোকসংশ্লেষণ কী? বা পিথাগোরাসের উপপাদ্যটি বুঝিয়ে দাও)...'
                    }
                    className="w-full resize-none max-h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition leading-relaxed font-sans"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  id="ai-chat-send-btn"
                  disabled={(!inputText.trim() && !selectedImage) || loading}
                  className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-emerald-950/20 transition flex items-center justify-center gap-2 shrink-0 font-bold"
                  title="প্রশ্ন পাঠান"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs">পাঠান</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-1">
                <span>এনসিটিবি ও এনসিইআরটি সিলেবাস সহায়িকা</span>
                <span className="hidden sm:inline">Enter চাপলে পাঠাবে • Shift+Enter নতুন লাইন</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
