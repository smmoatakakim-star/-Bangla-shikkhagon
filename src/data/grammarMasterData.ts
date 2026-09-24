export interface GrammarTopic {
  id: string;
  title: string;
  banglaTitle: string;
  level: 'Class 6-8' | 'Class 9-10' | 'All Classes (৬ষ্ঠ-১০ম)';
  category: 'Parts of Speech' | 'Tense & Verbs' | 'Sentence & Syntax' | 'Advanced Grammar' | 'Writing & Vocabulary';
  summary: string;
  rules: {
    ruleNo: number;
    ruleTitle: string;
    explanation: string;
    formula?: string;
    examples: { sentence: string; explanation: string }[];
  }[];
  mcqs: {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
}

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'parts-of-speech',
    title: 'Parts of Speech (পদ প্রকরণ)',
    banglaTitle: 'Parts of Speech — পদ প্রকরণ ও শ্রেণিবিভাগ',
    level: 'All Classes (৬ষ্ঠ-১০ম)',
    category: 'Parts of Speech',
    summary: 'ইংরেজি বাক্যে ব্যবহৃত প্রতিটি শব্দকে তাদের কাজ ও গঠন অনুযায়ী ৮টি ভাগে ভাগ করা হয়।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: '৮ প্রকার Parts of Speech চেনার নিয়ম',
        explanation: 'Noun (নাম), Pronoun (নামের পরিবর্তে), Adjective (দোষ/গুণ), Verb (কাজ), Adverb (ক্রিয়া/বিশেষণের ধরন), Preposition (অবস্থান), Conjunction (সংযোজক), Interjection (আবেগসূচক)।',
        formula: 'Sentence = Noun/Pronoun + Verb + Object/Complement',
        examples: [
          { sentence: 'Rahim plays cricket skillfully.', explanation: 'Rahim (Noun), plays (Verb), cricket (Noun), skillfully (Adverb)।' },
          { sentence: 'Alas! The man is dead.', explanation: 'Alas! হলো Interjection এবং is হলো Verb।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-pos-1',
        question: 'Identify the part of speech of the underlined word: "She runs **quickly**."',
        options: ['Adjective', 'Adverb', 'Verb', 'Noun'],
        correctAnswerIndex: 1,
        explanation: '"Quickly" শব্দটি "runs" verb-টিকে modify করছে (কীভাবে দৌড়ায়), তাই এটি Adverb of manner।',
        difficulty: 'easy',
      },
      {
        id: 'gm-pos-2',
        question: 'In the sentence "Honesty is the best policy", what kind of noun is "Honesty"?',
        options: ['Proper Noun', 'Common Noun', 'Collective Noun', 'Abstract Noun'],
        correctAnswerIndex: 3,
        explanation: 'Honesty বা সততা হলো গুণবাচক অনুভূতি যা স্পর্শ করা যায় না, তাই এটি Abstract Noun।',
        difficulty: 'easy',
      },
      {
        id: 'gm-pos-3',
        question: 'Which word in "Look before you leap" is a Conjunction?',
        options: ['Look', 'before', 'you', 'leap'],
        correctAnswerIndex: 1,
        explanation: '"before" এখানে দুটি clause (Look এবং you leap)-কে সংযুক্ত করেছে, তাই এটি Conjunction।',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'tenses-all',
    title: 'All 12 Tenses with Rules & Formulas',
    banglaTitle: 'Tense — কাল ও প্রকারভেদ (১২টি টেন্সের সহজ সূত্র)',
    level: 'All Classes (৬ষ্ঠ-১০ম)',
    category: 'Tense & Verbs',
    summary: 'ক্রিয়া সম্পাদনের নির্দিষ্ট সময়কেই Tense বলে। এটি ইংরেজি ব্যাকরণের মেরুদণ্ড।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Present Indefinite Tense (সাধারণ বর্তমান)',
        explanation: 'চিরন্তন সত্য (Universal Truth), অভ্যাসগত কাজ (Habitual fact) এবং বর্তমানের সাধারণ কাজে ব্যবহৃত হয়। Subject third person singular (He/She/It/Name) হলে verb-এর সাথে s/es বসে।',
        formula: 'Subject + V1 (s/es) + Object',
        examples: [
          { sentence: 'The sun rises in the east.', explanation: 'চিরন্তন সত্য হওয়ায় rises হয়েছে।' },
          { sentence: 'He goes to school every day.', explanation: 'অভ্যাসগত কাজ হওয়ায় go এর সাথে es যোগ হয়ে goes হয়েছে।' },
        ],
      },
      {
        ruleNo: 2,
        ruleTitle: 'Present Continuous Tense (ঘটমান বর্তমান)',
        explanation: 'বর্তমানে কোনো কাজ চলমান বা ঘটছে বোঝালে এটি ব্যবহৃত হয়।',
        formula: 'Subject + am / is / are + V1 + ing + Object',
        examples: [
          { sentence: 'They are playing football in the field.', explanation: 'কাজটি বর্তমানে ঘটছে।' },
        ],
      },
      {
        ruleNo: 3,
        ruleTitle: 'Present Perfect Tense (পুরাঘটিত বর্তমান)',
        explanation: 'কোনো কাজ এইমাত্র শেষ হয়েছে কিন্তু তার ফল এখনও বিদ্যমান।',
        formula: 'Subject + have / has + V3 (Past Participle) + Object',
        examples: [
          { sentence: 'I have finished my homework.', explanation: 'have + finished (V3) ব্যবহার করা হয়েছে।' },
        ],
      },
      {
        ruleNo: 4,
        ruleTitle: 'Past Indefinite Tense (সাধারণ অতীত)',
        explanation: 'অতীতের কোনো নির্দিষ্ট সময়ে কোনো কাজ সম্পন্ন হয়েছিল বোঝালে Past Indefinite হয়।',
        formula: 'Subject + V2 (Past Form) + Object',
        examples: [
          { sentence: 'He went to Dhaka yesterday.', explanation: 'yesterday অতীত নির্দেশক শব্দ, তাই go-এর past form went বসেছে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-ten-1',
        question: 'Choose the correct sentence in Present Perfect Tense:',
        options: [
          'He has wrote a letter.',
          'He has written a letter.',
          'He wrote a letter.',
          'He is writing a letter.',
        ],
        correctAnswerIndex: 1,
        explanation: 'Present Perfect-এ have/has এর পর verb-এর past participle form (written) বসে।',
        difficulty: 'easy',
      },
      {
        id: 'gm-ten-2',
        question: '"Water boils at 100°C." — Which tense is used here?',
        options: ['Present Continuous', 'Past Indefinite', 'Present Indefinite', 'Future Indefinite'],
        correctAnswerIndex: 2,
        explanation: 'এটি একটি বৈজ্ঞানিক চিরন্তন সত্য (Universal Truth), তাই Present Indefinite Tense হয়েছে।',
        difficulty: 'easy',
      },
      {
        id: 'gm-ten-3',
        question: 'The patient had died before the doctor ____.',
        options: ['came', 'had come', 'comes', 'was coming'],
        correctAnswerIndex: 0,
        explanation: 'Past Perfect-এ "before"-এর পূর্বের অংশ Past Perfect হলে পরের অংশ Past Indefinite (V2 = came) হয়।',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'right-form-of-verbs',
    title: 'Right Form of Verbs (ক্রিয়ার সঠিক রূপ)',
    banglaTitle: 'Right Form of Verbs — সেরা ২০টি বোর্ড নিয়ম',
    level: 'All Classes (৬ষ্ঠ-১০ম)',
    category: 'Tense & Verbs',
    summary: 'বাক্যের অর্থ ও নিয়ম অনুযায়ী Verb-এর সঠিক রূপ নির্ধারণ করার জন্য সর্বাধিক গুরুত্বপূর্ণ নিয়মসমূহ।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Universal Truth & Habitual Fact',
        explanation: 'চিরন্তন সত্য বা অভ্যাসগত কাজ বোঝালে সর্বদাই Present Indefinite Tense হয়।',
        formula: 'Subject + V1 (s/es if 3rd person singular)',
        examples: [
          { sentence: 'The earth moves (move) round the sun.', explanation: 'চিরন্তন সত্য হওয়ায় moves হবে।' },
        ],
      },
      {
        ruleNo: 2,
        ruleTitle: 'Since / As if / As though-এর নিয়ম',
        explanation: 'As if / As though-এর পূর্বে Present Tense থাকলে পরে Past Indefinite (be verb হলে were) বসে।',
        formula: 'Present Tense + as if / as though + Past Indefinite (were)',
        examples: [
          { sentence: 'He speaks as if he knew (know) everything.', explanation: 'as if-এর পূর্বে speaks (present), তাই পরে knew (past) হয়েছে।' },
          { sentence: 'He talks as if he were (be) mad.', explanation: 'অবাস্তব অনুমানে be verb সর্বদাই were হয়।' },
        ],
      },
      {
        ruleNo: 3,
        ruleTitle: 'Lest-এর পর Should/Might',
        explanation: 'বাক্যে Lest (পাছে কিছু ঘটে এই ভয়ে) থাকলে এর পরবর্তী clause-এ Subject-এর পরে should বা might বসে।',
        formula: 'Clause + lest + Subject + should/might + V1',
        examples: [
          { sentence: 'Walk fast lest you should miss (miss) the train.', explanation: 'lest-এর পর should miss বসেছে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-rfv-1',
        question: 'If I were a king, I ____ help the poor.',
        options: ['will', 'would', 'shall', 'can'],
        correctAnswerIndex: 1,
        explanation: '2nd conditional-এ If + Past Indefinite হলে অপর অংশে Subject + would/could/might + V1 বসে।',
        difficulty: 'medium',
      },
      {
        id: 'gm-rfv-2',
        question: 'He talked as if he ____ everything.',
        options: ['knows', 'knew', 'has known', 'is knowing'],
        correctAnswerIndex: 1,
        explanation: 'As if-এর প্রথম অংশ Past Indefinite হলে দ্বিতীয় অংশ Past Perfect হয়, কিন্তু প্রথম অংশ Present হলে দ্বিতীয় অংশ Past Indefinite (knew) হয়।',
        difficulty: 'medium',
      },
      {
        id: 'gm-rfv-3',
        question: 'Walk carefully lest you ____ stumble.',
        options: ['may', 'can', 'should', 'will'],
        correctAnswerIndex: 2,
        explanation: 'Lest যুক্ত বাক্যে সর্বদাই Subject-এর পর "should" বসে।',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'voice-change',
    title: 'Voice Change (বাচ্য পরিবর্তন — Active & Passive)',
    banglaTitle: 'Voice Change — বাচ্য পরিবর্তন (Active to Passive)',
    level: 'All Classes (৬ষ্ঠ-১০ম)',
    category: 'Sentence & Syntax',
    summary: 'Subject নিজে কাজ করছে (Active) নাকি Subject-এর ওপর কাজ প্রযুক্ত হচ্ছে (Passive) তা নির্ধারণ করার নিয়ম।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Active থেকে Passive করার মৌলিক ৫টি ধাপ',
        explanation: '১. Active-এর Object টি Passive-এর Subject হবে। ২. Tense ও Person অনুযায়ী সাহায্যকারী verb বসবে। ৩. মূল verb-এর Past Participle (V3) বসবে। ৪. সাধারণত by (বা with/to/at) বসবে। ৫. Active-এর Subject টি Passive-এর Object হবে।',
        formula: 'Passive Subject + Auxiliary Verb + V3 + by/at/to + Passive Object',
        examples: [
          { sentence: 'Active: He writes a letter. → Passive: A letter is written by him.', explanation: 'Present Indefinite-এ am/is/are + V3 বসে।' },
          { sentence: 'Active: I know the man. → Passive: The man is known to me.', explanation: 'know verb-এর পর by না বসে to বসে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-vc-1',
        question: 'Change into passive: "The boy broke the window."',
        options: [
          'The window is broken by the boy.',
          'The window was broken by the boy.',
          'The window has broken by the boy.',
          'The window had broken by the boy.',
        ],
        correctAnswerIndex: 1,
        explanation: '"broke" Past Indefinite Tense হওয়ায় passive-এ was/were + V3 (was broken) হবে।',
        difficulty: 'easy',
      },
      {
        id: 'gm-vc-2',
        question: 'Passive of "Do the work":',
        options: [
          'Let the work be done.',
          'Let the work done.',
          'The work should done.',
          'You are told to do work.',
        ],
        correctAnswerIndex: 0,
        explanation: 'Imperative sentence-এ passive করার সূত্র: Let + object + be + V3।',
        difficulty: 'medium',
      },
      {
        id: 'gm-vc-3',
        question: 'Passive of "Who wrote Hamlet?":',
        options: [
          'By whom Hamlet was written?',
          'By whom was Hamlet written?',
          'Whom was Hamlet written by?',
          'Who was written Hamlet?',
        ],
        correctAnswerIndex: 1,
        explanation: 'Who থাকলে By whom + auxiliary verb (was) + subject (Hamlet) + V3 (written)? বসে।',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'narration-direct-indirect',
    title: 'Narration (উক্তি পরিবর্তন — Direct & Indirect Speech)',
    banglaTitle: 'Narration — প্রত্যক্ষ ও পরোক্ষ উক্তি রূপান্তর',
    level: 'Class 9-10',
    category: 'Sentence & Syntax',
    summary: 'বক্তার বক্তব্যকে হুবহু প্রকাশ করা (Direct) বা অন্যের ভাষায় বর্ণনা করা (Indirect)-র ব্যাকরণিক নিয়ম।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Tense পরিবর্তনের সাধারণ নিয়ম',
        explanation: 'Reporting verb Past Tense-এ থাকলে: Present Indefinite → Past Indefinite; Present Continuous → Past Continuous; Present Perfect → Past Perfect; Past Indefinite → Past Perfect।',
        formula: 'He said, "I am ill." → He said that he was ill.',
        examples: [
          { sentence: 'Direct: She said, "I write a letter." → Indirect: She said that she wrote a letter.', explanation: 'Present Indefinite পরিবর্তিত হয়ে Past Indefinite হয়েছে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-nar-1',
        question: 'He said to me, "Are you reading a book?" (Indirect form):',
        options: [
          'He asked me that I was reading a book.',
          'He asked me if I was reading a book.',
          'He told me whether I am reading a book.',
          'He asked me did I read a book.',
        ],
        correctAnswerIndex: 1,
        explanation: 'Interrogative sentence (Yes/No question)-এ conjunction হিসেবে if/whether বসে এবং বাক্যটি assertive (I was reading) হয়ে যায়।',
        difficulty: 'medium',
      },
      {
        id: 'gm-nar-2',
        question: 'Teacher said, "The earth is round." (Indirect speech):',
        options: [
          'Teacher said that the earth was round.',
          'Teacher said that the earth is round.',
          'Teacher said if the earth is round.',
          'Teacher told that earth was round.',
        ],
        correctAnswerIndex: 1,
        explanation: 'চিরন্তন সত্য (Universal Truth) বাক্য হলে reporting verb past tense হলেও reported speech-এর tense অপরিবর্তিত থাকে।',
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'subject-verb-agreement',
    title: 'Subject-Verb Agreement (কর্তা ও ক্রিয়ার সঙ্গতি)',
    banglaTitle: 'Subject-Verb Agreement — ২০টি অপরিহার্য নিয়ম',
    level: 'All Classes (৬ষ্ঠ-১০ম)',
    category: 'Sentence & Syntax',
    summary: 'Subject-এর Number (Singular/Plural) ও Person অনুযায়ী Verb-এর সঠিক রূপ নির্ধারণ করার নিয়মাবলী।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Neither...nor / Either...or-এর নিয়ম',
        explanation: 'Either...or বা Neither...nor দ্বারা যুক্ত Subject-এর ক্ষেত্রে Verb-টি তার নিকটবর্তী Subject (2nd subject) অনুযায়ী নির্ধারিত হয়।',
        formula: 'Neither S1 nor S2 + Verb (according to S2)',
        examples: [
          { sentence: 'Neither the teacher nor the students are (be) present.', explanation: 'নিকটবর্তী subject "students" plural, তাই are হয়েছে।' },
          { sentence: 'Neither the students nor the teacher is (be) present.', explanation: 'নিকটবর্তী subject "teacher" singular, তাই is হয়েছে।' },
        ],
      },
      {
        ruleNo: 2,
        ruleTitle: 'Along with / As well as / Together with-এর নিয়ম',
        explanation: 'যদি দুটি Subject "as well as", "along with", "together with", "with" ইত্যাদি দিয়ে যুক্ত হয়, তবে Verb সর্বদাই প্রথম Subject অনুযায়ী হয়।',
        formula: 'S1 + as well as / with + S2 + Verb (according to S1)',
        examples: [
          { sentence: 'The captain, along with his players, was (be) praised.', explanation: 'প্রথম subject "captain" singular, তাই was হয়েছে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-sva-1',
        question: 'Slow and steady ____ the race.',
        options: ['win', 'wins', 'won', 'winning'],
        correctAnswerIndex: 1,
        explanation: '"Slow and steady" দুটি শব্দ হলেও একক একটি ধারণাকে প্রকাশ করে, তাই verb singular (wins) হবে।',
        difficulty: 'medium',
      },
      {
        id: 'gm-sva-2',
        question: 'Neither Rahim nor his friends ____ present yesterday.',
        options: ['was', 'were', 'is', 'are'],
        correctAnswerIndex: 1,
        explanation: 'Neither...nor-এ verb-এর কাছের subject "friends" plural এবং yesterday অতীত নির্দেশক, তাই were হবে।',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'sentence-transformation',
    title: 'Sentence Transformation (বাক্য রূপান্তর)',
    banglaTitle: 'Transformation of Sentences (Affirmative, Negative, Interrogative, Exclamatory)',
    level: 'All Classes (৬ষ্ঠ-১০ম)',
    category: 'Sentence & Syntax',
    summary: 'বাক্যের মূল অর্থ অক্ষুণ্ণ রেখে গঠনগত রূপান্তর করার নিয়ম।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Only / Alone থাকলে রূপান্তর',
        explanation: 'ব্যক্তি বোঝালে Only-এর পরিবর্তে বাক্যের শুরুতে None but; বস্তু বোঝালে Nothing but; বয়স বা সংখ্যা বোঝালে Not more than / Not less than বসে।',
        formula: 'Only Allah can help us. → None but Allah can help us.',
        examples: [
          { sentence: 'He had only a ball. → He had nothing but a ball.', explanation: 'বল বস্তুবাচক হওয়ায় nothing but বসেছে।' },
          { sentence: 'He is only ten. → He is not more than ten.', explanation: 'ten সংখ্যা বা বয়স হওয়ায় not more than বসেছে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-tr-1',
        question: 'Negative form of "Only honesty can bring peace":',
        options: [
          'None but honesty can bring peace.',
          'Nothing but honesty can bring peace.',
          'Not more than honesty can bring peace.',
          'Honesty cannot bring peace.',
        ],
        correctAnswerIndex: 1,
        explanation: 'Honesty বস্তু বা গুণবাচক Abstract ধারণা, তাই "Nothing but" বসবে।',
        difficulty: 'medium',
      },
      {
        id: 'gm-tr-2',
        question: 'Affirmative form of "There is no mother but loves her child":',
        options: [
          'All mothers love their children.',
          'Every mother loves her child.',
          'No mother hates her child.',
          'A mother always loves her child.',
        ],
        correctAnswerIndex: 1,
        explanation: '"There is no... but" থাকলে affirmative রূপান্তরে "Every + noun + verb" বসে।',
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'tag-questions',
    title: 'Tag Questions (সংক্ষিপ্ত প্রশ্ন জুড়ে দেওয়া)',
    banglaTitle: 'Tag Questions — নিয়ম ও বিশেষ ব্যতিক্রমসমূহ',
    level: 'Class 9-10',
    category: 'Sentence & Syntax',
    summary: 'কথোপকথনের সময় শ্রোতার সমর্থন চেয়ে বাক্যের শেষে ছোট্ট একটি প্রশ্ন জুড়ে দেওয়াকে Tag Question বলে।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Affirmative Statement → Negative Tag',
        explanation: 'বাক্যটি যদি হ্যাঁ-বোধক হয়, তবে Tag হবে না-বোধক (সংক্ষিপ্ত রূপ: aren\'t, don\'t, didn\'t, won\'t)। বাক্যটি না-বোধক হলে Tag হবে হ্যাঁ-বোধক।',
        formula: 'Statement + comma + auxiliary verb (+ n\'t) + subject pronoun + question mark?',
        examples: [
          { sentence: 'He is a student, isn\'t he?', explanation: 'Statement affirmative, তাই tag negative হয়েছে।' },
          { sentence: 'She does not sing, does she?', explanation: 'Statement negative, তাই tag affirmative হয়েছে।' },
        ],
      },
      {
        ruleNo: 2,
        ruleTitle: 'Let\'s / Let us থাকলে Tag',
        explanation: 'Let\'s বা Let us দিয়ে প্রস্তাব বোঝালে Tag সর্বদাই "shall we?" হয়।',
        formula: 'Let\'s + V1... , shall we?',
        examples: [
          { sentence: 'Let\'s go out for a walk, shall we?', explanation: 'Let\'s এর জন্য shall we? বসেছে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-tq-1',
        question: '"Let us discuss the matter, ____?"',
        options: ['will you?', 'shall we?', 'don\'t we?', 'can we?'],
        correctAnswerIndex: 1,
        explanation: 'Let\'s বা Let us দ্বারা প্রস্তাব বোঝালে tag question সর্বদাই "shall we?" হয়।',
        difficulty: 'easy',
      },
      {
        id: 'gm-tq-2',
        question: '"Barking dogs seldom bite, ____?"',
        options: ['do they?', 'don\'t they?', 'does it?', 'doesn\'t it?'],
        correctAnswerIndex: 0,
        explanation: '"seldom" একটি semi-negative শব্দ (কদাচিৎ/না বললেই চলে), তাই tag affirmative হবে এবং dogs plural হওয়ায় "do they?" হবে।',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'articles-rules',
    title: 'Articles (A, An, The & Omission of Articles)',
    banglaTitle: 'Articles — A, An, The ব্যবহারের খুঁটিনাটি নিয়ম ও Cross (×)',
    level: 'All Classes (৬ষ্ঠ-১০ম)',
    category: 'Parts of Speech',
    summary: 'A ও An অনির্দিষ্ট (Indefinite) এবং The নির্দিষ্ট (Definite) নির্দেশক হিসেবে ব্যবহৃত হয়।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Vowel Sound বনাম Consonant Sound',
        explanation: 'শব্দের প্রথম বর্ণ নয়, প্রথম উচ্চারণ (Sound) দেখে A/An নির্ধারণ করতে হয়। Vowel sound (অ, আ, এ, ই) হলে An বসে।',
        formula: 'Vowel Sound → An; Consonant Sound → A',
        examples: [
          { sentence: 'He is an honest (অ-নেস্ট) man.', explanation: 'h অনুচ্চারিত এবং vowel sound আসায় an বসেছে।' },
          { sentence: 'He is a university (ইউ) student.', explanation: 'U এর উচ্চারণ "ইউ" হলে consonant sound বিধায় a বসেছে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-art-1',
        question: 'He has ____ European friend.',
        options: ['a', 'an', 'the', 'no article'],
        correctAnswerIndex: 0,
        explanation: 'European-এর উচ্চারণ "ইউ" (consonant sound)-এর মতো হওয়ায় এর পূর্বে "a" বসবে।',
        difficulty: 'easy',
      },
      {
        id: 'gm-art-2',
        question: 'He is ____ MA in English.',
        options: ['a', 'an', 'the', 'no article'],
        correctAnswerIndex: 1,
        explanation: 'M-এর উচ্চারণ শুরু হয় "এম" (Vowel sound \'এ\') দিয়ে, তাই "an" বসবে।',
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'prepositions-appropriate',
    title: 'Prepositions & Appropriate Prepositions',
    banglaTitle: 'Prepositions — স্থান, সময় ও উপযুক্ত Preposition-এর তালিকা',
    level: 'All Classes (৬ষ্ঠ-১০ম)',
    category: 'Parts of Speech',
    summary: 'Noun বা Pronoun-এর পূর্বে বসে বাক্যের অন্য শব্দের সাথে অবস্থানগত বা কালগত সম্পর্ক প্রকাশ করে।',
    rules: [
      {
        ruleNo: 1,
        ruleTitle: 'Time (সময়)-এর ক্ষেত্রে At, On, In',
        explanation: 'নির্দিষ্ট সময়ে At (at 5 PM); বারের নাম বা তারিখে On (on Monday, on 16 December); মাস, ঋতু বা সালে In (in January, in 1971) বসে।',
        formula: 'At (exact time) | On (days/dates) | In (months/years/seasons)',
        examples: [
          { sentence: 'Bangladesh became independent in 1971.', explanation: 'সাল বোঝাতে in বসে।' },
          { sentence: 'Our exam starts at 10:00 AM on Sunday.', explanation: 'নির্দিষ্ট সময়ে at এবং দিনে on বসে।' },
        ],
      },
    ],
    mcqs: [
      {
        id: 'gm-prep-1',
        question: 'He is addicted ____ smoking.',
        options: ['with', 'in', 'to', 'for'],
        correctAnswerIndex: 2,
        explanation: 'Addicted-এর পর উপযুক্ত preposition হিসেবে "to" বসে (আসক্ত)।',
        difficulty: 'easy',
      },
      {
        id: 'gm-prep-2',
        question: 'The man died ____ cholera.',
        options: ['by', 'of', 'from', 'for'],
        correctAnswerIndex: 1,
        explanation: 'রোগে মারা যাওয়া বোঝালে "die of" বসে (Die of cholera)।',
        difficulty: 'medium',
      },
    ],
  },
];
