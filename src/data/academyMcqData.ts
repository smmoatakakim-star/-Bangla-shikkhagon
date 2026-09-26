import { QuizQuestion } from '../types';
import { allNctbMcqList } from './mcq';
import { class9McqList } from './mcq/class9Mcq';
import { class10McqList } from './mcq/class10Mcq';
import { SSC_QUIZZES } from './curriculum/sscLessonsQuizzes';
import { HSC_QUIZZES } from './curriculum/hscLessonsQuizzes';

/**
 * Filter and sanitize quiz questions so no placeholder distractor exists,
 * restoring full un-truncated text and balancing correct answers across options.
 */
function sanitizeQuestion(q: QuizQuestion): QuizQuestion {
  const dummyPatterns = [
    'ভুল উত্তর',
    'অপ্রাসঙ্গিক',
    'তত্ত্ববহির্ভূত',
    'আংশিক অসত্য',
    'ব্যক্তিগত মতামত',
    'কাল্পনিক',
    'প্রচলিত লোককথা',
    'মুখস্থ করে',
    'অযৌক্তিক',
    'কোনো ব্যবহারিক',
    'খাতা ভরানো',
    'আন্দাজে',
    'বহির্ভূত',
    'ভিত্তি নেই',
    'সীমিত কিছু ক্ষেত্রে',
    'পৃষ্ঠাসংখ্যা বাড়ানো',
    'বিভ্রান্তিতে ফেলা',
    'জটিলতা তৈরি করা',
    'পর্যাপ্ত তথ্য বিশ্লেষণ',
    'তাত্ত্বিক পর্যবেক্ষণ',
    'পরীক্ষামূলক প্রমাণ',
  ];

  const hasPlaceholder = q.options?.some(
    (opt) => opt.endsWith('...') || dummyPatterns.some((p) => opt.includes(p))
  );

  // If already clean and has 4 options with valid balanced answer index, preserve it
  if (
    !hasPlaceholder &&
    q.options &&
    q.options.length === 4 &&
    typeof q.correctAnswerIndex === 'number' &&
    q.correctAnswerIndex >= 0 &&
    q.correctAnswerIndex < 4
  ) {
    return q;
  }

  // Restore un-truncated correct answer text if available in explanation
  let correctText =
    q.options[q.correctAnswerIndex] || q.options[0] || 'সঠিক উত্তর';
  if (correctText.endsWith('...') && q.explanation && q.explanation.includes('সঠিক উত্তর:')) {
    const extracted = q.explanation
      .split('সঠিক উত্তর:')[1]
      .trim()
      .replace(/[।.]+$/, '')
      .trim();
    if (extracted.length > 3) {
      correctText = extracted;
    }
  }

  // Smart subject-specific alternative distractors
  const genericAlts: Record<string, string[]> = {
    physics: [
      'বল ও ভরবেগের সংরক্ষণশীলতা নীতি',
      'অভিকর্ষজ ত্বরণ ও মুক্ত পতন',
      'তড়িৎ ক্ষেত্র ও বিভব পার্থক্য',
      'আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলন',
    ],
    chemistry: [
      'অরবিটাল সংকরায়ণ ও সমযোজী বন্ধন',
      'ইলেকট্রন আসক্তি ও পর্যায়বৃত্ত ধর্ম',
      'লা-শাতেলিয়ারের সাম্যাবস্থা নীতি',
      'জারণ-বিজারণ ও ইলেকট্রন স্থানান্তর',
    ],
    biology: [
      'মাইটোকন্ড্রিয়া ও এটিপি সংশ্লেষণ',
      'ডিএনএ প্রতিলিপন ও প্রোটিন তৈরি',
      'মায়োসিস বিভাজনে ক্রসিং ওভার',
      'জাইলেম ও ফ্লোয়েমের পরিবহন ব্যবস্থা',
    ],
    math: [
      'দ্বিপদী বিস্তৃতি ও সাধারণ পদ',
      'পিথাগোরাসের জ্যামিতিক উপপাদ্য',
      'স্থানাঙ্ক জ্যামিতির সরলরেখার ঢাল',
      'ত্রিকোণমিতিক অভেদাবলী ও মান',
    ],
    higher_math: [
      'ম্যাট্রিক্সের গুণন ও বিপরীত ম্যাট্রিক্স',
      'অন্তরীকরণ ও পরিবর্তনের হার',
      'সমাকলন ও আবদ্ধ ক্ষেত্রফল',
      'সমতলীয় ভেক্টরের ডট ও ক্রস গুণন',
    ],
    bangla: [
      'রবীন্দ্রনাথ ঠাকুরের মানবতাবাদী দর্শন',
      'কাজী নজরুল ইসলামের সাম্যবাদী চেতনা',
      'তৎপুরুষ ও বহুব্রীহি সমাস',
      'সাধু ও চলিত ভাষারীতির ব্যাকরণ',
    ],
    english: [
      'Subject-Verb Agreement Rules',
      'Past Perfect Tense Application',
      'Appropriate Prepositions',
      'Active to Passive Voice Transformation',
    ],
    ict: [
      'বাইনারি ও হেক্সাডেসিমেল রূপান্তর',
      'মৌলিক ও সার্বজনীন লজিক গেট',
      'HTML ও CSS দিয়ে ওয়েব কাঠামো',
      'IPv4 ও IPv6 আইপি এড্রেসিং',
    ],
    bgs: [
      '১৯৫২ সালের মহান ভাষা আন্দোলন',
      '১৯৭১ সালের মুক্তিযুদ্ধ ও সংবিধান',
      'আইনের শাসন ও মৌলিক অধিকার',
      'জাতিসংঘ ও আন্তর্জাতিক সহযোগিতা',
    ],
    accounting: [
      'দুতরফা দাখিলার স্বর্ণসূত্র',
      'রেওয়ামিলের ডেবিট ও ক্রেডিট সমতা',
      'আর্থিক অবস্থার বিবরণী ও নিট লাভ',
      'স্থায়ী সম্পদের অবচয় নির্ণয়',
    ],
    finance: [
      'অর্থের বর্তমান মূল্য ও বাট্টাকরণ',
      'বাণিজ্যিক ব্যাংকের ঋণ আমানত',
      'ঝুঁকি ও প্রত্যাশিত আয়ের হার',
      'মূলধনি বাজেট প্রণয়ন পদ্ধতি',
    ],
    economics: [
      'চাহিদা ও যোগানের ভারসাম্য দাম',
      'উৎপাদন সম্ভাবনা রেখা (PPC)',
      'জাতীয় আয় পরিমাপের পদ্ধতি',
      'মুদ্রাস্ফীতি নিয়ন্ত্রণ ও রাজস্ব নীতি',
    ],
    civics: [
      'গণতান্ত্রিক রাষ্ট্রব্যবস্থা ও নাগরিক অধিকার',
      'আইনের শাসন ও ন্যায়বিচার প্রতিষ্ঠা',
      'সুশাসন প্রতিষ্ঠার মৌলিক উপাদান',
      'স্থানীয় সরকার কাঠামোর স্তর',
    ],
  };

  const subjectKey = (q.subjectId || 'physics')
    .toLowerCase()
    .replace(/_1st|_2nd/g, '');
  const pool = genericAlts[subjectKey] || genericAlts.physics;
  const filteredPool = pool.filter((p) => p !== correctText);

  // Collect valid existing options
  const validDistractors = (q.options || []).filter(
    (opt, idx) =>
      idx !== q.correctAnswerIndex &&
      opt !== correctText &&
      !opt.endsWith('...') &&
      !dummyPatterns.some((p) => opt.includes(p))
  );

  while (validDistractors.length < 3) {
    const candidate = filteredPool[validDistractors.length % filteredPool.length];
    if (!validDistractors.includes(candidate) && candidate !== correctText) {
      validDistractors.push(candidate);
    } else {
      validDistractors.push(
        filteredPool[0] || 'যথাযথ তাত্ত্বিক পর্যবেক্ষণ ও প্রমাণ'
      );
    }
  }

  // Deterministically place correct answer across 0, 1, 2, 3
  const hash = Math.abs(
    q.id
      .split('')
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  );
  const targetIndex = hash % 4;

  const finalOptions: string[] = [];
  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === targetIndex) {
      finalOptions.push(correctText);
    } else {
      finalOptions.push(validDistractors[dIdx++]);
    }
  }

  return {
    ...q,
    options: finalOptions,
    correctAnswerIndex: targetIndex,
    explanation:
      q.explanation ||
      `সঠিক উত্তর: ${correctText}। পাঠ্যবইয়ের সংশ্লিষ্ট নিয়মানুযায়ী এটি সঠিক।`,
  };
}

// Extracted and sanitized SSC questions from quizzes
const sscQuizQuestions: QuizQuestion[] = SSC_QUIZZES.flatMap((qz) =>
  qz.questions.map((q) =>
    sanitizeQuestion({
      ...q,
      classId: 'ssc',
      subjectId: q.subjectId || qz.subjectId,
      chapterId: q.chapterId || qz.chapterId,
    })
  )
);

// Extracted and sanitized HSC questions from quizzes
const hscQuizQuestions: QuizQuestion[] = HSC_QUIZZES.flatMap((qz) =>
  qz.questions.map((q) =>
    sanitizeQuestion({
      ...q,
      classId: 'hsc',
      subjectId: q.subjectId || qz.subjectId,
      chapterId: q.chapterId || qz.chapterId,
    })
  )
);

// Additional high-yield board standard MCQs for SSC
const sscCuratedMCQs: QuizQuestion[] = [
  {
    id: 'ssc-mcq-phy-01',
    classId: 'ssc',
    subjectId: 'physics',
    chapterId: 'ssc-physics-ch1',
    topic: 'ভৌত রাশি ও পরিমাপ',
    question: 'আন্তর্জাতিক পদ্ধতিতে (SI) মৌলিক রাশির সংখ্যা কয়টি?',
    options: ['৫টি', '৬টি', '৭টি', '৯টি'],
    correctAnswerIndex: 2,
    explanation: 'আন্তর্জাতিক পদ্ধতিতে (SI) মৌলিক রাশি হলো ৭টি: দৈর্ঘ্য, ভর, সময়, তাপমাত্রা, তড়িৎ প্রবাহ, দীপন তীব্রতা ও পদার্থের পরিমাণ।',
    difficulty: 'easy',
    source: 'ঢাকা বোর্ড',
  },
  {
    id: 'ssc-mcq-phy-02',
    classId: 'ssc',
    subjectId: 'physics',
    chapterId: 'ssc-physics-ch2',
    topic: 'গতি',
    question: 'স্থির অবস্থান থেকে সুষম ত্বরণে চলমান বস্তুর অতিক্রান্ত দূরত্ব (s) এবং সময়ের (t) সম্পর্ক কোনটি?',
    options: ['s ∝ t', 's ∝ t²', 's ∝ √t', 's ∝ 1/t'],
    correctAnswerIndex: 1,
    explanation: 'গতিসূত্র s = ut + 1/2 at² অনুযায়ী স্থির অবস্থানে (u=0) সুষম ত্বরণে দূরত্ব সময়ের বর্গের সমানুপাতিক (s ∝ t²)।',
    difficulty: 'medium',
    source: 'রাজশাহী বোর্ড',
  },
  {
    id: 'ssc-mcq-chem-01',
    classId: 'ssc',
    subjectId: 'chemistry',
    chapterId: 'ssc-chemistry-ch3',
    topic: 'পদার্থের গঠন',
    question: 'সোডিয়াম (Na) পরমাণুর ইলেকট্রন বিন্যাস কোনটি?',
    options: ['২, ৮, ১', '২, ৭, ২', '২, ৮, ২', '২, ৮'],
    correctAnswerIndex: 0,
    explanation: 'সোডিয়ামের পারমাণবিক সংখ্যা ১১। এর ইলেকট্রন বিন্যাস হলো ২, ৮, ১।',
    difficulty: 'easy',
    source: 'যশোর বোর্ড',
  },
  {
    id: 'ssc-mcq-chem-02',
    classId: 'ssc',
    subjectId: 'chemistry',
    chapterId: 'ssc-chemistry-ch4',
    topic: 'পর্যায় সারণি',
    question: 'পর্যায় সারণির গ্রুপ-১ এর মৌলগুলোকে কী বলা হয়?',
    options: ['মৃৎক্ষার ধাতু', 'ক্ষার ধাতু', 'হ্যালোজেন', 'নিষ্ক্রিয় গ্যাস'],
    correctAnswerIndex: 1,
    explanation: 'গ্রুপ-১ এর মৌলগুলো (Li, Na, K, Rb, Cs, Fr) পানির সাথে বিক্রিয়া করে তীব্র ক্ষার তৈরি করে, তাই এদের ক্ষার ধাতু বলে।',
    difficulty: 'easy',
    source: 'চট্টগ্রাম বোর্ড',
  },
  {
    id: 'ssc-mcq-math-01',
    classId: 'ssc',
    subjectId: 'math',
    chapterId: 'ssc-math-ch3',
    topic: 'বীজগাণিতিক রাশি',
    question: 'a + b = 5 এবং a - b = 3 হলে, ab এর মান কত?',
    options: ['২', '৪', '৫', '৮'],
    correctAnswerIndex: 1,
    explanation: 'ab = {(a+b)/2}² - {(a-b)/2}² = (5/2)² - (3/2)² = 25/4 - 9/4 = 16/4 = 4।',
    difficulty: 'medium',
    source: 'কুমিল্লা বোর্ড',
  },
  {
    id: 'ssc-mcq-math-02',
    classId: 'ssc',
    subjectId: 'math',
    chapterId: 'ssc-math-ch9',
    topic: 'ত্রিকোণমিতিক অনুপাত',
    question: 'sin² 45° + cos² 45° এর মান কত?',
    options: ['০', '১/২', '১', '√২'],
    correctAnswerIndex: 2,
    explanation: 'যেকোনো কোণ θ এর জন্য sin² θ + cos² θ = ১। অতএব sin² 45° + cos² 45° = ১।',
    difficulty: 'easy',
    source: 'দিনাজপুর বোর্ড',
  },
  {
    id: 'ssc-mcq-bio-01',
    classId: 'ssc',
    subjectId: 'biology',
    chapterId: 'ssc-biology-ch2',
    topic: 'জীবকোষ ও টিস্যু',
    question: 'উদ্ভিদকোষের কোন অঙ্গাণুটিকে কোষের শক্তিঘর (Power House) বলা হয়?',
    options: ['রাইবোসোম', 'লাইসোজোম', 'মাইটোকন্ড্রিয়া', 'গলগি বস্তু'],
    correctAnswerIndex: 2,
    explanation: 'মাইটোকন্ড্রিয়া কোষে শক্তি (ATP) উৎপাদন করে, তাই একে কোষের শক্তিঘর বলা হয়।',
    difficulty: 'easy',
    source: 'বরিশাল বোর্ড',
  },
  {
    id: 'ssc-mcq-ict-01',
    classId: 'ssc',
    subjectId: 'ict',
    chapterId: 'ssc-ict-ch2',
    topic: 'কম্পিউটার ও তথ্য নিরাপত্তা',
    question: 'কম্পিউটার ভাইরাস কী ধরনের প্রোগ্রাম?',
    options: ['ক্ষতিকর প্রোগ্রাম', 'অ্যান্টিভাইরাস', 'অপারেটিং সিস্টেম', 'হার্ডওয়্যার কন্ট্রোলার'],
    correctAnswerIndex: 0,
    explanation: 'কম্পিউটার ভাইরাস হলো ক্ষতিকারক প্রোগ্রাম কোড যা কম্পিউটার সিস্টেম ও তথ্যের ক্ষতি করে।',
    difficulty: 'easy',
    source: 'সিলেট বোর্ড',
  },
  {
    id: 'ssc-mcq-acc-01',
    classId: 'ssc',
    subjectId: 'accounting',
    chapterId: 'ssc-accounting-ch2',
    topic: 'লেনদেন',
    question: 'হিসাব সমীকরণ A = L + E-তে ‘E’ দ্বারা কী বোঝায়?',
    options: ['সম্পদ (Assets)', 'দায় (Liabilities)', 'মালিকানাস্বত্ব (Equity)', 'ব্যয় (Expense)'],
    correctAnswerIndex: 2,
    explanation: 'মৌলিক হিসাব সমীকরণ হলো: Assets (A) = Liabilities (L) + Owner’s Equity (E)।',
    difficulty: 'easy',
    source: 'ঢাকা বোর্ড',
  },
  {
    id: 'ssc-mcq-fin-01',
    classId: 'ssc',
    subjectId: 'finance',
    chapterId: 'ssc-finance-ch3',
    topic: 'অর্থের সময়মূল্য',
    question: 'ভবিষ্যত মূল্য নির্ধারণে নিচের কোন প্রক্রিয়াটি ব্যবহার করা হয়?',
    options: ['বাট্টাকরণ', 'চক্রবৃদ্ধিকরণ', 'মূল্যায়ন', 'বিনিয়োগ'],
    correctAnswerIndex: 1,
    explanation: 'বর্তমান মূল্যের ওপর সুদের হার প্রয়োগ করে ভবিষ্যত মূল্য বের করার পদ্ধতি হলো চক্রবৃদ্ধিকরণ (Compounding)।',
    difficulty: 'easy',
    source: 'চট্টগ্রাম বোর্ড',
  },
];

// Additional high-yield board standard MCQs for HSC
const hscCuratedMCQs: QuizQuestion[] = [
  {
    id: 'hsc-mcq-phy1-01',
    classId: 'hsc',
    subjectId: 'physics_1st',
    chapterId: 'hsc-physics_1st-ch2',
    topic: 'ভেক্টর',
    question: 'দুটি সমান ভেক্টর P ও P এর মধ্যবর্তী কোণ কত হলে লব্ধির মান P হবে?',
    options: ['৬০°', '৯০°', '১২০°', '১৮০°'],
    correctAnswerIndex: 2,
    explanation: 'R² = P² + P² + 2P² cos θ; P² = 2P² (1 + cos θ) => cos θ = -1/2 => θ = ১২০°।',
    difficulty: 'medium',
    paper: '১ম পত্র',
    source: 'ঢাকা বোর্ড',
  },
  {
    id: 'hsc-mcq-phy1-02',
    classId: 'hsc',
    subjectId: 'physics_1st',
    chapterId: 'hsc-physics_1st-ch4',
    topic: 'নিউটনীয় বলবিদ্যা',
    question: 'কৌণিক ভরবেগের মাত্রা সমীকরণ কোনটি?',
    options: ['[MLT⁻¹]', '[ML²T⁻¹]', '[ML²T⁻²]', '[MLT⁻²]'],
    correctAnswerIndex: 1,
    explanation: 'কৌণিক ভরবেগ L = mvr = M × (LT⁻¹) × L = [ML²T⁻¹]।',
    difficulty: 'medium',
    paper: '১ম পত্র',
    source: 'রাজশাহী বোর্ড',
  },
  {
    id: 'hsc-mcq-phy2-01',
    classId: 'hsc',
    subjectId: 'physics_2nd',
    chapterId: 'hsc-physics_2nd-ch1',
    topic: 'তাপগতিবিদ্যা',
    question: 'রূদ্ধতাপীয় প্রক্রিয়ায় নিচের কোনটি স্থির থাকে?',
    options: ['তাপমাত্রা', 'চাপ', 'আয়তন', 'এন্ট্রপি'],
    correctAnswerIndex: 3,
    explanation: 'রূদ্ধতাপীয় প্রক্রিয়ায় dQ = 0, ফলে dS = dQ / T = 0; অর্থাৎ এন্ট্রপি স্থির থাকে।',
    difficulty: 'medium',
    paper: '২য় পত্র',
    source: 'যশোর বোর্ড',
  },
  {
    id: 'hsc-mcq-chem1-01',
    classId: 'hsc',
    subjectId: 'chemistry_1st',
    chapterId: 'hsc-chemistry_1st-ch2',
    topic: 'গুণগত রসায়ন',
    question: 'হাইড্রোজেন পরমাণুর বামার সিরিজের বর্ণালি কোন অঞ্চলে দেখা যায়?',
    options: ['অতিবেগুনি অঞ্চল', 'দৃশ্যমান অঞ্চল', 'অবলোহিত অঞ্চল', 'মাইক্রোওয়েভ অঞ্চল'],
    correctAnswerIndex: 1,
    explanation: 'বামার সিরিজ (n₁ = 2) দৃশ্যমান বর্ণালি অঞ্চলে (Visible Region) আলো বিকিরণ করে।',
    difficulty: 'easy',
    paper: '১ম পত্র',
    source: 'দিনাজপুর বোর্ড',
  },
  {
    id: 'hsc-mcq-chem2-01',
    classId: 'hsc',
    subjectId: 'chemistry_2nd',
    chapterId: 'hsc-chemistry_2nd-ch2',
    topic: 'জৈব রসায়ন',
    question: 'বেনজিনে কয়টি সিগমা (σ) ও পাই (π) বন্ধন রয়েছে?',
    options: ['৬টি σ ও ৩টি π', '১২টি σ ও ৩টি π', '৯টি σ ও ৩টি π', '৬টি σ ও ৬টি π'],
    correctAnswerIndex: 1,
    explanation: 'বেনজিন (C₆H₆) বলয়ে ৬টি C-C ও ৬টি C-H সিগমা বন্ধন = মোট ১২টি σ বন্ধন, এবং ৩টি দ্বিবন্ধনে ৩টি π বন্ধন রয়েছে।',
    difficulty: 'medium',
    paper: '২য় পত্র',
    source: 'কুমিল্লা বোর্ড',
  },
  {
    id: 'hsc-mcq-hm1-01',
    classId: 'hsc',
    subjectId: 'higher_math_1st',
    chapterId: 'hsc-higher_math_1st-ch1',
    topic: 'ম্যাট্রিক্স ও নির্ণায়ক',
    question: 'একটি বর্গ ম্যাট্রিক্স A এর নির্ণায়কের মান |A| = 0 হলে ম্যাট্রিক্সটিকে কী বলে?',
    options: ['অভিমুখী ম্যাট্রিক্স', 'ব্যতিক্রমী (Singular) ম্যাট্রিক্স', 'অব্যতিক্রমী ম্যাট্রিক্স', 'কর্ণ ম্যাট্রিক্স'],
    correctAnswerIndex: 1,
    explanation: 'যে বর্গ ম্যাট্রিক্সের নির্ণায়কের মান শূন্য তাকে ব্যতিক্রমী বা Singular ম্যাট্রিক্স বলে এবং এর বিপরীত ম্যাট্রিক্স নির্ণয় করা যায় না।',
    difficulty: 'easy',
    paper: '১ম পত্র',
    source: 'চট্টগ্রাম বোর্ড',
  },
  {
    id: 'hsc-mcq-bio1-01',
    classId: 'hsc',
    subjectId: 'biology_1st',
    chapterId: 'hsc-biology_1st-ch1',
    topic: 'কোষ ও এর গঠন',
    question: 'প্রোটিন তৈরির কারখানা বলা হয় কোন সাইটোপ্লাজমীয় অঙ্গাণুকে?',
    options: ['মাইটোকন্ড্রিয়া', 'গলগি বস্তু', 'লাইসোজোম', 'রাইবোসোম'],
    correctAnswerIndex: 3,
    explanation: 'রাইবোসোম ট্রান্সলেশন প্রক্রিয়ায় পলিপেপটাইড বা প্রোটিন সংশ্লেষণ করে, তাই একে প্রোটিন কারখানা বলে।',
    difficulty: 'easy',
    paper: '১ম পত্র',
    source: 'ঢাকা বোর্ড',
  },
  {
    id: 'hsc-mcq-ict-01',
    classId: 'hsc',
    subjectId: 'ict',
    chapterId: 'hsc-ict-ch3',
    topic: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
    question: 'হেক্সাডেসিমেল পদ্ধতিতে ‘B’ এর দশমিক মান কত?',
    options: ['১০', '১১', '১২', '১৩'],
    correctAnswerIndex: 1,
    explanation: 'হেক্সাডেসিমেলে A = 10, B = 11, C = 12, D = 13, E = 14, F = 15।',
    difficulty: 'easy',
    source: 'বরিশাল বোর্ড',
  },
];

/**
 * Get all SSC MCQs combining Class 9, 10, and SSC quizzes
 */
export function getAllSscMcqs(): QuizQuestion[] {
  return [
    ...class9McqList.map((q) => ({ ...q, classId: 'ssc' as any })),
    ...class10McqList.map((q) => ({ ...q, classId: 'ssc' as any })),
    ...sscQuizQuestions,
    ...sscCuratedMCQs,
  ];
}

/**
 * Get all HSC MCQs
 */
export function getAllHscMcqs(): QuizQuestion[] {
  return [...hscQuizQuestions, ...hscCuratedMCQs];
}

/**
 * Filter MCQs for a subject and optionally a chapter
 */
export function getFilteredAcademyMcqs(
  classLevel: 'ssc' | 'hsc',
  subjectId?: string,
  chapterId?: string,
  paperFilter?: string
): QuizQuestion[] {
  const allList = classLevel === 'ssc' ? getAllSscMcqs() : getAllHscMcqs();

  return allList.filter((q) => {
    // Subject filter
    if (subjectId) {
      const qSub = (q.subjectId || '').toLowerCase();
      const targetSub = subjectId.toLowerCase();
      // Handle mapping between unified and paper-split IDs
      const matchesSub =
        qSub === targetSub ||
        qSub.startsWith(targetSub) ||
        targetSub.startsWith(qSub) ||
        (targetSub.includes('physics') && qSub.includes('physics')) ||
        (targetSub.includes('chemistry') && qSub.includes('chemistry')) ||
        (targetSub.includes('biology') && qSub.includes('biology')) ||
        (targetSub.includes('higher_math') && qSub.includes('higher_math')) ||
        (targetSub.includes('math') && qSub.includes('math')) ||
        (targetSub.includes('bangla') && qSub.includes('bangla')) ||
        (targetSub.includes('english') && qSub.includes('english')) ||
        (targetSub.includes('ict') && qSub.includes('ict')) ||
        (targetSub.includes('accounting') && qSub.includes('accounting')) ||
        (targetSub.includes('finance') && qSub.includes('finance')) ||
        (targetSub.includes('economics') && qSub.includes('economics')) ||
        (targetSub.includes('civics') && qSub.includes('civics'));

      if (!matchesSub) return false;
    }

    // Paper filter
    if (paperFilter && paperFilter !== 'all') {
      if (q.paper && !q.paper.includes(paperFilter)) {
        return false;
      }
    }

    // Chapter filter
    if (chapterId && chapterId !== 'all') {
      if (q.chapterId !== chapterId) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Return all platform MCQs consolidated across NCTB (6-10), SSC, and HSC
 */
export function getAllPlatformMcqs(): QuizQuestion[] {
  const map = new Map<string, QuizQuestion>();
  allNctbMcqList.forEach((q) => map.set(q.id, q));
  getAllSscMcqs().forEach((q) => map.set(q.id, q));
  getAllHscMcqs().forEach((q) => map.set(q.id, q));
  return Array.from(map.values());
}

/**
 * Total count of authentic MCQs across all classes, SSC and HSC
 */
export function getTotalPlatformMcqCount(): number {
  return getAllPlatformMcqs().length;
}

/**
 * Return MCQs for a given classId (handling class-6..10, ssc, hsc)
 */
export function getPlatformMcqsByClass(classId: string): QuizQuestion[] {
  if (classId === 'ssc') {
    return getAllSscMcqs();
  }
  if (classId === 'hsc') {
    return getAllHscMcqs();
  }
  return allNctbMcqList.filter((q) => q.classId === classId);
}

