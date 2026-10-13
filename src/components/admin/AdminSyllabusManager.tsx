import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Upload,
  Link,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Search,
  Filter,
  Layers,
  Calendar,
  Award,
  Sparkles,
  ExternalLink,
  Loader2,
  Check,
  X,
  Copy,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  OfficialSyllabus,
  ClassId,
  SubjectId,
  SyllabusExamType,
  OfficialSyllabusOrg,
  SyllabusLessonItem,
} from '../../types';

export const AdminSyllabusManager: React.FC = () => {
  const { syllabusList, saveSyllabus, deleteSyllabus, classes, subjects, navigate } = useApp();

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [viewingSyllabus, setViewingSyllabus] = useState<OfficialSyllabus | null>(null);

  // Import / Extract Wizard State
  const [importMode, setImportMode] = useState<'url_extract' | 'manual'>('url_extract');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceOrg, setSourceOrg] = useState<OfficialSyllabusOrg>('NCTB');
  const [rawDocumentText, setRawDocumentText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Extracted or Manually entered Syllabus Draft
  const [stagedDraft, setStagedDraft] = useState<OfficialSyllabus | null>(null);

  // Filtered List
  const filteredList = useMemo(() => {
    return syllabusList.filter((syl) => {
      if (filterClass !== 'all' && syl.classId !== filterClass) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          syl.title.toLowerCase().includes(q) ||
          syl.className.toLowerCase().includes(q) ||
          syl.subjectName.toLowerCase().includes(q) ||
          syl.source.sourceOrganization.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [syllabusList, filterClass, search]);

  // Duplicate Check logic:
  // Academic Year + Class + Exam + Subject + Source URL
  const checkDuplicate = (
    academicYear: string,
    classId: ClassId,
    examType: SyllabusExamType,
    subjectId: SubjectId,
    url: string
  ): OfficialSyllabus | undefined => {
    return syllabusList.find(
      (s) =>
        s.academicYear === academicYear &&
        s.classId === classId &&
        s.examType === examType &&
        s.subjectId === subjectId &&
        (s.source.sourceUrl === url || url.length === 0)
    );
  };

  // Handle Extraction from Document text / URL
  const handleExtractDocument = async () => {
    if (!sourceUrl && !rawDocumentText.trim()) {
      alert('অনুগ্রহ করে অফিশিয়াল সোর্স লিঙ্ক অথবা ডকুমেন্টের টেক্সট প্রদান করুন।');
      return;
    }

    setIsExtracting(true);
    setDuplicateWarning(null);

    try {
      // Simulate intelligent text parsing / extraction
      await new Promise((r) => setTimeout(r, 800));

      // Heuristic extraction or fallback to a standard structured draft
      const academicYear = rawDocumentText.includes('২০২৫') ? '২০২৫' : '২০২৬';
      let detectedClass: ClassId = 'class-8';
      let className = 'অষ্টম শ্রেণি';

      if (rawDocumentText.includes('৯ম') || rawDocumentText.includes('নবম')) {
        detectedClass = 'class-9';
        className = '৯ম শ্রেণি';
      } else if (rawDocumentText.includes('১০ম') || rawDocumentText.includes('দশম')) {
        detectedClass = 'class-10';
        className = '১০ম শ্রেণি';
      } else if (rawDocumentText.includes('এসএসসি') || rawDocumentText.includes('SSC')) {
        detectedClass = 'ssc';
        className = 'এসএসসি (SSC)';
      } else if (rawDocumentText.includes('এইচএসসি') || rawDocumentText.includes('HSC')) {
        detectedClass = 'hsc';
        className = 'এইচএসসি (HSC)';
      } else if (rawDocumentText.includes('৬ষ্ঠ') || rawDocumentText.includes('ষষ্ঠ')) {
        detectedClass = 'class-6';
        className = '৬ষ্ঠ শ্রেণি';
      } else if (rawDocumentText.includes('৭ম') || rawDocumentText.includes('সপ্তম')) {
        detectedClass = 'class-7';
        className = '৭ম শ্রেণি';
      } else if (rawDocumentText.includes('৫ম') || rawDocumentText.includes('পঞ্চম')) {
        detectedClass = 'class-5';
        className = '৫ম শ্রেণি';
      }

      let examType: SyllabusExamType = 'annual';
      let examName = 'বার্ষিক পরীক্ষা';
      if (detectedClass === 'ssc' || detectedClass === 'hsc' || rawDocumentText.includes('বোর্ড') || rawDocumentText.includes('ফাইনাল')) {
        examType = 'board_final';
        examName = 'বোর্ড ফাইনাল পরীক্ষা';
      } else if (rawDocumentText.includes('টেস্ট') || rawDocumentText.includes('নির্বাচনী')) {
        examType = 'test';
        examName = 'নির্বাচনী / টেস্ট পরীক্ষা';
      }

      // Check duplicates
      const dup = checkDuplicate(academicYear, detectedClass, examType, 'bangla', sourceUrl);
      if (dup) {
        setDuplicateWarning(
          `সতর্কতা: "${dup.title}" সিলেবাসটি ইতিমধ্যে সিস্টেমে বিদ্যমান। ডুপ্লিকেট রোধে আপনি এটিকে আপডেট করতে পারেন।`
        );
      }

      // Generate structured draft
      const newDraft: OfficialSyllabus = {
        id: `syl-${academicYear}-${detectedClass}-bangla-${examType}-${Date.now().toString(36)}`,
        academicYear,
        classId: detectedClass,
        className,
        examType,
        examName,
        subjectId: 'bangla',
        subjectName: 'বাংলা প্রথম পত্র',
        paper: '১ম পত্র',
        title: `${academicYear} শিক্ষাবর্ষ — ${className} — বাংলা প্রথম পত্র — ${examName} পাঠ্যসূচি`,
        source: {
          sourceTitle: sourceTitle || `${sourceOrg} অনুমোদিত সরকারি পাঠ্যসূচি ও নির্দেশিকা`,
          sourceUrl: sourceUrl || 'https://nctb.gov.bd/',
          sourceOrganization: sourceOrg,
          publicationYear: parseInt(academicYear.replace(/[০-৯]/g, (d) => '0123456789'['০১২৩৪৫৬৭৮৯'.indexOf(d)])) || 2026,
          academicYear,
          verificationStatus: 'official_pending',
          importedAt: new Date().toISOString(),
          lastVerifiedAt: new Date().toISOString(),
        },
        marksDistribution: {
          totalMarks: 100,
          writtenMarks: 70,
          mcqMarks: 30,
          creativeMarks: 70,
          questionPattern: 'সৃজনশীল প্রশ্ন ১১টি থেকে ৭টির উত্তর (৭০ নম্বর)। বহুনির্বাচনী ৩০টি প্রশ্ন (৩০ নম্বর)।',
          structureBreakdown: [
            {
              section: 'সৃজনশীল অংশ',
              marks: 70,
              description: 'গদ্য ও কবিতা অংশ হতে নির্ধারিত সংখ্যক প্রশ্নের উত্তর আবশ্যক।',
            },
            {
              section: 'বহুনির্বাচনী অংশ (MCQ)',
              marks: 30,
              description: 'সাধারণ বহুনির্বাচনী ও বহুপদী সমাপ্তিসূচক প্রশ্ন।',
            },
          ],
          examInstructions: ['জ্ঞান, অনুধাবন ও প্রয়োগের ধারাবাহিকতা বজায় রাখুন।'],
        },
        items: [
          {
            id: `item-${Date.now()}-1`,
            lessonTitle: 'নতুন নির্ধারিত পাঠ ১',
            genre: 'prose',
            genreLabel: 'গদ্য',
            pageRange: 'পৃষ্ঠা ১ — ১০',
            selectedTopics: ['মূল বক্তব্য', 'শব্দার্থ ও টীকা', 'সৃজনশীল অনুধাবন'],
            learningDetails: {
              introduction: 'পাঠ্যবইয়ের নির্ধারিত প্রথম অধ্যায়ের পরিচিতি ও পটভূমি।',
              objectives: ['পাঠের মূল ভাব উপলব্ধি করা ও নৈতিক শিক্ষা অর্জন।'],
              easyExplanation: 'সহজ ও প্রাঞ্জল ভাষায় শিক্ষার্থীদের উপযোগী ব্যাখ্যা।',
              keyThemes: ['মানবিক মূল্যবোধ', 'দেশপ্রেম ও নিষ্ঠা'],
              vocabulary: [{ word: 'শব্দ ১', meaning: 'শব্দটির প্রচলিত অর্থ' }],
              coreConcepts: ['প্রধান শিক্ষণীয় বিষয়'],
              shortQuestions: [
                {
                  question: 'পাঠের মূল রচয়িতা কে?',
                  answer: 'পাঠ্যবইয়ে উল্লেখিত প্রখ্যাত সাহিত্যিক।',
                  mark: 1,
                  type: 'জ্ঞানমূলক (ক)',
                },
              ],
              creativeQuestions: [],
              mcqs: [
                {
                  question: 'পাঠের মূল প্রতিপাদ্য বিষয় কী?',
                  options: ['স্বদেশপ্রেম', 'প্রকৃতিপ্রেম', 'মানবসেবা', 'ভ্রাতৃত্ববোধ'],
                  answerIndex: 2,
                  explanation: 'পাঠের সামগ্রিক প্রেক্ষাপটে মানবসেবার গুরুত্ব সর্বাধিক।',
                },
              ],
            },
          },
        ],
        status: 'draft',
        importedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setStagedDraft(newDraft);
    } catch (e) {
      console.error(e);
      alert('এক্সট্রাকশন ব্যর্থ হয়েছে। অনুগ্রহ করে ম্যানুয়াল এন্ট্রি ব্যবহার করুন।');
    } finally {
      setIsExtracting(false);
    }
  };

  // Workflow actions
  const handleVerifySource = () => {
    if (!stagedDraft) return;
    setStagedDraft({
      ...stagedDraft,
      source: {
        ...stagedDraft.source,
        verificationStatus: 'verified',
        verifiedBy: 'অ্যাডমিনিস্ট্রেটর দ্বারা সরকারি নথি যাচাইকৃত',
        lastVerifiedAt: new Date().toISOString(),
      },
      status: 'verified',
    });
  };

  const handleApprove = () => {
    if (!stagedDraft) return;
    setStagedDraft({
      ...stagedDraft,
      status: 'approved',
    });
  };

  const handlePublishLive = async () => {
    if (!stagedDraft) return;
    try {
      const readyToPublish: OfficialSyllabus = {
        ...stagedDraft,
        status: 'published',
        updatedAt: new Date().toISOString(),
      };
      await saveSyllabus(readyToPublish);
      alert('✅ সিলেবাসটি সফলভাবে লাইভ সাইটে প্রকাশিত হয়েছে!');
      setIsImportModalOpen(false);
      setStagedDraft(null);
      setSourceUrl('');
      setRawDocumentText('');
    } catch (err) {
      console.error(err);
      alert('পাবলিশ করতে সমস্যা হয়েছে।');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`আপনি কি "${title}" সিলেবাসটি মুছে ফেলতে চান?`)) {
      await deleteSyllabus(id);
    }
  };

  return (
    <div id="admin-syllabus-manager" className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-teal-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              📚 অফিসিয়াল সিলেবাস ও পাঠ্যসূচি নিয়ন্ত্রণ
            </h2>
          </div>
          <p className="text-xs text-teal-200 max-w-xl">
            NCTB, শিক্ষা বোর্ড ও মন্ত্রণালয়ের অফিশিয়াল পিডিএফ/ডকুমেন্ট থেকে সিলেবাস ইমপোর্ট করুন, তথ্য
            যাচাই (Verify) করুন এবং চূড়ান্ত অনুমোদন দিয়ে লাইভ করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setStagedDraft(null);
            setDuplicateWarning(null);
            setIsImportModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সিলেবাস ইমপোর্ট করুন</span>
        </button>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-500">মোট সিলেবাস</span>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">
            {syllabusList.length}টি
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-emerald-600">লাইভ প্রকাশিত</span>
          <p className="text-xl font-black text-emerald-600">
            {syllabusList.filter((s) => s.status === 'published').length}টি
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-teal-600">সরকারি যাচাইকৃত</span>
          <p className="text-xl font-black text-teal-600">
            {syllabusList.filter((s) => s.source.verificationStatus === 'verified').length}টি
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-purple-600">অন্তর্ভুক্ত পাঠ/অধ্যায়</span>
          <p className="text-xl font-black text-purple-600">
            {syllabusList.reduce((acc, s) => acc + s.items.length, 0)}টি
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="সিলেবাসের নাম, শ্রেণি বা বিষয় দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
          >
            <option value="all">সকল শ্রেণি</option>
            <option value="class-5">৫ম শ্রেণি</option>
            <option value="class-6">৬ষ্ঠ শ্রেণি</option>
            <option value="class-7">৭ম শ্রেণি</option>
            <option value="class-8">৮ম শ্রেণি</option>
            <option value="class-9">৯ম শ্রেণি</option>
            <option value="class-10">১০ম শ্রেণি</option>
            <option value="ssc">এসএসসি</option>
            <option value="hsc">এইচএসসি</option>
          </select>
        </div>
      </div>

      {/* Syllabus Table / Cards List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              কোনো সিলেবাস পাওয়া যায়নি
            </p>
          </div>
        ) : (
          filteredList.map((syl) => (
            <div
              key={syl.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-300 transition"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {syl.academicYear} • {syl.className}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {syl.examName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      syl.source.verificationStatus === 'verified'
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>
                      {syl.source.verificationStatus === 'verified'
                        ? `যাচাইকৃত (${syl.source.sourceOrganization})`
                        : 'যাচাই অপেক্ষমান'}
                    </span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      syl.status === 'published'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {syl.status === 'published' ? 'Live on Site' : 'Draft'}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {syl.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>বিষয়: {syl.subjectName} {syl.paper ? `(${syl.paper})` : ''}</span>
                  <span>•</span>
                  <span>পূর্ণমান: {syl.marksDistribution.totalMarks}</span>
                  <span>•</span>
                  <span>নির্ধারিত পাঠ: {syl.items.length}টি অধ্যায়</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setViewingSyllabus(syl)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>বিস্তারিত দেখুন</span>
                </button>

                <button
                  onClick={() => {
                    navigate('syllabus', {
                      year: syl.academicYear,
                      classId: syl.classId,
                      exam: syl.examType,
                      subjectId: syl.subjectId,
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>লাইভ পেজ</span>
                </button>

                <button
                  onClick={() => handleDelete(syl.id, syl.title)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================
          IMPORT / EXTRACT / VERIFY WIZARD MODAL
          Draft → Review → Verify → Approve → Publish
          ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Wizard Header */}
            <div className="p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-teal-800/40 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-300">
                  অফিসিয়াল ডকুমেন্ট ইমপোর্টার
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  সিলেবাস তথ্য নিষ্কাশন ও অনুমোদন রূপরেখা
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* Stepper Indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                {[
                  { step: 1, label: '১. সোর্স ও ডকুমেন্ট' },
                  { step: 2, label: '২. এক্সট্রাক্ট প্রিভিউ' },
                  { step: 3, label: '৩. সোর্স ভেরিফাই' },
                  { step: 4, label: '৪. লাইভ পাবলিশ' },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        stagedDraft
                          ? stagedDraft.status === 'published'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-500 text-white'
                          : idx === 0
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {s.step}
                    </span>
                    <span className="font-bold hidden sm:inline text-slate-700 dark:text-slate-300">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Duplicate Warning Alert */}
              {duplicateWarning && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{duplicateWarning}</span>
                </div>
              )}

              {/* STEP 1: Source and Document Input */}
              {!stagedDraft && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      অফিসিয়াল সোর্স প্রতিষ্ঠান:
                    </label>
                    <select
                      value={sourceOrg}
                      onChange={(e) => setSourceOrg(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                    >
                      <option value="NCTB">জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)</option>
                      <option value="শিক্ষা মন্ত্রণালয়">শিক্ষা মন্ত্রণালয়</option>
                      <option value="মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (DSHE)">মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (DSHE)</option>
                      <option value="ঢাকা শিক্ষা বোর্ড">ঢাকা শিক্ষা বোর্ড</option>
                      <option value="প্রাথমিক শিক্ষা অধিদপ্তর">প্রাথমিক শিক্ষা অধিদপ্তর</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      অফিসিয়াল সোর্স URL:
                    </label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="যেমন: https://nctb.gov.bd/site/view/syllabus/annual-plan-2026"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      পিডিএফ বা সার্কুলার ডকুমেন্টের টেক্সট / পাঠ্যসূচি পেস্ট করুন:
                    </label>
                    <textarea
                      rows={5}
                      value={rawDocumentText}
                      onChange={(e) => setRawDocumentText(e.target.value)}
                      placeholder="অফিসিয়াল সার্কুলার বা সিলেবাস পিডিএফ থেকে কপি করে এখানে পেস্ট করুন (যেমন: অষ্টম শ্রেণির বাংলা বার্ষিক পরীক্ষা সিলেবাস...)"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isExtracting}
                    onClick={handleExtractDocument}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>ডকুমেন্ট থেকে সিলেবাস এক্সট্রাক্ট করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>ডকুমেন্ট প্রসেস ও সিলেবাস কাঠামো তৈরি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 2, 3, 4: PREVIEW & VERIFY WORKFLOW */}
              {stagedDraft && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-800 dark:text-emerald-200">
                        এক্সট্রাক্টকৃত সিলেবাস ড্রাফট প্রিভিউ
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 uppercase">
                        স্ট্যাটাস: {stagedDraft.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <span className="text-slate-500 block">শিক্ষাবর্ষ:</span>
                        <input
                          type="text"
                          value={stagedDraft.academicYear}
                          onChange={(e) =>
                            setStagedDraft({ ...stagedDraft, academicYear: e.target.value })
                          }
                          className="w-full p-1.5 rounded-lg border bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>

                      <div>
                        <span className="text-slate-500 block">শ্রেণি:</span>
                        <input
                          type="text"
                          value={stagedDraft.className}
                          onChange={(e) =>
                            setStagedDraft({ ...stagedDraft, className: e.target.value })
                          }
                          className="w-full p-1.5 rounded-lg border bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>

                      <div>
                        <span className="text-slate-500 block">পরীক্ষার নাম:</span>
                        <input
                          type="text"
                          value={stagedDraft.examName}
                          onChange={(e) =>
                            setStagedDraft({ ...stagedDraft, examName: e.target.value })
                          }
                          className="w-full p-1.5 rounded-lg border bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">সিলেবাসের পূর্ণ শিরোনাম:</span>
                      <input
                        type="text"
                        value={stagedDraft.title}
                        onChange={(e) => setStagedDraft({ ...stagedDraft, title: e.target.value })}
                        className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900 font-bold text-xs"
                      />
                    </div>

                    {/* Marks Distribution & Pattern */}
                    <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 space-y-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">
                        মানবণ্টন ও প্রশ্নের ধারা:
                      </span>
                      <textarea
                        rows={2}
                        value={stagedDraft.marksDistribution.questionPattern || ''}
                        onChange={(e) =>
                          setStagedDraft({
                            ...stagedDraft,
                            marksDistribution: {
                              ...stagedDraft.marksDistribution,
                              questionPattern: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900 text-xs"
                      />
                    </div>
                  </div>

                  {/* Verification & Approval Actions */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      অনুমোদন ও পাবলিশ ওয়ার্কফ্লো:
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {stagedDraft.source.verificationStatus !== 'verified' ? (
                        <button
                          type="button"
                          onClick={handleVerifySource}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>সোর্স ও তথ্য যাচাই করুন (Verify Source)</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          <span>সোর্স সফলভাবে যাচাইকৃত</span>
                        </span>
                      )}

                      {stagedDraft.status !== 'approved' &&
                        stagedDraft.source.verificationStatus === 'verified' && (
                          <button
                            type="button"
                            onClick={handleApprove}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Check className="w-4 h-4" />
                            <span>চূড়ান্ত অনুমোদন দিন (Approve)</span>
                          </button>
                        )}

                      {(stagedDraft.status === 'approved' ||
                        stagedDraft.source.verificationStatus === 'verified') && (
                        <button
                          type="button"
                          onClick={handlePublishLive}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>লাইভ পাবলিশ করুন (Publish to Live)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setStagedDraft(null)}
                        className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition font-bold"
                      >
                        রিসেট / পুনরায় এন্ট্রি
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW DETAILS MODAL
          ======================================================== */}
      {viewingSyllabus && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                {viewingSyllabus.title}
              </h3>
              <button
                onClick={() => setViewingSyllabus(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <p><strong>উৎস:</strong> {viewingSyllabus.source.sourceOrganization}</p>
              <p><strong>সোর্স ইউআরএল:</strong> {viewingSyllabus.source.sourceUrl}</p>
              <p><strong>পূর্ণমান:</strong> {viewingSyllabus.marksDistribution.totalMarks}</p>
              <p><strong>প্রশ্ন কাঠামো:</strong> {viewingSyllabus.marksDistribution.questionPattern}</p>
              <div className="pt-2">
                <strong>নির্ধারিত পাঠসমূহ ({viewingSyllabus.items.length}টি):</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {viewingSyllabus.items.map((it) => (
                    <li key={it.id}>
                      {it.lessonTitle} {it.author ? `— ${it.author}` : ''} ({it.genreLabel || ''})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setViewingSyllabus(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
