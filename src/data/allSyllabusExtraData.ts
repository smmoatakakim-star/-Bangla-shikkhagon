import type { PoemAnalysisItem } from './allSyllabusPoemsData';

export const EXTRA_SYLLABUS_CONTENT: PoemAnalysisItem[] = [
  // ==========================================
  // বাংলা গল্প (Bangla Stories - SSC & HSC & Lower Secondary)
  // ==========================================
  {
    id: 'ssc-story-shuva',
    title: 'শুভা',
    banglaTitle: 'শুভা (গল্প — রবীন্দ্রনাথ ঠাকুর)',
    poet: 'রবীন্দ্রনাথ ঠাকুর',
    poetBio: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুর (১৮৬১-১৯৪১)। গল্পগুচ্ছ গ্রন্থের বিখ্যাত ছোটগল্প।',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'story',
    typeLabel: 'গল্প',
    subjectName: 'বাংলা প্রথম পত্র (গদ্যাংশ)',
    coreTheme: 'বাক্প্রতিবন্ধী কিশোরীর প্রতি প্রকৃতির মমতা ও সমাজের নির্মম অবহেলা',
    moolBhab: 'শুভা ছিল বাণীকণ্ঠের ছোট মেয়ে, যে জন্ম থেকেই বোবা। সমাজের মানুষ ও তার নিজের মা তাকে অভিশাপ মনে করত। কিন্তু বোবা প্রকৃতির সাথে শুভার ছিল নিবিড় সখ্য। সর্বশী ও পাঙ্গুলি নামের দুটি গাভী এবং প্রতাপ নামের অলস যুবক ছিল তার সঙ্গী। বাক্শক্তিহীন হলেও শুভার একটি সংবেদনশীল হৃদয় ছিল, যা সমাজে সহানুভূতি পায়নি।',
    stanzasOrExcerpts: [
      {
        lines: 'মেয়েটির নাম যখন সুভাষিণী রাখা হইয়াছিল তখন কে জানিত সে বোবা হইবে!',
        explanation: 'নামকরণের সার্থকতা ও ভাগ্যের নিষ্ঠুর পরিহাসের সূচনা।'
      },
      {
        lines: 'প্রকৃতি যেন তাহার ভাষার অভাব পূরণ করিয়া দেয়। যেন তাহার হইয়া কথা কয়।',
        explanation: 'মানুষের উপেক্ষা থেকে বাঁচতে শুভা প্রকৃতির মাঝে আত্মিক সান্ত্বনা খুঁজে পেত।'
      }
    ],
    keyWordsGlossary: [
      { word: 'সুভাষিণী', meaning: 'যে মধুর ও সুন্দর কথা বলে' },
      { word: 'গর্ভের কলঙ্ক', meaning: 'মায়ের চোখে সন্তানের ত্রুটি বা অভিশাপ' },
      { word: 'অস্তমান', meaning: 'ডুবন্ত বা অস্ত যাচ্ছে এমন' },
      { word: 'কপোল', meaning: 'গাল' }
    ],
    learningOutcomes: [
      'বিশেষ চাহিদাসম্পন্ন (প্রতিবন্ধী) মানুষের প্রতি গভীর মানবিক সহানুভূতি ও সমমর্মিতা প্রকাশ',
      'প্রকৃতির সঙ্গে মানুষের চিরন্তন আত্মিক সম্পর্ক উপলব্ধি'
    ],
    shortQuestions: [
      { question: 'শুভার প্রকৃত নাম কী ছিল?', answer: 'সুভাষিণী।', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'শুভার মা কেন তাকে নিজের গর্ভের কলঙ্ক মনে করতেন?', answer: 'মা সাধারণত কন্যাকে নিজের অঙ্গের অংশ মনে করেন, তাই তার অক্ষমতাকে নিজের ত্রুটি মনে করে মা তাকে গর্ভের কলঙ্ক ভাবতেন।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    creativeQuestion: {
      stimulus: 'দৃষ্টিপ্রতিবন্ধী বালক রফিক বিদ্যালয়ে সহপাঠীদের বিদ্রূপের শিকার হলেও বাড়ির পোষা কুকুর ও বাগানের পাখিদের সাথে গভীর বন্ধুত্ব গড়ে তুলেছে। প্রকৃতির নিবিড় সান্নিধ্যই তার মানসিক শান্তির আশ্রয়।',
      questions: [
        { level: 'ক', text: 'শুভার বাবার নাম কী?', answer: 'বাণীকণ্ঠ।', mark: 1 },
        { level: 'খ', text: '‘প্রকৃতি যেন তাহার ভাষার অভাব পূরণ করিয়া দেয়’—ব্যাখ্যা করো।', answer: 'শুভা কথা বলতে পারত না বলে মানুষ তার সঙ্গ এড়িয়ে চলত, কিন্তু নদী, বাতাস ও প্রকৃতি যেন অনুভূতির ভাষায় শুভার মনের কথা বুঝত।', mark: 2 },
        { level: 'গ', text: 'উদ্দীপকের রফিকের সাথে শুভার জীবনের কোন দিকটি সাদৃশ্যপূর্ণ?', answer: 'উভয়েই প্রতিবন্ধী হয়েও প্রকৃতির সান্নিধ্যে জীবনের স্বস্তি ও মনের ভাব বিনিময়ের আশ্রয় খুঁজে পেয়েছে।', mark: 3 },
        { level: 'ঘ', text: '“রফিকের মতো শুভাও সমাজের অবহেলার শিকার”—মন্তব্যটি গল্প অবলম্বনে মূল্যায়ন করো।', answer: 'সমাজের নির্মম মানসিকতা শুভার বিয়ে ও ভবিষ্যতকে ধ্বংস করে দেয়। প্রতিবন্ধী মানুষের অধিকার ও মর্যাদার প্রতি মানবিক দৃষ্টিভঙ্গি গড়ে তোলাই লেখকের মূল বার্তা।', mark: 4 }
      ]
    },
    mcqs: [
      {
        id: 'mcq-shuva-1',
        question: 'শুভার দুটি প্রিয় গাভীর নাম কী ছিল?',
        options: ['সর্বশী ও পাঙ্গুলি', 'শ্যামা ও রাঙা', 'কাজলী ও ধবলী', 'গৌরী ও সুরভী'],
        correctAnswerIndex: 0,
        explanation: 'শুভার গোয়ালের দুটি গাভীর নাম সর্বশী ও পাঙ্গুলি।'
      },
      {
        id: 'mcq-shuva-2',
        question: 'প্রতাপের কাছে শুভার প্রধান মর্যাদা কী ছিল?',
        options: ['মাছ ধরার চমৎকার নিঃশব্দ সঙ্গী', 'রান্নাবান্নায় সাহায্যকারী', 'কথোপকথনকারী', 'সহোদরা বোন'],
        correctAnswerIndex: 0,
        explanation: 'মাছ ধরার সময় নীরব সঙ্গী হওয়াতেই প্রতাপ শুভার কদর করত।'
      }
    ]
  },
  {
    id: 'ssc-story-boi-pora',
    title: 'বই পড়া',
    banglaTitle: 'বই পড়া (প্রবন্ধ/গল্প — প্রমথ চৌধুরী)',
    poet: 'প্রমথ চৌধুরী',
    poetBio: 'প্রমথ চৌধুরী (১৮৬৮-১৯৪৬), বাংলা গদ্যে চলিত রীতির প্রবর্তক ও ‘বীরবল’ ছদ্মনামের লেখক।',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'story',
    typeLabel: 'গল্প',
    subjectName: 'বাংলা প্রথম পত্র (গদ্যাংশ)',
    coreTheme: 'শিক্ষা ব্যবস্থার সীমাবদ্ধতা, লাইব্রেরির প্রয়োজনীয়তা ও স্বশিক্ষিত হওয়ার গুরুত্ব',
    moolBhab: 'বই পড়ার অভ্যাস মানুষের মনের বিকাশ ও আত্মার মুক্তির প্রধান উপায়। লেখক দেখিয়েছেন যে মুখস্থ ও পাস করা বিদ্যা প্রকৃত শিক্ষা নয়। লাইব্রেরি হলো স্বশিক্ষিত হওয়ার সর্বোৎকৃষ্ট স্থান, যা স্কুল-কলেজের চেয়েও বেশি মর্যাদাপূর্ণ। জাতিকে মনের দিক থেকে ধনী হতে হলে বই পড়ার কোনো বিকল্প নেই।',
    stanzasOrExcerpts: [
      {
        lines: 'সুশিক্ষিত লোক মাত্রই স্বশিক্ষিত। যথার্থ গুরু শিষ্যের আত্মাকে উদ্বোধিত করেন মাত্র।',
        explanation: 'বাহ্যিক চাপিয়ে দেওয়া বিদ্যা নয়, নিজের আগ্রহে অর্জিত জ্ঞানই প্রকৃত শিক্ষা।'
      }
    ],
    keyWordsGlossary: [
      { word: 'স্বশিক্ষিত', meaning: 'যে নিজে নিজে শিক্ষা অর্জন করে' },
      { word: 'আবদার', meaning: 'বায়না বা অযৌক্তিক দাবি' },
      { word: 'উদ্বোধিত', meaning: 'জাগরিত বা বিকশিত করা' },
      { word: 'ডেমোক্র্যাসি', meaning: 'গণতন্ত্র' }
    ],
    learningOutcomes: [
      'সাহিত্য চর্চা ও বই পড়ার আনন্দ উপলব্ধি করা',
      'লাইব্রেরির গুরুত্ব অনুধাবন ও স্বশিক্ষিত হওয়ার প্রেরণা অর্জন'
    ],
    shortQuestions: [
      { question: '‘বই পড়া’ প্রবন্ধে লেখক লাইব্রেরিকে কার উপরে স্থান দিয়েছেন?', answer: 'স্কুল-কলেজের উপরে।', mark: 1, type: 'জ্ঞানমূলক' },
      { question: '“সুশিক্ষিত লোক মাত্রই স্বশিক্ষিত”—বলতে কী বোঝানো হয়েছে?', answer: 'শিক্ষক কেবল পথপ্রদর্শক, শিক্ষার্থী নিজে যখন অনুসন্ধিৎসা নিয়ে পাঠে নিয়োজিত হয় তখনই সে সত্যিকারের শিক্ষিত হয়।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-bp-1',
        question: 'আমাদের দেশে সাহিত্যের চর্চাকে অনেকে কী মনে করেন?',
        options: ['অনাবশ্যক ও আর্থিক দিক দিয়ে নিষ্ফল', 'পরম পুণ্যকর্ম', 'একমাত্র অবলম্বন', 'আধ্যাত্মিক সাধনা'],
        correctAnswerIndex: 0,
        explanation: 'বস্তুবাদী সমাজে নগদ লাভ না থাকায় সাহিত্যচর্চাকে অনেকে অনাবশ্যক মনে করে।'
      }
    ]
  },
  {
    id: 'ssc-story-ekattorer-dinguli',
    title: 'একাত্তরের দিনগুলি',
    banglaTitle: 'একাত্তরের দিনগুলি (স্মৃতিকথা/দিনলিপি — জাহানারা ইমাম)',
    poet: 'জাহানারা ইমাম',
    poetBio: 'শহীদ জননী জাহানারা ইমাম (১৯২৯-১৯৯৪)। ১৯৭১ সালে মুক্তিযুদ্ধে ছেলে রুমীকে উৎসর্গকারী মহীয়সী নারী।',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'story',
    typeLabel: 'গল্প',
    subjectName: 'বাংলা প্রথম পত্র (গদ্যাংশ)',
    coreTheme: 'মুক্তিযুদ্ধের অবরুদ্ধ ঢাকা শহরের দিনলিপি ও গেরিলা যোদ্ধা রুমীর আত্মত্যাগ',
    moolBhab: 'একাত্তরের দিনগুলি শহীদ জননী জাহানারা ইমামের এক মর্মস্পর্শী ডায়েরি। ১৯৭১ সালের অবরুদ্ধ ঢাকার সাধারণ মানুষের ভয়, আতঙ্ক, গেরিলা মুক্তিযোদ্ধাদের সাহসী আক্রমণ এবং পাকিস্তানি হানাদারদের বর্বরোচিত নির্যাতনের চিত্র এতে বিধৃত। তাঁর বড় ছেলে শাফী ইমাম রুমী ইঞ্জিনিয়ারিং কলেজে ভর্তি না হয়ে দেশমাতৃকার টানে মুক্তিযুদ্ধে যান এবং শহীদ হন।',
    stanzasOrExcerpts: [
      {
        lines: 'রুমী বলল, মা, দেশের এই অবস্থায় আমি যদি আমেরিকা চলে যাই, তবে নিজের বিবেকের কাছে কোনোদিন জবাব দিতে পারব না।',
        explanation: 'তরুণ প্রজন্মের অদম্য দেশপ্রেম ও জাতীয় মুক্তির দৃঢ় অঙ্গীকার।'
      }
    ],
    keyWordsGlossary: [
      { word: 'গেরিলা', meaning: 'গোপনে অতর্কিত আক্রমণকারী বীর মুক্তিযোদ্ধা' },
      { word: 'অবরুদ্ধ', meaning: 'চারদিক থেকে অবরুদ্ধ বা বন্দি অবস্থা' },
      { word: 'মার্শাল ল', meaning: 'সামরিক শাসন' }
    ],
    learningOutcomes: [
      'মুক্তিযুদ্ধের রক্তক্ষয়ী ইতিহাস ও বীর মুক্তিযোদ্ধাদের আত্মত্যাগ সম্পর্কে সচেতন হওয়া',
      'দেশপ্রেম ও ন্যায়ের পক্ষে অবস্থানের মূল্যবোধ অর্জন'
    ],
    shortQuestions: [
      { question: 'শহীদ রুমী কোন গেরিলা দলের সদস্য ছিলেন?', answer: 'ক্র্যাক প্লাটুনের গেরিলা যোদ্ধা ছিলেন।', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'জাহানারা ইমামকে কেন ‘শহীদ জননী’ বলা হয়?', answer: 'মুক্তিযুদ্ধে তাঁর জ্যেষ্ঠ সন্তান রুমী দেশের জন্য নিজের জীবন উৎসর্গ করেছিলেন বলে তাঁকে শহীদ জননী বলা হয়।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-ekattor-1',
        question: '‘একাত্তরের দিনগুলি’ কোন ধরনের রচনা?',
        options: ['দিনলিপি বা স্মৃতিকথা', 'ঐতিহাসিক নাটক', 'রোমাঞ্চকর উপন্যাস', 'ভ্রমণকাহিনী'],
        correctAnswerIndex: 0,
        explanation: 'এটি জাহানারা ইমামের ব্যক্তিগত ডায়েরি বা দিনলিপির আকারে লিখিত স্মৃতিকথা।'
      }
    ]
  },
  {
    id: 'hsc-story-oporchita',
    title: 'অপরিচিতা',
    banglaTitle: 'অপরিচিতা (ছোটগল্প — রবীন্দ্রনাথ ঠাকুর)',
    poet: 'রবীন্দ্রনাথ ঠাকুর',
    poetBio: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুর (১৮৬১-১৯৪১)। বাংলা সাহিত্যের শ্রেষ্ঠ ছোটগল্পকার।',
    classId: 'hsc',
    className: 'এইচএসসি / একাদশ-দ্বাদশ শ্রেণি',
    exam: 'HSC ২০২৬',
    type: 'story',
    typeLabel: 'গল্প',
    subjectName: 'বাংলা প্রথম পত্র (গদ্যাংশ)',
    coreTheme: 'যৌতুক প্রথার বিরুদ্ধে বলিষ্ঠ নারী প্রতিবাদ ও ব্যক্তিত্বহীন পুরুষের আত্মগ্লানি',
    moolBhab: 'অনুপম ছিল উচ্চশিক্ষিত কিন্তু ব্যক্তিত্বহীন এক যুবক, যার সমস্ত সিদ্ধান্ত নিত তার মামা। বিয়ের আসরে মামা শম্ভুনাথ সেনের দেওয়া গহনা পরীক্ষা করে অপমান করতে চাইলে শম্ভুনাথ বিয়ে ভেঙে দেন। কন্যা কল্যাণী পিতার আত্মমর্যাদায় উদ্বুদ্ধ হয়ে যৌতুকলোভী পরিবার প্রত্যাখ্যান করে এবং আজীবন দেশ ও নারীশিক্ষার ব্রত গ্রহণ করে। গল্পের শেষে অনুপম সারাজীবন কল্যাণীর স্মৃতি ও ব্যক্তিত্বের সমীহে অনুতপ্ত থাকে।',
    stanzasOrExcerpts: [
      {
        lines: 'মেয়ের পিতা বলিলেন, বেশ তো, গহনা পরীক্ষা করিয়া লউন। কিন্তু বিবাহের লগ্ন পার হইয়া যাইবে না তো?',
        explanation: 'যৌতুকলোভীদের সামনে শম্ভুনাথ সেনের নীরব কিন্তু প্রখর আত্মসম্মানবোধ।'
      },
      {
        lines: 'কল্যাণী বলিল, আমি বিবাহ করিব না।',
        explanation: 'নারী স্বাধীনতার অনন্য প্রকাশ ও ব্যক্তিত্বের দৃঢ় স্ফুরণ।'
      }
    ],
    keyWordsGlossary: [
      { word: 'মাকাল ফল', meaning: 'দেখতে সুন্দর কিন্তু ভেতরে অপদার্থ বা গুণহীন' },
      { word: 'অন্নপূর্ণা', meaning: 'দেবী দুর্গা, ধনধান্যের প্রতীক' },
      { word: 'গণ্ডুষ', meaning: 'এক অঞ্জলি বা এক আঁজলা জল' }
    ],
    learningOutcomes: [
      'যৌতুক প্রথার বিরুদ্ধে সামাজিক সচেতনতা ও তীব্র প্রতিবাদ গড়ে তোলা',
      'নারীর আত্মমর্যাদা ও স্বাধীন চিন্তার বিকাশ উপলব্ধি করা'
    ],
    shortQuestions: [
      { question: 'অনুপমের বন্ধুর নাম কী ছিল?', answer: 'হরিহর বা হরিশ।', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'শম্ভুনাথ সেন বিয়ের আসরে বিয়ে ভেঙে দিয়েছিলেন কেন?', answer: 'বরের মামা তাঁর দেওয়া পারিবারিক গহনার খাঁটিত্ব যাচাই করে কন্যার পিতাকে চরম অসম্মান করায় তিনি বিয়ে ভেঙে দেন।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-op-1',
        question: '‘অপরিচিতা’ গল্পে অনুপমের আসল অভিভাবক কে ছিলেন?',
        options: ['মামা', 'মা', 'পিতা', 'হরিদাস'],
        correctAnswerIndex: 0,
        explanation: 'অনুপম নিজে সিদ্ধান্তহীন ছিল, তার মামাই পরিবারের সর্বেসর্বা ছিলেন।'
      }
    ]
  },
  {
    id: 'hsc-story-raincoat',
    title: 'রেইনকোট',
    banglaTitle: 'রেইনকোট (গল্প — আখতারুজ্জামান ইলিয়াস)',
    poet: 'আখতারুজ্জামান ইলিয়াস',
    poetBio: 'আখতারুজ্জামান ইলিয়াস (১৯৪৩-১৯৯৭), বাংলা সাহিত্যের অন্যতম শ্রেষ্ঠ কথাসাহিত্যিক।',
    classId: 'hsc',
    className: 'এইচএসসি / একাদশ-দ্বাদশ শ্রেণি',
    exam: 'HSC ২০২৬',
    type: 'story',
    typeLabel: 'গল্প',
    subjectName: 'বাংলা প্রথম পত্র (গদ্যাংশ)',
    coreTheme: 'মুক্তিযুদ্ধের উত্তাল আবহ, রেইনকোটের রূপক শক্তি ও একজন ভীরু শিক্ষকের বীরত্বে রূপান্তর',
    moolBhab: 'নূরুল হুদা ছিলেন কলেজের একজন নিরীহ ও ভীতু রসায়নের প্রভাষক। ঢাকার উত্তাল ১৯৭১ সালে তাঁর শ্যালক মিন্টু মুক্তিযুদ্ধে যায় এবং একটি রেইনকোট রেখে যায়। বর্ষার দিনে সেই রেইনকোট গায়ে দিয়ে কলেজে যাওয়ার পর পাক সেনাদের হাতে ধরা পড়েন নূরুল হুদা। পাকিস্তানি ক্যাম্পের চরম নির্যাতনেও তিনি মুক্তিযোদ্ধাদের সন্ধান দেননি; রেইনকোটটি যেন তাঁকে দেশপ্রেমের অপরাজেয় সাহস ও বীরত্বে রূপান্তরিত করেছিল।',
    stanzasOrExcerpts: [
      {
        lines: 'রেইনকোটটা গায়ে দেওয়ার পর থেকেই নূরুল হুদার মনে এক অদ্ভুত উষ্ণতা ও নির্ভীকতা ভর করে।',
        explanation: 'রেইনকোট এখানে সাধারণ পোশাক নয়, মুক্তিযোদ্ধার অপরাজেয় দেশপ্রেমের প্রতীকী আবরণ।'
      }
    ],
    keyWordsGlossary: [
      { word: 'রেইনকোট', meaning: 'মুক্তিযোদ্ধা মিন্টুর রেখে যাওয়া কোট, সাহসের প্রতীক' },
      { word: 'সাবোটাজ', meaning: 'ধ্বংসাত্মক অন্তর্ঘাতী আক্রমণ' },
      { word: 'মিসক্রিয়ান্ট', meaning: 'দুষ্কৃতকারী (পাক বাহিনী মুক্তিযোদ্ধাদের এ নামে ডাকত)' }
    ],
    learningOutcomes: [
      'মুক্তিযুদ্ধে সাধারণ মানুষের বীরত্ব ও রূপান্তরের মনস্তত্ত্ব অনুধাবন',
      'প্রতীকী সাহিত্যের গভীর তাৎপর্য ব্যাখ্যা করতে পারা'
    ],
    shortQuestions: [
      { question: 'রেইনকোটটি মূলত কার ছিল?', answer: 'নূরুল হুদার শ্যালক মুক্তিযোদ্ধা মিন্টুর।', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'নূরুল হুদা মিলিটারির বুটের লাথি খেয়েও কেন আনন্দ অনুভব করেছিলেন?', answer: 'তিনি অনুভব করেছিলেন যে পাকিস্তানিরা মুক্তিযোদ্ধাদের ভয় পায় এবং তিনিও মুক্তিযোদ্ধাদের সহযোগী হয়ে আঘাত সহ্য করছেন।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-rc-1',
        question: '‘রেইনকোট’ গল্পে রেইনকোটটি কিসের প্রতীক?',
        options: ['মুক্তিযুদ্ধের সাহস, চেতনা ও দেশপ্রেমের প্রতীক', 'ধনী পরিবারের বিলাসিতা', 'শীতের পোশাক', 'বৃষ্টির প্রতিরোধক'],
        correctAnswerIndex: 0,
        explanation: 'রেইনকোট পরিধানের পর ভীরু নূরুল হুদার আত্মায় মুক্তিযুদ্ধের চেতনা জাগ্রত হয়।'
      }
    ]
  },

  // ==========================================
  // ইংরেজি সাহিত্য (English Literature: Poems & Prose)
  // ==========================================
  {
    id: 'ssc-eng-daffodils',
    title: 'I Wandered Lonely as a Cloud (Daffodils)',
    banglaTitle: 'ড্যাফোডিলস (I Wandered Lonely as a Cloud — William Wordsworth)',
    poet: 'William Wordsworth',
    poetBio: 'William Wordsworth (1770-1850), the high priest of Romantic English poetry and Nature poet.',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'english_lit',
    typeLabel: 'English Literature',
    subjectName: 'English 1st Paper',
    coreTheme: 'The healing power of nature, aesthetic ecstasy, and tranquil recollection',
    moolBhab: 'The poet was wandering aimlessly like a lone cloud when he suddenly beheld a vast field of golden daffodils fluttering and dancing beside a lake. The joyful spectacle filled his heart with boundless delight. Even later, lying in pensive solitude on his couch, the memory of those flowers flashes upon his "inward eye," filling his soul with renewed bliss.',
    stanzasOrExcerpts: [
      {
        lines: 'I wandered lonely as a cloud / That floats on high o\'er vales and hills, / When all at once I saw a crowd, / A host, of golden daffodils;',
        explanation: 'Introduction of the poet\'s solitude instantly transformed by the miraculous beauty of nature.'
      },
      {
        lines: 'For oft, when on my couch I lie / In vacant or in pensive mood, / They flash upon that inward eye / Which is the bliss of solitude;',
        explanation: 'Nature provides eternal spiritual refreshment through memory and imagination.'
      }
    ],
    keyWordsGlossary: [
      { word: 'Host', meaning: 'A great multitude or large number (বিশাল দল)' },
      { word: 'Glee', meaning: 'Great delight, joy, or merriment (পরম আনন্দ)' },
      { word: 'Pensive', meaning: 'Engaged in deep or serious thought (গভীর ভাবনামগ্ন)' },
      { word: 'Inward eye', meaning: 'Spiritual sight or power of imagination (অন্তর্দৃষ্টি)' }
    ],
    learningOutcomes: [
      'Appreciate romantic imagery and figurative poetic expressions in English',
      'Understand the philosophical link between human tranquility and Mother Nature'
    ],
    shortQuestions: [
      { question: 'What did the poet compare his wandering to?', answer: 'He compared his wandering to a solitary floating cloud over valleys and hills.', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'What does "inward eye" mean in Wordsworth\'s poem?', answer: 'It refers to the human imagination and memory that can visualize past beauty in quiet moments.', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-eng-daf-1',
        question: 'Where were the golden daffodils dancing?',
        options: ['Beside the lake, beneath the trees', 'On the mountaintops', 'Inside a palace garden', 'Along the city streets'],
        correctAnswerIndex: 0,
        explanation: 'Wordsworth describes them beside the lake, beneath the trees, fluttering and dancing in the breeze.'
      }
    ]
  },
  {
    id: 'ssc-eng-mandela',
    title: 'Nelson Mandela: From Black Pimpernel to World Statesman',
    banglaTitle: 'নেলসন ম্যান্ডেলা (Nelson Mandela — Prose Passage)',
    poet: 'NCTB English Reader',
    poetBio: 'Historical biography of Nelson Mandela (1918-2013), South Africa\'s first Black President and Nobel Peace Laureate.',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'english_lit',
    typeLabel: 'English Literature',
    subjectName: 'English 1st Paper',
    coreTheme: 'Fight against apartheid racial discrimination, peace, reconciliation, and human dignity',
    moolBhab: 'Nelson Mandela guided South Africa from the shackles of apartheid to a multi-racial democracy. Imprisoned for nearly three decades on Robben Island for his fight against white minority rule, he never lost his resolve to emancipate his people. He advocated forgiveness over vengeance, earning worldwide reverence as a global icon of peace and reconciliation.',
    stanzasOrExcerpts: [
      {
        lines: 'I have fought against white domination, and I have fought against black domination. I have cherished the ideal of a democratic and free society.',
        explanation: 'Mandela\'s eternal courtroom statement displaying unconditional justice and equality.'
      }
    ],
    keyWordsGlossary: [
      { word: 'Apartheid', meaning: 'Racial segregation and discrimination policy in South Africa (বর্ণবাদ)' },
      { word: 'Emancipation', meaning: 'The fact or process of being set free from legal, social, or political restrictions (মুক্তি)' },
      { word: 'Reconciliation', meaning: 'The restoration of friendly relations (সমঝোতা ও পুনর্মিলন)' }
    ],
    learningOutcomes: [
      'Learn historical vocabulary on civil rights and democratic transitions',
      'Inspire dedication to human rights, justice, and non-violent political leadership'
    ],
    shortQuestions: [
      { question: 'How many years did Nelson Mandela spend in prison?', answer: 'Nearly three decades (27 years).', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'Why is Mandela remembered as an icon of reconciliation?', answer: 'Because instead of seeking revenge after becoming president, he unified black and white citizens under a rainbow nation.', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-eng-man-1',
        question: 'When did Nelson Mandela receive the Nobel Peace Prize?',
        options: ['1993', '1990', '1999', '1985'],
        correctAnswerIndex: 0,
        explanation: 'Mandela was awarded the Nobel Peace Prize jointly with F.W. de Klerk in 1993.'
      }
    ]
  },
  {
    id: 'hsc-eng-patriot',
    title: 'The Patriot (Robert Browning)',
    banglaTitle: 'দ্য প্যাট্রিয়ট (The Patriot — Dramatic Monologue by Robert Browning)',
    poet: 'Robert Browning',
    poetBio: 'Robert Browning (1812-1889), the master of English Victorian dramatic monologues.',
    classId: 'hsc',
    className: 'এইচএসসি / একাদশ-দ্বাদশ শ্রেণি',
    exam: 'HSC ২০২৬',
    type: 'english_lit',
    typeLabel: 'English Literature',
    subjectName: 'English 1st Paper',
    coreTheme: 'Fickleness of public adoration, tragedy of political leaders, and ultimate justice in God',
    moolBhab: 'Exactly one year ago, the patriot was greeted with roses, myrtles, and cheering crowds on every rooftop. Today, falsely accused, he is led bound in ropes to the scaffold in the rain, pelted with stones. Realizing the treacherous fickleness of earthly applause, he finds peace knowing that God alone will judge his true intentions and reward him in heaven.',
    stanzasOrExcerpts: [
      {
        lines: 'It was roses, roses, all the way, / With myrtle mixed in my path like mad: / The house-roofs seemed to heave and sway, / The church-spires flamed, such flags they had, / A year ago on this very day.',
        explanation: 'Vivid imagery depicting the transient glory and intoxicating popularity of the hero.'
      },
      {
        lines: '\'Tis God shall repay: I am safer so.',
        explanation: 'Final philosophical acceptance that divine judgment is incorruptible.'
      }
    ],
    keyWordsGlossary: [
      { word: 'Myrtle', meaning: 'An aromatic evergreen shrub associated with victory (বিজয়সূচক গুল্ম)' },
      { word: 'Scaffold', meaning: 'A raised wooden platform used for executions (ফাঁসির মঞ্চ)' },
      { word: 'Fickle', meaning: 'Changing frequently, especially regarding loyalty (চঞ্চল বা ক্ষণস্থায়ী)' }
    ],
    learningOutcomes: [
      'Master the technique of dramatic monologue and narrative shifts in poetry',
      'Analyze the philosophical contrast between human ingratitude and divine solace'
    ],
    shortQuestions: [
      { question: 'What did the people throw at the patriot when he was being taken to the scaffold?', answer: 'They hurled stones at him, cutting his forehead.', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'Why does the poet say "\'Tis God shall repay: I am safer so"?', answer: 'He believes humans are unjust, but God is all-just and will grant him eternal peace.', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-eng-pat-1',
        question: 'What poetic form is "The Patriot"?',
        options: ['Dramatic monologue', 'Epic ballad', 'Shakespearean sonnet', 'Pastoral elegy'],
        correctAnswerIndex: 0,
        explanation: 'It is a classic dramatic monologue written by Robert Browning.'
      }
    ]
  },

  // ==========================================
  // ইংরেজি ব্যাকরণ (English Language & Grammar Master Guides)
  // ==========================================
  {
    id: 'grammar-right-form-verbs',
    title: 'Right Form of Verbs (ক্রিয়ার সঠিক রূপ)',
    banglaTitle: 'Right Form of Verbs — নিয়মাবলী ও বোর্ড প্রশ্নের সমাধান',
    poet: 'English Grammar Syllabus',
    poetBio: 'NCTB Secondary & Higher Secondary English Grammar Standard.',
    classId: 'ssc',
    className: 'এসএসসি ও এইচএসসি',
    exam: 'SSC ২০২৬',
    type: 'grammar',
    typeLabel: 'ব্যাকরণ',
    subjectName: 'English 2nd Paper (Grammar)',
    coreTheme: 'Subject-Verb Agreement, Tense, Modals, Non-finite forms, and Conditional structures',
    moolBhab: 'বাক্যের সঠিক ভাব ও অর্থ প্রকাশের জন্য Subject-এর Number, Person এবং Tense অনুযায়ী Verb-এর সঠিক রূপ নির্ধারণ করাই হলো Right Form of Verbs। বোর্ড পরীক্ষায় ভালো নম্বর পেতে Subject-verb agreement, Gerund/Infinitive, Passive voice, এবং Conditional বাক্যের নিয়মসমূহ সুস্পষ্টভাবে আয়ত্ত করা অপরিহার্য।',
    stanzasOrExcerpts: [
      {
        lines: 'Rule 1: As well as, along with, together with, accompanied by থাকলে ১ম Subject অনুযায়ী Verb বসে।',
        explanation: 'Example: The captain along with his players (is/are) present. Ans: is.'
      },
      {
        lines: 'Rule 2: It is high time / It is time এর পর Subject থাকলে Verb-এর Past form (V2) বসে।',
        explanation: 'Example: It is high time we (change) our bad habits. Ans: changed.'
      },
      {
        lines: 'Rule 3: With a view to, look forward to, get used to এর পর Verb-এর সাথে ing যুক্ত হয়।',
        explanation: 'Example: He went to the library with a view to (read) books. Ans: reading.'
      }
    ],
    keyWordsGlossary: [
      { word: 'Subject-Verb Agreement', meaning: 'Subject-এর সাথে Verb-এর সঙ্গতিপূর্ণ রূপ' },
      { word: 'Non-finite Verb', meaning: 'অসমাপিকা ক্রিয়া (Gerund, Participle, Infinitive)' },
      { word: 'Conditional Sentences', meaning: 'শর্তযুক্ত বাক্য (1st, 2nd, 3rd conditionals)' }
    ],
    learningOutcomes: [
      'বোর্ড পরীক্ষার শূন্যস্থানে Verb-এর সঠিক রূপ নির্বাচন করতে পারা',
      'ভুল বাক্য সংশোধন ও আত্মবিশ্বাসের সাথে ইংরেজি রচনা লেখা'
    ],
    shortQuestions: [
      { question: '‘Lest’ যুক্ত বাক্যে Verb-এর পূর্বে কোন Modal বসে?', answer: 'Should বা Might বসে (যেমন: lest he should fail).', mark: 1, type: 'জ্ঞানমূলক' },
      { question: '‘No sooner had... than’ বাক্যে Tense-এর গঠন কী?', answer: 'Had-এর পর Verb-এর Past Participle (V3) এবং Than-এর পর Past Indefinite (V2) বসে।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-rfv-1',
        question: 'Neither of the boys ____ present in the class yesterday.',
        options: ['was', 'were', 'are', 'have been'],
        correctAnswerIndex: 0,
        explanation: '\'Neither of\' singular subject নির্দেশ করে, তাই past tense-এ \'was\' হবে।'
      }
    ]
  },
  {
    id: 'grammar-narration-speech',
    title: 'Narration / Direct & Indirect Speech (উক্তি পরিবর্তন)',
    banglaTitle: 'Narration (উক্তি পরিবর্তন) — Passage Narration Rules',
    poet: 'English Grammar Syllabus',
    poetBio: 'NCTB Secondary & Higher Secondary English 2nd Paper.',
    classId: 'hsc',
    className: 'এইচএসসি ও এসএসসি',
    exam: 'HSC ২০২৬',
    type: 'grammar',
    typeLabel: 'ব্যাকরণ',
    subjectName: 'English 2nd Paper (Grammar)',
    coreTheme: 'Assertive, Interrogative, Imperative, Optative, Exclamatory and Passage Narration conversion',
    moolBhab: 'বক্তার বক্তব্যকে প্রত্যক্ষ (Direct) রূপ থেকে পরোক্ষ (Indirect) রূপে রূপান্তর করার পদ্ধতিই হলো Narration। এতে Reporting Verb পরিবর্তন, Conjunction যুক্তকরণ, Person পরিবর্তন (123/SON formula), Tense পরিবর্তন এবং নৈকট্যসূচক শব্দের দূরত্বসূচক শব্দে রূপান্তরের নিয়মাবলি সঠিকভাবে অনুসরণ করতে হয়।',
    stanzasOrExcerpts: [
      {
        lines: 'Person Rule (SON): 1st person follows Subject, 2nd person follows Object, 3rd person No change.',
        explanation: 'উদ্ধৃতি চিহ্নের ভেতরের Person পরিবর্তনের মৌলিক সূত্র।'
      },
      {
        lines: 'Tense Rule: Present Indefinite -> Past Indefinite; Present Continuous -> Past Continuous; Past Indefinite -> Past Perfect.',
        explanation: 'Reporting verb past tense-এ থাকলে Tense এক ধাপ পিছিয়ে যায়।'
      }
    ],
    keyWordsGlossary: [
      { word: 'Reporting Verb', meaning: 'যে ক্রিয়াপদের সাহায্যে বক্তার বক্তব্য উপস্থাপন করা হয় (said, asked)' },
      { word: 'Reported Speech', meaning: 'বক্তার প্রত্যক্ষ বক্তব্য যা ইনভার্টেড কমার ভেতরে থাকে' }
    ],
    learningOutcomes: [
      'Passage Narration সফলভাবে সমাধান করার কৌশল অর্জন',
      'উভয়মুখী কথোপকথন স্পষ্টভাবে ইংরেজিতে প্রকাশ করা'
    ],
    shortQuestions: [
      { question: 'Interrogative বাক্যে reporting verb ‘said’ পরিবর্তিত হয়ে কী হয়?', answer: 'Asked বা Inquired of হয়।', mark: 1, type: 'জ্ঞানমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-narr-1',
        question: 'He said, "I have done my duty." — এর Indirect Speech কী?',
        options: ['He said that he had done his duty.', 'He said that I had done my duty.', 'He told that he has done his duty.', 'He said he did his duty.'],
        correctAnswerIndex: 0,
        explanation: 'Present perfect পরিবর্তিত হয়ে past perfect (had done) হবে এবং 1st person subject \'he\' অনুযায়ী পরিবর্তিত হবে।'
      }
    ]
  },

  // ==========================================
  // বাংলা ব্যাকরণ (Bangla Grammar Master Topics)
  // ==========================================
  {
    id: 'b-grammar-shondhi',
    title: 'সন্ধি (স্বরসন্ধি, ব্যঞ্জনসন্ধি ও বিসর্গসন্ধি)',
    banglaTitle: 'সন্ধি — নিয়মাবলী, সূত্র ও গুরুত্বপূর্ণ উদাহরণ',
    poet: 'বাংলা ব্যাকরণ ও নির্মিতি',
    poetBio: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) ৯ম-১০ম ও একাদশ-দ্বাদশ শ্রেণি।',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'grammar',
    typeLabel: 'ব্যাকরণ',
    subjectName: 'বাংলা দ্বিতীয় পত্র (ব্যাকরণ)',
    coreTheme: 'পাশাপাশি অবস্থিত দুটি ধ্বনির মিলন, পরিবর্তন বা বিলোপের নিয়মাবলী',
    moolBhab: 'সন্ধি শব্দের অর্থ মিলন। দ্রুত উচ্চারণের ফলে পাশাপাশি দুটি ধ্বনির মিলন ঘটে, কোনো একটি লোপ পায় বা একটি নতুন ধ্বনির রূপ নেয়। সন্ধি মূলত দুই প্রকার: বাংলা সন্ধি ও তৎসম সন্ধি। তৎসম সন্ধি আবার তিন প্রকার: স্বরসন্ধি, ব্যঞ্জনসন্ধি ও বিসর্গসন্ধি। সন্ধি ভাষাকে সংক্ষিপ্ত, শ্রুতিমধুর ও গতিশীল করে তোলে।',
    stanzasOrExcerpts: [
      {
        lines: 'অ/আ + ই/ঈ = এ (যেমন: নর + ইন্দ্র = নরেন্দ্র, মহ + ঈশ্বর = মহেশ্বর)',
        explanation: 'গুণ স্বরসন্ধির প্রধান সূত্র।'
      },
      {
        lines: 'নিপাতনে সিদ্ধ সন্ধি: যা কোনো সাধারণ নিয়ম বা সূত্রের আওতায় পড়ে না (যেমন: গো + অক্ষ = গবাক্ষ, এক + দশ = একাদশ)',
        explanation: 'ব্যতিক্রমী কিন্তু পরীক্ষায় বারবার আসা সন্ধি সাধিত শব্দ।'
      }
    ],
    keyWordsGlossary: [
      { word: 'স্বরসন্ধি', meaning: 'স্বরধ্বনির সাথে স্বরধ্বনির মিলন' },
      { word: 'ব্যঞ্জনসন্ধি', meaning: 'স্বর ও ব্যঞ্জন বা ব্যঞ্জন ও ব্যঞ্জনের মিলন' },
      { word: 'নিপাতনে সিদ্ধ', meaning: 'যে সন্ধি কোনো সাধারণ নিয়ম মানে না' }
    ],
    learningOutcomes: [
      'সন্ধি বিচ্ছেদ ও সন্ধিবদ্ধ পদ নির্ভুলভাবে নির্ণয় করতে পারা',
      'বাংলা বানান ও শব্দ গঠনের সঠিক নিয়ম সম্পর্কে সম্যক জ্ঞান লাভ'
    ],
    shortQuestions: [
      { question: '‘বিদ্যালয়’ শব্দের সন্ধি বিচ্ছেদ কী?', answer: 'বিদ্যা + আলয় = বিদ্যালয়।', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'নিপাতনে সিদ্ধ সন্ধি কাকে বলে?', answer: 'যে সন্ধি ব্যাকরণের সাধারণ নিয়মের বাইরে প্রথাগতভাবে সিদ্ধ হয়েছে, তাকে নিপাতনে সিদ্ধ সন্ধি বলে।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-shondhi-1',
        question: '‘পাবক’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?',
        options: ['পো + অক', 'পৌ + অক', 'পা + বক', 'পব + অক'],
        correctAnswerIndex: 1,
        explanation: 'ঔ + অ = আব্ নিয়ম অনুযায়ী পৌ + অক = পাবক।'
      }
    ]
  },
  {
    id: 'b-grammar-shomash',
    title: 'সমাস (দ্বন্দ্ব, দ্বিগু, কর্মধারয়, তৎপুরুষ, বহুব্রীহি ও অব্যয়ীভাব)',
    banglaTitle: 'সমাস — প্রকারভেদ ও ব্যাসবাক্যসহ সমাস নির্ণয়',
    poet: 'বাংলা ব্যাকরণ ও নির্মিতি',
    poetBio: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) ব্যাকরণ কাঠামো।',
    classId: 'ssc',
    className: 'এসএসসি ও এইচএসসি',
    exam: 'SSC ২০২৬',
    type: 'grammar',
    typeLabel: 'ব্যাকরণ',
    subjectName: 'বাংলা দ্বিতীয় পত্র (ব্যাকরণ)',
    coreTheme: 'একাধিক পদের একপদীকরণ ও নতুন অর্থবোধক শব্দ গঠনের প্রক্রিয়া',
    moolBhab: 'অর্থের সংগতি বিশিষ্ট দুই বা ততোধিক পদ এক পদে পরিণত হওয়াকে সমাস বলে। সমাসের মাধ্যমে নতুন শব্দ সৃষ্টি হয় এবং ভাষার প্রকাশভঙ্গি সংক্ষেপ ও সৌন্দর্যমণ্ডিত হয়। প্রধান ছয় প্রকার সমাস হলো: দ্বন্দ্ব (উভয় পদ প্রধান), কর্মধারয় (পরপদ প্রধান), তৎপুরুষ (বিভক্তি লোপে পরপদ প্রধান), বহুব্রীহি (অন্য পদ প্রধান), দ্বিগু (সংখ্যাবাচক পূর্বপদ), এবং অব্যয়ীভাব (অব্যয় পদের অর্থ প্রধান)।',
    stanzasOrExcerpts: [
      {
        lines: 'বহুব্রীহি সমাস: পূর্বপদ বা পরপদ কোনোটির অর্থ না বুঝিয়ে সম্পূর্ণ তৃতীয় কোনো ব্যক্তি বা বস্তুকে বোঝায়।',
        explanation: 'যেমন: দশ আনন যার = দশানন (রাবণ); পীত অম্বর যার = পীতাম্বর (শ্রীকৃষ্ণ)।'
      }
    ],
    keyWordsGlossary: [
      { word: 'সমস্তপদ', meaning: 'সমাস নিষ্পন্ন মূল শব্দটি' },
      { word: 'ব্যাসবাক্য', meaning: 'সমস্তপদকে ভেঙে যে বাক্য তৈরি করা হয় (বিগ্রহবাক্য)' }
    ],
    learningOutcomes: [
      'পরীক্ষায় প্রদত্ত শব্দের ব্যাসবাক্য লিখে সমাসের নাম নির্ধারণ করতে পারা',
      'বাংলা ভাষার শব্দ গঠন কৌশল গভীরভাবে হৃদয়ঙ্গম করা'
    ],
    shortQuestions: [
      { question: 'যে সমাসে উভয় পদের অর্থ প্রাধান্য পায় তাকে কী সমাস বলে?', answer: 'দ্বন্দ্ব সমাস (যেমন: মা ও বাবা = মা-বাবা)।', mark: 1, type: 'জ্ঞানমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-shomash-1',
        question: '‘সিংহাসন’ কোন সমাসের উদাহরণ?',
        options: ['মধ্যপদলোপী কর্মধারয়', 'তৎপুরুষ সমাস', 'দ্বন্দ্ব সমাস', 'বহুব্রীহি সমাস'],
        correctAnswerIndex: 0,
        explanation: 'সিংহ চিহ্নিত আসন = সিংহাসন (মধ্যপদ \'চিহ্নিত\' লোপ পেয়েছে)।'
      }
    ]
  },

  // ==========================================
  // বাংলাদেশ ও বিশ্বপরিচয় (Bangladesh and Global Studies - BGS)
  // ==========================================
  {
    id: 'bgs-muktijuddho-1971',
    title: 'বাঙালির মুক্তিযুদ্ধ ও স্বাধীন বাংলাদেশের অভ্যুদয়',
    banglaTitle: '১৯৭১-এর মহান মুক্তিযুদ্ধ ও স্বাধীন বাংলাদেশের জন্ম (BGS)',
    poet: 'বাংলাদেশ ও বিশ্বপরিচয় পাঠ্যসূচি',
    poetBio: 'NCTB জাতীয় শিক্ষাক্রম (১০ম শ্রেণি ও এসএসসি)।',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'bgs',
    typeLabel: 'বাংলাদেশ ও বিশ্বপরিচয়',
    subjectName: 'বাংলাদেশ ও বিশ্বপরিচয় (অধ্যায় ১ ও ২)',
    coreTheme: 'ঐতিহাসিক পটভূমি, ২৫শে মার্চের গণহত্যা, ৭ই মার্চের ভাষণ ও নয় মাসের সশস্ত্র প্রতিরোধ',
    moolBhab: '১৯৪৭ সালে দেশভাগের পর থেকে পাকিস্তানি শাসকগোষ্ঠীর রাজনৈতিক, অর্থনৈতিক ও সাংস্কৃতিক বৈষম্যের বিরুদ্ধে পূর্ব বাংলায় ধারাবাহিক আন্দোলন গড়ে ওঠে। ১৯৭১ সালের ৭ই মার্চ বঙ্গবন্ধুর ঐতিহাসিক ভাষণ জাতিকে যুদ্ধের প্রস্তুতি এনে দেয়। ২৫শে মার্চ কালরাতে পরিচালিত বর্বর অপারেশন সার্চলাইটের পর ২৬শে মার্চ প্রথম প্রহরে স্বাধীনতা ঘোষণার মাধ্যমে সর্বাত্মক মুক্তিযুদ্ধ শুরু হয়। ত্রিশ লাখ শহীদের রক্ত ও দুই লাখ মা-বোনের সম্ভ্রমের বিনিময়ে ১৬ই ডিসেম্বর চূড়ান্ত বিজয় অর্জিত হয়।',
    stanzasOrExcerpts: [
      {
        lines: '৭ই মার্চের ভাষণ: "এবারের সংগ্রাম আমাদের মুক্তির সংগ্রাম, এবারের সংগ্রাম স্বাধীনতার সংগ্রাম।" — ইউনেস্কো কর্তৃক বিশ্ব প্রামাণ্য ঐতিহ্য স্বীকৃত।',
        explanation: 'বাঙালি জাতির স্বাধীনতার অলিখিত রণকৌশল ও চূড়ান্ত নির্দেশ।'
      },
      {
        lines: 'মুজিবনগর সরকার: ১৯৭১ সালের ১০ই এপ্রিল গঠিত এবং ১৭ই এপ্রিল মেহেরপুরের বৈদ্যনাথতলায় শপথ গ্রহণ করে মুক্তিযুদ্ধের নেতৃত্ব দেয়।',
        explanation: 'স্বাধীন বাংলাদেশের প্রথম সাংবিধানিক সরকার।'
      }
    ],
    keyWordsGlossary: [
      { word: 'অপারেশন সার্চলাইট', meaning: '১৯৭১ সালের ২৫শে মার্চ রাতে পাকিস্তানি বাহিনীর বর্বরোচিত গণহত্যা অভিযান' },
      { word: 'মুজিবনগর সরকার', meaning: 'মুক্তিযুদ্ধ পরিচালনাকারী প্রথম বাংলাদেশ সরকার' },
      { word: 'মুক্তিবাহিনী', meaning: 'নিয়মিত ও অনিয়মিত বীর মুক্তিযোদ্ধাদের সম্মিলিত সশস্ত্র বাহিনী' }
    ],
    learningOutcomes: [
      'মহান মুক্তিযুদ্ধের অবিনাশী চেতনা ও মূল্যবোধ অন্তরে ধারণ করা',
      'স্বাধীনতার সঠিক ইতিহাস ও জাতির পিতার ঐতিহাসিক ভূমিকা অনুধাবন'
    ],
    shortQuestions: [
      { question: 'মুজিবনগর সরকারের অস্থায়ী রাষ্ট্রপতি কে ছিলেন?', answer: 'সৈয়দ নজরুল ইসলাম।', mark: 1, type: 'জ্ঞানমূলক' },
      { question: '৭ই মার্চের ভাষণকে কেন বাঙালির মুক্তির সনদ বলা হয়?', answer: 'এই ভাষণের মাধ্যমে বঙ্গবন্ধু পুরো জাতিকে ঐক্যবদ্ধ করে স্বাধীনতা যুদ্ধের জন্য সশস্ত্র প্রস্তুতি গ্রহণের সুস্পষ্ট দিকনির্দেশনা দিয়েছিলেন।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-bgs-1',
        question: 'মুজিবনগর সরকারের প্রধানমন্ত্রী কে ছিলেন?',
        options: ['তাজউদ্দীন আহমদ', 'সৈয়দ নজরুল ইসলাম', 'ক্যাপ্টেন এম. মনসুর আলী', 'এ.এইচ.এম. কামারুজ্জামান'],
        correctAnswerIndex: 0,
        explanation: 'প্রথম বাংলাদেশ সরকারের প্রধানমন্ত্রী ছিলেন তাজউদ্দীন আহমদ।'
      }
    ]
  },
  {
    id: 'bgs-constitution-rights',
    title: 'বাংলাদেশের সংবিধান ও মৌলিক নাগরিক অধিকার',
    banglaTitle: 'গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান ও নাগরিক দায়িত্ব (BGS)',
    poet: 'বাংলাদেশ ও বিশ্বপরিচয় পাঠ্যসূচি',
    poetBio: 'NCTB জাতীয় শিক্ষাক্রম।',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'bgs',
    typeLabel: 'বাংলাদেশ ও বিশ্বপরিচয়',
    subjectName: 'বাংলাদেশ ও বিশ্বপরিচয় (অধ্যায় ৭)',
    coreTheme: 'সংবিধানের চার মূলনীতি, গণতান্ত্রিক শাসনব্যবস্থা ও নাগরিকের মৌলিক অধিকার',
    moolBhab: '১৯৭২ সালের ৪ঠা নভেম্বর গৃহীত এবং ১৬ই ডিসেম্বর কার্যকর হওয়া বাংলাদেশের সংবিধান হলো রাষ্ট্রের সর্বোচ্চ আইন। এর মূল চারটি স্তম্ভ হলো জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা। সংবিধানে আইনের দৃষ্টিতে সকল নাগরিকের সমতা, বাকস্বাধীনতা, শিক্ষার অধিকার ও জীবনের অধিকারসহ মৌলিক অধিকারের পূর্ণ গ্যারান্টি দেওয়া হয়েছে। একই সাথে কর প্রদান ও আইনের প্রতি আনুগত্য নাগরিকের প্রধান দায়িত্ব।',
    stanzasOrExcerpts: [
      {
        lines: 'সংবিধানের মৌলিক চার মূলনীতি: জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা।',
        explanation: 'রাষ্ট্র পরিচালনার মূল দিকনির্দেশক আদর্শ।'
      }
    ],
    keyWordsGlossary: [
      { word: 'সংবিধান', meaning: 'রাষ্ট্র পরিচালনার মৌলিক বিধিসংবলিত সর্বোচ্চ আইনগ্রন্থ' },
      { word: 'মৌলিক অধিকার', meaning: 'সংবিধান দ্বারা স্বীকৃত ও সংরক্ষিত নাগরিকের অপরিহার্য অধিকার' }
    ],
    learningOutcomes: [
      'সংবিধানের মর্যাদা রক্ষা ও একজন সচেতন দেশপ্রেমিক নাগরিক হিসেবে গড়ে ওঠা',
      'আইন মান্য করা ও গণতান্ত্রিক মূল্যবোধের চর্চা করা'
    ],
    shortQuestions: [
      { question: 'বাংলাদেশের সংবিধান কোন তারিখে গণপরিষদে গৃহীত হয়?', answer: '১৯৭২ সালের ৪ঠা নভেম্বর।', mark: 1, type: 'জ্ঞানমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-bgs-con-1',
        question: 'বাংলাদেশের সংবিধানের খসড়া প্রণয়ন কমিটির প্রধান কে ছিলেন?',
        options: ['ড. কামাল হোসেন', 'তাজউদ্দীন আহমদ', 'আব্দুর রাজ্জাক', 'বিচারপতি আবু সাঈদ চৌধুরী'],
        correctAnswerIndex: 0,
        explanation: 'সংবিধানের খসড়া কমিটির সভাপতি ছিলেন তৎকালীন আইনমন্ত্রী ড. কামাল হোসেন।'
      }
    ]
  },

  // ==========================================
  // বিজ্ঞান (Science Master Core Topics)
  // ==========================================
  {
    id: 'sci-motion-force-physics',
    title: 'বল ও গতি (Force and Motion — পদার্থবিজ্ঞান)',
    banglaTitle: 'বল, গতি ও নিউটনের গতিসূত্র (পদার্থবিজ্ঞান — বিজ্ঞান)',
    poet: 'পদার্থবিজ্ঞান ও বিজ্ঞান পাঠ্যসূচি',
    poetBio: 'NCTB জাতীয় শিক্ষাক্রম (৮ম ও ১০ম শ্রেণি)।',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'science',
    typeLabel: 'বিজ্ঞান',
    subjectName: 'বিজ্ঞান ও পদার্থবিজ্ঞান',
    coreTheme: 'গতি সমীকরণ, নিউটনের ৩টি গতিসূত্র, ভরবেগ সংরক্ষণ সূত্র ও ঘর্ষণ বল',
    moolBhab: 'বাহ্যিক বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকে এবং গতিশীল বস্তু সুষম দ্রুতিতে সরলরেখায় চলতে থাকে (নিউটনের ১ম সূত্র)। বল প্রয়োগের ফলে বস্তুর ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমানুপাতিক (F = ma, ২য় সূত্র)। প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে (৩য় সূত্র)। এ নীতিগুলোর ওপর ভিত্তি করে মহাকাশে রকেট উৎক্ষেপণ থেকে শুরু করে দৈনন্দিন জীবনের সকল গতি সঞ্চালিত হয়।',
    stanzasOrExcerpts: [
      {
        lines: 'গতির চারটি মৌলিক সমীকরণ: (১) v = u + at, (২) s = ((u + v)/2) * t, (৩) s = ut + 0.5 * a * t^2, (৪) v^2 = u^2 + 2as',
        explanation: 'সরলরেখায় সুষম ত্বরণে চলমান বস্তুর গাণিতিক সমাধান সূত্র।'
      },
      {
        lines: 'নিউটনের ৩য় সূত্র: Action = -Reaction. রকেটের গ্যাস নির্গমন ও সামনে এগিয়ে চলা এর উৎকৃষ্ট প্রমাণ।',
        explanation: 'ক্রিয়া ও প্রতিক্রিয়া দুটি ভিন্ন বস্তুর ওপর কাজ করে।'
      }
    ],
    keyWordsGlossary: [
      { word: 'জড়তা (Inertia)', meaning: 'বস্তুর যে ধর্মের জন্য সে স্থির বা গতিশীল অবস্থা বজায় রাখতে চায়' },
      { word: 'ত্বরণ (Acceleration)', meaning: 'সময়ের সাথে বস্তুর বেগের পরিবর্তনের হার (a = (v-u)/t)' },
      { word: 'ভরবেগ (Momentum)', meaning: 'ভর ও বেগের গুণফল (p = mv)' }
    ],
    learningOutcomes: [
      'নিউটনের গতিসূত্রের বাস্তব প্রয়োগ ও গাণিতিক সমস্যা সমাধান করতে পারা',
      'গতি ও বলের পারস্পরিক সম্পর্ক বৈজ্ঞানিক দৃষ্টিকোণ থেকে ব্যাখ্যা করা'
    ],
    shortQuestions: [
      { question: 'বলের এসআই (SI) একক কী?', answer: 'নিউটন (Newton বা N)।', mark: 1, type: 'জ্ঞানমূলক' },
      { question: 'চলন্ত বাস হঠাৎ ব্রেক কষলে যাত্রীরা সামনের দিকে ঝুঁকে পড়ে কেন?', answer: 'গতি জড়তার কারণে যাত্রীদের দেহের নিচের অংশ বাসের সাথে থেমে গেলেও ওপরের অংশ গতি বজায় রাখতে চায়।', mark: 2, type: 'অনুধাবনমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-sci-force-1',
        question: '১০ কেজি ভরের একটি বস্তুর ওপর ২০ নিউটন বল প্রয়োগ করলে তার ত্বরণ কত হবে?',
        options: ['২ মি/সেকেন্ড²', '০.৫ মি/সেকেন্ড²', '২০০ মি/সেকেন্ড²', '১০ মি/সেকেন্ড²'],
        correctAnswerIndex: 0,
        explanation: 'F = ma সূত্রানুযায়ী, a = F / m = ২০ / ১০ = ২ মিটার/সেকেন্ড²।'
      }
    ]
  },
  {
    id: 'sci-atomic-structure-chemistry',
    title: 'পরমাণুর গঠন ও রাসায়নিক বন্ধন (রসায়ন — বিজ্ঞান)',
    banglaTitle: 'পরমাণুর গঠন, পর্যায় সারণি ও রাসায়নিক বন্ধন (বিজ্ঞান/রসায়ন)',
    poet: 'রসায়ন ও বিজ্ঞান পাঠ্যসূচি',
    poetBio: 'NCTB জাতীয় শিক্ষাক্রম।',
    classId: 'ssc',
    className: 'এসএসসি / ৯ম-১০ম শ্রেণি',
    exam: 'SSC ২০২৬',
    type: 'science',
    typeLabel: 'বিজ্ঞান',
    subjectName: 'বিজ্ঞান ও রসায়ন',
    coreTheme: 'ইলেকট্রন বিন্যাস, অষ্টক নিয়ম, আয়নিক ও সমযোজী বন্ধন',
    moolBhab: 'পদার্থের ক্ষুদ্রতম কণা পরমাণু ইলেকট্রন, প্রোটন ও নিউট্রন দিয়ে গঠিত। পরমাণুর কেন্দ্রে থাকে ধনাত্মক চার্জযুক্ত নিউক্লিয়াস এবং বাইরে নির্দিষ্ট কক্ষপথে ইলেকট্রন পরিভ্রমণ করে। প্রতিটি মৌল স্থিতিশীল ইলেকট্রন বিন্যাস (অষ্টক বা দ্বিত্ব) অর্জনের জন্য ইলেকট্রন আদান-প্রদান করে আয়নিক বন্ধন অথবা শেয়ার করে সমযোজী বন্ধন গঠন করে। পানির অণু (H2O) সমযোজী এবং খাদ্য লবণ (NaCl) আয়নিক বন্ধনের উৎকৃষ্ট উদাহরণ।',
    stanzasOrExcerpts: [
      {
        lines: 'আয়নিক বন্ধন: ধাতু থেকে অধাতুতে ইলেকট্রন স্থানান্তরের মাধ্যমে সৃষ্ট ধনাত্মক ও ঋণাত্মক আয়নের আকর্ষণে গঠিত হয়।',
        explanation: 'উদাহরণ: Na+ + Cl- -> NaCl (খাবার লবণ)।'
      },
      {
        lines: 'সমযোজী বন্ধন: দুটি অধাতব পরমাণুর মধ্যে ইলেকট্রন যুগল শেয়ারের মাধ্যমে গঠিত হয়।',
        explanation: 'উদাহরণ: দুটি হাইড্রোজেন পরমাণুর ইলেকট্রন শেয়ার করে H2 গ্যাস সৃষ্টি।'
      }
    ],
    keyWordsGlossary: [
      { word: 'আইসোটোপ', meaning: 'একই পারমাণবিক সংখ্যা বিশিষ্ট কিন্তু ভিন্ন ভরসংখ্যার পরমাণু' },
      { word: 'যোজ্যতা (Valency)', meaning: 'অন্য কোনো পরমাণুর সাথে যুক্ত হওয়ার ক্ষমতা' },
      { word: 'অষ্টক নিয়ম', meaning: 'সবচেয়ে বাইরের শক্তিস্তরে ৮টি ইলেকট্রন ধারণের প্রবণতা' }
    ],
    learningOutcomes: [
      'মৌলের ইলেকট্রন বিন্যাস থেকে তার রাসায়নিক ধর্ম ও বন্ধন প্রকৃতি বুঝতে পারা',
      'দৈনন্দিন জীবনের যৌগসমূহের গঠন ব্যাখ্যা করতে পারা'
    ],
    shortQuestions: [
      { question: 'পরমাণুর নিউক্লিয়াসে কোন কোন কণা থাকে?', answer: 'প্রোটন ও নিউট্রন (ইলেকট্রন বাইরে ঘোরে)।', mark: 1, type: 'জ্ঞানমূলক' }
    ],
    mcqs: [
      {
        id: 'mcq-sci-chem-1',
        question: 'খাবার লবণ (NaCl) এর মধ্যে কোন ধরনের বন্ধন বিদ্যমান?',
        options: ['আয়নিক বন্ধন', 'সমযোজী বন্ধন', 'ধাতব বন্ধন', 'হাইড্রোজেন বন্ধন'],
        correctAnswerIndex: 0,
        explanation: 'সোডিয়াম ইলেকট্রন ত্যাগ করে এবং ক্লোরিন ইলেকট্রন গ্রহণ করে আয়নিক বন্ধন তৈরি করে।'
      }
    ]
  }
];
