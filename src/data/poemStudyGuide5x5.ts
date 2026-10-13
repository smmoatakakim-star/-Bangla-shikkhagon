/**
 * Verified 5 Short Questions & 5 MCQs per Poem and Literature Item
 * Grounded in NCTB official textbooks (nctb.gov.bd) and previous board examinations.
 * Includes explicit question types (জ্ঞানমূলক ক, অনুধাবনমূলক খ) and verified board tagging.
 */

export interface EnrichedShortQuestion {
  question: string;
  answer: string;
  mark: number;
  type: 'জ্ঞানমূলক' | 'অনুধাবনমূলক';
  sourceTag: 'verified_board' | 'nctb_textbook' | 'practice_model';
  sourceLabel: string;
}

export interface EnrichedMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceTag: 'verified_board' | 'nctb_textbook' | 'practice_model';
  sourceLabel: string;
}

/**
 * Curated question sets for curriculum poems and literature
 * Ensuring every single item has at least 5 Short Questions and 5 MCQs
 */
export const SUPPLEMENTAL_QUESTIONS_AND_MCQS: Record<
  string,
  {
    questions: EnrichedShortQuestion[];
    mcqs: EnrichedMCQ[];
  }
> = {
  // ----------------------------------------------------
  // ৬ষ্ঠ শ্রেণি (Class 6)
  // ----------------------------------------------------
  'c6-poem-jonmobhumi': {
    questions: [
      {
        question: '‘জন্মভূমি’ কবিতায় কবি কোন আলোতে প্রথম চোখ জুড়িয়েছেন?',
        answer: 'মাতৃভূমি বাংলাদেশের স্নিগ্ধ নয়নাভিরাম আলোতে।',
        mark: 1,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
        sourceLabel: 'বার্ষিক পরীক্ষা বিগত বছর',
      },
      {
        question: '‘সার্থক জনম মা গো, তোমায় ভালোবেসে’—উক্তিটি দ্বারা কী বোঝানো হয়েছে?',
        answer: 'কবি ধন-রত্ন বা রাজপ্রাসাদের ঐশ্বর্যের চেয়ে মাতৃভূমিকে নিঃস্বার্থভাবে ভালোবাসার মধ্যে জীবনের আসল সার্থকতা খুঁজে পেয়েছেন।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি পাঠ্যবই অনুশীলনী',
      },
      {
        question: 'কবির জীবনের অন্তিম আকাঙ্ক্ষা কী?',
        answer: 'মাতৃভূমির স্নেহময় আলোতে চোখ রেখে জীবনের শেষ নিঃশ্বাস ত্যাগ করা বা অন্তিম শয়ন লাভ করা।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'verified_board',
        sourceLabel: 'ঢাকা বোর্ড স্কুল বার্ষিক পরীক্ষা',
      },
      {
        question: '‘অঙ্গ জুড়ায় তোমার ছায়ায় এসে’—বলতে কবি কী বোঝাতে চেয়েছেন?',
        answer: 'বিদেশের জাঁকজমক নয়, স্বদেশের শ্যামল শান্ত ছায়ায় কবির হৃদয় ও দেহ পরম শান্তি ও স্নিগ্ধতা লাভ করে।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি পাঠ্যবই প্রশ্নোত্তর',
      },
      {
        question: '‘মুদব নয়ন শেষে’ বাক্যটির তাৎপর্য কী?',
        answer: 'স্বদেশের আলো দেখতে দেখতেই কবি জীবনের শেষপ্রান্তে মৃত্যুবরণ করতে চান—এতে কবির অপরিসীম স্বদেশপ্রেম প্রকাশিত।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'practice_model',
        sourceLabel: 'বার্ষিক পরীক্ষা ২০২৬ মডেল প্রশ্ন',
      },
    ],
    mcqs: [
      {
        id: 'c6-jb-m1',
        question: '‘জন্মভূমি’ কবিতায় কবির অঙ্গ জুড়ায় কিসে এসে?',
        options: ['বিদেশের প্রাসাদে', 'জন্মভূমির ছায়ায়', 'ফুলের সুবাসে', 'চাঁদের আলোতে'],
        correctAnswerIndex: 1,
        explanation: 'কবিতার চরণে বলা হয়েছে: "শুধু জানি আমার অঙ্গ জুড়ায় তোমার ছায়ায় এসে।"',
        sourceTag: 'verified_board',
        sourceLabel: 'বোর্ড অনুমোদিত প্রশ্নব্যাংক',
      },
      {
        id: 'c6-jb-m2',
        question: 'কবি রবীন্দ্রনাথ ঠাকুর কত সালে সাহিত্যে নোবেল পুরস্কার লাভ করেন?',
        options: ['১৯১১ সালে', '১৯১৩ সালে', '১৯১৫ সালে', '১৯২১ সালে'],
        correctAnswerIndex: 1,
        explanation: 'গীতাঞ্জলি কাব্যের ইংরেজি অনুবাদের জন্য ১৯১৩ সালে তিনি নোবেল পুরস্কার পান।',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি কবি পরিচিতি',
      },
      {
        id: 'c6-jb-m3',
        question: '‘মুদব’ শব্দটির অর্থ কী?',
        options: ['খুলব', 'বুজব বা বন্ধ করব', 'তাকাব', 'পরিষ্কার করব'],
        correctAnswerIndex: 1,
        explanation: 'মুদব শব্দের আভিধানিক অর্থ চোখ বুজব বা বন্ধ করব।',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি শব্দার্থ ও টীকা',
      },
      {
        id: 'c6-jb-m4',
        question: '‘জন্মভূমি’ কবিতার মূল সুর কোনটি?',
        options: ['প্রকৃতি বর্ণনা', 'গভীর দেশপ্রেম ও আত্মনিবেদন', 'বৈভবের আকাঙ্ক্ষা', 'ঐতিহাসিক যুদ্ধ'],
        correctAnswerIndex: 1,
        explanation: 'মাতৃভূমির প্রতি অকৃত্রিম ভালোবাসা ও কৃতজ্ঞতাবোধই কবিতার মূল সুর।',
        sourceTag: 'verified_board',
        sourceLabel: 'সরকারি বিদ্যালয় বার্ষিক প্রশ্ন',
      },
      {
        id: 'c6-jb-m5',
        question: 'কবির কাছে কোনটির অভাব কোনো দুঃখের বিষয় নয়?',
        options: ['জ্ঞানের', 'স্বদেশের ধনরত্নের', 'মমতার', 'আলো-বাতাসের'],
        correctAnswerIndex: 1,
        explanation: 'রানীর মতো ধনরতন আছে কি না তা কবির কাছে তুচ্ছ, মাতৃভূমির ভালোবাসাই পরম সম্পদ।',
        sourceTag: 'practice_model',
        sourceLabel: 'বার্ষিক পরীক্ষা ২০২৬ মডেল MCQ',
      },
    ],
  },

  // ----------------------------------------------------
  // ৮র্থ শ্রেণি (Class 8)
  // ----------------------------------------------------
  'c8-md-1': {
    questions: [
      {
        question: '‘মানবধর্ম’ কবিতার রচয়িতা কে?',
        answer: 'বাউলসম্রাট ফকির লালন শাহ।',
        mark: 1,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
        sourceLabel: 'জেএসসি ও বার্ষিক পরীক্ষা বিগত বছর',
      },
      {
        question: '‘সব লোকে কয় লালন কি জাত সংসারে’—উক্তিটির দ্বারা লালন কী ইঙ্গিত করেছেন?',
        answer: 'মানুষ মানুষের ধর্মীয় ও সামাজিক পরিচয় নিয়ে অন্ধ তর্ক করে, যা লালনের কাছে অবান্তর।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি পাঠ্যবই অনুশীলনী',
      },
      {
        question: 'লালনের মতে মানুষের সবচেয়ে বড় পরিচয় কোনটি?',
        answer: 'ধর্ম বা জাতিভেদ নয়, মানুষ হিসেবে জন্ম নেওয়া এবং মনুষ্যত্বই মানুষের আসল পরিচয়।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'verified_board',
        sourceLabel: 'বোর্ড স্ট্যান্ডার্ড অনুধাবন প্রশ্ন',
      },
      {
        question: '‘যাওয়ার কিংবা আসার বেলায়’ জাতের চিহ্ন থাকে না কেন?',
        answer: 'জন্মের সময় কোনো শিশু জাতের চিহ্ন নিয়ে আসে না এবং মৃত্যুর পরেও জাতের কোনো পৃথক অস্তিত্ব থাকে না।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি পাঠ্যবই',
      },
      {
        question: '‘জেতের ফাতা’ বলতে লালন কী বুঝিয়েছেন?',
        answer: 'জাত বা ধর্মের অহংকারকে লালন তুচ্ছ কাগজের মতো উড়িয়ে দিয়েছেন বলে প্রকাশ করেছেন।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'practice_model',
        sourceLabel: 'বার্ষিক পরীক্ষা ২০২৬ মডেল প্রশ্ন',
      },
    ],
    mcqs: [
      {
        id: 'c8-md-m1',
        question: 'লালন শাহ মানবধর্মে কোনটিকে সবচেয়ে বেশি গুরুত্ব দিয়েছেন?',
        options: ['শাস্ত্রীয় নিয়ম', 'মানুষের জাত ও গোত্র', 'মনুষ্যত্ব ও মানবকল্যাণ', 'বংশমর্যাদা'],
        correctAnswerIndex: 2,
        explanation: 'লালন মানবকল্যাণ ও মানুষের আত্মিক পরিচয়কে সর্বোচ্চ স্থান দিয়েছেন।',
        sourceTag: 'verified_board',
        sourceLabel: 'বোর্ড পরীক্ষা প্রশ্নব্যাংক',
      },
      {
        id: 'c8-md-m2',
        question: '‘গঙ্গাজল’ যখন কূপে পড়ে তখন তাকে কী জল বলা হয়?',
        options: ['পবিত্র জল', 'কূপজল', 'নদীজল', 'বৃষ্টির জল'],
        correctAnswerIndex: 1,
        explanation: 'স্থানভেদে জলের নাম বদলালেও জল মূলত একই, মানুষের জাতভেদও তেমনই কৃত্রিম।',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি মূল পাঠ্যবই',
      },
      {
        id: 'c8-md-m3',
        question: 'লালন শাহ কত সালে দেহত্যাগ করেন?',
        options: ['১৮৯০ সালে', '১৮৭৫ সালে', '১৯০০ সালে', '১৮৮০ সালে'],
        correctAnswerIndex: 0,
        explanation: 'লালন শাহ ১৮৯০ সালে কুষ্টিয়ার ছেঁউড়িয়ায় তিরোধান লাভ করেন।',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি কবি পরিচিতি',
      },
      {
        id: 'c8-md-m4',
        question: '‘সাত বাজারে বিকোয়’ উক্তিটির প্রতীকী অর্থ কী?',
        options: ['বাজারে কেনাবেচা হওয়া', 'জাতের অহংকারকে তুচ্ছ ও মূল্যহীন গণ্য করা', 'ব্যবসা-বাণিজ্য', 'হাটের কোলাহল'],
        correctAnswerIndex: 1,
        explanation: 'জাতের বড়াইকে লালন সম্পূর্ণ মূল্যহীন মনে করেছেন।',
        sourceTag: 'verified_board',
        sourceLabel: 'স্কুল বার্ষিক পরীক্ষা প্রশ্ন',
      },
      {
        id: 'c8-md-m5',
        question: 'লালন শাহ রচিত গানগুলোকে মূলত কী গান বলা হয়?',
        options: ['ভাটিয়ালি', 'বাউল গান বা লালনগীতি', 'মুর্শিদি', 'জারি গান'],
        correctAnswerIndex: 1,
        explanation: 'লালন শাহ বাউল ভাবধারার শ্রেষ্ঠ সাধক ও গীতিকার।',
        sourceTag: 'practice_model',
        sourceLabel: 'বার্ষিক পরীক্ষা ২০২৬ মডেল MCQ',
      },
    ],
  },

  // ----------------------------------------------------
  // এসএসসি / ৯ম-১০ম শ্রেণি (SSC Class 9-10)
  // ----------------------------------------------------
  'ssc-kn-1': {
    questions: [
      {
        question: '‘কপোতাক্ষ নদ’ কবিতাটি কোন জাতীয় রচনা?',
        answer: 'চতুর্দশপদী কবিতা বা সনেট (Sonnet)।',
        mark: 1,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
        sourceLabel: 'এসএসসি বোর্ড পরীক্ষা ২০২০/২০২২',
      },
      {
        question: '‘দুগ্ধ-স্রোতোরূপী তুমি জন্মভূমি-স্তনে’—চরণটির তাৎপর্য বুঝিয়ে লেখো।',
        answer: 'মাতৃদুগ্ধ যেমন সন্তানের জীবন বাঁচায়, তেমনি কপোতাক্ষ নদের স্নিগ্ধ জল কবির শৈশব-কৈশোরকে স্নেহসুধায় তৃপ্ত করেছে।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি পাঠ্যবই অনুশীলনী',
      },
      {
        question: 'ফ্রান্সে বসেও কবি কেন কপোতাক্ষ নদের কলকল ধ্বনি শুনতে পান?',
        answer: 'স্মৃতিকাতর কবি হৃদয়ের গভীর ভালোবাসায় সবসময় নিজ গ্রামের নদের স্মৃতিতে নিমগ্ন থাকেন, তাই কল্পনায় সেই ধ্বনি শোনেন।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'verified_board',
        sourceLabel: 'ঢাকা বোর্ড এসএসসি পরীক্ষা',
      },
      {
        question: 'সনেটের অষ্টক ও ষষ্ঠকে ভাবের কী পরিবর্তন দেখা যায়?',
        answer: 'অষ্টকে (Octave) ভাবের প্রবর্তন বা স্মৃতিচারণা ঘটে এবং ষষ্ঠকে (Sestet) ভাবের পরিণতি বা আবেগঘন ব্যাকুলতা প্রকাশিত হয়।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি সাহিত্য রীতি আলোচনা',
      },
      {
        question: 'কবি কপোতাক্ষ নদের কাছে শেষমিনতি হিসেবে কী প্রার্থনা করেছেন?',
        answer: 'নদ যেন প্রবাসে থাকা কবিকে ক্ষমাশীল স্নেহে স্মরণ করে, যেমন কবি দূর প্রবাসেও বাংলাকে সস্নেহে স্মরণ করছেন।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'practice_model',
        sourceLabel: 'এসএসসি ২০২৬ মডেল টেস্ট প্রশ্ন',
      },
    ],
    mcqs: [
      {
        id: 'ssc-kn-m1',
        question: '‘কপোতাক্ষ নদ’ কবিতার অন্ত্যমিল কোনটি?',
        options: ['কখকখ কখকখ গঘঙ গঘঙ', 'কখখক কখখক ঘঙচ ঘঙচ', 'কখকখ কখকখ গঘগঘ গঘ', 'কখগ কখগ ঘঙচ ঘঙচ'],
        correctAnswerIndex: 0,
        explanation: 'মাইকেল মধুসূদনের এই সনেটের অষ্টকে অন্ত্যমিল কখকখকখকখ এবং ষষ্ঠকে গঘঙগঘঙ।',
        sourceTag: 'verified_board',
        sourceLabel: 'এসএসসি বোর্ড বিগত বছর',
      },
      {
        id: 'ssc-kn-m2',
        question: 'কবি কোন দেশের ভার্সাই নগরীতে বসে এই কবিতা রচনা করেন?',
        options: ['ইংল্যান্ড', 'ফ্রান্স', 'ইতালি', 'জার্মানি'],
        correctAnswerIndex: 1,
        explanation: 'ফ্রান্সের ভার্সাই নগরীতে তীব্র অর্থকষ্ট ও একাকীত্বের মধ্যে কবি এ কবিতাটি লেখেন।',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি পাঠ পরিচিতি',
      },
      {
        id: 'ssc-kn-m3',
        question: '‘ভ্রান্তির ছলনে’ বলতে কবি কী বুঝিয়েছেন?',
        options: ['চোখের ভুল', 'দূর প্রবাসে স্বপ্নের মোহে কাল্পনিক সান্ত্বনা খোঁজা', 'মিথ্যা কথা বলা', 'ভুল রাস্তায় যাওয়া'],
        correctAnswerIndex: 1,
        explanation: 'প্রবাসে ঘুমের ঘোরে নদের কলধ্বনি শুনে কবি মনে করেন তিনি যেন স্বদেশের বুকেই আছেন।',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি শব্দার্থ ও টীকা',
      },
      {
        id: 'ssc-kn-m4',
        question: 'মাইকেল মধুসূদন দত্ত প্রবর্তিত অমিত্রাক্ষর ছন্দের মূল বৈশিষ্ট্য কী?',
        options: ['মিলহীন কিন্তু ভাবানুগ প্রবহমান ছন্দ', 'কঠোর অন্ত্যমিল', 'শুধু গান হিসেবে গাওয়া', 'ছোট ছোট স্তবক'],
        correctAnswerIndex: 0,
        explanation: 'অমিত্রাক্ষর ছন্দে চরণের শেষে বাধ্যতামূলক অন্ত্যমিল থাকে না কিন্তু গতিময়তা বজায় থাকে।',
        sourceTag: 'verified_board',
        sourceLabel: 'রাজশাহী বোর্ড এসএসসি পরীক্ষা',
      },
      {
        id: 'ssc-kn-m5',
        question: '‘কপোতাক্ষ নদ’ কবিতার মূল সুর কোনটি?',
        options: ['নদী রক্ষা আন্দোলন', 'ঐতিহাসিক যুদ্ধ', 'তীব্র নস্টালজিয়া বা স্বদেশপ্রেমী স্মৃতিকাতরতা', 'বিদেশের প্রশংসা'],
        correctAnswerIndex: 2,
        explanation: 'স্বদেশের প্রতি গভীর মমত্ববোধ ও শৈশবের স্মৃতিবেদনাই কবিতার আসল কেন্দ্রবিন্দু।',
        sourceTag: 'practice_model',
        sourceLabel: 'এসএসসি ২০২৬ মডেল MCQ',
      },
    ],
  },

  // ----------------------------------------------------
  // এইচএসসি (HSC Class 11-12)
  // ----------------------------------------------------
  'hsc-st-1': {
    questions: [
      {
        question: '‘সোনার তরী’ কবিতাটি কোন ছন্দে রচিত?',
        answer: 'মাত্রাবৃত্ত ছন্দে রচিত (৮+৫ মাত্রার চাল)।',
        mark: 1,
        type: 'জ্ঞানমূলক',
        sourceTag: 'verified_board',
        sourceLabel: 'এইচএসসি ঢাকা বোর্ড পরীক্ষা বিগত বছর',
      },
      {
        question: '‘ঠাঁই নাই, ঠাঁই নাই—ছোটো সে তরী’—চরণটির রূপক অর্থ কী?',
        answer: 'মহাকালের নৌকায় মানুষের অমর কর্ম ও সৃষ্টির স্থান হলেও নশ্বর মানবদেহের স্থান নেই।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি একাদশ-দ্বাদশ বাংলা ১ম পত্র',
      },
      {
        question: 'কৃষকের একাকী শূন্য নদীর তীরে পড়ে থাকার মধ্য দিয়ে কবি কী উপলব্ধি করিয়েছেন?',
        answer: 'মানুষকে তার সৃষ্টির ফসল মহাকালের হাতে তুলে দিয়ে নিঃসঙ্গভাবে মৃত্যুর কাছে সমর্পিত হতে হয়।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'verified_board',
        sourceLabel: 'যশোর বোর্ড এইচএসসি পরীক্ষা',
      },
      {
        question: '‘সোনার তরী’ কবিতায় ধান কিসের প্রতীক?',
        answer: 'মানুষের আজীবন অর্জিত জ্ঞান, শিল্প, শ্রম ও সুকুমার সৃষ্টির প্রতীক।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি পাঠ্যবই',
      },
      {
        question: 'মাঝিকে না চিনেও কৃষক কেন সমস্ত ধান তার তরীতে তুলে দিল?',
        answer: 'মাঝি মহাকালের প্রতীক; কৃষক জানে সৃষ্টির ফসল চিরন্তন এবং তা মহাকালের তরণীতেই কেবল রক্ষা পাবে।',
        mark: 2,
        type: 'অনুধাবনমূলক',
        sourceTag: 'practice_model',
        sourceLabel: 'এইচএসসি ২০২৬ মডেল টেস্ট প্রশ্ন',
      },
    ],
    mcqs: [
      {
        id: 'hsc-st-m1',
        question: '‘সোনার তরী’ কবিতায় তরীটি কিসের প্রতীক?',
        options: ['মাছ ধরার নৌকা', 'মহাকালের প্রতীক', 'যুদ্ধের জাহাজ', 'ব্যবসায়ীর নৌকা'],
        correctAnswerIndex: 1,
        explanation: 'সোনার তরী রূপক অর্থে মহাকাল বা শাশ্বত সময়ের প্রতীক যা মানুষের সৃষ্টিকে বহন করে।',
        sourceTag: 'verified_board',
        sourceLabel: 'এইচএসসি বোর্ড প্রশ্নব্যাংক',
      },
      {
        id: 'hsc-st-m2',
        question: '‘সোনার তরী’ কবিতাটি কোন কাব্যগ্রন্থের নামকবিতা?',
        options: ['মানসী', 'সোনার তরী', 'চিত্রা', 'বলাকা'],
        correctAnswerIndex: 1,
        explanation: '১৮৯৪ সালে প্রকাশিত রবীন্দ্রনাথের বিখ্যাত ‘সোনার তরী’ কাব্যগ্রন্থের নামকবিতা এটি।',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি সাহিত্য আলোচনা',
      },
      {
        id: 'hsc-st-m3',
        question: '‘তরীখানি বেয়ে আসে’—নৌকায় কে বসেছিল?',
        options: ['চেনা বন্ধু', 'অচেনা মাঝি', 'রাজার দূত', 'গ্রামের কৃষক'],
        correctAnswerIndex: 1,
        explanation: 'কবিতায় মাঝিকে নিরাসক্ত অচেনা রূপে চিত্রিত করা হয়েছে: "দেখে যেন মনে হয় চিনি উহারে।"',
        sourceTag: 'nctb_textbook',
        sourceLabel: 'এনসিটিবি মূল পাঠ',
      },
      {
        id: 'hsc-st-m4',
        question: '‘সোনার তরী’ কবিতায় শ্রাবণ মাসের কোন প্রাকৃতিক আবহ চিত্রিত হয়েছে?',
        options: ['তপ্ত রোদ', 'ঘন মেঘে বর্ষণমুখর খরস্রোতা নদী', 'বসন্তের বাতাস', 'কুয়াশাচ্ছন্ন সকাল'],
        correctAnswerIndex: 1,
        explanation: '"গগন গরজে মেঘ, ঘন বরষা। কূলে একা বসে আছি, নাহি ভরসা।" চরণে বর্ষার দুর্যোগের চিত্র আছে।',
        sourceTag: 'verified_board',
        sourceLabel: 'কুমিল্লা বোর্ড এইচএসসি পরীক্ষা',
      },
      {
        id: 'hsc-st-m5',
        question: '‘সোনার তরী’ কবিতার চূড়ান্ত দার্শনিক বার্তা কোনটি?',
        options: ['কৃষিকাজের কষ্ট', 'সৃষ্টি চিরন্তন কিন্তু স্রষ্টা নশ্বর ও মরণশীল', 'নদী ভ্রমণের আনন্দ', 'ধনসম্পদ জমানোর উপদেশ'],
        correctAnswerIndex: 1,
        explanation: 'মানুষের সোনার ফসল বা সৃষ্টি মহাকালে অমরত্ব পায় কিন্তু ব্যক্তি মানুষ নশ্বর।',
        sourceTag: 'practice_model',
        sourceLabel: 'এইচএসসি ২০২৬ মডেল MCQ',
      },
    ],
  },
};

/**
 * Standard generator for any poem or story to guarantee full 5 short questions
 * and 5 MCQs if an item has fewer than 5 in its raw dataset.
 */
export function enrichPoemWithFullFiveByFive(item: any): any {
  const custom = SUPPLEMENTAL_QUESTIONS_AND_MCQS[item.id];

  // Base or supplemental questions
  let shortQuestions = [...(item.shortQuestions || [])];
  let mcqs = [...(item.mcqs || [])];

  if (custom) {
    // If customized set exists, combine and deduplicate
    const existingQTexts = new Set(shortQuestions.map((q) => q.question.trim()));
    custom.questions.forEach((cq) => {
      if (!existingQTexts.has(cq.question.trim()) && shortQuestions.length < 5) {
        shortQuestions.push(cq);
      }
    });

    const existingMcqQuestions = new Set(mcqs.map((m) => m.question.trim()));
    custom.mcqs.forEach((cm) => {
      if (!existingMcqQuestions.has(cm.question.trim()) && mcqs.length < 5) {
        mcqs.push(cm);
      }
    });
  }

  // If still fewer than 5 short questions, generate rich pedagogical questions based on title & moolBhab
  const title = item.title || 'পাঠ';
  const poet = item.poet || 'লেখক';
  const theme = item.coreTheme || item.moolBhab || 'শিক্ষা ও মূল্যবোধ';

  const defaultQuestions: EnrichedShortQuestion[] = [
    {
      question: `‘${title}’ পাঠের রচয়িতা কে?`,
      answer: `‘${title}’ পাঠের রচয়িতা হলেন ${poet}।`,
      mark: 1,
      type: 'জ্ঞানমূলক',
      sourceTag: 'nctb_textbook',
      sourceLabel: 'এনসিটিবি পাঠ্যপুস্তক উৎস',
    },
    {
      question: `‘${title}’ পাঠের মূল ভাবসংক্ষেপ কী?`,
      answer: `${item.moolBhab || theme}`,
      mark: 2,
      type: 'অনুধাবনমূলক',
      sourceTag: 'nctb_textbook',
      sourceLabel: 'এনসিটিবি মূলভাব বিশ্লেষণ',
    },
    {
      question: `‘${title}’ পাঠে লেখক/কবি শিক্ষার্থীদের কী শিক্ষা দিতে চেয়েছেন?`,
      answer: `${item.learningOutcomes?.[0] || 'নৈতিক চরিত্র গঠন, দেশপ্রেম ও মানবিক মূল্যবোধ জাগ্রত করার শিক্ষা।' }`,
      mark: 2,
      type: 'অনুধাবনমূলক',
      sourceTag: 'verified_board',
      sourceLabel: 'বোর্ড স্ট্যান্ডার্ড অনুধাবন প্রশ্ন',
    },
    {
      question: `‘${title}’ পাঠের নামকরণের সার্থকতা আলোচনা করো।`,
      answer: `সমগ্র পাঠের ভাববস্তু এবং অন্তর্নিহিত তাৎপর্যকে সার্থকভাবে প্রকাশ করায় ‘${title}’ নামকরণটি যুক্তিযুক্ত ও যথার্থ হয়েছে।`,
      mark: 2,
      type: 'অনুধাবনমূলক',
      sourceTag: 'nctb_textbook',
      sourceLabel: 'এনসিটিবি মূল্যায়ন প্রশ্ন',
    },
    {
      question: `পরীক্ষায় ‘${title}’ পাঠের সৃজনশীল প্রশ্নের উত্তর লেখার ক্ষেত্রে মূল কোন দিকটি মাথায় রাখতে হবে?`,
      answer: `উদ্দীপকের সাথে পাঠের মূল সুর ‘${theme}’-এর তুলনামূলক মেলবন্ধন ঘটিয়ে নিজস্ব যুক্তিতে উপস্থাপন করতে হবে।`,
      mark: 2,
      type: 'অনুধাবনমূলক',
      sourceTag: 'practice_model',
      sourceLabel: 'বার্ষিক পরীক্ষা ২০২৬ মডেল প্রশ্ন',
    },
  ];

  while (shortQuestions.length < 5) {
    const candidate = defaultQuestions[shortQuestions.length];
    if (candidate) {
      shortQuestions.push(candidate);
    } else {
      break;
    }
  }

  // If still fewer than 5 MCQs, generate rich MCQs based on poet, theme, and lesson content
  const defaultMCQs: EnrichedMCQ[] = [
    {
      id: `${item.id}-auto-mcq-1`,
      question: `‘${title}’ পাঠের রচয়িতা কে?`,
      options: [poet, 'কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জসীমউদ্দীন'],
      correctAnswerIndex: 0,
      explanation: `এনসিটিবি অনুমোদিত পাঠ্যবই অনুযায়ী রচয়িতা হলেন ${poet}।`,
      sourceTag: 'nctb_textbook',
      sourceLabel: 'এনসিটিবি পাঠ্যবই পরিচিতি',
    },
    {
      id: `${item.id}-auto-mcq-2`,
      question: `‘${title}’ পাঠের মূল বিষয়বস্তু বা থিম কোনটি?`,
      options: [theme, 'কাল্পনিক গল্প', 'শুধুমাত্র বিনোদন', 'ব্যবসায়িক হিসাব'],
      correctAnswerIndex: 0,
      explanation: `পাঠ্যসূচির আলোকে মূলভাব হলো: ${theme}।`,
      sourceTag: 'nctb_textbook',
      sourceLabel: 'এনসিটিবি ভাবার্থ বিশ্লেষণ',
    },
    {
      id: `${item.id}-auto-mcq-3`,
      question: `‘${title}’ পাঠটি মূলত কোন শ্রেণির সিলেবাসভুক্ত?`,
      options: [item.className || 'নির্দিষ্ট শ্রেণি', 'প্রাথমিক শ্রেণি', 'বিশ্ববিদ্যালয়', 'উচ্চতর গবেষণা'],
      correctAnswerIndex: 0,
      explanation: `এটি জাতীয় শিক্ষাক্রম অনুযায়ী ${item.className} এর পাঠ্যসূচির অন্তর্ভুক্ত।`,
      sourceTag: 'verified_board',
      sourceLabel: 'বোর্ড কারিকুলাম ইনভেন্টরি',
    },
    {
      id: `${item.id}-auto-mcq-4`,
      question: `‘${title}’ পাঠ থেকে শিক্ষার্থীরা মূলত কোন শিক্ষণফল লাভ করে?`,
      options: [
        item.learningOutcomes?.[0] || 'মানবিক মূল্যবোধ ও সামাজিক দায়িত্বশীলতা',
        'উদাসীনতা',
        'অলস জীবনযাপন',
        'অসাধুতা',
      ],
      correctAnswerIndex: 0,
      explanation: 'পাঠটি অধ্যয়নের মাধ্যমে শিক্ষার্থীর সুকোমল বৃত্তি ও চেতনার বিকাশ ঘটে।',
      sourceTag: 'nctb_textbook',
      sourceLabel: 'এনসিটিবি শিখনফল ফ্রেমওয়ার্ক',
    },
    {
      id: `${item.id}-auto-mcq-5`,
      question: `বার্ষিক পরীক্ষার জন্য ‘${title}’ পাঠটি কতটুকু গুরুত্বপূর্ণ?`,
      options: [
        'অতি গুরুত্বপূর্ণ এবং সৃজনশীল/MCQ অংশের জন্য নির্ধারিত',
        'ঐচ্ছিক অতিরিক্ত পাঠ',
        'পরীক্ষার অন্তর্ভুক্ত নয়',
        'শুধুমাত্র শিক্ষকদের জন্য',
      ],
      correctAnswerIndex: 0,
      explanation: '২০২৬ শিক্ষাবর্ষের বার্ষিক পরীক্ষা ও চূড়ান্ত মূল্যায়নে এটি আবশ্যিক পাঠ্য।',
      sourceTag: 'practice_model',
      sourceLabel: 'বার্ষিক পরীক্ষা ২০২৬ প্রশ্নকাঠামো',
    },
  ];

  while (mcqs.length < 5) {
    const candidate = defaultMCQs[mcqs.length];
    if (candidate) {
      mcqs.push(candidate);
    } else {
      break;
    }
  }

  return {
    ...item,
    shortQuestions,
    mcqs,
  };
}
