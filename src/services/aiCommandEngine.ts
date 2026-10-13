import { chatWithAiTeacher } from './aiService';
import {
  ManagedClass,
  ManagedSubject,
  ManagedQuestion,
  ManagedNote,
  ManagedChapter,
  ManagedNotice,
  SiteSeoConfig,
  ClassId,
  SubjectId,
} from '../types';

export interface ParsedCommandIntent {
  actionType: 'mcq' | 'lesson' | 'chapter' | 'notice' | 'seo' | 'class' | 'subject' | 'general';
  targetClass: ClassId;
  targetSubject: SubjectId;
  topic: string;
  quantity: number;
  description: string;
  rawCommand: string;
}

export interface AICommandDraft {
  id: string;
  command: string;
  timestamp: string;
  intent: ParsedCommandIntent;
  summary: string;
  status: 'draft_ready' | 'published' | 'cancelled' | 'failed';
  errorMessage?: string;
  // Specific payload by actionType
  payload: {
    questions?: ManagedQuestion[];
    note?: ManagedNote;
    chapter?: ManagedChapter;
    notice?: ManagedNotice;
    seo?: SiteSeoConfig;
    managedClass?: ManagedClass;
    managedSubject?: ManagedSubject;
  };
}

/**
 * Normalizes Bengali digits to numbers
 */
export function parseBengaliOrEnglishNumber(str: string): number {
  const bnDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const normalized = str.replace(/[০-৯]/g, (d) => bnDigits[d] || d);
  const match = normalized.match(/\d+/);
  return match ? parseInt(match[0], 10) : 5;
}

/**
 * Extracts class and subject from natural Bangla query
 */
export function extractClassAndSubject(text: string): {
  classId: ClassId;
  subjectId: SubjectId;
  quantity: number;
} {
  const lower = text.toLowerCase();

  // Quantity detection (e.g. ১০টি, ২০টি, 30টি, ৫টি)
  const qtyMatch = text.match(/([০-৯\d]+)\s*(?:টি|টা|খানা)/);
  const quantity = qtyMatch ? parseBengaliOrEnglishNumber(qtyMatch[1]) : 5;

  // Class detection
  let classId: ClassId = 'class-8';
  if (lower.includes('ক্লাস ৫') || lower.includes('৫ম শ্রেণি') || lower.includes('class 5')) {
    classId = 'class-5';
  } else if (lower.includes('ক্লাস ৬') || lower.includes('৬ষ্ঠ শ্রেণি') || lower.includes('class 6')) {
    classId = 'class-6';
  } else if (lower.includes('ক্লাস ৭') || lower.includes('৭ম শ্রেণি') || lower.includes('class 7')) {
    classId = 'class-7';
  } else if (lower.includes('ক্লাস ৮') || lower.includes('৮ম শ্রেণি') || lower.includes('class 8')) {
    classId = 'class-8';
  } else if (lower.includes('ক্লাস ৯') || lower.includes('৯ম শ্রেণি') || lower.includes('class 9')) {
    classId = 'class-9';
  } else if (lower.includes('ক্লাস ১০') || lower.includes('১০ম শ্রেণি') || lower.includes('class 10')) {
    classId = 'class-10';
  } else if (lower.includes('এসএসসি') || lower.includes('ssc')) {
    classId = 'ssc';
  } else if (lower.includes('এইচএসসি') || lower.includes('hsc')) {
    classId = 'hsc';
  }

  // Subject detection
  let subjectId: SubjectId = 'science';
  if (lower.includes('গণিত') || lower.includes('math') || lower.includes('অংক')) {
    subjectId = 'math';
  } else if (lower.includes('বাংলা') || lower.includes('bangla')) {
    subjectId = 'bangla';
  } else if (lower.includes('ইংরেজি') || lower.includes('english')) {
    subjectId = 'english';
  } else if (lower.includes('আইসিটি') || lower.includes('ict') || lower.includes('তথ্য')) {
    subjectId = 'ict';
  } else if (lower.includes('পদার্থ') || lower.includes('physics')) {
    subjectId = 'physics';
  } else if (lower.includes('রসায়ন') || lower.includes('chemistry')) {
    subjectId = 'chemistry';
  } else if (lower.includes('জীববিজ্ঞান') || lower.includes('biology')) {
    subjectId = 'biology';
  } else if (lower.includes('ইতিহাস') || lower.includes('history')) {
    subjectId = 'bgs';
  } else if (lower.includes('ধর্ম') || lower.includes('islam')) {
    subjectId = 'islamic_studies';
  }

  return { classId, subjectId, quantity };
}

/**
 * Main AI Command Parser and Draft Generator
 * Strictly follows Draft / Staging requirement (No auto-publish)
 */
export async function executeAiCommand(command: string): Promise<AICommandDraft> {
  const trimmed = command.trim();
  const lower = trimmed.toLowerCase();
  const { classId, subjectId, quantity } = extractClassAndSubject(trimmed);

  const draftId = `cmd-draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const timestamp = new Date().toLocaleString('bn-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // 1. MCQ Generation Intent
  if (
    lower.includes('mcq') ||
    lower.includes('বহুনির্বাচনী') ||
    lower.includes('নৈর্ব্যক্তিক') ||
    (lower.includes('প্রশ্ন') && (lower.includes('কুইজ') || lower.includes('অপশন')))
  ) {
    const topic = trimmed
      .replace(/ক্লাস\s*[০-৯\d]+/gi, '')
      .replace(/[০-৯\d]+\s*(?:টি|টা|খানা)/gi, '')
      .replace(/mcq|বহুনির্বাচনী|তৈরি করো|বানাও|যোগ করো/gi, '')
      .trim() || `${classId} ${subjectId} মূল সিলেবাস`;

    const count = Math.min(Math.max(quantity, 1), 20); // Safe batch between 1 and 20

    const prompt = `আপনি একজন জাতীয় শিক্ষাক্রম (NCTB) বিশেষজ্ঞ শিক্ষক।
শ্রেণি: ${classId}, বিষয়: ${subjectId}, অধ্যায়/টপিক: "${topic}"।
অনুগ্রহ করে ${count}টি মানসম্মত বহুনির্বাচনী প্রশ্ন (MCQ) তৈরি করুন।
প্রতিটি প্রশ্নে ৪টি অপশন (ক, খ, গ, ঘ), সঠিক উত্তরের ইনডেক্স (০ থেকে ৩) এবং সঠিক উত্তরের স্পষ্ট ব্যাখ্যা থাকতে হবে।

ফরম্যাট প্রতি প্রশ্নের জন্য:
---
প্রশ্ন: [প্রশ্নের বক্তব্য]
ক) [অপশন ১]
খ) [অপশন ২]
গ) [অপশন ৩]
ঘ) [অপশন ৪]
সঠিক উত্তর: [ক/খ/গ/ঘ]
ব্যাখ্যা: [ধাপভিত্তিক নির্ভুল ব্যাখ্যা]
---`;

    try {
      const aiReply = await chatWithAiTeacher(prompt, { classId, subjectId });
      const rawBlocks = aiReply.split('---').map((b) => b.trim()).filter(Boolean);

      const generatedQuestions: ManagedQuestion[] = [];

      rawBlocks.forEach((block, idx) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        let qText = '';
        const options: string[] = [];
        let correctIdx = 0;
        let explanation = 'এনসিটিবি পাঠ্যক্রম অনুযায়ী সঠিক উত্তর।';

        lines.forEach((line) => {
          if (line.startsWith('প্রশ্ন:')) {
            qText = line.replace('প্রশ্ন:', '').trim();
          } else if (line.match(/^[ক|a]\)/i) || line.startsWith('১.') || line.startsWith('ক)')) {
            options.push(line.replace(/^[ক|a]\)|^[১|1]\./i, '').trim());
          } else if (line.match(/^[খ|b]\)/i) || line.startsWith('২.') || line.startsWith('খ)')) {
            options.push(line.replace(/^[খ|b]\)|^[২|2]\./i, '').trim());
          } else if (line.match(/^[গ|c]\)/i) || line.startsWith('৩.') || line.startsWith('গ)')) {
            options.push(line.replace(/^[গ|c]\)|^[৩|3]\./i, '').trim());
          } else if (line.match(/^[ঘ|d]\)/i) || line.startsWith('৪.') || line.startsWith('ঘ)')) {
            options.push(line.replace(/^[ঘ|d]\)|^[৪|4]\./i, '').trim());
          } else if (line.includes('সঠিক উত্তর:')) {
            const ansStr = line.replace('সঠিক উত্তর:', '').trim();
            if (ansStr.includes('খ') || ansStr.includes('২')) correctIdx = 1;
            else if (ansStr.includes('গ') || ansStr.includes('৩')) correctIdx = 2;
            else if (ansStr.includes('ঘ') || ansStr.includes('৪')) correctIdx = 3;
            else correctIdx = 0;
          } else if (line.startsWith('ব্যাখ্যা:')) {
            explanation = line.replace('ব্যাখ্যা:', '').trim();
          }
        });

        if (!qText) {
          qText = `${topic}: বহুনির্বাচনী প্রশ্ন #${idx + 1}`;
        }
        while (options.length < 4) {
          options.push(`বিকল্প অপশন ${options.length + 1}`);
        }

        generatedQuestions.push({
          id: `q-cmd-${Date.now()}-${idx + 1}-${Math.random().toString(36).slice(2, 5)}`,
          classId,
          subjectId,
          chapterId: 'ch-general',
          question: qText,
          options: options.slice(0, 4),
          correctAnswerIndex: correctIdx,
          explanation,
          source: 'AI Command Center',
          type: 'mcq',
          status: 'draft',
        });
      });

      // Fallback if parsing failed into single question
      if (generatedQuestions.length === 0) {
        generatedQuestions.push({
          id: `q-cmd-${Date.now()}-1`,
          classId,
          subjectId,
          chapterId: 'ch-general',
          question: `${topic} সম্পর্কিত বহুনির্বাচনী প্রশ্ন:`,
          options: ['ক) সঠিক তাত্ত্বিক নিয়ম', 'খ) বিকল্প ২', 'গ) বিকল্প ৩', 'ঘ) বিকল্প ৪'],
          correctAnswerIndex: 0,
          explanation: aiReply.slice(0, 300),
          source: 'AI Command Center',
          type: 'mcq',
          status: 'draft',
        });
      }

      return {
        id: draftId,
        command: trimmed,
        timestamp,
        intent: {
          actionType: 'mcq',
          targetClass: classId,
          targetSubject: subjectId,
          topic,
          quantity: generatedQuestions.length,
          description: `${classId} শ্রেণির ${subjectId} বিষয়ে "${topic}" টপিকে ${generatedQuestions.length}টি MCQ প্রশ্ন ড্রাফট হিসেবে প্রস্তুত।`,
          rawCommand: trimmed,
        },
        summary: `মোট ${generatedQuestions.length}টি বহুনির্বাচনী প্রশ্ন তৈরি করা হয়েছে। প্রকাশের পূর্বে প্রিভিউ ও অনুমোদন করুন।`,
        status: 'draft_ready',
        payload: {
          questions: generatedQuestions,
        },
      };
    } catch (err: any) {
      return {
        id: draftId,
        command: trimmed,
        timestamp,
        intent: {
          actionType: 'mcq',
          targetClass: classId,
          targetSubject: subjectId,
          topic,
          quantity,
          description: 'MCQ প্রশ্ন তৈরিতে সমস্যা হয়েছে।',
          rawCommand: trimmed,
        },
        summary: 'কমান্ডটি সম্পন্ন করা যায়নি।',
        status: 'failed',
        errorMessage: err?.message || 'AI মডেল থেকে উত্তর পেতে বিলম্ব হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
        payload: {},
      };
    }
  }

  // 2. Chapter Addition Intent
  if (lower.includes('অধ্যায় যোগ') || lower.includes('অধ্যায় যোগ') || lower.includes('chapter যোগ') || lower.includes('নতুন অধ্যায়')) {
    const chapterNumMatch = trimmed.match(/([০-৯\d]+)\s*(?:নম্বর|নং)?\s*অধ্যায়/);
    const chapterNum = chapterNumMatch ? parseBengaliOrEnglishNumber(chapterNumMatch[1]) : 1;

    const topic = trimmed
      .replace(/ক্লাস\s*[০-৯\d]+/gi, '')
      .replace(/[০-৯\d]+\s*(?:নম্বর|নং)?\s*অধ্যায়/gi, '')
      .replace(/যোগ করো|বানাও|যুক্ত করো|নতুন অধ্যায়/gi, '')
      .trim() || `অধ্যায় ${chapterNum}: সাধারণ পাঠ্যক্রম`;

    const newChapter: ManagedChapter = {
      id: `ch-${classId}-${subjectId}-${chapterNum}-${Date.now().toString().slice(-4)}`,
      classId,
      subjectId,
      title: topic.startsWith('অধ্যায়') ? topic : `অধ্যায় ${chapterNum}: ${topic}`,
      chapterNumber: chapterNum,
      description: `জাতীয় শিক্ষাক্রম অনুযায়ী ${classId} শ্রেণির ${subjectId} বিষয়ের ${chapterNum} নম্বর অধ্যায়।`,
      isPopular: false,
      status: 'draft',
    };

    return {
      id: draftId,
      command: trimmed,
      timestamp,
      intent: {
        actionType: 'chapter',
        targetClass: classId,
        targetSubject: subjectId,
        topic,
        quantity: 1,
        description: `${classId} শ্রেণির ${subjectId} বিষয়ের ${chapterNum} নম্বর অধ্যায় ড্রাফট হিসেবে প্রস্তুত।`,
        rawCommand: trimmed,
      },
      summary: `১টি নতুন অধ্যায় ("${newChapter.title}") ড্রাফট হিসেবে প্রস্তুত হয়েছে।`,
      status: 'draft_ready',
      payload: {
        chapter: newChapter,
      },
    };
  }

  // 3. Notice / Announcement Intent
  if (lower.includes('নোটিস') || lower.includes('নোটিশ') || lower.includes('ঘোষণা') || lower.includes('বিজ্ঞপ্তি')) {
    const topic = trimmed
      .replace(/একটি|নতুন|শিক্ষামূলক|নোটিস|নোটিশ|ঘোষণা|তৈরি করো|জারি করো/gi, '')
      .trim() || 'শিক্ষার্থীদের জন্য জরুরি নোটিস';

    const prompt = `বাংলা শিক্ষাগার ওয়েবসাইটের জন্য "${topic}" বিষয়ের উপর শিক্ষার্থীদের উদ্দেশ্যে একটি আকর্ষণীয়, অনুপ্রেরণামূলক ও স্পষ্ট নোটিস তৈরি করুন।`;
    const noticeText = await chatWithAiTeacher(prompt);

    const newNotice: ManagedNotice = {
      id: `notice-cmd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: topic.length > 5 ? topic : 'শিক্ষার্থীদের জন্য জরুরি নোটিস',
      text: noticeText.slice(0, 300).trim(),
      type: lower.includes('জরুরি') ? 'urgent' : lower.includes('পরীক্ষা') ? 'exam' : 'info',
      showOnBanner: true,
      status: 'draft',
    };

    return {
      id: draftId,
      command: trimmed,
      timestamp,
      intent: {
        actionType: 'notice',
        targetClass: classId,
        targetSubject: subjectId,
        topic,
        quantity: 1,
        description: `নতুন সাইট নোটিস ("${newNotice.title}") ড্রাফট হিসেবে প্রস্তুত।`,
        rawCommand: trimmed,
      },
      summary: '১টি সাইট নোটিস ড্রাফট হিসেবে প্রস্তুত হয়েছে। প্রকাশের আগে প্রিভিউ ও অনুমোদন করুন।',
      status: 'draft_ready',
      payload: {
        notice: newNotice,
      },
    };
  }

  // 4. SEO Config Intent
  if (lower.includes('seo') || lower.includes('এসইও') || lower.includes('মেটা') || lower.includes('টাইটেল আপডেট')) {
    const newSeo: SiteSeoConfig = {
      id: 'global_seo',
      siteTitle: 'বাংলা শিক্ষাগর — ৬ষ্ঠ থেকে ১০ম শ্রেণির ডিজিটাল পাঠশালা ও AI প্ল্যাটফর্ম',
      metaDescription: '৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য নির্ভরযোগ্য ফ্রি ডিজিটাল পাঠশালা। সকল বিষয়ের পাঠ্যবই, অধ্যায়ভিত্তিক নোট, প্রশ্নব্যাংক ও এআই শিক্ষক।',
      keywords: 'বাংলা শিক্ষাগর, nctb education, class 6-10, mcq question bank, digital education bangladesh',
      ogTitle: 'বাংলা শিক্ষাগর — আধুনিক ডিজিটাল শিক্ষা প্ল্যাটফর্ম',
      ogDescription: 'সহজ ব্যাখ্যা, লাইভ মডেল টেস্ট ও স্মার্ট এআই শিক্ষকের সাথে পাঠ্যক্রমের সেরা প্রস্তুতি।',
    };

    return {
      id: draftId,
      command: trimmed,
      timestamp,
      intent: {
        actionType: 'seo',
        targetClass: classId,
        targetSubject: subjectId,
        topic: 'এসইও কনফিগারেশন',
        quantity: 1,
        description: 'ওয়েবসাইটের এসইও ও মেটা ট্যাগ ড্রাফট প্রস্তুত।',
        rawCommand: trimmed,
      },
      summary: 'এসইও টাইটেল ও মেটা বিবরণ ড্রাফট তৈরি হয়েছে। অনুমোদন করলে লাইভ কার্যকর হবে।',
      status: 'draft_ready',
      payload: {
        seo: newSeo,
      },
    };
  }

  // 5. Class Addition Intent
  if (lower.includes('শ্রেণি যোগ') || lower.includes('ক্লাস যোগ') || lower.includes('নতুন শ্রেণি') || lower.includes('নতুন ক্লাস')) {
    const gradeNum = parseBengaliOrEnglishNumber(trimmed);
    const banglaNums: Record<number, string> = {
      1: '১ম', 2: '২য়', 3: '৩য়', 4: '৪র্থ', 5: '৫ম',
      6: '৬ষ্ঠ', 7: '৭ম', 8: '৮ম', 9: '৯ম', 10: '১০ম',
      11: '১১দশ', 12: '১২দশ',
    };
    const bName = banglaNums[gradeNum] ? `${banglaNums[gradeNum]} শ্রেণি` : `${gradeNum}ম শ্রেণি`;
    const newClass: ManagedClass = {
      id: `class-${gradeNum}`,
      name: bName,
      numericGrade: gradeNum,
      description: `NCTB কারিকুলাম অনুযায়ী ${bName}-এর সিলেবাস ও বোর্ড প্রশ্নব্যাংক।`,
      iconName: gradeNum >= 11 ? 'Award' : gradeNum >= 9 ? 'GraduationCap' : 'BookOpen',
      status: 'draft',
      totalChapters: 12,
      totalQuizzes: 20,
    };
    return {
      id: draftId,
      command: trimmed,
      timestamp,
      intent: {
        actionType: 'class',
        targetClass: newClass.id as ClassId,
        targetSubject: subjectId,
        topic: newClass.name,
        quantity: 1,
        description: `নতুন শ্রেণি (${newClass.name}) ড্রাফট হিসেবে প্রস্তুত।`,
        rawCommand: trimmed,
      },
      summary: `১টি নতুন শ্রেণি ("${newClass.name}") ড্রাফট হিসেবে প্রস্তুত হয়েছে।`,
      status: 'draft_ready',
      payload: {
        managedClass: newClass,
      },
    };
  }

  // 6. Subject Addition Intent
  if (lower.includes('বিষয় যোগ') || lower.includes('নতুন বিষয়') || lower.includes('subject যোগ')) {
    const cleanTopic = trimmed
      .replace(/ক্লাস\s*[০-৯\d]+/gi, '')
      .replace(/বিষয় যোগ|নতুন বিষয়|subject যোগ|যুক্ত করো|বানাও/gi, '')
      .trim() || 'নতুন পাঠ্য বিষয়';
    const subId = `sub-${classId}-${Date.now().toString().slice(-4)}`;
    const newSubject: ManagedSubject = {
      id: subId,
      name: cleanTopic,
      banglaName: cleanTopic,
      classId,
      iconName: 'BookOpen',
      description: `${classId} শ্রেণির জন্য ${cleanTopic} বিষয়।`,
      status: 'draft',
    };
    return {
      id: draftId,
      command: trimmed,
      timestamp,
      intent: {
        actionType: 'subject',
        targetClass: classId,
        targetSubject: subId as SubjectId,
        topic: cleanTopic,
        quantity: 1,
        description: `${classId} শ্রেণিতে নতুন বিষয় ("${cleanTopic}") ড্রাফট হিসেবে প্রস্তুত।`,
        rawCommand: trimmed,
      },
      summary: `১টি নতুন বিষয় ("${cleanTopic}") ড্রাফট হিসেবে প্রস্তুত হয়েছে।`,
      status: 'draft_ready',
      payload: {
        managedSubject: newSubject,
      },
    };
  }

  // 7. Default: Study Note / Revision Lesson Intent (e.g. "সহজ বাংলায় করে দাও", "নোট তৈরি করো", "বানান ঠিক করো")
  const topic = trimmed
    .replace(/ক্লাস\s*[০-৯\d]+/gi, '')
    .replace(/তৈরি করো|বানাও|লিখে দাও|নোট|সহজ বাংলায় করে দাও/gi, '')
    .trim() || `${classId} ${subjectId} পাঠ্যক্রম নোট`;

  const prompt = `আপনি একজন অভিজ্ঞ শিক্ষক।
শ্রেণি: ${classId}, বিষয়: ${subjectId}, বিষয়বস্তু/কমান্ড: "${trimmed}"।
অনুগ্রহ করে শিক্ষার্থীদের জন্য একটি আকর্ষণীয়, প্রাঞ্জল ও সমৃদ্ধ স্টাডি রিভিশন নোট তৈরি করুন।
এতে অন্তর্ভুক্ত রাখুন:
১. সহজ ভাষায় মূল বিষয়ের ব্যাখ্যা
২. ৩টি গুরুত্বপূর্ণ শিখনফল পয়েন্ট
৩. পরীক্ষার জন্য জরুরি রিভিশন সামারি`;

  try {
    const aiExplanation = await chatWithAiTeacher(prompt, { classId, subjectId });

    const newNote: ManagedNote = {
      id: `note-cmd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      classId,
      subjectId,
      chapterId: 'ch-general',
      title: topic.startsWith('পাঠ:') ? topic : `পাঠ: ${topic}`,
      explanation: aiExplanation,
      keyPoints: [
        'মৌলিক শর্ত ও বৈজ্ঞানিক বা তাত্ত্বিক ভিত্তি স্পষ্ট রাখা প্রয়োজন।',
        'বোর্ড পরীক্ষার সৃজনশীল ও বহুনির্বাচনী প্রশ্নের জন্য উদাহরণ চর্চা জরুরি।',
        'অধ্যায়ের সূত্র ও নিয়মসমূহ নিয়মিত খাতায় নোট করে রিভিশন দিন।',
      ],
      quickNotes: 'ধারাবাহিক অনুশীলনের মাধ্যমে ধারণা আয়ত্তে রাখা সম্ভব।',
      status: 'draft',
    };

    return {
      id: draftId,
      command: trimmed,
      timestamp,
      intent: {
        actionType: 'lesson',
        targetClass: classId,
        targetSubject: subjectId,
        topic,
        quantity: 1,
        description: `${classId} শ্রেণির ${subjectId} বিষয়ে "${newNote.title}" স্টাডি নোট ড্রাফট প্রস্তুত।`,
        rawCommand: trimmed,
      },
      summary: `১টি স্টাডি নোট ড্রাফট প্রস্তুত হয়েছে। প্রকাশের আগে প্রিভিউ দেখে নিন।`,
      status: 'draft_ready',
      payload: {
        note: newNote,
      },
    };
  } catch (err: any) {
    return {
      id: draftId,
      command: trimmed,
      timestamp,
      intent: {
        actionType: 'general',
        targetClass: classId,
        targetSubject: subjectId,
        topic,
        quantity: 1,
        description: 'কমান্ড প্রক্রিয়া সম্পন্ন করা যায়নি।',
        rawCommand: trimmed,
      },
      summary: 'কমান্ড প্রসেসিং ব্যর্থ হয়েছে।',
      status: 'failed',
      errorMessage: err?.message || 'সার্ভার থেকে উত্তর পাওয়া যায়নি। পুনরায় চেষ্টা করুন।',
      payload: {},
    };
  }
}
