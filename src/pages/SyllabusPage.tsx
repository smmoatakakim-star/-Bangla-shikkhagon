import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  FileText,
  HelpCircle,
  Bot,
  Brain,
  Check,
  X,
  Bookmark,
  Share2,
  AlertCircle,
  GraduationCap,
  ListOrdered,
  Percent,
  Lightbulb,
  Printer,
  Upload,
  Download,
  Calculator,
  AlertTriangle,
  PenTool,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ClassId,
  SubjectId,
  SyllabusExamType,
  OfficialSyllabus,
  SyllabusLessonItem,
} from '../types';
import { ALL_SYLLABUS_POEMS_DATA, PoemAnalysisItem } from '../data/allSyllabusPoemsData';
import { ANNUAL_EXAM_STUDY_GUIDES, SubjectAnnualGuide } from '../data/annualExamStudyGuides';

export const SyllabusPage: React.FC = () => {
  const {
    syllabusList,
    saveSyllabus,
    classes,
    subjects,
    navigate,
    completedChapters,
    toggleCompleteChapter,
  } = useApp();

  // Top view mode: syllabus vs poems vs all_subjects
  const [mainTab, setMainTab] = useState<'syllabus' | 'poems' | 'all_subjects'>('syllabus');
  const [selectedPoemModal, setSelectedPoemModal] = useState<PoemAnalysisItem | null>(null);
  const [poemClassFilter, setPoemClassFilter] = useState<string>('all');
  const [poemTypeFilter, setPoemTypeFilter] = useState<string>('all');
  const [poemSearchQuery, setPoemSearchQuery] = useState<string>('');

  // School Syllabus Upload & Entry Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [schoolName, setSchoolName] = useState<string>('');
  const [schoolClassId, setSchoolClassId] = useState<ClassId>('class-8');
  const [schoolSubjectId, setSchoolSubjectId] = useState<string>('bangla');
  const [schoolExamName, setSchoolExamName] = useState<string>('২০২৬ বার্ষিক পরীক্ষা');
  const [schoolSyllabusText, setSchoolSyllabusText] = useState<string>('');
  const [schoolPdfFileName, setSchoolPdfFileName] = useState<string>('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');

  // All Subjects Annual Exam Guide filter
  const [guideClassFilter, setGuideClassFilter] = useState<string>('all');
  const [guideSubjectFilter, setGuideSubjectFilter] = useState<string>('all');
  const [selectedGuideModal, setSelectedGuideModal] = useState<SubjectAnnualGuide | null>(null);

  // Filters state
  const [selectedYear, setSelectedYear] = useState<string>('২০২৬');
  const [selectedClassId, setSelectedClassId] = useState<ClassId | 'all'>('class-8');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedPaper, setSelectedPaper] = useState<string>('all');
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected lesson modal state for Lesson Learning Page
  const [selectedLesson, setSelectedLesson] = useState<{
    syllabus: OfficialSyllabus;
    item: SyllabusLessonItem;
  } | null>(null);

  // Active tab inside lesson learning modal
  const [lessonActiveTab, setLessonActiveTab] = useState<
    'overview' | 'explanation' | 'concepts' | 'questions' | 'creative' | 'mcq'
  >('overview');

  // Interactive MCQ answers within modal
  const [userMcqAnswers, setUserMcqAnswers] = useState<Record<number, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  // Available unique years from syllabus list
  const availableYears = useMemo(() => {
    const set = new Set<string>();
    syllabusList.forEach((s) => set.add(s.academicYear));
    if (set.size === 0) set.add('২০২৬');
    return Array.from(set).sort().reverse();
  }, [syllabusList]);

  // Supported Classes definition (Class 5, 6, 7, 8, 9, 10, SSC, HSC)
  const supportedClasses: { id: ClassId; name: string; badge: string }[] = [
    { id: 'class-5', name: '৫ম শ্রেণি', badge: 'প্রাথমিক' },
    { id: 'class-6', name: '৬ষ্ঠ শ্রেণি', badge: 'নিম্ন মাধ্যমিক' },
    { id: 'class-7', name: '৭ম শ্রেণি', badge: 'নিম্ন মাধ্যমিক' },
    { id: 'class-8', name: '৮ম শ্রেণি', badge: 'জেএসসি/বার্ষিক' },
    { id: 'class-9', name: '৯ম শ্রেণি', badge: 'মাধ্যমিক' },
    { id: 'class-10', name: '১০ম শ্রেণি', badge: 'এসএসসি প্রস্তুতি' },
    { id: 'ssc', name: 'এসএসসি (SSC)', badge: 'বোর্ড পরীক্ষা' },
    { id: 'hsc', name: 'এইচএসসি (HSC)', badge: 'উচ্চ মাধ্যমিক' },
  ];

  // Filter syllabuses
  const filteredSyllabuses = useMemo(() => {
    return syllabusList.filter((syl) => {
      if (syl.status !== 'published') return false;

      // Exclude any 2026 half-yearly examination content (exam concluded)
      if (
        syl.academicYear === '২০২৬' &&
        (syl.examType === 'half_yearly' ||
          syl.examName?.includes('অর্ধবার্ষিক') ||
          syl.title?.includes('অর্ধবার্ষিক'))
      ) {
        return false;
      }

      if (selectedYear !== 'all' && syl.academicYear !== selectedYear) return false;
      if (selectedClassId !== 'all' && syl.classId !== selectedClassId) return false;
      if (selectedExamType !== 'all' && syl.examType !== selectedExamType) return false;
      if (selectedSubjectId !== 'all' && syl.subjectId !== selectedSubjectId) return false;
      if (selectedPaper !== 'all' && syl.paper && syl.paper !== selectedPaper) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = syl.title.toLowerCase().includes(q);
        const inItems = syl.items.some(
          (item) =>
            item.lessonTitle.toLowerCase().includes(q) ||
            item.author?.toLowerCase().includes(q) ||
            item.selectedTopics?.some((t) => t.toLowerCase().includes(q))
        );
        if (!inTitle && !inItems) return false;
      }

      return true;
    });
  }, [
    syllabusList,
    selectedYear,
    selectedClassId,
    selectedExamType,
    selectedSubjectId,
    selectedPaper,
    searchQuery,
  ]);

  // Active selected syllabus or the first matching one
  const currentSyllabus = useMemo(() => {
    if (selectedSyllabusId) {
      const found = filteredSyllabuses.find((s) => s.id === selectedSyllabusId);
      if (found) return found;
    }
    return filteredSyllabuses[0] || null;
  }, [filteredSyllabuses, selectedSyllabusId]);

  // Calculate progress of completed items in this syllabus
  const progressStats = useMemo(() => {
    if (!currentSyllabus || currentSyllabus.items.length === 0) {
      return { total: 0, completed: 0, percentage: 0 };
    }
    const total = currentSyllabus.items.length;
    const completed = currentSyllabus.items.filter((item) =>
      completedChapters.includes(item.id) || (item.chapterId && completedChapters.includes(item.chapterId))
    ).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [currentSyllabus, completedChapters]);

  const handleOpenLesson = (syl: OfficialSyllabus, item: SyllabusLessonItem) => {
    setSelectedLesson({ syllabus: syl, item });
    setLessonActiveTab('overview');
    setUserMcqAnswers({});
    setRevealedExplanations({});
  };

  const handleSelectMcq = (qIndex: number, optionIndex: number) => {
    setUserMcqAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    setRevealedExplanations((prev) => ({ ...prev, [qIndex]: true }));
  };

  const handleAskAiAboutLesson = (item: SyllabusLessonItem, syl: OfficialSyllabus) => {
    setSelectedLesson(null);
    navigate('ai_chat', {
      query: `${syl.className}-এর বাংলা ১ম পত্রের পাঠ ‘${item.lessonTitle}’ (${item.author || ''}) নিয়ে বিশদভাবে বুঝিয়ে দাও এবং পরীক্ষার জন্য ৩টি গুরুত্বপূর্ণ অনুধাবনমূলক প্রশ্ন ও উত্তর তৈরি করো।`,
    });
  };

  // Handle saving customized school annual syllabus
  const handleSaveSchoolSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || (!schoolSyllabusText.trim() && !schoolPdfFileName)) {
      alert('অনুগ্রহ করে বিদ্যালয়ের নাম এবং সিলেবাসের বিবরণ বা ফাইল প্রদান করুন।');
      return;
    }

    const cls = supportedClasses.find((c) => c.id === schoolClassId);
    const sub = subjects.find((s) => s.id === schoolSubjectId);

    const newSyllabus: OfficialSyllabus = {
      id: `school-syl-${Date.now()}`,
      academicYear: selectedYear,
      classId: schoolClassId,
      className: cls?.name || 'শ্রেণি',
      examType: 'annual',
      examName: schoolExamName,
      subjectId: schoolSubjectId,
      subjectName: sub?.name || 'বিষয়',
      paper: 'বার্ষিক পাঠ্যক্রম',
      title: `${schoolName} — ${cls?.name || ''} — ${sub?.name || ''} (${schoolExamName})`,
      source: {
        sourceTitle: `${schoolName} বার্ষিক পরীক্ষার অফিসিয়াল পাঠ্যসূচি`,
        sourceUrl: schoolPdfFileName ? `https://school-portal.edu.bd/docs/${schoolPdfFileName}` : '',
        sourceOrganization: schoolName,
        publicationYear: 2026,
        academicYear: selectedYear,
        publicationDate: '২০২৬',
        verificationStatus: 'verified',
        verifiedBy: `${schoolName} একাডেমিক কমিটি`,
        importedAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
      },
      marksDistribution: {
        totalMarks: 100,
        writtenMarks: 70,
        mcqMarks: 30,
        questionPattern: 'সৃজনশীল ও বহুনির্বাচনী প্রশ্নকাঠামো',
        structureBreakdown: [
          { section: 'রচনামূলক ও সৃজনশীল', marks: 70, description: 'পাঠ্যসূচির নির্ধারিত অধ্যায়সমূহ থেকে' },
          { section: 'বহুনির্বাচনী', marks: 30, description: 'পাঠ্যবইয়ের অধ্যায়ভিত্তিক মূল্যায়ন' },
        ],
        examInstructions: ['বিদ্যালয়ের বার্ষিক পরীক্ষার নিয়মাবলী প্রযোজ্য।'],
        specialNotes: [`উৎস: ${schoolName} কর্তৃক অনুমোদিত বার্ষিক পরীক্ষার সিলেবাস`],
      },
      status: 'published',
      importedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hash: `school-${Date.now()}`,
      items: [
        {
          id: `item-${Date.now()}-1`,
          lessonTitle: `বার্ষিক পরীক্ষার নির্ধারিত সিলেবাস ও অধ্যায়সমূহ`,
          author: schoolName,
          genre: 'prose',
          genreLabel: 'বার্ষিক পাঠ্যসূচি',
          selectedTopics: schoolSyllabusText.split('\n').filter(Boolean).slice(0, 5),
          learningDetails: {
            introduction: schoolSyllabusText || 'বিদ্যালয় কর্তৃক আপলোডকৃত পাঠ্যসূচির পূর্ণ বিবরণ।',
            objectives: ['বার্ষিক পরীক্ষায় সর্বোচ্চ ফলাফল অর্জন ও নির্ধারিত অধ্যায়ের প্রস্তুতি।'],
            easyExplanation: schoolSyllabusText || 'বিদ্যালয় কর্তৃক নির্ধারিত পাঠ্যসূচি অনুযায়ী অনুশীলন করুন।',
            keyThemes: ['বার্ষিক পরীক্ষা প্রস্তুতি', schoolName],
            vocabulary: [],
            coreConcepts: ['বিদ্যালয়ের অভ্যন্তরীণ বার্ষিক মূল্যায়ন নির্দেশিকা'],
            shortQuestions: [
              {
                question: 'বার্ষিক পরীক্ষার এই সিলেবাসটি কার দ্বারা অনুমোদিত?',
                answer: `${schoolName}-এর একাডেমিক কমিটি কর্তৃক অনুমোদিত।`,
                mark: 1,
                type: 'জ্ঞানমূলক (ক)',
              },
            ],
            creativeQuestions: [],
            mcqs: [
              {
                question: 'বিদ্যালয়ের বার্ষিক পরীক্ষায় ভালো ফলাফলের মূল চাবিকাঠি কী?',
                options: ['সিলেবাসের প্রতিটি অধ্যায় পুঙ্খানুপুঙ্খ পড়া', 'শুধু সাজেশন মুখস্থ করা', 'অনিয়মিত পড়ালেখা', 'পরীক্ষায় অনুপস্থিত থাকা'],
                answerIndex: 0,
                explanation: 'সম্পূর্ণ সিলেবাস নিয়মমাফিক অনুশীলন করাই ভালো ফলাফলের নিশ্চয়তা দেয়।',
              },
            ],
          },
        },
      ],
    };

    saveSyllabus(newSyllabus);
    setUploadSuccessMsg(`‘${schoolName}’-এর বার্ষিক পরীক্ষার সিলেবাস সফলভাবে সিস্টেমে যুক্ত হয়েছে!`);
    setTimeout(() => {
      setIsUploadModalOpen(false);
      setUploadSuccessMsg('');
      setSchoolName('');
      setSchoolSyllabusText('');
      setSchoolPdfFileName('');
      setSelectedClassId(schoolClassId);
      setSelectedSyllabusId(newSyllabus.id);
    }, 1200);
  };

  // Filtered All Subjects Annual Exam Guides
  const filteredGuides = useMemo(() => {
    return ANNUAL_EXAM_STUDY_GUIDES.filter((guide) => {
      if (guideClassFilter !== 'all' && guide.classId !== guideClassFilter) return false;
      if (guideSubjectFilter !== 'all' && guide.subjectId !== guideSubjectFilter) return false;
      return true;
    });
  }, [guideClassFilter, guideSubjectFilter]);

  // Filtered poems calculation for All Poems & Literature Tab
  const filteredPoems = useMemo(() => {
    return ALL_SYLLABUS_POEMS_DATA.filter((poem) => {
      if (poemClassFilter !== 'all' && poem.classId !== poemClassFilter) return false;
      if (poemTypeFilter === 'poem' && poem.type !== 'poem') return false;
      if (poemTypeFilter === 'novel_drama' && poem.type !== 'novel' && poem.type !== 'drama') return false;
      if (poemTypeFilter === 'story' && poem.type !== 'story') return false;
      if (poemTypeFilter === 'english_lit' && poem.type !== 'english_lit') return false;
      if (poemTypeFilter === 'grammar' && poem.type !== 'grammar') return false;
      if (poemTypeFilter === 'bgs' && poem.type !== 'bgs') return false;
      if (poemTypeFilter === 'science' && poem.type !== 'science') return false;
      if (poemSearchQuery) {
        const q = poemSearchQuery.toLowerCase();
        return (
          poem.title.toLowerCase().includes(q) ||
          poem.banglaTitle.toLowerCase().includes(q) ||
          poem.poet.toLowerCase().includes(q) ||
          poem.subjectName.toLowerCase().includes(q) ||
          poem.coreTheme.toLowerCase().includes(q) ||
          poem.moolBhab.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [poemClassFilter, poemTypeFilter, poemSearchQuery]);

  return (
    <div id="official-syllabus-page" className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-8 rounded-3xl shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>উৎস: সরকারি / NCTB অনুমোদিত পাঠ্যসূচি</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[11px] font-semibold">
              শিক্ষাবর্ষ {selectedYear}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>📚 সিলেবাস ও পাঠ্যসূচি</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB), শিক্ষা মন্ত্রণালয় ও সংশ্লিষ্ট শিক্ষা বোর্ডের
            অফিসিয়াল সিলেবাস অনুযায়ী প্রণীত পাঠ্যসূচি, মানবণ্টন, পরীক্ষার কাঠামো ও প্রতিটি পাঠের গভীর
            বিশ্লেষণমূলক শিক্ষা গাইড।
          </p>

          {/* Source Verification Badge */}
          {currentSyllabus?.source && (
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>যাচাইকারী: {currentSyllabus.source.sourceOrganization}</span>
              </span>

              {currentSyllabus.source.sourceUrl && (
                <a
                  href={currentSyllabus.source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
                >
                  <span>মূল উৎস দেখুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Top Controls: View Switcher, School Upload, and Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setMainTab('syllabus')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              mainTab === 'syllabus'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 বিষয়ভিত্তিক সিলেবাস</span>
          </button>
          <button
            onClick={() => setMainTab('poems')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              mainTab === 'poems'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>📜 সকল কবিতা ও সাহিত্য ({ALL_SYLLABUS_POEMS_DATA.length})</span>
          </button>
          <button
            onClick={() => setMainTab('all_subjects')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              mainTab === 'all_subjects'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4 text-cyan-300" />
            <span>📐 গণিত, ইংরেজি ও সকল বিষয় ({ANNUAL_EXAM_STUDY_GUIDES.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>বিদ্যালয়ের সিলেবাস আপলোড</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title="সিলেবাস বা গাইড প্রিন্ট অথবা PDF সংরক্ষণ করুন"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>

      {/* Official Exam Disclaimer & Policy Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">
            📌 বার্ষিক পরীক্ষা ও বোর্ড প্রস্তুতির সতর্কবার্তা ও দিকনির্দেশনা (Official NCTB Policy):
          </span>
          <p className="leading-relaxed">
            জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (nctb.gov.bd) অনুমোদিত মূল পাঠ্যবই ও বিগত বছরের বোর্ড প্রশ্ন পর্যালোচনার ভিত্তিতে শিক্ষার্থীদের সুস্পষ্ট ধারণা গঠনের সুবিধার্থে এই গাইড প্রস্তুত করা হয়েছে। <strong>পরীক্ষায় কোনো প্রশ্ন হুবহু কমন পড়ার কোনো গ্যারান্টি বা প্রতিশ্রুতি প্রদান করা হয় না।</strong> প্রতিটি শিক্ষার্থীকে মূল এনসিটিবি পাঠ্যবই পুঙ্খানুপুঙ্খ অধ্যয়ন করার পরামর্শ দেওয়া হচ্ছে।
          </p>
        </div>
      </div>

      {mainTab === 'syllabus' ? (
        <>
          {/* Class Switcher (Pills) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>শ্রেণি নির্বাচন করুন:</span>
          </label>
          <span className="text-[11px] text-slate-400">৫ম শ্রেণি থেকে এইচএসসি পর্যন্ত সমর্থিত</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {supportedClasses.map((cls) => {
            const isSelected = selectedClassId === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => {
                  setSelectedClassId(cls.id);
                  setSelectedSyllabusId('');
                }}
                className={`px-4 py-2.5 rounded-2xl font-bold shrink-0 transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cls.name}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {cls.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar: [ শিক্ষাবর্ষ ] [ পরীক্ষা ] [ বিষয় ] [ পত্র ] [ অনুসন্ধান ] */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 text-xs">
          {/* 1. Academic Year */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>শিক্ষাবর্ষ</span>
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr} শিক্ষাবর্ষ
                </option>
              ))}
            </select>
          </div>

          {/* 2. Exam Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>পরীক্ষা</span>
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => {
                setSelectedExamType(e.target.value);
                setSelectedSyllabusId('');
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল পরীক্ষা</option>
              <option value="annual">বার্ষিক পরীক্ষা / মূল্যায়ন</option>
              <option value="board_final">বোর্ড পরীক্ষা (এসএসসি/এইচএসসি)</option>
              <option value="test">নির্বাচনী / টেস্ট পরীক্ষা</option>
              <option value="pre_test">প্রাক-নির্বাচনী পরীক্ষা</option>
            </select>
          </div>

          {/* 3. Subject */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>বিষয়</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedSyllabusId('');
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল বিষয়</option>
              <option value="bangla">বাংলা</option>
              <option value="english">ইংরেজি</option>
              <option value="math">গণিত</option>
              <option value="science">বিজ্ঞান</option>
              <option value="bgs">বাংলাদেশ ও বিশ্বপরিচয়</option>
            </select>
          </div>

          {/* 4. Paper */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>পত্র</span>
            </label>
            <select
              value={selectedPaper}
              onChange={(e) => {
                setSelectedPaper(e.target.value);
                setSelectedSyllabusId('');
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল পত্র</option>
              <option value="১ম পত্র">১ম পত্র</option>
              <option value="২য় পত্র">২য় পত্র</option>
              <option value="আবশ্যিক">আবশ্যিক</option>
            </select>
          </div>

          {/* 5. Search Bar */}
          <div className="col-span-2 sm:col-span-4 md:col-span-1 space-y-1.5">
            <label className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Search className="w-3.5 h-3.5" />
              <span>পাঠ খুঁজুন</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="গল্প বা কবিতার নাম..."
                className="w-full p-2.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Multiple matching syllabuses switcher tabs */}
      {filteredSyllabuses.length > 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1.5 pl-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>উপলব্ধ পত্র ও শাখা:</span>
            </span>
            {filteredSyllabuses.map((syl) => {
              const isCurrent = currentSyllabus?.id === syl.id;
              return (
                <button
                  key={syl.id}
                  onClick={() => setSelectedSyllabusId(syl.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                  }`}
                >
                  <span>{syl.subjectName}</span>
                  {syl.paper && <span className="text-[10px] font-semibold opacity-90">({syl.paper})</span>}
                  <span className="text-[10px] font-semibold opacity-75">• {syl.items.length} পাঠ</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {currentSyllabus ? (
        <div className="space-y-6">
          {/* Syllabus Metadata & Marks Distribution Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {currentSyllabus.academicYear} • {currentSyllabus.className} • {currentSyllabus.examName}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  {currentSyllabus.subjectName} {currentSyllabus.paper ? `(${currentSyllabus.paper})` : ''}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentSyllabus.title}
                </p>
              </div>

              {/* Progress Tracker */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shrink-0 min-w-[200px] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    পাঠ প্রস্তুতি অগ্রগতি:
                  </span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    {progressStats.completed}/{progressStats.total} ({progressStats.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressStats.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Official Marks Distribution Details (Preserve ALL details) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  মানবণ্টন ও প্রশ্নের রূপরেখা (পূর্ণমান: {currentSyllabus.marksDistribution.totalMarks})
                </h3>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentSyllabus.marksDistribution.structureBreakdown?.map((part, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {part.section}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                        {part.marks} নম্বর
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {part.description}
                    </p>
                  </div>
                )) || (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      লিখিত ও বহুনির্বাচনী
                    </span>
                    <p className="text-[11px] text-slate-500">
                      সৃজনশীল ৭০ + বহুনির্বাচনী ৩০ = ১০০ নম্বর
                    </p>
                  </div>
                )}
              </div>

              {/* Question Pattern Summary */}
              {currentSyllabus.marksDistribution.questionPattern && (
                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
                    <span>প্রশ্নের ধারা ও বিশেষ নির্দেশনা:</span>
                  </span>
                  <p className="leading-relaxed pl-5 text-[11.5px]">
                    {currentSyllabus.marksDistribution.questionPattern}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* “এই পরীক্ষায় যা পড়তে হবে” Section Heading */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>📖 এই পরীক্ষায় যা পড়তে হবে</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    {currentSyllabus.items.length}টি পাঠ
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  প্রতিটি পাঠে ক্লিক করে পাঠ পরিচিতি, সহজ ব্যাখ্যা, প্রশ্নোত্তর, সৃজনশীল, MCQ ও AI সহায়তা দেখুন
                </p>
              </div>
            </div>

            {/* Clickable Syllabus Items Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSyllabus.items.map((item, index) => {
                const isCompleted =
                  completedChapters.includes(item.id) ||
                  (item.chapterId && completedChapters.includes(item.chapterId));

                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenLesson(currentSyllabus, item)}
                    className="group bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-emerald-500 transition duration-200 cursor-pointer flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200/60 dark:border-emerald-800">
                            {item.genreLabel || 'পাঠ'}
                          </span>
                          {item.pageRange && (
                            <span className="text-[10.5px] font-semibold text-slate-400">
                              {item.pageRange}
                            </span>
                          )}
                        </div>

                        {/* Completion Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompleteChapter(item.chapterId || item.id);
                          }}
                          className={`p-1.5 rounded-xl transition ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-600'
                          }`}
                          title={isCompleted ? 'পড়া সম্পন্ন হয়েছে' : 'পড়া সম্পন্ন হিসেবে চিহ্নিত করুন'}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Title & Author */}
                      <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition flex items-center gap-1.5">
                          <span>{item.lessonTitle}</span>
                        </h4>
                        {item.author && (
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                            লেখক/কবি: {item.author}
                          </p>
                        )}
                      </div>

                      {/* Brief Introduction Snippet */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.learningDetails.introduction}
                      </p>

                      {/* Selected Topics Chips */}
                      {item.selectedTopics && item.selectedTopics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.selectedTopics.map((topic, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                            >
                              • {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Features Row (Arrows and Links) */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>প্রশ্নোত্তর ({item.learningDetails.shortQuestions.length}টি)</span>
                        <span>•</span>
                        <span>MCQ ({item.learningDetails.mcqs.length}টি)</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400">
                          <Bot className="w-3 h-3" />
                          <span>AI শিক্ষক</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>সম্পূর্ণ পাঠ খুলুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            নির্বাচিত ফিল্টারের জন্য কোনো সিলেবাস পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            অন্য কোনো শ্রেণি, শিক্ষাবর্ষ বা পরীক্ষার ধরন নির্বাচন করে পুনরায় চেষ্টা করুন।
          </p>
        </div>
      )}
    </>
  ) : mainTab === 'poems' ? (
    /* All Poems & Literature View */
    <div className="space-y-6">
      {/* Poem Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <span>সিলেবাসের সকল কবিতা, উপন্যাস ও নাটক ({filteredPoems.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ৬ষ্ঠ থেকে দ্বাদশ শ্রেণি (SSC ও HSC) পর্যন্ত NCTB সিলেবাসের প্রতিটি কবিতার পঙ্‌ক্তি বিশ্লেষণ, শব্দার্থ, মূলভাব ও সৃজনশীল প্রশ্নোত্তর।
            </p>
          </div>

          {/* Poem Search */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={poemSearchQuery}
              onChange={(e) => setPoemSearchQuery(e.target.value)}
              placeholder="কবিতা বা কবির নাম দিয়ে খুঁজুন..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 font-bold text-[11px]">শ্রেণি:</span>
          {[
            { id: 'all', label: 'সকল শ্রেণি' },
            { id: 'class-6', label: '৬ষ্ঠ শ্রেণি' },
            { id: 'class-7', label: '৭ম শ্রেণি' },
            { id: 'class-8', label: '৮ম শ্রেণি' },
            { id: 'ssc', label: 'এসএসসি (৯ম-১০ম)' },
            { id: 'hsc', label: 'এইচএসসি (একাদশ-দ্বাদশ)' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setPoemClassFilter(c.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                poemClassFilter === c.id
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}

          <span className="text-slate-400 font-bold text-[11px] ml-2">ধরন ও বিষয়:</span>
          {[
            { id: 'all', label: 'সবকিছু' },
            { id: 'poem', label: '📜 কবিতা' },
            { id: 'story', label: '📖 গল্প ও প্রবন্ধ' },
            { id: 'novel_drama', label: '🎭 উপন্যাস ও নাটক' },
            { id: 'english_lit', label: '🇬🇧 English Lit.' },
            { id: 'grammar', label: '✏️ ব্যাকরণ' },
            { id: 'bgs', label: '🇧🇩 বিজিএস (BGS)' },
            { id: 'science', label: '🔬 বিজ্ঞান' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setPoemTypeFilter(t.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                poemTypeFilter === t.id
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Poems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPoems.map((poem) => (
          <div
            key={poem.id}
            onClick={() => setSelectedPoemModal(poem)}
            className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-500 transition cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {poem.typeLabel} • {poem.className}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {poem.exam}
                </span>
              </div>

              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-slate-100 group-hover:text-rose-600 transition">
                  {poem.title}
                </h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  রচয়িতা: {poem.poet}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {poem.moolBhab}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-bold">
              <span>পঙ্‌ক্তি বিশ্লেষণ ও প্রশ্নোত্তর পড়ুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    /* All Subjects Annual Exam Preparation Guide View (Math, English, Science, BGS, ICT, Religion, Accounting) */
    <div className="space-y-6">
      {/* Top Filter and Search Controls for All Subjects */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>গণিত, ইংরেজি ও সকল বিষয়ের পূর্ণাঙ্গ বার্ষিক প্রস্তুতি গাইড ({filteredGuides.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ৬ষ্ঠ থেকে ১০ম (SSC) ও একাদশ-দ্বাদশ (HSC) শ্রেণি: গণিতের সমাধানকৃত উদাহরণ, ইংরেজি গ্রামার ও রাইটিং, বিজ্ঞান, বিজিএস, আইসিটি, ধর্ম শিক্ষা ও হিসাববিজ্ঞানের বার্ষিক রিভিশন।
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>সকল গাইড প্রিন্ট / PDF</span>
          </button>
        </div>

        {/* Filter Pills for Classes and Subjects */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 font-bold text-[11px]">শ্রেণি:</span>
          {[
            { id: 'all', label: 'সকল শ্রেণি' },
            { id: 'class-6', label: '৬ষ্ঠ শ্রেণি' },
            { id: 'class-7', label: '৭ম শ্রেণি' },
            { id: 'class-8', label: '৮ম শ্রেণি' },
            { id: 'ssc', label: 'এসএসসি (৯ম-১০ম)' },
            { id: 'hsc', label: 'এইচএসসি (একাদশ-দ্বাদশ)' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setGuideClassFilter(c.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                guideClassFilter === c.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}

          <span className="text-slate-400 font-bold text-[11px] ml-2">বিষয়:</span>
          {[
            { id: 'all', label: 'সকল বিষয়' },
            { id: 'math', label: '📐 সাধারণ গণিত' },
            { id: 'english', label: '🇬🇧 ইংরেজি ২য় পত্র' },
            { id: 'general_science', label: '🔬 বিজ্ঞান' },
            { id: 'bgs', label: '🇧🇩 বাংলাদেশ ও বিশ্বপরিচয়' },
            { id: 'ict', label: '💻 আইসিটি' },
            { id: 'islamic_studies', label: '🕌 ইসলাম ও নৈতিক শিক্ষা' },
            { id: 'accounting', label: '📊 হিসাববিজ্ঞান (কমার্স)' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setGuideSubjectFilter(s.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                guideSubjectFilter === s.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4 hover:border-indigo-400 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  {guide.className} • {guide.groupLabel || 'সাধারণ পাঠ্য'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {guide.exam}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  {guide.subjectName}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
                  {guide.revisionSummary}
                </p>
              </div>

              {/* NCTB Source & Status Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>উৎস: {guide.syllabusSource.organization}</span>
                </div>
                <a
                  href={guide.syllabusSource.nctbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-emerald-400 underline font-bold flex items-center gap-1"
                >
                  <span>NCTB যাচাই</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Key Topics List */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  📌 বার্ষিক পরীক্ষার গুরুত্বপূর্ণ অধ্যায় ও টপিক:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {guide.keyTopics.slice(0, 5).map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                    >
                      • {top}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setSelectedGuideModal(guide)}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>সমাধানকৃত উদাহরণ ও প্রশ্নোত্তর দেখুন ({guide.coreExamQuestions.length + (guide.workedMathExamples?.length || 0)})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelectedGuideModal(guide);
                  setTimeout(() => window.print(), 300);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                title="এই বিষয়ের গাইড প্রিন্ট করুন"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

      {/* ========================================================
          LESSON / CHAPTER LEARNING MODAL (Point 6 Full Implementation)
          Contains all 12 educational components:
          1. 📖 পাঠ পরিচিতি
          2. 🎯 শেখার উদ্দেশ্য
          3. 📝 সহজ ভাষায় বিষয়টি বোঝানো
          4. 📌 গুরুত্বপূর্ণ বিষয়
          5. 📚 কঠিন শব্দ/শব্দার্থ
          6. 💡 মূল ধারণা
          7. ❓ Original short questions (ক/খ)
          8. ✍️ Original descriptive/creative questions (গ/ঘ)
          9. ✅ Original MCQ
          10. 🧠 Quiz
          11. 🤖 AI শিক্ষক
          12. 📊 Practice progress
          ======================================================== */}
      {selectedLesson && (
        <div
          id="syllabus-lesson-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        >
          <div
            id="syllabus-lesson-modal-container"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white flex items-start justify-between gap-4 border-b border-teal-800/40 shrink-0">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    {selectedLesson.syllabus.className} • {selectedLesson.syllabus.subjectName}
                  </span>
                  {selectedLesson.item.genreLabel && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/90 text-[10px] font-semibold">
                      {selectedLesson.item.genreLabel}
                    </span>
                  )}
                  {selectedLesson.item.pageRange && (
                    <span className="text-[11px] text-slate-300 font-medium">
                      ({selectedLesson.item.pageRange})
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white">
                  {selectedLesson.item.lessonTitle}
                </h3>

                {selectedLesson.item.author && (
                  <p className="text-xs text-emerald-200">
                    কবি/লেখক: {selectedLesson.item.author}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedLesson(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs Bar inside Modal */}
            <div className="flex items-center gap-1.5 p-2.5 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-none text-xs shrink-0">
              {[
                { id: 'overview', label: '📖 পাঠ পরিচিতি ও উদ্দেশ্য' },
                { id: 'explanation', label: '📝 সহজ ব্যাখ্যা' },
                { id: 'concepts', label: '💡 গুরুত্বপূর্ণ বিষয় ও শব্দার্থ' },
                { id: 'questions', label: `❓ সংক্ষিপ্ত প্রশ্নোত্তর (${selectedLesson.item.learningDetails.shortQuestions.length})` },
                { id: 'creative', label: `✍️ সৃজনশীল প্রশ্ন (${selectedLesson.item.learningDetails.creativeQuestions.length})` },
                { id: 'mcq', label: `✅ বহুনির্বাচনী অনুশীলন (${selectedLesson.item.learningDetails.mcqs.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLessonActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition cursor-pointer ${
                    lessonActiveTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body: Active Tab Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {/* TAB 1: OVERVIEW & OBJECTIVES */}
              {lessonActiveTab === 'overview' && (
                <div className="space-y-5">
                  {/* 1. পাঠ পরিচিতি */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>১. 📖 পাঠ পরিচিতি</span>
                    </h4>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedLesson.item.learningDetails.introduction}
                    </div>
                  </div>

                  {/* 2. শেখার উদ্দেশ্য */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>২. 🎯 এই পাঠের শিখনফল ও উদ্দেশ্য</span>
                    </h4>
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800 space-y-2">
                      {selectedLesson.item.learningDetails.objectives.map((obj, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-emerald-900 dark:text-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EASY EXPLANATION */}
              {lessonActiveTab === 'explanation' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>৩. 📝 সহজ ভাষায় বিষয়টি বোঝানো</span>
                  </h4>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-loose space-y-3 whitespace-pre-line">
                    {selectedLesson.item.learningDetails.easyExplanation}
                  </div>
                </div>
              )}

              {/* TAB 3: KEY THEMES, CONCEPTS & VOCABULARY */}
              {lessonActiveTab === 'concepts' && (
                <div className="space-y-5">
                  {/* 4. গুরুত্বপূর্ণ বিষয় */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>৪. 📌 গুরুত্বপূর্ণ বিষয়সমূহ</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedLesson.item.learningDetails.keyThemes.map((theme, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{theme}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. কঠিন শব্দ ও শব্দার্থ */}
                  {selectedLesson.item.learningDetails.vocabulary.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>৫. 📚 কঠিন শব্দ ও শব্দার্থ (টিকা)</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedLesson.item.learningDetails.vocabulary.map((vocab, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/60 text-xs space-y-0.5"
                          >
                            <span className="font-bold text-purple-900 dark:text-purple-200">
                              {vocab.word}
                            </span>
                            <p className="text-[11.5px] text-slate-600 dark:text-slate-400">
                              = {vocab.meaning}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. মূল ধারণা */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-emerald-600" />
                      <span>৬. 💡 মূল ধারণা ও নীতিকথা</span>
                    </h4>
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                      {selectedLesson.item.learningDetails.coreConcepts.map((conc, idx) => (
                        <p key={idx} className="leading-relaxed">
                          • {conc}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ORIGINAL SHORT QUESTIONS (জ্ঞানমূলক ও অনুধাবনমূলক) */}
              {lessonActiveTab === 'questions' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>৭. ❓ সংক্ষিপ্ত প্রশ্নোত্তর (জ্ঞানমূলক ‘ক’ ও অনুধাবনমূলক ‘খ’)</span>
                  </h4>

                  {selectedLesson.item.learningDetails.shortQuestions.length === 0 ? (
                    <p className="text-xs text-slate-400 p-4">এই পাঠের জন্য কোনো সংক্ষিপ্ত প্রশ্ন নেই।</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedLesson.item.learningDetails.shortQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              প্রশ্ন {idx + 1}: {q.question}
                            </span>
                            {q.type && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                                {q.type} {q.mark ? `(${q.mark} নম্বর)` : ''}
                              </span>
                            )}
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            <span className="font-bold text-emerald-600 block mb-1">উত্তর:</span>
                            {q.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ORIGINAL CREATIVE QUESTIONS (সৃজনশীল) */}
              {lessonActiveTab === 'creative' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>৮. ✍️ বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্ন (উদ্দীপক ও মূল্যায়ন)</span>
                  </h4>

                  {selectedLesson.item.learningDetails.creativeQuestions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      এই পাঠের সৃজনশীল প্রশ্ন শিগগিরই যুক্ত করা হবে।
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedLesson.item.learningDetails.creativeQuestions.map((cq, cqIdx) => (
                        <div
                          key={cqIdx}
                          className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 space-y-4"
                        >
                          {/* উদ্দীপক */}
                          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/80 space-y-1">
                            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block">
                              উদ্দীপকটি মনোযোগ দিয়ে পড়ো এবং নিচের প্রশ্নগুলোর উত্তর দাও:
                            </span>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                              “{cq.stimulus}”
                            </p>
                          </div>

                          {/* Sub questions (ক, খ, গ, ঘ) */}
                          <div className="space-y-3">
                            {cq.questions.map((subQ, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                    ({subQ.level}) {subQ.q}
                                  </span>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {subQ.mark} নম্বর
                                  </span>
                                </div>
                                <div className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed pl-2 border-l-2 border-emerald-500">
                                  <span className="font-bold text-slate-700 dark:text-slate-300">
                                    আদর্শ উত্তর সংক্ষেপ:
                                  </span>{' '}
                                  {subQ.a}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: ORIGINAL MCQ PRACTICE */}
              {lessonActiveTab === 'mcq' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>৯. ✅ বহুনির্বাচনী প্রশ্ন (MCQ) অনুশীলন ও তাৎক্ষণিক ফলাফল</span>
                  </h4>

                  {selectedLesson.item.learningDetails.mcqs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      এই পাঠের কোনো MCQ সংরক্ষিত নেই।
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedLesson.item.learningDetails.mcqs.map((mcq, mIdx) => {
                        const selectedAns = userMcqAnswers[mIdx];
                        const isAnswered = selectedAns !== undefined;
                        const isCorrect = selectedAns === mcq.answerIndex;

                        return (
                          <div
                            key={mIdx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                          >
                            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                              {mIdx + 1}. {mcq.question}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {mcq.options.map((opt, optIdx) => {
                                const isOptionSelected = selectedAns === optIdx;
                                const isOptionCorrect = optIdx === mcq.answerIndex;

                                let btnStyle =
                                  'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500';

                                if (isAnswered) {
                                  if (isOptionCorrect) {
                                    btnStyle =
                                      'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 border-emerald-500 font-bold';
                                  } else if (isOptionSelected) {
                                    btnStyle =
                                      'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-100 border-rose-500 font-bold';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleSelectMcq(mIdx, optIdx)}
                                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                                  >
                                    <span>
                                      {String.fromCharCode(65 + optIdx)}. {opt}
                                    </span>
                                    {isAnswered && isOptionCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {revealedExplanations[mIdx] && (
                              <div
                                className={`p-3 rounded-xl text-xs space-y-1 ${
                                  isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200'
                                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200'
                                }`}
                              >
                                <span className="font-bold block">
                                  {isCorrect ? '✅ সঠিক উত্তর!' : '❌ সঠিক উত্তর: ' + mcq.options[mcq.answerIndex]}
                                </span>
                                {mcq.explanation && (
                                  <p className="text-[11px] leading-relaxed">
                                    {mcq.explanation}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar (Quiz, AI Teacher, Mark Complete) */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                {/* 11. 🤖 AI শিক্ষক */}
                <button
                  type="button"
                  onClick={() => handleAskAiAboutLesson(selectedLesson.item, selectedLesson.syllabus)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-amber-300" />
                  <span>AI শিক্ষককে প্রশ্ন করুন</span>
                </button>

                {/* 10. 🧠 Quiz */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLesson(null);
                    navigate('daily_quiz');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Brain className="w-4 h-4" />
                  <span>কুইজ অনুশীলন করুন</span>
                </button>
              </div>

              {/* 12. 📊 Practice Progress toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleCompleteChapter(
                      selectedLesson.item.chapterId || selectedLesson.item.id
                    );
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                    completedChapters.includes(
                      selectedLesson.item.chapterId || selectedLesson.item.id
                    )
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {completedChapters.includes(
                      selectedLesson.item.chapterId || selectedLesson.item.id
                    )
                      ? 'পড়া সম্পন্ন ✅'
                      : 'পড়া সম্পন্ন চিহ্নিত করুন'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedLesson(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SELECTED POEM & LITERATURE LEARNING MODAL
          Contains full line analysis, glossary, CQ & MCQ
          ======================================================== */}
      {selectedPoemModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-rose-50/60 dark:bg-rose-950/30">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold text-xs">
                    {selectedPoemModal.typeLabel}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {selectedPoemModal.className} • {selectedPoemModal.exam}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {selectedPoemModal.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedPoemModal.poet} {selectedPoemModal.poetBio && `• ${selectedPoemModal.poetBio}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedPoemModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed">
              {/* Core Theme & Mool Bhab */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>মূলভাব ও সারসংক্ষেপ:</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {selectedPoemModal.moolBhab}
                </p>
              </div>

              {/* Stanza Explanations */}
              {selectedPoemModal.stanzasOrExcerpts && selectedPoemModal.stanzasOrExcerpts.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-rose-600" />
                    <span>প্রধান পঙ্‌ক্তি ও স্তবক বিশ্লেষণ:</span>
                  </div>
                  <div className="space-y-2.5">
                    {selectedPoemModal.stanzasOrExcerpts.map((st, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="font-serif italic text-rose-800 dark:text-rose-300 font-semibold whitespace-pre-line text-xs sm:text-[13px]">
                          "{st.lines}"
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs">
                          {st.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary */}
              {selectedPoemModal.keyWordsGlossary && selectedPoemModal.keyWordsGlossary.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200">📖 গুরুত্বপূর্ণ শব্দার্থ ও টীকা:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedPoemModal.keyWordsGlossary.map((g, i) => (
                      <div key={i} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <strong className="text-slate-900 dark:text-slate-100">{g.word}:</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{g.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Outcomes */}
              {selectedPoemModal.learningOutcomes && selectedPoemModal.learningOutcomes.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>পাঠের শিখনফল:</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 pl-2">
                    {selectedPoemModal.learningOutcomes.map((lo, i) => (
                      <li key={i}>{lo}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Short Questions */}
              {selectedPoemModal.shortQuestions && selectedPoemModal.shortQuestions.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>পরীক্ষার গুরুত্বপূর্ণ জ্ঞানমূলক ও অনুধাবনমূলক প্রশ্ন:</span>
                  </div>
                  <div className="space-y-2">
                    {selectedPoemModal.shortQuestions.map((sq: any, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                            {i + 1}. {sq.question}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">
                              {sq.type || 'জ্ঞানমূলক'}
                            </span>
                            {sq.sourceLabel && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-semibold">
                                {sq.sourceLabel}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl">
                          <strong className="text-emerald-700 dark:text-emerald-400">উত্তর:</strong> {sq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Creative Question Stimulus */}
              {selectedPoemModal.creativeQuestion && (
                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 space-y-3">
                  <div className="font-bold text-purple-900 dark:text-purple-200">
                    ✍️ নমুনা সৃজনশীল প্রশ্ন (CQ):
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 italic">
                    “{selectedPoemModal.creativeQuestion.stimulus}”
                  </div>
                  <div className="space-y-2">
                    {selectedPoemModal.creativeQuestion.questions.map((q, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900 text-xs space-y-1">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          ({q.level}) {q.text} ({q.mark} নম্বর)
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{q.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MCQs */}
              {selectedPoemModal.mcqs && selectedPoemModal.mcqs.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>গুরুত্বপূর্ণ বহুনির্বাচনী প্রশ্ন (MCQ):</span>
                  </div>
                  <div className="space-y-2">
                    {selectedPoemModal.mcqs.map((mcq: any, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {i + 1}. {mcq.question}
                          </span>
                          {mcq.sourceLabel && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 font-medium">
                              {mcq.sourceLabel}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {mcq.options.map((opt: string, optIdx: number) => (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-xl border ${
                                optIdx === mcq.correctAnswerIndex
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-400/40'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg">
                          <strong>ব্যাখ্যা:</strong> {mcq.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>প্রিন্ট / PDF সংরক্ষণ</span>
              </button>

              <button
                onClick={() => setSelectedPoemModal(null)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SELECTED SUBJECT ANNUAL GUIDE MODAL (Math Worked Examples, English Exercises)
          ======================================================== */}
      {selectedGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-start justify-between gap-4 border-b border-indigo-800/40 shrink-0">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                    {selectedGuideModal.className} • {selectedGuideModal.groupLabel || 'আবশ্যিক'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/90 text-[10px] font-semibold">
                    {selectedGuideModal.exam}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedGuideModal.subjectName} — বার্ষিক পরীক্ষা সম্পূর্ণ গাইড
                </h3>
                <p className="text-xs text-indigo-200">
                  উৎস: {selectedGuideModal.syllabusSource.organization} • {selectedGuideModal.syllabusSource.statusNote}
                </p>
              </div>

              <button
                onClick={() => setSelectedGuideModal(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed flex-1">
              {/* Revision Summary */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5">
                <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>পরীক্ষার সংক্ষিপ্ত রূপরেখা ও রিভিশন নির্দেশিকা:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedGuideModal.revisionSummary}
                </p>
              </div>

              {/* Math Worked Examples (If Math/Accounting) */}
              {selectedGuideModal.workedMathExamples && selectedGuideModal.workedMathExamples.length > 0 && (
                <div className="space-y-4">
                  <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    <span>গণিতের ধাপভিত্তিক সমাধানকৃত মডেল উদাহরণ (Step-by-Step Worked Examples):</span>
                  </div>

                  <div className="space-y-4">
                    {selectedGuideModal.workedMathExamples.map((ex, idx) => (
                      <div
                        key={ex.id || idx}
                        className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
                            উদাহরণ {idx + 1}: {ex.topic}
                          </span>
                          {ex.importantFormula && (
                            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                              সূত্র: {ex.importantFormula}
                            </span>
                          )}
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-slate-100">
                          <strong>সমস্যা:</strong> {ex.problem}
                        </div>

                        <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500 text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block">ধাপভিত্তিক সমাধান:</span>
                          {ex.stepByStepSolution.map((step, sIdx) => (
                            <p key={sIdx} className="text-slate-700 dark:text-slate-300 font-mono">
                              {step}
                            </p>
                          ))}
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold flex items-center justify-between">
                          <span>চূড়ান্ত উত্তর: {ex.finalAnswer}</span>
                          <span className="text-[11px] text-slate-500 font-normal">💡 {ex.examTip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* English Grammar & Exercises (If English) */}
              {selectedGuideModal.englishGrammarExercises && selectedGuideModal.englishGrammarExercises.length > 0 && (
                <div className="space-y-4">
                  <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-blue-600" />
                    <span>English Grammar Rules & Practical Exercises:</span>
                  </div>

                  <div className="space-y-4">
                    {selectedGuideModal.englishGrammarExercises.map((eg, idx) => (
                      <div
                        key={eg.id || idx}
                        className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
                          {idx + 1}. {eg.topic}
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl">
                          <strong>Rules Summary:</strong> {eg.rulesSummary}
                        </p>

                        <div className="space-y-2">
                          {eg.exerciseQuestions.map((qItem, qIdx) => (
                            <div
                              key={qIdx}
                              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                            >
                              <div className="font-bold text-slate-800 dark:text-slate-200">
                                Q{qIdx + 1}: {qItem.question}
                              </div>
                              <p className="text-emerald-700 dark:text-emerald-300">
                                <strong>Answer:</strong> {qItem.answer} — {qItem.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Exam Questions with Source Tags */}
              <div className="space-y-3">
                <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <span>বার্ষিক পরীক্ষার গুরুত্বপূর্ণ প্রশ্ন ও আদর্শ উত্তর ({selectedGuideModal.coreExamQuestions.length}):</span>
                </div>

                <div className="space-y-3">
                  {selectedGuideModal.coreExamQuestions.map((cq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                          {idx + 1}. {cq.question}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold">
                            {cq.type} ({cq.mark} নম্বর)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                            {cq.sourceTag === 'verified_board'
                              ? 'বোর্ড যাচাইকৃত'
                              : cq.sourceTag === 'nctb_textbook'
                              ? 'এনসিটিবি পাঠ্যবই'
                              : 'মডেল প্রশ্ন'}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-xs pl-2 border-l-2 border-indigo-500">
                        <strong className="text-indigo-600">উত্তর:</strong> {cq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Test MCQs */}
              {selectedGuideModal.modelTestMCQs && selectedGuideModal.modelTestMCQs.length > 0 && (
                <div className="space-y-3">
                  <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>মডেল বহুনির্বাচনী প্রশ্ন (Model MCQs):</span>
                  </div>

                  <div className="space-y-3">
                    {selectedGuideModal.modelTestMCQs.map((mcq, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                      >
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {idx + 1}. {mcq.question}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {mcq.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-xl border ${
                                oIdx === mcq.correctIndex
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950 dark:text-emerald-200'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                          <strong>ব্যাখ্যা:</strong> {mcq.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>প্রিন্ট / PDF সংরক্ষণ</span>
              </button>

              <button
                onClick={() => setSelectedGuideModal(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCHOOL ANNUAL SYLLABUS UPLOAD & ENTRY MODAL
          Allows teachers / admins to upload custom school syllabus
          ======================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Upload className="w-5 h-5 text-teal-400" />
                  <span>বিদ্যালয়ের নিজস্ব বার্ষিক সিলেবাস আপলোড</span>
                </h3>
                <p className="text-xs text-teal-200 mt-0.5">
                  আপনার প্রতিষ্ঠানের সংক্ষিপ্ত সিলেবাস বা পিডিএফ যুক্ত করুন
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchoolSyllabus} className="p-5 sm:p-6 space-y-4 text-xs">
              {uploadSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-300">
                  ✅ {uploadSuccessMsg}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  বিদ্যালয় / প্রতিষ্ঠানের নাম:
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মতিঝিল মডেল স্কুল অ্যান্ড কলেজ"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    শ্রেণি:
                  </label>
                  <select
                    value={schoolClassId}
                    onChange={(e) => setSchoolClassId(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    {supportedClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    বিষয়:
                  </label>
                  <select
                    value={schoolSubjectId}
                    onChange={(e) => setSchoolSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  পরীক্ষার নাম:
                </label>
                <input
                  type="text"
                  value={schoolExamName}
                  onChange={(e) => setSchoolExamName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  সিলেবাসের বিবরণ বা নির্ধারিত অধ্যায়সমূহ:
                </label>
                <textarea
                  rows={4}
                  placeholder="বার্ষিক পরীক্ষার নির্ধারিত অধ্যায়, পৃষ্ঠা নম্বর বা পাঠ্যসূচির বিস্তারিত তালিকা লিখুন..."
                  value={schoolSyllabusText}
                  onChange={(e) => setSchoolSyllabusText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  সিলেবাস ফাইল বা পিডিএফ নাম (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: annual_syllabus_2026.pdf"
                  value={schoolPdfFileName}
                  onChange={(e) => setSchoolPdfFileName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  সিলেবাস সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
