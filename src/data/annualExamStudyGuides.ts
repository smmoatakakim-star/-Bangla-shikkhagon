/**
 * Annual Examination Complete Study Guides & Preparation Materials
 * Covers: Mathematics, English, Science, BGS, ICT, Religion, Business Studies & Humanities.
 * Classes: Class 6, 7, 8, 9, 10 (SSC), 11-12 (HSC).
 * Grounded in NCTB official textbooks (nctb.gov.bd) and previous board examinations.
 */

export interface MathWorkedExample {
  id: string;
  topic: string;
  problem: string;
  stepByStepSolution: string[];
  finalAnswer: string;
  importantFormula?: string;
  examTip: string;
}

export interface EnglishGrammarExercise {
  id: string;
  topic: string;
  rulesSummary: string;
  exerciseQuestions: {
    question: string;
    answer: string;
    explanation: string;
  }[];
}

export interface SubjectAnnualGuide {
  id: string;
  classId: 'class-6' | 'class-7' | 'class-8' | 'class-9' | 'class-10' | 'ssc' | 'hsc';
  className: string;
  subjectId: string;
  subjectName: string;
  group?: 'general' | 'science' | 'humanities' | 'business';
  groupLabel?: string;
  exam: string;
  academicYear: string;
  syllabusSource: {
    nctbUrl: string;
    organization: string;
    verificationStatus: 'verified' | 'school_custom' | 'pending_document';
    statusNote: string;
  };
  revisionSummary: string;
  keyTopics: string[];
  workedMathExamples?: MathWorkedExample[];
  englishGrammarExercises?: EnglishGrammarExercise[];
  coreExamQuestions: {
    question: string;
    answer: string;
    mark: number;
    type: 'জ্ঞানমূলক' | 'অনুধাবনমূলক' | 'প্রয়োগ/উচ্চতর দক্ষতা' | 'গাণিতিক সমস্যা';
    sourceTag: 'verified_board' | 'nctb_textbook' | 'practice_model';
  }[];
  modelTestMCQs: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const ANNUAL_EXAM_STUDY_GUIDES: SubjectAnnualGuide[] = [
  // ----------------------------------------------------
  // ১. গণিত (Mathematics - SSC / Class 9-10)
  // ----------------------------------------------------
  {
    id: 'guide-math-ssc-2026',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    subjectId: 'math',
    subjectName: 'সাধারণ গণিত (Mathematics)',
    group: 'general',
    groupLabel: 'সকল বিভাগ',
    exam: 'SSC ২০২৬ ও বার্ষিক পরীক্ষা',
    academicYear: '২০২৬',
    syllabusSource: {
      nctbUrl: 'https://nctb.gov.bd/site/view/syllabus/ssc-math-2026',
      organization: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      verificationStatus: 'verified',
      statusNote: 'এনসিটিবি অনুমোদিত মূল পাঠ্যবই ও বার্ষিক মূল্যায়ন কাঠামো অনুযায়ী যাচাইকৃত।',
    },
    revisionSummary:
      'এসএসসি ও বার্ষিক পরীক্ষায় গণিত বিষয়ের চারটি বিভাগ থাকে: ক-বিভাগ (বীজগণিত), খ-বিভাগ (জ্যামিতি), গ-বিভাগ (ত্রিকোণমিতি ও পরিমিতি), এবং ঘ-বিভাগ (পরিসংখ্যান)। প্রতিটি বিভাগে সূত্র আত্মস্থ করা এবং ধাপ অনুযায়ী গণনা নির্ভুল রাখা অত্যন্ত গুরুত্বপূর্ণ।',
    keyTopics: [
      'বীজগাণিতিক রাশি (অধ্যায় ৩)',
      'সূচক ও লগারিদম (অধ্যায় ৪)',
      'বাস্তব সংখ্যা ও সেট-ফাংশন (অধ্যায় ১ ও ২)',
      'বৃত্ত ও ব্যবহারিক জ্যামিতি (অধ্যায় ৭ ও ৮)',
      'ত্রিকোণমিতিক অনুপাত ও দূরত্ব (অধ্যায় ৯ ও ১০)',
      'পরিমিতি (অধ্যায় ১৬)',
      'পরিসংখ্যান (অধ্যায় ১৭)',
    ],
    workedMathExamples: [
      {
        id: 'math-ex-1',
        topic: 'বীজগাণিতিক রাশি (বর্গের সূত্র ও মান নির্ণয়)',
        problem: 'যদি x + 1/x = 4 হয়, তবে প্রমাণ করো যে, x^4 + 1/x^4 = 194।',
        stepByStepSolution: [
          'ধাপ ১: দেওয়া আছে, x + 1/x = 4। উভয় পক্ষকে বর্গ করে পাই: (x + 1/x)² = 4²',
          'ধাপ ২: x² + 2·x·(1/x) + 1/x² = 16 => x² + 2 + 1/x² = 16 => x² + 1/x² = 14',
          'ধাপ ৩: পুনরায় উভয় পক্ষকে বর্গ করে পাই: (x² + 1/x²)² = 14²',
          'ধাপ ৪: (x²)² + 2·x²·(1/x²) + (1/x²)² = 196 => x^4 + 2 + 1/x^4 = 196',
          'ধাপ ৫: x^4 + 1/x^4 = 196 - 2 = 194 (প্রমাণিত)।',
        ],
        finalAnswer: 'x^4 + 1/x^4 = 194 (প্রমাণিত)',
        importantFormula: '(a + b)² = a² + 2ab + b² এবং a² + b² = (a + b)² - 2ab',
        examTip: 'প্রতিটি ধাপে পার্শ্বনোট ও ‘উভয় পক্ষকে বর্গ করে’ উল্লেখ করলে পূর্ণ নম্বর পাওয়া নিশ্চিত হয়।',
      },
      {
        id: 'math-ex-2',
        topic: 'ত্রিকোণমিতি ও উচ্চতা-দূরত্ব (অধ্যায় ১০)',
        problem: 'একটি টাওয়ারের পাদদেশ থেকে ৭৫ মিটার দূরে ভূতলস্থ কোনো বিন্দুতে টাওয়ারের চূড়ার উন্নতি কোণ ৩০° হলে, টাওয়ারটির উচ্চতা নির্ণয় করো।',
        stepByStepSolution: [
          'ধাপ ১: মনে করি, টাওয়ারের উচ্চতা AB = h মিটার এবং পাদদেশ থেকে বিন্দুর দূরত্ব BC = ৭৫ মিটার।',
          'ধাপ ২: বিন্দু C-তে উন্নতি কোণ ∠ACB = 30°।',
          'ধাপ ৩: সমকোণী ত্রিভুজ ABC হতে পাই: tan ∠ACB = লম্ব/ভূমি = AB / BC',
          'ধাপ ৪: tan 30° = h / 75 => 1/√3 = h / 75',
          'ধাপ ৫: h = 75 / √3 = (75·√3) / 3 = 25√3 ≈ 43.301 মিটার।',
        ],
        finalAnswer: 'টাওয়ারটির উচ্চতা প্রায় ৪৩.৩০১ মিটার।',
        importantFormula: 'tan θ = লম্ব ÷ ভূমি এবং tan 30° = 1/√3',
        examTip: 'জ্যামিতিক চিত্র অবশ্যই পেনসিল দিয়ে নির্ভুলভাবে আঁকতে হবে।',
      },
      {
        id: 'math-ex-3',
        topic: 'পরিসংখ্যান (সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয়)',
        problem: 'একটি শ্রেণির শিক্ষার্থীদের গণিতে প্রাপ্ত নম্বরের গণসংখ্যা সারণি থেকে সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয় করো। (আনুমানিক গড় a = ৬৫, মোট গণসংখ্যা N = ৫০, ∑fiui = -১২, শ্রেণি ব্যবধান h = ১০)।',
        stepByStepSolution: [
          'ধাপ ১: সংক্ষিপ্ত পদ্ধতিতে গড়ের সূত্র: x̄ = a + (∑fiui / N) × h',
          'ধাপ ২: সূত্রে মান বসিয়ে পাই: x̄ = ৬৫ + (-১২ / ৫০) × ১০',
          'ধাপ ৩: x̄ = ৬৫ - (১২০ / ৫০) = ৬৫ - ২.৪ = ৬২.৬',
        ],
        finalAnswer: 'নির্ণেয় সংক্ষিপ্ত গড় = ৬২.৬',
        importantFormula: 'x̄ = a + (∑fiui / N) × h',
        examTip: 'বিচ্যুতি সংখ্যা ui = (xi - a) / h নির্ভুলভাবে গণনাকরণ আবশ্যক।',
      },
    ],
    coreExamQuestions: [
      {
        question: 'বাস্তব সংখ্যায় অমূলদ সংখ্যা কাকে বলে? উদাহরণ দাও।',
        answer: 'যে সংখ্যাকে দুটি পূর্ণসংখ্যার ভগ্নাংশ (p/q, যেখানে q ≠ 0) আকারে প্রকাশ করা যায় না, তাকে অমূলদ সংখ্যা বলে। যেমন: √2, √3, π ইত্যাদি।',
        mark: 2,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
      },
      {
        question: 'বৃত্তের বহিঃস্থ কোনো বিন্দু থেকে বৃত্তে কয়টি স্পর্শক আঁকা যায় এবং এদের দৈর্ঘ্য কেমন হয়?',
        answer: 'বৃত্তের বহিঃস্থ কোনো বিন্দু থেকে বৃত্তে ঠিক দুটি স্পর্শক আঁকা যায় এবং বহিঃস্থ বিন্দু থেকে স্পর্শবিন্দুদ্বয়ের দূরত্ব সমান (উপপাদ্য ২৯)।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
      },
      {
        question: 'একটি ঘনকের ধার ৪ মিটার হলে এর সমগ্র তলের ক্ষেত্রফল ও কর্ণের দৈর্ঘ্য কত?',
        answer: 'সমগ্র তলের ক্ষেত্রফল = 6a² = 6 × (4)² = 96 বর্গমিটার; কর্ণের দৈর্ঘ্য = √3·a = 4√3 ≈ 6.928 মিটার।',
        mark: 4,
        type: 'গাণিতিক সমস্যা',
        sourceTag: 'verified_board',
      },
    ],
    modelTestMCQs: [
      {
        question: 'sec² θ - tan² θ এর মান কত?',
        options: ['0', '1', '-1', '2'],
        correctIndex: 1,
        explanation: 'ত্রিকোণমিতিক মৌলিক অভেদ অনুযায়ী sec² θ - tan² θ = 1।',
      },
      {
        question: 'প্রচুরক শ্রেণির সূত্র কোনটি?',
        options: [
          'L + [f1 / (f1 + f2)] × h',
          'L + [(f1 + f2) / f1] × h',
          'a + (∑fiui / N) × h',
          'L + (N/2 - Fc) × (h/fm)',
        ],
        correctIndex: 0,
        explanation: 'প্রচুরক = L + [f1 / (f1 + f2)] × h, যেখানে L প্রচুরক শ্রেণির নিম্নসীমা।',
      },
    ],
  },

  // ----------------------------------------------------
  // ২. ইংরেজি গ্রামার ও রাইটিং (English - SSC / Class 9-10)
  // ----------------------------------------------------
  {
    id: 'guide-eng-ssc-2026',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    subjectId: 'english',
    subjectName: 'English 2nd Paper (Grammar & Composition)',
    group: 'general',
    groupLabel: 'সকল বিভাগ',
    exam: 'SSC ২০২৬ ও বার্ষিক পরীক্ষা',
    academicYear: '২০২৬',
    syllabusSource: {
      nctbUrl: 'https://nctb.gov.bd/site/view/syllabus/ssc-english-2026',
      organization: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      verificationStatus: 'verified',
      statusNote: 'এনসিটিবি অনুমোদিত এসএসসি কারিকুলাম ও পরীক্ষার পূর্ণাঙ্গ সিলেবাস।',
    },
    revisionSummary:
      'ইংরেজি ২য় পত্রে ৬০ নম্বর গ্রামার এবং ৪০ নম্বর কম্পোজিশন (Writing)। গ্রামারে Right form of verbs, Completing sentences, Transformation, Tag questions, Connectors এবং Punctuation-এর সুনির্দিষ্ট নিয়ম অনুশীলন করলে ফুল মার্কস অর্জন সম্ভব।',
    keyTopics: [
      'Gap filling with clues (Prepositions & Articles)',
      'Right form of verbs',
      'Transformation of sentences (Voice, Degree, Simple/Complex/Compound)',
      'Completing sentences (Conditionals & Clauses)',
      'Suffix and Prefix',
      'Tag Questions',
      'Sentence Connectors',
      'Punctuation and Capitalization',
      'Writing: CV with Cover Letter, Formal Letter/Application, Paragraph, Composition',
    ],
    englishGrammarExercises: [
      {
        id: 'eng-ex-1',
        topic: 'Right Form of Verbs (বোর্ড স্ট্যান্ডার্ড এক্সারসাইজ)',
        rulesSummary:
          '১. As if / As though থাকলে পূর্ববর্তী অংশ Present হলে পরবর্তী অংশ Past Indefinite এবং be verb হলে \'were\' বসে। ২. If + Past Indefinite হলে অপর অংশে Subject + would/could + V1 বসে।',
        exerciseQuestions: [
          {
            question: 'He speaks as if he (know) everything.',
            answer: 'knew',
            explanation: 'As if-এর আগে Present Indefinite (speaks) থাকায় পরে Past Indefinite (knew) হবে।',
          },
          {
            question: 'If I had a camera, I (take) some photographs.',
            answer: 'would take',
            explanation: 'Second conditional গঠন অনুযায়ী If + Past Indefinite হলে Main clause-এ would + V1 বসে।',
          },
          {
            question: 'Scarcely had the teacher entered the classroom when the students (stand) up.',
            answer: 'stood',
            explanation: 'Scarcely had... when যুক্ত বাক্যে when-এর পর Past Indefinite (stood) বসে।',
          },
        ],
      },
      {
        id: 'eng-ex-2',
        topic: 'Transformation of Sentences (Voice & Complex/Compound)',
        rulesSummary:
          'Simple (In spite of/Despite) -> Complex (Though/Although) -> Compound (But). Passive voice-এ Subject Object হয় এবং উপযুক্ত auxiliary verb + V3 বসে।',
        exerciseQuestions: [
          {
            question: 'Change into Passive: Who called you?',
            answer: 'By whom were you called?',
            explanation: 'Who থাকলে By whom বসে এবং Past Indefinite-এ you-এর সাথে were বসে।',
          },
          {
            question: 'Change into Complex: In spite of his poverty, he is honest.',
            answer: 'Though he is poor, he is honest.',
            explanation: 'In spite of-এর পরিবর্তে Though/Although বসে এবং noun phrase adjective-এ রূপান্তর হয়।',
          },
        ],
      },
    ],
    coreExamQuestions: [
      {
        question: 'What are the essential parts of a Formal Job Application (Cover Letter)?',
        answer: 'Date, Inside Address (The Advertiser/Manager), Subject line, Salutation (Sir/Dear Sir), Body of the letter mentioning qualifications, Courteous closing, Signature, and an attached Curriculum Vitae (CV).',
        mark: 2,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
      },
    ],
    modelTestMCQs: [
      {
        question: 'Walk fast lest you ____ miss the train.',
        options: ['will', 'should', 'can', 'may'],
        correctIndex: 1,
        explanation: 'Lest যুক্ত বাক্যে সর্বদাই Subject-এর পর \'should\' বা \'might\' বসে।',
      },
    ],
  },

  // ----------------------------------------------------
  // ৩. বিজ্ঞান (Science - Physics, Chemistry, Biology / General Science)
  // ----------------------------------------------------
  {
    id: 'guide-sci-ssc-2026',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    subjectId: 'general_science',
    subjectName: 'সাধারণ বিজ্ঞান ও পদার্থ-রসায়ন-জীববিজ্ঞান',
    group: 'general',
    groupLabel: 'বিজ্ঞান ও সাধারণ শাখা',
    exam: 'SSC ২০২৬ ও বার্ষিক পরীক্ষা',
    academicYear: '২০২৬',
    syllabusSource: {
      nctbUrl: 'https://nctb.gov.bd/site/view/syllabus/ssc-science-2026',
      organization: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      verificationStatus: 'verified',
      statusNote: 'এনসিটিবি অনুমোদিত মূল পাঠ্যসূচি অনুযায়ী সংকলিত।',
    },
    revisionSummary:
      'বিজ্ঞান বিষয়ের সৃজনশীল প্রশ্নে ক ও খ তাত্ত্বিক এবং গ ও ঘ প্রয়োগমূলক ও বিশ্লেষণধর্মী। সমীকরণ, একক এবং চিত্র পরিষ্কারভাবে উপস্থাপন করা ভালো নম্বরের মূল চাবিকাঠি।',
    keyTopics: [
      'উন্নততর জীবনধারা (খাদ্য, পুষ্টি ও ভিটামিন)',
      'হৃদযন্ত্রের যত কথা (রক্ত সংবহন, রক্তচাপ ও হার্ট অ্যাটাক)',
      'পলিমার ও প্লাস্টিক পদার্থ',
      'অম্ল, ক্ষারক ও লবণের ব্যবহার এবং pH স্কেল',
      'আলোর প্রতিসরণ ও চোখের ত্রুটি',
      'তড়িৎ বর্তনী ও শক্তির রূপান্তর',
      'জীবকোষ, ডিএনএ (DNA) ও বংশগতি বিদ্যা',
    ],
    coreExamQuestions: [
      {
        question: 'pH স্কেল কী? নিরপেক্ষ পানির pH কত?',
        answer: 'কোনো দ্রবণে হাইড্রোজেন আয়নের (H+) ঘনমাত্রার ঋণাত্মক লগারিদমকে pH বলে। ২৫° সেলসিয়াস তাপমাত্রায় বিশুদ্ধ নিরপেক্ষ পানির pH হলো ৭।',
        mark: 2,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
      },
      {
        question: 'চোখের মায়োপিয়া বা হ্রস্বদৃষ্টি ত্রুটি কী এবং এটি কীভাবে দূর করা যায়?',
        answer: 'যখন চোখ কাছের বস্তু স্পষ্ট দেখে কিন্তু দূরের বস্তু অস্পষ্ট দেখে, তখন তাকে মায়োপিয়া বলে। উপযুক্ত ফোকাস দূরত্বের অবতল (Concave) লেন্সের চশমা ব্যবহার করে এ ত্রুটি দূর করা যায়।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
      },
    ],
    modelTestMCQs: [
      {
        question: 'রক্তের স্বাভাবিক pH মাত্রা কত?',
        options: ['৭.৩৫ - ৭.৪৫', '৬.০ - ৬.৫', '৮.০ - ৮.৫', '৫.০ - ৫.৫'],
        correctIndex: 0,
        explanation: 'মানবদেহের রক্তের স্বাভাবিক pH সামান্য ক্ষারীয়, যার পরিসর ৭.৩৫ থেকে ৭.৪৫।',
      },
    ],
  },

  // ----------------------------------------------------
  // ৪. বাংলাদেশ ও বিশ্বপরিচয় (BGS - Class 8, 9, 10, SSC)
  // ----------------------------------------------------
  {
    id: 'guide-bgs-ssc-2026',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    subjectId: 'bgs',
    subjectName: 'বাংলাদেশ ও বিশ্বপরিচয় (BGS)',
    group: 'general',
    groupLabel: 'সকল বিভাগ',
    exam: 'SSC ২০২৬ ও বার্ষিক পরীক্ষা',
    academicYear: '২০২৬',
    syllabusSource: {
      nctbUrl: 'https://nctb.gov.bd/site/view/syllabus/ssc-bgs-2026',
      organization: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      verificationStatus: 'verified',
      statusNote: 'এনসিটিবি অনুমোদিত বার্ষিক ও এসএসসি সিলেবাস।',
    },
    revisionSummary:
      'ইতিহাস, ভূগোল, অর্থনীতি, রাষ্ট্রবিজ্ঞান ও সমাজবিজ্ঞানের সমন্বয়ে বাংলাদেশ ও বিশ্বপরিচয় গঠিত। বিশেষ করে ১৯৭১-এর মুক্তিযুদ্ধ, বাংলাদেশের ভূপ্রকৃতি ও নদীব্যবস্থা, সংবিধানের চার মূলনীতি এবং টেকসই উন্নয়ন লক্ষ্যমাত্রা (SDG) পরীক্ষায় সর্বাধিক গুরুত্বপূর্ণ।',
    keyTopics: [
      'পূর্ব বাংলার আন্দোলন ও জাতীয়তাবাদের উত্থান (১৯৪৭-১৯৭০)',
      'স্বাধীন বাংলাদেশ ও ১৯৭১ সালের মুক্তিযুদ্ধ',
      'বাংলাদেশের ভূপ্রকৃতি, জলবায়ু ও প্রাকৃতিক দুর্যোগ',
      'গণপ্রজাতন্ত্রী বাংলাদেশের সরকার ও শাসনব্যবস্থা',
      'সংবিধান ও নাগরিকের মৌলিক অধিকার',
      'টেকসই উন্নয়ন লক্ষ্যমাত্রা (SDG)',
      'বাংলাদেশের সামাজিক পরিবর্তন ও নারী অধিকার',
    ],
    coreExamQuestions: [
      {
        question: 'বাংলাদেশের সংবিধানের ৪টি মূলনীতি কী কী?',
        answer: 'জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা।',
        mark: 2,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
      },
    ],
    modelTestMCQs: [
      {
        question: 'ঐতিহাসিক ৬ দফা দাবি কত সালে উত্থাপিত হয়?',
        options: ['১৯৬৬ সালে', '১৯৬৯ সালে', '১৯৭০ সালে', '১৯৫২ সালে'],
        correctIndex: 0,
        explanation: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান ১৯৬৬ সালের ৫-৬ ফেব্রুয়ারি লাহোরে ৬ দফা দাবি পেশ করেন।',
      },
    ],
  },

  // ----------------------------------------------------
  // ৫. তথ্য ও যোগাযোগ প্রযুক্তি (ICT - Class 6-10, HSC)
  // ----------------------------------------------------
  {
    id: 'guide-ict-ssc-2026',
    classId: 'ssc',
    className: 'এসএসসি ও ৮ম শ্রেণি',
    subjectId: 'ict',
    subjectName: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
    group: 'general',
    groupLabel: 'সকল বিভাগ',
    exam: '২০২৬ বার্ষিক পরীক্ষা ও এসএসসি',
    academicYear: '২০২৬',
    syllabusSource: {
      nctbUrl: 'https://nctb.gov.bd/site/view/syllabus/ssc-ict-2026',
      organization: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      verificationStatus: 'verified',
      statusNote: 'এনসিটিবি অনুমোদিত আইসিটি পাঠ্যসূচি।',
    },
    revisionSummary:
      'আইসিটি পরীক্ষায় হার্ডওয়্যার, সফটওয়্যার, সাইবার নিরাপত্তা, স্প্রেডশিট ও ডেটাবেজ ম্যানেজমেন্টের ওপর ২৫টি বহুনির্বাচনী প্রশ্ন এবং প্র্যাকটিক্যাল পরীক্ষা অনুষ্ঠিত হয়।',
    keyTopics: [
      'তথ্য ও যোগাযোগ প্রযুক্তি এবং আমাদের বাংলাদেশ',
      'কম্পিউটার ও কম্পিউটার ব্যবহারকারীর নিরাপত্তা (পাসওয়ার্ড, ম্যালওয়্যার ও অ্যান্টিভাইরাস)',
      'আমার শিক্ষায় ইন্টারনেট (ই-বুক ও ডিজিটাল কনটেন্ট)',
      'আমার লেখালেখি ও হিসাব (ওয়ার্ড প্রসেসর ও স্প্রেডশিট এক্সেল)',
      'মাল্টিমিডিয়া ও গ্রাফিক্স (পাওয়ারপয়েন্ট ও ফটোশপ)',
      'ডেটাবেজ ও প্রোগ্রামিংয়ের প্রাথমিক ধারণা',
    ],
    coreExamQuestions: [
      {
        question: 'ম্যালওয়্যার (Malware) কী? দুটি ক্ষতিকর ম্যালওয়্যারের নাম লেখো।',
        answer: 'কম্পিউটার সিস্টেমের ক্ষতিসাধনের উদ্দেশ্যে তৈরি ক্ষতিকর প্রোগ্রামকে ম্যালওয়্যার বলে। যেমন: কম্পিউটার ভাইরাস (Trojan Horse), স্পাইওয়্যার (Spyware)।',
        mark: 2,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
      },
    ],
    modelTestMCQs: [
      {
        question: 'স্প্রেডশিটে যোগ করার জন্য কোন ফাংশনটি ব্যবহৃত হয়?',
        options: ['=SUM()', '=ADD()', '=TOTAL()', '=PLUS()'],
        correctIndex: 0,
        explanation: 'মাইক্রোসফট এক্সেলে নির্দিষ্ট রেঞ্জের সংখ্যা যোগ করতে =SUM(A1:A10) ফাংশন ব্যবহৃত হয়।',
      },
    ],
  },

  // ----------------------------------------------------
  // ৬. ইসলাম ও নৈতিক শিক্ষা / ধর্ম শিক্ষা (Religion - Class 6-10)
  // ----------------------------------------------------
  {
    id: 'guide-religion-ssc-2026',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    subjectId: 'islamic_studies',
    subjectName: 'ইসলাম ও নৈতিক শিক্ষা',
    group: 'general',
    groupLabel: 'সকল বিভাগ',
    exam: '২০২৬ বার্ষিক পরীক্ষা ও এসএসসি',
    academicYear: '২০২৬',
    syllabusSource: {
      nctbUrl: 'https://nctb.gov.bd/site/view/syllabus/ssc-islam-2026',
      organization: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      verificationStatus: 'verified',
      statusNote: 'এনসিটিবি অনুমোদিত পাঠ্যক্রম।',
    },
    revisionSummary:
      'আকাইদ ও বিশ্বাস, ইবাদত, আখলাক বা চরিত্র, শরিয়তের উৎস (কুরআন ও হাদিস) এবং আদর্শ জীবনচরিত অধ্যায়সমূহের সুনির্দিষ্ট আয়াতের অর্থ ও হাদিসের আলোকে জীবন গঠনের শিক্ষা।',
    keyTopics: [
      'আকাইদ ও বিশ্বাস (তাওহিদ, রিসালাত ও আখিরাত)',
      'ইবাদত (নামাজ, রোজা, জাকাত ও হজ)',
      'আখলাক বা চরিত্র (সততা, ধৈর্য, পরোপকার ও অশ্লীলতা বর্জন)',
      'শরিয়তের উৎস (কুরআন মাজিদ ও হাদিস শরিফ)',
      'আদর্শ জীবনচরিত (মহানবী হযরত মুহাম্মদ সা. ও খলিফাগণ)',
    ],
    coreExamQuestions: [
      {
        question: 'নিফাক কী? মুনাফিকের প্রধান তিনটি লক্ষণ কী কী?',
        answer: 'মুখে ঈমানের দাবি করে অন্তরে কুফরি বা অবিশ্বাস গোপন রাখাকে নিফাক বলে। হাদিস অনুযায়ী মুনাফিকের তিনটি লক্ষণ: কথা বললে মিথ্যা বলে, ওয়াদা করলে ভঙ্গ করে, এবং আমানত রাখলে খেয়ানত করে।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'verified_board',
      },
    ],
    modelTestMCQs: [
      {
        question: '‘আল-কুরআন’ কত বছর ধরে অবতীর্ণ হয়েছিল?',
        options: ['২৩ বছর', '১০ বছর', '৪০ বছর', '২৫ বছর'],
        correctIndex: 0,
        explanation: 'মহানবী (সা.)-এর নবুওয়াত প্রাপ্তির পর দীর্ঘ ২৩ বছরে পর্যায়ক্রমে কুরআন অবতীর্ণ হয়।',
      },
    ],
  },

  // ----------------------------------------------------
  // ৭. ব্যবসায় শিক্ষা শাখা: হিসাববিজ্ঞান (Business Studies - Accounting)
  // ----------------------------------------------------
  {
    id: 'guide-acc-ssc-2026',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    subjectId: 'accounting',
    subjectName: 'হিসাববিজ্ঞান (Accounting)',
    group: 'business',
    groupLabel: 'ব্যবসায় শিক্ষা বিভাগ',
    exam: 'SSC ২০২৬ ও বার্ষিক পরীক্ষা',
    academicYear: '২০২৬',
    syllabusSource: {
      nctbUrl: 'https://nctb.gov.bd/site/view/syllabus/ssc-accounting-2026',
      organization: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      verificationStatus: 'verified',
      statusNote: 'এনসিটিবি অনুমোদিত ব্যবসায় শিক্ষা পাঠ্যক্রম।',
    },
    revisionSummary:
      'দুতরফা দাখিলা পদ্ধতি, লেনদেন চিহ্নিতকরণ, জাবেদা, খতিয়ান, নগদান বই, রেওয়ামিল এবং আর্থিক বিবরণী। আর্থিক বিবরণী অংশে বিশদ আয় বিবরণী ও আর্থিক অবস্থার বিবরণী প্রস্তুতকরণে সর্বাধিক মনোযোগ দিতে হবে।',
    keyTopics: [
      'লেনদেন ও হিসাব সমীকরণ (A = L + E)',
      'দুতরফা দাখিলা পদ্ধতি',
      'জাবেদা ও বিশেষ জাবেদা',
      'খতিয়ান ও রেওয়ামিল',
      'নগদান বই (দুই ঘরা ও তিন ঘরা)',
      'আর্থিক বিবরণী (১০ম অধ্যায়)',
      'পারিবারিক ও আত্মকর্মসংস্থানমূলক হিসাব',
    ],
    workedMathExamples: [
      {
        id: 'acc-ex-1',
        topic: 'হিসাব সমীকরণ (A = L + E)',
        problem: 'রহিম ট্রেডার্স ৫০,০০০ টাকা নগদ এবং ২০,০০০ টাকার পণ্যদ্রব্য নিয়ে ব্যবসা শুরু করলেন। হিসাব সমীকরণে এর প্রভাব ব্যাখ্যা করো।',
        stepByStepSolution: [
          'ধাপ ১: নগদ আনয়ন করায় সম্পদ (Asset) নগদ তহবিল বৃদ্ধি পেল ৫০,০০০ টাকা।',
          'ধাপ ২: পণ্যদ্রব্য আনয়ন করায় সম্পদ মজুদ পণ্য বৃদ্ধি পেল ২০,০০০ টাকা।',
          'ধাপ ৩: মালিক কর্তৃক আনীত মোট অর্থ (৫০,০০০ + ২০,০০০) = ৭০,০০০ টাকা মালিকানাস্বত্ব (Equity) মূলধন বৃদ্ধি পেল।',
          'ধাপ ৪: সমীকরণ প্রমাণ: সম্পদ (৭০,০০০) = দায় (০) + মালিকানাস্বত্ব (৭০,০০০)।',
        ],
        finalAnswer: 'সম্পদ (A) বৃদ্ধি ৭০,০০০ টাকা = মালিকানাস্বত্ব (E) বৃদ্ধি ৭০,০০০ টাকা।',
        importantFormula: 'A = L + E (Asset = Liabilities + Owner\'s Equity)',
        examTip: 'প্রতিটি লেনদেনের দুটি দিক চিহ্নিত করে ডেবিট ও ক্রেডিট নির্ণয় নিশ্চিত করতে হবে।',
      },
    ],
    coreExamQuestions: [
      {
        question: 'রেওয়ামিল তৈরির মূল উদ্দেশ্য কী?',
        answer: 'খতিয়ানের জেরগুলোর গাণিতিক শুদ্ধতা যাচাই করাই রেওয়ামিল প্রস্তুতের প্রধান উদ্দেশ্য।',
        mark: 2,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
      },
    ],
    modelTestMCQs: [
      {
        question: 'হিসাব সমীকরণের মূল উপাদান কয়টি?',
        options: ['৩টি (A = L + E)', '২টি', '৪টি', '৫টি'],
        correctIndex: 0,
        explanation: 'হিসাব সমীকরণের প্রধান ৩টি উপাদান হলো সম্পদ (A), দায় (L) এবং মালিকানাস্বত্ব (E)।',
      },
    ],
  },
];
