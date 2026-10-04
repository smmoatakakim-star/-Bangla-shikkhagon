export interface EnglishWord {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  banglaMeaning: string;
  englishMeaning: string;
  exampleSentence: string;
  banglaExample: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'daily' | 'academic' | 'exam' | 'formal';
}

export interface EnglishSentencePractice {
  id: string;
  banglaSentence: string;
  englishAnswer: string;
  grammarPattern: string;
  difficulty: 'easy' | 'medium' | 'hard';
  classScope: string;
  hints: string[];
}

export interface EnglishSpellingPractice {
  id: string;
  word: string;
  banglaMeaning: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface EnglishQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // সহজ বাংলা ব্যাখ্যা
  category: 'grammar' | 'tense' | 'vocabulary' | 'translation' | 'spelling' | 'synonym_antonym';
  difficulty: 'easy' | 'medium' | 'hard';
  classScope: string; // e.g., 'Class 5-8', 'Class 9-10 (SSC)', 'Class 11-12 (HSC)'
}

export const DAILY_VOCABULARY_LIST: EnglishWord[] = [
  {
    id: 'w-1',
    word: 'Diligent',
    pronunciation: '/ˈdɪl.ə.dʒənt/ (ডিলিজেন্ট)',
    partOfSpeech: 'Adjective',
    banglaMeaning: 'পরিশ্রমী, অধ্যবসায়ী',
    englishMeaning: 'Showing persistent and hard effort in doing work',
    exampleSentence: 'A diligent student can easily score GPA-5 in SSC exam.',
    banglaExample: 'একজন পরিশ্রমী শিক্ষার্থী সহজেই এসএসসি পরীক্ষায় জিপিএ-৫ পেতে পারে।',
    synonyms: ['Hardworking', 'Industrious', 'Meticulous', 'Assiduous'],
    antonyms: ['Lazy', 'Negligent', 'Careless', 'Idle'],
    difficulty: 'medium',
    category: 'daily',
  },
  {
    id: 'w-2',
    word: 'Acquire',
    pronunciation: '/əˈkwaɪ.ɚ/ (অ্যাকোয়ার)',
    partOfSpeech: 'Verb',
    banglaMeaning: 'অর্জন করা, আয়ত্ত করা',
    englishMeaning: 'To get or gain something through effort or practice',
    exampleSentence: 'Reading books daily helps students acquire strong vocabulary.',
    banglaExample: 'প্রতিদিন বই পড়া শিক্ষার্থীদের সমৃদ্ধ শব্দভাণ্ডার অর্জন করতে সাহায্য করে।',
    synonyms: ['Obtain', 'Gain', 'Attain', 'Procure'],
    antonyms: ['Lose', 'Forfeit', 'Surrender', 'Discard'],
    difficulty: 'easy',
    category: 'academic',
  },
  {
    id: 'w-3',
    word: 'Punctual',
    pronunciation: '/ˈpʌŋk.tʃu.əl/ (পাঙ্কচুয়াল)',
    partOfSpeech: 'Adjective',
    banglaMeaning: 'সময়নিষ্ঠ, সময়মতো উপস্থিত হয় এমন',
    englishMeaning: 'Arriving or doing something at the arranged time',
    exampleSentence: 'Students must be punctual in school and examinations.',
    banglaExample: 'শিক্ষার্থীদের অবশ্যই স্কুল ও পরীক্ষায় সময়নিষ্ঠ হতে হবে।',
    synonyms: ['Timely', 'Prompt', 'On time', 'Precise'],
    antonyms: ['Tardy', 'Late', 'Delayed', 'Unpunctual'],
    difficulty: 'easy',
    category: 'daily',
  },
  {
    id: 'w-4',
    word: 'Perseverance',
    pronunciation: '/ˌpɝː.səˈvɪr.əns/ (পারসিভিয়ারেন্স)',
    partOfSpeech: 'Noun',
    banglaMeaning: 'দৃঢ় সংকল্প, নিরবচ্ছিন্ন অধ্যবসায়',
    englishMeaning: 'Continued effort to do something despite difficulties',
    exampleSentence: 'Perseverance is the true key to success in higher education.',
    banglaExample: 'উচ্চশিক্ষায় সাফল্যের আসল চাবিকাঠি হলো অধ্যবসায়।',
    synonyms: ['Dedication', 'Determination', 'Persistence', 'Endurance'],
    antonyms: ['Hesitation', 'Apathy', 'Weakness', 'Surrender'],
    difficulty: 'hard',
    category: 'exam',
  },
  {
    id: 'w-5',
    word: 'Eloquent',
    pronunciation: '/ˈel.ə.kwənt/ (অ্যালোকোয়েন্ট)',
    partOfSpeech: 'Adjective',
    banglaMeaning: 'বাকপটু, সুন্দর ও অর্থপূর্ণভাবে বলতে পারা',
    englishMeaning: 'Giving a clear, strong message through fluent speech',
    exampleSentence: 'Bangabandhu Sheikh Mujibur Rahman was an eloquent speaker.',
    banglaExample: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান ছিলেন একজন অসামান্য বাকপটু বক্তা।',
    synonyms: ['Articulate', 'Fluent', 'Expressive', 'Persuasive'],
    antonyms: ['Inarticulate', 'Hesitant', 'Stammering'],
    difficulty: 'hard',
    category: 'formal',
  },
  {
    id: 'w-6',
    word: 'Crucial',
    pronunciation: '/ˈkruː.ʃəl/ (ক্রুশাল)',
    partOfSpeech: 'Adjective',
    banglaMeaning: 'অত্যন্ত গুরুত্বপূর্ণ, চূড়ান্ত',
    englishMeaning: 'Extremely important or necessary',
    exampleSentence: 'Regular grammar practice is crucial for mastering English.',
    banglaExample: 'ইংরেজি আয়ত্তের জন্য নিয়মিত ব্যাকরণ চর্চা অত্যন্ত গুরুত্বপূর্ণ।',
    synonyms: ['Vital', 'Critical', 'Essential', 'Key'],
    antonyms: ['Trivial', 'Minor', 'Insignificant', 'Unimportant'],
    difficulty: 'medium',
    category: 'academic',
  },
  {
    id: 'w-7',
    word: 'Beneficial',
    pronunciation: '/ˌben.əˈfɪʃ.əl/ (বেনেফিশিয়াল)',
    partOfSpeech: 'Adjective',
    banglaMeaning: 'উপকারী, ফলপ্রসূ',
    englishMeaning: 'Having a good or helpful result or effect',
    exampleSentence: 'Morning exercise is very beneficial for both physical and mental health.',
    banglaExample: 'সকালের ব্যায়াম শারীরিক ও মানসিক উভয় স্বাস্থ্যের জন্যই খুবই উপকারী।',
    synonyms: ['Helpful', 'Advantageous', 'Useful', 'Favorable'],
    antonyms: ['Harmful', 'Detrimental', 'Damaging', 'Disadvantageous'],
    difficulty: 'easy',
    category: 'daily',
  },
  {
    id: 'w-8',
    word: 'Comprehend',
    pronunciation: '/ˌkɑːm.prəˈhend/ (কম্প্রিহেন্ড)',
    partOfSpeech: 'Verb',
    banglaMeaning: 'পুরোপুরি উপলব্ধি করা বা বোঝা',
    englishMeaning: 'To understand something clearly and completely',
    exampleSentence: 'You should read the paragraph carefully to comprehend the main idea.',
    banglaExample: 'মূল ভাবার্থটি গভীরভাবে বোঝার জন্য অনুচ্ছেদটি মনোযোগ দিয়ে পড়া উচিত।',
    synonyms: ['Understand', 'Grasp', 'Perceive', 'Fathom'],
    antonyms: ['Misunderstand', 'Confuse', 'Misinterpret'],
    difficulty: 'medium',
    category: 'academic',
  },
];

export const ENGLISH_TRANSLATION_PRACTICES: EnglishSentencePractice[] = [
  {
    id: 't-1',
    banglaSentence: 'সূর্য পূর্ব দিকে ওঠে এবং পশ্চিম দিকে অস্ত যায়।',
    englishAnswer: 'The sun rises in the east and sets in the west.',
    grammarPattern: 'Universal Truth (চিরন্তন সত্য) → Present Indefinite Tense (V1 + s/es)',
    difficulty: 'easy',
    classScope: 'Class 5-8',
    hints: ['Rise (ওঠা)', 'Set (অস্ত যাওয়া)', 'পূর্ব দিক: the east'],
  },
  {
    id: 't-2',
    banglaSentence: 'ডাক্তার আসার পূর্বেই রোগীটি মারা গেল।',
    englishAnswer: 'The patient had died before the doctor came.',
    grammarPattern: 'Past Perfect + before + Past Simple [Sub + had + V3 + before + Sub + V2]',
    difficulty: 'medium',
    classScope: 'Class 8-10 (SSC)',
    hints: ['Patient (রোগী)', 'পূর্বে: before', 'had + V3'],
  },
  {
    id: 't-3',
    banglaSentence: 'সকাল থেকে মুষলধারে বৃষ্টি হচ্ছে।',
    englishAnswer: 'It has been raining cats and dogs since morning.',
    grammarPattern: 'Present Perfect Continuous Tense [has/have been + V-ing + since/for]',
    difficulty: 'medium',
    classScope: 'Class 7-10 (SSC)',
    hints: ['মুষলধারে: cats and dogs', 'সকাল থেকে: since morning', 'has been raining'],
  },
  {
    id: 't-4',
    banglaSentence: 'সে যদি মন দিয়ে পড়ত, তবে পরীক্ষায় পাস করত।',
    englishAnswer: 'If he had studied attentively, he would have passed the exam.',
    grammarPattern: '3rd Conditional [If + Past Perfect, Subject + would have + V3]',
    difficulty: 'hard',
    classScope: 'Class 9-12 (SSC & HSC)',
    hints: ['Attentively (মনোযোগ দিয়ে)', 'would have + V3'],
  },
  {
    id: 't-5',
    banglaSentence: 'সততা সর্বোৎকৃষ্ট পন্থা।',
    englishAnswer: 'Honesty is the best policy.',
    grammarPattern: 'Universal Proverb (প্রবাদ বাক্য) & Superlative Degree',
    difficulty: 'easy',
    classScope: 'Class 5-10',
    hints: ['Honesty (সততা)', 'Policy (পন্থা)'],
  },
  {
    id: 't-6',
    banglaSentence: 'আমরা নিয়মিত পড়াশোনা না করলে ভালো ফল করতে পারব না।',
    englishAnswer: 'Unless we study regularly, we will not be able to make good results.',
    grammarPattern: '1st Conditional with Unless [Unless + Present Simple, Future Simple]',
    difficulty: 'medium',
    classScope: 'Class 9-12 (SSC & HSC)',
    hints: ['Unless = if not (যদি না)', 'Regularly (নিয়মিত)'],
  },
];

export const ENGLISH_SPELLING_LIST: EnglishSpellingPractice[] = [
  {
    id: 'sp-1',
    word: 'Accommodation',
    banglaMeaning: 'বাসস্থান বা থাকার জায়গা',
    options: ['Accomodation', 'Accommodation', 'Acommodation', 'Accomadation'],
    correctIndex: 1,
    explanation: 'সঠিক বানান হলো "Accommodation" — এখানে ডাবল "c" (cc) এবং ডাবল "m" (mm) রয়েছে।',
    difficulty: 'hard',
  },
  {
    id: 'sp-2',
    word: 'Lieutenant',
    banglaMeaning: 'সেনাবাহিনীর সামরিক পদবী (লেফটেন্যান্ট)',
    options: ['Lieutenent', 'Leutenant', 'Lieutenant', 'Liutenant'],
    correctIndex: 2,
    explanation: 'স্মরণ রাখার বাংলা টেকনিক: "Lie-u-ten-ant" (মিথ্যা তুমি দশ পিপড়া) → Lieutenant।',
    difficulty: 'hard',
  },
  {
    id: 'sp-3',
    word: 'Grammar',
    banglaMeaning: 'ব্যাকরণ',
    options: ['Grammer', 'Grammar', 'Gramar', 'Graammer'],
    correctIndex: 1,
    explanation: 'সঠিক বানান "Grammar"। অধিকাংশ শিক্ষার্থী ভুল করে Grammer লেখে, কিন্তু শেষে "ar" হবে।',
    difficulty: 'easy',
  },
  {
    id: 'sp-4',
    word: 'Committee',
    banglaMeaning: 'কমিটি বা সমিতি',
    options: ['Comitee', 'Commitee', 'Committee', 'Committe'],
    correctIndex: 2,
    explanation: 'সঠিক বানান "Committee" — ডাবল m (mm), ডাবল t (tt), ডাবল e (ee)।',
    difficulty: 'medium',
  },
  {
    id: 'sp-5',
    word: 'Necessary',
    banglaMeaning: 'প্রয়োজনীয় বা আবশ্যক',
    options: ['Neccessary', 'Necessary', 'Necesary', 'Necessery'],
    correctIndex: 1,
    explanation: 'সঠিক বানান "Necessary" — একটি c এবং দুটি s (one c, double s)।',
    difficulty: 'medium',
  },
];

export const ENGLISH_QUIZZES_DATA: EnglishQuizItem[] = [
  {
    id: 'eq-1',
    question: 'Choose the correct form of verb: "Neither Rahim nor his brothers _____ present yesterday."',
    options: ['is', 'are', 'was', 'were'],
    correctIndex: 3,
    explanation:
      '"Neither... nor" দ্বারা দুটি Subject যুক্ত হলে nor-এর পরের Subject অনুযায়ী Verb বসে। এখানে "his brothers" Plural এবং বাক্যটি Past Tense ("yesterday"), তাই সঠিক উত্তর "were"।',
    category: 'grammar',
    difficulty: 'medium',
    classScope: 'Class 8-10 (SSC)',
  },
  {
    id: 'eq-2',
    question: 'Identify the tense: "She has been reading this novel for two hours."',
    options: [
      'Present Continuous Tense',
      'Past Perfect Continuous Tense',
      'Present Perfect Continuous Tense',
      'Future Continuous Tense',
    ],
    correctIndex: 2,
    explanation:
      'Subject + has/have been + verb-ing + for/since সময় নির্দেশ করলে তা "Present Perfect Continuous Tense" হয়।',
    category: 'tense',
    difficulty: 'easy',
    classScope: 'Class 5-8',
  },
  {
    id: 'eq-3',
    question: 'What is the SYNONYM of the word "Courageous"?',
    options: ['Timid', 'Brave', 'Coward', 'Fragile'],
    correctIndex: 1,
    explanation:
      '"Courageous" শব্দের অর্থ সাহসী বা নির্ভীক। এর সমার্থক শব্দ (Synonym) হলো "Brave"। Timid ও Coward হলো এর বিপরীত (Antonym)।',
    category: 'synonym_antonym',
    difficulty: 'easy',
    classScope: 'Class 5-10',
  },
  {
    id: 'eq-4',
    question: 'What is the ANTONYM of "Optimistic"?',
    options: ['Pessimistic', 'Hopeful', 'Confident', 'Cheerful'],
    correctIndex: 0,
    explanation:
      '"Optimistic" অর্থ আশাবাদী। এর বিপরীত শব্দ (Antonym) হলো "Pessimistic" (হতাশাবাদী বা নৈরাশ্যবাদী)।',
    category: 'synonym_antonym',
    difficulty: 'easy',
    classScope: 'Class 7-12',
  },
  {
    id: 'eq-5',
    question: 'Choose the correct preposition: "The student is proficient _____ Mathematics."',
    options: ['in', 'at', 'on', 'with'],
    correctIndex: 0,
    explanation:
      'কোনো নির্দিষ্ট ভাষা বা বিদ্যায় পারদর্শী বোঝাতে Appropriate Preposition হিসেবে "proficient in" ব্যবহৃত হয়। আবার দক্ষ বোঝাতে "good at" বসে।',
    category: 'grammar',
    difficulty: 'medium',
    classScope: 'Class 9-12 (SSC & HSC)',
  },
  {
    id: 'eq-6',
    question: 'Select the correct sentence with proper Tense sequence:',
    options: [
      'If you will come, I will go.',
      'If you come, I will go.',
      'If you came, I will go.',
      'If you come, I would go.',
    ],
    correctIndex: 1,
    explanation:
      '1st Conditional নিয়মে "If + Present Indefinite, Future Indefinite (will + V1)" বসে। If ক্লজে কখনো will বসে না। তাই "If you come, I will go." সঠিক।',
    category: 'tense',
    difficulty: 'medium',
    classScope: 'Class 8-10 (SSC)',
  },
  {
    id: 'eq-7',
    question: 'Select the correct passive voice: "Who wrote this letter?"',
    options: [
      'By whom this letter was written?',
      'By whom was this letter written?',
      'Who was written this letter?',
      'By who was this letter written?',
    ],
    correctIndex: 1,
    explanation:
      'Interrogative বাক্যে "Who" থাকলে প্যাসিভে "By whom" দিয়ে শুরু হয় এবং Auxiliary verb সাবজেক্টের আগে বসে: By whom + was + subject + V3? অর্থাৎ "By whom was this letter written?"।',
    category: 'grammar',
    difficulty: 'hard',
    classScope: 'Class 9-12 (SSC & HSC)',
  },
  {
    id: 'eq-8',
    question: 'Which of the following is an abstract noun?',
    options: ['Gold', 'Honesty', 'Army', 'Teacher'],
    correctIndex: 1,
    explanation:
      '"Honesty" (সততা) একটি গুণ বা ধারণার নাম, যা স্পর্শ বা দেখা যায় না কেবল অনুভব করা যায়। তাই এটি Abstract Noun। Gold হলো Material, Army হলো Collective, Teacher হলো Common Noun।',
    category: 'grammar',
    difficulty: 'easy',
    classScope: 'Class 5-8',
  },
];
