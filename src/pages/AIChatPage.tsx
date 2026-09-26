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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId, AIChatMessage, AIChatMode, AIGeneratedQuizItem } from '../types';
import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from '../data/curriculumData';
import { isRawHtmlDocument, sanitizeAiDirectAnswer, cleanTextForSpeech } from '../utils/banglaUtils';
import { AIQuickAnswerTab } from '../components/ai/AIQuickAnswerTab';
import { AINotesTab } from '../components/ai/AINotesTab';
import { AIMcqGeneratorTab } from '../components/ai/AIMcqGeneratorTab';

const SUGGESTED_PROMPTS = [
  { text: 'ভগ্নাংশ কী?', classId: 'class-6', subjectId: 'math' },
  { text: '🌱 সালোকসংশ্লেষণ সহজে বুঝিয়ে দাও', classId: 'class-6', subjectId: 'science' },
  { text: '📐 পিথাগোরাসের উপপাদ্যটি কী ও কীভাবে প্রমাণ করতে হয়?', classId: 'class-8', subjectId: 'math' },
  { text: '🍎 নিউটনের ৩য় সূত্র বাস্তব উদাহরণ দিয়ে ব্যাখ্যা করো', classId: 'class-9', subjectId: 'physics' },
  { text: '🇬🇧 ইংরেজি Tense মনে রাখার সহজ শর্টকাট কৌশল', classId: 'class-7', subjectId: 'english' },
  { text: '🔬 Class 8 বিজ্ঞান ৩য় অধ্যায় (ব্যাপন ও অভিস্রবণ)-এর সারসংক্ষেপ', classId: 'class-8', subjectId: 'science' },
  { text: '⚡ ওহমের সূত্র ও বর্তনীর তুল্যরোধ নির্ণয়ের নিয়ম', classId: 'class-10', subjectId: 'physics' },
];

export const AIChatPage: React.FC = () => {
  const { pageParams, navigate } = useApp();

  // Active Main Feature Tab
  const [activeMainTab, setActiveMainTab] = useState<'chat' | 'quick_answer' | 'notes' | 'mcqs'>(
    (pageParams?.tab as any) || 'chat'
  );

  // Selected filters/context
  const [selectedClass, setSelectedClass] = useState<ClassId>(pageParams?.classId || 'class-8');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(pageParams?.subjectId || 'science');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(pageParams?.chapterId || '');
  const [activeMode, setActiveMode] = useState<AIChatMode>('general');

  // Input & state
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedNotes, setSavedNotes] = useState<Record<string, boolean>>({});

  // Audio Speech Synthesis for AI Teacher response
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Interactive Quiz state inside chat
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});

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

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
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
          // Immediately purge and reject any messages that contain raw HTML document/tag text
          // and sanitize out any forbidden greetings
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
        text: `**AI শিক্ষক — শিক্ষণ সহায়ক** 🎓\n\n৬ষ্ঠ থেকে ১০ম শ্রেণির যেকোনো বিষয়, অধ্যায়, গণিতের জটিল অঙ্ক বা বিজ্ঞান নিয়ে সরাসরি প্রশ্ন করতে পারেন।\n\n💡 *নিচের কুইক প্রম্পটগুলোতে চাপ দিন অথবা আপনার প্রশ্নটি নিচে লিখে পাঠান।*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: [
          'ভগ্নাংশ কী?',
          'সালোকসংশ্লেষণ সহজে বুঝিয়ে দাও',
          'পিথাগোরাসের উপপাদ্যটি কী?',
          'Class 8 বিজ্ঞানের গুরুত্বপূর্ণ নোট দাও',
        ],
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial param query if passed from other pages (e.g. Chapter or Quiz page)
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
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  // Send message
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if ((!textToSend && !selectedImage) || loading) return;

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
      const payload = {
        messages: newMessages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          text: m.text,
          imageBase64: m.imageBase64,
          imageMimeType: m.imageMimeType,
        })),
        context: {
          classId: selectedClass,
          subjectId: selectedSubject,
          chapterTitle: currentChapterObj?.title || '',
          mode: activeMode,
        },
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let aiReply = '';
      try {
        const textResponse = await res.text();
        // If response is raw HTML (e.g. <!DOCTYPE, <html, <head, <meta, etc.), strictly reject it
        if (!isRawHtmlDocument(textResponse)) {
          try {
            const data = JSON.parse(textResponse);
            aiReply =
              data.reply ||
              data.text ||
              data.content ||
              data.answer ||
              data.message ||
              '';
          } catch {
            // If response was direct text rather than JSON
            aiReply = textResponse.trim();
          }
        }
      } catch (readErr) {
        console.warn('Response parsing warning:', readErr);
      }

      // Final check: Guarantee aiReply never contains raw HTML documents
      if (isRawHtmlDocument(aiReply)) {
        aiReply = '';
      }

      // Strip any automated greetings, intros, or forbidden identity tags
      aiReply = sanitizeAiDirectAnswer(aiReply);

      if (!aiReply) {
        if (!res.ok) {
          throw new Error(`সার্ভারে সাময়িক সমস্যা হচ্ছে (স্ট্যাটাস: ${res.status})। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।`);
        }
        aiReply = 'দুঃখিত, কোনো উত্তর প্রস্তুত করা যায়নি। দয়া করে পুনরায় চেষ্টা করুন।';
      }

      const assistantMessage: AIChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: aiReply,
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
      console.error('AI chat error:', err);
      let errorText = 'দুঃখিত, অনুরোধটি সম্পন্ন করতে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।';
      if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        errorText = 'ইন্টারনেট বা সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আপনার নেটওয়ার্ক কানেকশন চেক করে পুনরায় চেষ্টা করুন।';
      } else if (err?.message) {
        errorText = err.message;
      }

      const errorMessage: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: errorText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        retryPrompt: textToSend,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
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

  // Quick Action Generators
  const handleGenerateNotes = async () => {
    if (!currentChapterObj) {
      alert('অনুগ্রহ করে আগে একটি অধ্যায় নির্বাচন করুন।');
      return;
    }
    const prompt = `অনুগ্রহ করে "${currentChapterObj.title}" অধ্যায়ের জন্য একটি পূর্ণাঙ্গ পরীক্ষার রিভিশন ও সারসংক্ষেপ নোট তৈরি করে দিন।`;
    setActiveMode('notes');
    handleSendMessage(prompt);
  };

  const handleGenerateMCQ = async () => {
    const topic = currentChapterObj ? currentChapterObj.title : `${selectedSubject} বিষয়`;
    const prompt = `অনুগ্রহ করে "${topic}"-এর ওপর ৪টি অপশন ও বিশদ ব্যাখ্যাসহ ৫টি গুরুত্বপূর্ণ বহুনির্বাচনী (MCQ) প্রশ্ন তৈরি করুন।`;
    setActiveMode('mcq');
    handleSendMessage(prompt);
  };

  return (
    <div id="ai-chat-page-root" className="pb-16 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div
        id="ai-chat-header-banner"
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg mb-6 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/30 border border-white/20 text-white inline-block mb-1">
                  Gemini 3.8 Flash Powered • NCERT & NCTB Curriculum
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  🤖 AI শিক্ষা সহায়ক (AI Education Assistant)
                </h1>
              </div>
            </div>
            <p className="text-emerald-50 text-sm sm:text-base max-w-2xl leading-relaxed">
              যেকোনো অধ্যায়ের সারসংক্ষেপ, গণিতের জটিল সমাধান, বিজ্ঞানের সূত্রের সহজ ব্যাখ্যা এবং তাৎক্ষণিক
              নোট তৈরি করুন এক ক্লিকে।
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="ai-chat-new-conversation-btn"
              onClick={handleClearChat}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-medium flex items-center gap-2 transition"
              title="নতুন আলোচনা শুরু করুন"
            >
              <RotateCcw className="w-4 h-4" />
              <span>নতুন আলোচনা</span>
            </button>

            <button
              id="ai-quick-notes-btn"
              onClick={() => setActiveMainTab('notes')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-sm font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>নোট জেনারেটর</span>
            </button>
          </div>
        </div>

        {/* 4-Tab Feature Switcher */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveMainTab('chat')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              activeMainTab === 'chat'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>🤖 AI শিক্ষক চ্যাট (Chat)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('quick_answer')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              activeMainTab === 'quick_answer'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>⚡ ১-ক্লিকে উত্তর (Quick Answer)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('notes')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              activeMainTab === 'notes'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>📝 AI দিয়ে নোট তৈরি (Notes)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('mcqs')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              activeMainTab === 'mcqs'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Target className="w-4 h-4 text-teal-500" />
            <span>🎯 AI দিয়ে MCQ তৈরি (Quiz)</span>
          </button>
        </div>
      </div>

      {/* Render Active Feature Tab */}
      {activeMainTab === 'quick_answer' && <AIQuickAnswerTab />}
      {activeMainTab === 'notes' && <AINotesTab />}
      {activeMainTab === 'mcqs' && <AIMcqGeneratorTab />}

      {/* Main Container: Context Selector & Chat Interface */}
      {activeMainTab === 'chat' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Settings / Context Sidebar */}
        <aside
          id="ai-context-sidebar"
          className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm h-fit space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              পড়ার বিষয় ও প্রেক্ষাপট নির্বাচন
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
              অটো-সিলেক্টেড
            </span>
          </div>

          {/* Class Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              শ্রেণি নির্ধারণ করুন
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CLASSES.map((cls) => {
                const isSelected = selectedClass === cls.id;
                const label =
                  cls.id === 'ssc'
                    ? 'SSC (৯-১০)'
                    : cls.id === 'hsc'
                    ? 'HSC (১১-১২)'
                    : `${cls.numericGrade}${
                        cls.numericGrade === 6
                          ? 'ষ্ঠ'
                          : cls.numericGrade === 7
                          ? 'ম'
                          : cls.numericGrade === 8
                          ? 'ম'
                          : cls.numericGrade === 9
                          ? 'ম'
                          : 'ম'
                      }`;
                return (
                  <button
                    key={cls.id}
                    id={`select-class-${cls.id}`}
                    onClick={() => {
                      setSelectedClass(cls.id);
                      setSelectedChapterId('');
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition text-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              বিষয় পছন্দ করুন
            </label>
            <select
              id="ai-subject-dropdown"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value as SubjectId);
                setSelectedChapterId('');
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {currentClassSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.banglaName || sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              নির্দিষ্ট অধ্যায় (ঐচ্ছিক)
            </label>
            <select
              id="ai-chapter-dropdown"
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- সম্পূর্ণ সিলেবাস বা সাধারণ বিষয় --</option>
              {currentChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Learning Mode Switcher */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              AI শিক্ষণ পদ্ধতি (Mode)
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'general', label: '📖 সাধারণ জিজ্ঞাসা ও ব্যাখ্যা', desc: 'সহজ প্রশ্ন ও উত্তর' },
                { id: 'notes', label: '📝 সংক্ষিপ্ত নোট ও সামারি', desc: 'পয়েন্ট আকারে মূল বিষয়' },
                { id: 'mcq', label: '❓ MCQ তৈরি ও প্র্যাকটিস', desc: 'অপশন ও ব্যাখ্যাসহ প্রশ্ন' },
                { id: 'math_steps', label: '📐 অঙ্কের ধাপভিত্তিক সমাধান', desc: 'Step-by-step নিয়ম' },
                { id: 'exam_tips', label: '🎯 পরীক্ষার মূল সাজেশন', desc: 'গুরুত্বপূর্ণ সৃজনশীল টিপস' },
              ].map((m) => {
                const isActive = activeMode === m.id;
                return (
                  <button
                    key={m.id}
                    id={`ai-mode-${m.id}`}
                    onClick={() => setActiveMode(m.id as AIChatMode)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{m.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.desc}</div>
                    </div>
                    {isActive && <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              id="ai-sidebar-generate-mcqs-btn"
              onClick={handleGenerateMCQ}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>৫টি কুইজ MCQ তৈরি করো</span>
            </button>
          </div>
        </aside>

        {/* Right Chat Panel */}
        <section
          id="ai-chat-main-window"
          className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[600px] h-[750px]"
        >
          {/* Active Context Bar */}
          <div
            id="ai-chat-context-bar"
            className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2 flex-wrap"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedClass.replace('class-', '')}ম শ্রেণি
              </span>
              <span>•</span>
              <span>{currentClassSubjects.find((s) => s.id === selectedSubject)?.name}</span>
              {currentChapterObj && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[200px] sm:max-w-xs">{currentChapterObj.title}</span>
                </>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {speakingMsgId && (
                <button
                  id="ai-chat-global-stop-voice-btn"
                  onClick={handleStopVoice}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition text-xs shadow-xs animate-pulse"
                  title="ভয়েস বন্ধ করুন"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>⏹ Stop Voice</span>
                </button>
              )}

              <button
                id="ai-chat-clear-history-top-btn"
                onClick={handleClearChat}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 flex items-center gap-1 transition text-xs"
                title="চ্যাট হিস্ট্রি পরিষ্কার করুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>

              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                {activeMode === 'general'
                  ? 'সাধারণ মোড'
                  : activeMode === 'notes'
                  ? 'নোট মোড'
                  : activeMode === 'mcq'
                  ? 'MCQ মোড'
                  : activeMode === 'math_steps'
                  ? 'অঙ্ক সমাধান'
                  : 'সাজেশন মোড'}
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            id="ai-messages-container"
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/40 dark:bg-slate-950/30"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  id={`ai-message-${msg.id}`}
                  className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* AI Avatar */}
                  {!isUser && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                    {/* Message Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-br-xs shadow-sm font-normal'
                          : msg.isError
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-bl-xs shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {/* Attached image if present in user message */}
                      {msg.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={msg.imageUrl}
                            alt="সংযুক্ত ছবি"
                            className="max-h-60 rounded-xl object-contain bg-black/20 border border-white/20"
                          />
                        </div>
                      )}

                      {/* Error state presentation with Retry button */}
                      {msg.isError ? (
                        <div className="space-y-3">
                          <div className="flex items-start gap-2.5">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-semibold text-rose-900 dark:text-rose-200 text-sm">
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
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>পুনরায় চেষ্টা করুন (Retry)</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {/* Context badge if present */}
                          {msg.contextInfo?.chapterTitle && !isUser && (
                            <div className="mb-2 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md inline-block font-medium">
                              📖 {msg.contextInfo.chapterTitle}
                            </div>
                          )}

                          {/* Message Content formatted with Markdown-like rendering */}
                          <div className="whitespace-pre-wrap font-sans space-y-2 select-text">
                            {isRawHtmlDocument(msg.text)
                              ? 'দুঃখিত, উত্তরটি লোড হতে সমস্যা হয়েছিল। অনুগ্রহ করে প্রশ্নটি পুনরায় করুন।'
                              : msg.text}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Toolbar for AI message (only if not an error) */}
                    {!isUser && !msg.isError && (
                      <div className="flex items-center gap-2 sm:gap-3 px-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        {/* 🔊 Listen / ⏹ Stop Voice button */}
                        {speakingMsgId === msg.id ? (
                          <button
                            id={`stop-voice-btn-${msg.id}`}
                            onClick={handleStopVoice}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition font-bold text-xs animate-pulse shadow-xs"
                            title="ভয়েস বন্ধ করুন"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>⏹ Stop Voice</span>
                          </button>
                        ) : (
                          <button
                            id={`listen-btn-${msg.id}`}
                            onClick={() => handleListen(msg.id, msg.text)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 hover:dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1.5 transition font-semibold text-xs shadow-xs"
                            title="উত্তরের বাংলা অডিও শুনুন"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>🔊 Listen</span>
                          </button>
                        )}

                        <button
                          id={`copy-btn-${msg.id}`}
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-emerald-600 flex items-center gap-1 transition px-1.5 py-1 rounded-md"
                          title="উত্তর কপি করুন"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">কপি হয়েছে!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>কপি</span>
                            </>
                          )}
                        </button>

                        <button
                          id={`bookmark-note-btn-${msg.id}`}
                          onClick={() => toggleSaveNote(msg.id)}
                          className={`flex items-center gap-1 transition px-1.5 py-1 rounded-md ${
                            savedNotes[msg.id]
                              ? 'text-emerald-600 font-semibold'
                              : 'hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                          title="নোটবুকে সংরক্ষণ করুন"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${savedNotes[msg.id] ? 'fill-current' : ''}`} />
                          <span>{savedNotes[msg.id] ? 'সংরক্ষিত' : 'সেভ করুন'}</span>
                        </button>

                        <button
                          id={`like-btn-${msg.id}`}
                          onClick={() => toggleLike(msg.id)}
                          className={`flex items-center gap-1 transition px-1.5 py-1 rounded-md ${
                            likedMap[msg.id]
                              ? 'text-emerald-600 font-semibold'
                              : 'hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                          title="সহায়ক উত্তর"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${likedMap[msg.id] ? 'fill-current' : ''}`} />
                          <span>উপকারী</span>
                        </button>

                        <span className="ml-auto text-[11px] text-slate-400">{msg.timestamp}</span>
                      </div>
                    )}

                    {/* Followup Suggestions */}
                    {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {msg.suggestedFollowups.map((item, idx) => (
                          <button
                            key={idx}
                            id={`followup-${msg.id}-${idx}`}
                            onClick={() => handleSendMessage(item)}
                            className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition"
                          >
                            + {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div id="ai-chat-loading-indicator" className="flex gap-3 items-start animate-fade-in">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-bl-xs shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                      AI শিক্ষক শিক্ষাক্রম বিশ্লেষণ করে উত্তর তৈরি করছেন...
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
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>জনপ্রিয় প্রশ্নসমূহ (ক্লিক করুন):</span>
              </div>
              <button
                id="ai-chat-clear-history-bottom-btn"
                onClick={handleClearChat}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition cursor-pointer px-2 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="চ্যাট হিস্ট্রি পরিষ্কার করুন"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Chat</span>
              </button>
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
                  className="whitespace-nowrap px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box Area */}
          <div
            id="ai-chat-input-area"
            className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
          >
            {/* Image Preview Thumbnail if selected */}
            {selectedImage && (
              <div className="flex items-center gap-3 p-2.5 mb-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <img
                  src={selectedImage.dataUrl}
                  alt="preview"
                  className="w-14 h-14 object-cover rounded-lg border border-emerald-300 dark:border-emerald-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                    {selectedImage.name}
                  </p>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    ছবি সংযুক্ত হয়েছে • AI প্রশ্নটি বিশ্লেষণ করবে
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition"
                  title="ছবি মুছুন"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2.5"
            >
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Image upload trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl border transition flex items-center justify-center shrink-0 ${
                  selectedImage
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title="অঙ্ক বা সমীকরণের ছবি তুলুন/আপলোড করুন"
              >
                <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </button>

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
                      : 'আপনার প্রশ্ন লিখুন (যেমন: সালোকসংশ্লেষণ কী? বা পিথাগোরাসের উপপাদ্যটি বুঝিয়ে দাও)...'
                  }
                  className="w-full resize-none max-h-32 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                id="ai-chat-send-btn"
                disabled={(!inputText.trim() && !selectedImage) || loading}
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-sm transition flex items-center justify-center shrink-0"
                title="প্রশ্ন পাঠান"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-2 text-center">
              AI সহায়ক এনসিটিবি ও এনসিইআরটি পাঠ্যক্রম অনুসারে তথ্য দেয়। ছবি তুলে যেকোনো অঙ্কের বা প্রশ্নের সমাধান পান।
            </p>
          </div>
        </section>
      </div>
      )}
    </div>
  );
};
