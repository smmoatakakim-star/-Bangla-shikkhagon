#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
from build_curriculum_modules import generate_class_file

# Load Class 6, 7, 8 scripts
exec(open("scripts/generate_all_classes.py").read())

# ==============================================================================
# CLASS 9 & 10 (SSC FOUNDATION & MASTERY)
# ==============================================================================
ssc_subjects = [
    {
        "id": "bangla", "name": "বাংলা",
        "chapters": [
            {"id": "ch-c9-ban-1", "order": 1, "title": "১ম অধ্যায়: শুভা (রবীন্দ্রনাথ ঠাকুর)", "description": "প্রকৃতির আশ্রয়ে বেড়ে ওঠা বাকপ্রতিবন্ধী কিশোরী শুভার অন্তরের অব্যক্ত বেদনা ও মানবিক আকুতি।"},
            {"id": "ch-c9-ban-2", "order": 2, "title": "২য় অধ্যায়: বই পড়া (প্রমথ চৌধুরী)", "description": "স্বশিক্ষিত মানুষ গঠনের প্রয়োজনীয়তা, লাইব্রেরির গুরুত্ব এবং মুখস্থ শিক্ষার ত্রুটি।"},
            {"id": "ch-c9-ban-3", "order": 3, "title": "৩য় অধ্যায়: অভাগীর স্বর্গ (শরৎচন্দ্র চট্টোপাধ্যায়)", "description": "সামন্তবাদী সমাজে নিম্নবর্ণের গরিব মানুষের মর্মন্তুদ বঞ্চনা ও কাঙালীর মাতৃভক্তি।"},
            {"id": "ch-c9-ban-4", "order": 4, "title": "৪র্থ অধ্যায়: পল্লীসাহিত্য (ড. মুহম্মদ শহীদুল্লাহ)", "description": "বাংলার লোকসংস্কৃতি, জারি-সারি গান, রূপকথা ও পল্লীর সমৃদ্ধ ঐতিহ্য সংরক্ষণের আহ্বান।"},
            {"id": "ch-c9-ban-5", "order": 5, "title": "৫ম অধ্যায়: আম-আঁটির ভেঁপু (বিভূতিভূষণ বন্দ্যোপাধ্যায়)", "description": "অপু ও দুর্গার নিষ্পাপ গ্রামীণ শৈশব, প্রকৃতির অপার রহস্য এবং চিরায়ত ভ্রাতৃপ্রেম।"},
            {"id": "ch-c9-ban-6", "order": 6, "title": "৬ষ্ঠ অধ্যায়: বঙ্গবাণী (আব্দুল হাকিম)", "description": "মধ্যযুগের বাংলায় মাতৃভাষা বাংলার প্রতি অবিচল ভালোবাসা ও দেশদ্রোহীদের তীব্র ভর্ৎসনা।"},
            {"id": "ch-c9-ban-7", "order": 7, "title": "৭ম অধ্যায়: কপোতাক্ষ নদ (মাইকেল মধুসূদন দত্ত)", "description": "ফ্রান্সে নির্বাসিত কবির স্মৃতিকাতরতা ও যশোরের কপোতাক্ষ নদের প্রতি নিঃশর্ত ভালোবাসা (সনেট)।"},
            {"id": "ch-c9-ban-8", "order": 8, "title": "৮ম অধ্যায়: জীবন-সঙ্গীত (হেমচন্দ্র বন্দ্যোপাধ্যায়)", "description": "মানবজীবন মায়ামরীচিকা নয়, কর্মের মাধ্যমে পৃথিবীতে অমর কীর্তি স্থাপনের চিরন্তন আহ্বান।"},
            {"id": "ch-c9-ban-9", "order": 9, "title": "৯ম অধ্যায়: জুতো আবিষ্কার (রবীন্দ্রনাথ ঠাকুর)", "description": "রাজা হবুচন্দ্রের অদ্ভুত নির্দেশ ও চামার কুলের বৃদ্ধ চর্মকারের বুদ্ধিদীপ্ত বাস্তব সমাধান।"},
            {"id": "ch-c9-ban-10", "order": 10, "title": "১০ম অধ্যায়: বাংলা ব্যাকরণ ও নির্মিতি", "description": "ধ্বনি ও বর্ণ, সন্ধি, সমাস, কারক ও বিভক্তি, ণ-ত্ব ও ষ-ত্ব বিধান এবং বাক্য প্রকরণ।"}
        ]
    },
    {
        "id": "english", "name": "English",
        "chapters": [
            {"id": "ch-c9-eng-1", "order": 1, "title": "Unit 1: Good Citizens", "description": "Rights and responsibilities of citizens, following state laws, and civic duty."},
            {"id": "ch-c9-eng-2", "order": 2, "title": "Unit 2: Pastimes and Hobbies", "description": "Constructive leisure activities, sports, reading habits, and digital wellness."},
            {"id": "ch-c9-eng-3", "order": 3, "title": "Unit 3: Events and Festivals", "description": "International Mother Language Day (21st Feb), Independence Day, and Pahela Baishakh."},
            {"id": "ch-c9-eng-4", "order": 4, "title": "Unit 4: Are We Aware?", "description": "Youth awareness, population management, environmental hazards, and sanitation."},
            {"id": "ch-c9-eng-5", "order": 5, "title": "Unit 5: Nature and Environment", "description": "Rising sea levels, global warming, carbon footprints, and renewable green energy."},
            {"id": "ch-c9-eng-6", "order": 6, "title": "Unit 6: Our Neighbours", "description": "Cultural ties, geography, and relations with India, Nepal, Bhutan, and Sri Lanka."},
            {"id": "ch-c9-eng-7", "order": 7, "title": "Unit 7: People Who Stand Out", "description": "Inspiring lives of Shilpacharya Zainul Abedin, Mother Teresa, and Begum Rokeya."},
            {"id": "ch-c9-eng-8", "order": 8, "title": "Unit 8: World Heritage", "description": "The Historic Shat Gombuj Mosque, Paharpur Somapura Mahavihara, and the Sundarbans."},
            {"id": "ch-c9-eng-9", "order": 9, "title": "Unit 9: Unconventional Vocations", "description": "Creative freelancing, culinary arts, social entrepreneurship, and wildlife photography."},
            {"id": "ch-c9-eng-10", "order": 10, "title": "Unit 10: Grammar Mastery — SSC Board Special", "description": "Transformation of Sentences, Right Form of Verbs, Tag Questions, Narration, and Connectors."}
        ]
    },
    {
        "id": "math", "name": "সাধারণ গণিত",
        "chapters": [
            {"id": "ch-c9-mat-1", "order": 1, "title": "১ম অধ্যায়: বাস্তব সংখ্যা (Real Numbers)", "description": "মূলদ ও অমূলদ সংখ্যা, আবৃত্ত দশমিক ভগ্নাংশ, আসন্ন মান ও সাধারণ ভগ্নাংশে রূপান্তর।"},
            {"id": "ch-c9-mat-2", "order": 2, "title": "২য় অধ্যায়: সেট ও ফাংশন (Sets & Functions)", "description": "সার্বিক সেট, উপসেট, শক্তি সেট, কার্তেসীয় গুণজ, অন্যয় ও ফাংশনের ডোমেন-রেঞ্জ।"},
            {"id": "ch-c9-mat-3", "order": 3, "title": "৩য় অধ্যায়: বীজগণিতীয় রাশি (Algebraic Expressions)", "description": "বর্গ ও ঘন সংবলিত সূত্রাবলী, মান নির্ণয়, উৎপাদকে বিশ্লেষণ ও বাস্তব সমস্যার সমাধান।"},
            {"id": "ch-c9-mat-4", "order": 4, "title": "৪র্থ অধ্যায়: সূচক ও লগারিদম (Exponents & Logarithms)", "description": "সূচকের সূত্রাবলী, লগারিদমের ভিত্তি, পূর্ণক ও অংশক এবং বৈজ্ঞানিক রূপে প্রকাশ।"},
            {"id": "ch-c9-mat-5", "order": 5, "title": "৫ম অধ্যায়: এক চলকবিশিষ্ট সমীকরণ", "description": "ঘাত সমীকরণ, দ্বিঘাত সমীকরণের মূল নির্ণয় এবং ব্যবহারিক গাণিতিক সমাধান।"},
            {"id": "ch-c9-mat-6", "order": 6, "title": "৬ষ্ঠ অধ্যায়: রেখা, কোণ ও ত্রিভুজ", "description": "জ্যামিতিক স্বতঃসিদ্ধ, উপপাদ্য ১৫ (ত্রিভুজের মধ্যবিন্দুর সংযোজক রেখা) ও প্রমাণ।"},
            {"id": "ch-c9-mat-7", "order": 7, "title": "৭ম অধ্যায়: ব্যবহারিক জ্যামিতি (সম্পাদ্য)", "description": "ত্রিভুজ ও চতুর্ভুজ অঙ্কন, পরিসীমা ও কোণ দেওয়া থাকলে নির্দিষ্ট ত্রিভুজ গঠন।"},
            {"id": "ch-c9-mat-8", "order": 8, "title": "৮ম অধ্যায়: বৃত্ত (Circles & Theorems)", "description": "বৃত্তের স্পর্শক, কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ, এবং বৃত্তস্থ চতুর্ভুজের বিপরীত কোণ।"},
            {"id": "ch-c9-mat-9", "order": 9, "title": "৯ম অধ্যায়: ত্রিকোণমিতিক অনুপাত (৯.১ ও ৯.২)", "description": "sin, cos, tan, cot, sec, cosec-এর সম্পর্ক, অভেদাবলী ও কোণের মান (০°, ৩০°, ৪৫°, ৬০°, ৯০°)।"},
            {"id": "ch-c9-mat-10", "order": 10, "title": "১০ম অধ্যায়: দূরত্ব ও উচ্চতা (Distance & Elevation)", "description": "উন্নতি কোণ, অবনতি কোণ, মিনারের উচ্চতা ও নদীর বিস্তার নির্ণয়ের ত্রিকোণমিতিক সমাধান।"},
            {"id": "ch-c9-mat-11", "order": 11, "title": "১১শ অধ্যায়: বীজগণিতীয় অনুপাত ও সমানুপাত", "description": "যোজন, বিয়োজন, একান্তরকরণ, ব্যস্তকরণ এবং ক্রমিক সমানুপাতিক সমস্যা।"},
            {"id": "ch-c9-mat-12", "order": 12, "title": "১২শ অধ্যায়: দুই চলকবিশিষ্ট সরল সহসমীকরণ", "description": "প্রতিস্থাপন, অপনয়ন, আরজগুণন এবং লেখচিত্রের সাহায্যে সহসমীকরণ সমাধান।"},
            {"id": "ch-c9-mat-13", "order": 13, "title": "১৩শ অধ্যায়: সসীম ধারা (Finite Series)", "description": "সমান্তর ধারা (n-তম পদ ও n পদের সমষ্টি) এবং গুণোত্তর ধারা (n-তম পদ ও সমষ্টি)।"},
            {"id": "ch-c9-mat-14", "order": 14, "title": "১৪শ অধ্যায়: অনুপাত, সদৃশতা ও প্রতিসমতা", "description": "সদৃশ ত্রিভুজের ক্ষেত্রফল ও অনুরূপ বাহুর বর্গের অনুপাতের সম্পর্ক।"},
            {"id": "ch-c9-mat-15", "order": 15, "title": "১৫শ অধ্যায়: ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য", "description": "সামান্তরিক ও ত্রিভুজক্ষেত্রের ক্ষেত্রফলের সম্পর্ক এবং পিথাগোরাসের উপপাদ্যের বিস্তার।"},
            {"id": "ch-c9-mat-16", "order": 16, "title": "১৬শ অধ্যায়: পরিমিতি (Mensuration)", "description": "ত্রিভুজ, চতুর্ভুজ, বৃত্তের ক্ষেত্রফল, বেলন বা সিলিন্ডার ও আয়তাকার ঘনবস্তুর আয়তন।"},
            {"id": "ch-c9-mat-17", "order": 17, "title": "১৭শ অধ্যায়: পরিসংখ্যান (Statistics)", "description": "সংক্ষিপ্ত পদ্ধতিতে গড়, মধ্যক, প্রচুরক এবং ক্রমযোজিত গণসংখ্যা লেখচিত্র ও ওজাইভ রেখা।"}
        ]
    },
    {
        "id": "physics", "name": "পদার্থবিজ্ঞান",
        "chapters": [
            {"id": "ch-c9-phy-1", "order": 1, "title": "১ম অধ্যায়: ভৌত রাশি ও পরিমাপ", "description": "ভার্নিয়ার স্কেল, স্ক্রু গজ, স্লাইড ক্যালিপার্স, লঘিষ্ঠ গণন ও পরিমাপে ত্রুটি।"},
            {"id": "ch-c9-phy-2", "order": 2, "title": "২য় অধ্যায়: গতি (Motion)", "description": "দূরত্ব, সরণ, বেগ, ত্বরণ, গতির সমীকরণ (v=u+at, s=ut+½at², v²=u²+2as) ও লেখচিত্র।"},
            {"id": "ch-c9-phy-3", "order": 3, "title": "৩য় অধ্যায়: বল (Force)", "description": "নিউটনের গতিসূত্র, জড়তা, ভরবেগ সংরক্ষণ সূত্র (m₁u₁+m₂u₂ = m₁v₁+m₂v₂) ও ঘর্ষণ।"},
            {"id": "ch-c9-phy-4", "order": 4, "title": "৪র্থ অধ্যায়: কাজ, ক্ষমতা ও শক্তি", "description": "কাজ W=Fs, গতিশক্তি Ek=½mv², বিভবশক্তি Ep=mgh, কর্মদক্ষতা ও শক্তির রূপান্তর।"},
            {"id": "ch-c9-phy-5", "order": 5, "title": "৫ম অধ্যায়: পদার্থের অবস্থা ও চাপ", "description": "চাপ P=hρg, প্লবতা, আর্কিমিডিসের নীতি, প্যাসকেলের সূত্র ও স্থিতিস্থাপকতা (হুকের সূত্র)।"},
            {"id": "ch-c9-phy-6", "order": 6, "title": "৬ষ্ঠ অধ্যায়: বস্তুর ওপর তাপের প্রভাব", "description": "কঠিনের প্রসারণ (α, β, γ), আপেক্ষিক তাপ (Q=msΔθ), ক্যালরিমেট্রির মূলনীতি ও গলন।"},
            {"id": "ch-c9-phy-7", "order": 7, "title": "৭ম অধ্যায়: তরঙ্গ ও শব্দ (Waves & Sound)", "description": "অনুদৈর্ঘ্য ও অনুপ্রস্থ তরঙ্গ, তরঙ্গ সমীকরণ (v=fλ), শব্দের বেগ, প্রতিধ্বনি ও শ্রবণসীমা।"},
            {"id": "ch-c9-phy-8", "order": 8, "title": "৮ম অধ্যায়: আলোর প্রতিফলন (Reflection of Light)", "description": "গোলীয় দর্পণ (অবতল ও উত্তল), ফোকাস দূরত্ব ও বক্রতার ব্যাসার্ধ (f=r/2), এবং দর্পণের সমীকরণ।"},
            {"id": "ch-c9-phy-9", "order": 9, "title": "৯ম অধ্যায়: আলোর প্রতিসরণ (Refraction of Light)", "description": "প্রতিসরণাঙ্ক (Snell's Law), সংকট কোণ, পূর্ণ অভ্যন্তরীণ প্রতিফলন, অপটিক্যাল ফাইবার ও লেন্স।"},
            {"id": "ch-c9-phy-10", "order": 10, "title": "১০ম অধ্যায়: স্থির বিদ্যুৎ (Static Electricity)", "description": "কুলম্বের সূত্র (F = k(q₁q₂)/d²), তড়িৎ তীব্রতা, তড়িৎ বিভব ও তড়িৎ আবেশ।"},
            {"id": "ch-c9-phy-11", "order": 11, "title": "১১শ অধ্যায়: চল বিদ্যুৎ (Current Electricity)", "description": "ওহমের সূত্র (I=V/R), তুল্য রোধ (শ্রেণি ও সমান্তরাল), তড়িৎ ক্ষমতা ও ইউনিট (kWh) খরচ।"},
            {"id": "ch-c9-phy-12", "order": 12, "title": "১২শ অধ্যায়: বিদ্যুতের চৌম্বক ক্রিয়া", "description": "তড়িৎচৌম্বক আবেশ, ফ্যারাডের সূত্র, ট্রান্সফরমার (Vp/Vs = Np/Ns = Is/Ip) ও মোটর।"},
            {"id": "ch-c9-phy-13", "order": 13, "title": "১৩শ অধ্যায়: আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স", "description": "তেজস্ক্রিয়তা (আলফা, বিটা, গামা), অর্ধপরিবাহী (p-n জংশন ডায়োড) ও ডিজিটাল লজিক।"},
            {"id": "ch-c9-phy-14", "order": 14, "title": "১৪শ অধ্যায়: জীবন বাঁচাতে পদার্থবিজ্ঞান", "description": "এক্স-রে, সিটি স্ক্যান, এমআরআই (MRI), আল্ট্রাসনোগ্রাফি, ইসিজি ও রেডিওথেরাপি।"}
        ]
    },
    {
        "id": "chemistry", "name": "রসায়ন",
        "chapters": [
            {"id": "ch-c9-che-1", "order": 1, "title": "১ম অধ্যায়: রসায়নের ধারণা (Concepts of Chemistry)", "description": "রসায়নের পরিধি, অনুসন্ধান ও গবেষণা প্রক্রিয়া এবং পরীক্ষাগারের সতর্কতামূলক প্রতীক।"},
            {"id": "ch-c9-che-2", "order": 2, "title": "২য় অধ্যায়: পদার্থের অবস্থা (States of Matter)", "description": "কণার গতিতত্ত্ব, ব্যাপন ও নিঃসরণ (Graham's Law), গলন ও স্ফুটন এবং পাতন।"},
            {"id": "ch-c9-che-3", "order": 3, "title": "৩য় অধ্যায়: পদার্থের গঠন (Structure of Matter)", "description": "রাদারফোর্ড ও বোর পরমাণু মডেল, কোয়ান্টাম স্তর ও উপস্তর (s, p, d, f) ইলেকট্রন বিন্যাস।"},
            {"id": "ch-c9-che-4", "order": 4, "title": "৪র্থ অধ্যায়: পর্যায় সারণি (Periodic Table)", "description": "মেন্ডেলিফের পর্যায় সূত্র, আধুনিক পর্যায় সূত্র, পর্যায়বৃত্ত ধর্ম (আয়নিকরণ শক্তি, তড়িৎ ঋণাত্মকতা)।"},
            {"id": "ch-c9-che-5", "order": 5, "title": "৫ম অধ্যায়: রাসায়নিক বন্ধন (Chemical Bonding)", "description": "অষ্টক ও দুইয়ের নিয়ম, আয়ন সৃষ্টি, আয়নিক ও সমযোজী বন্ধন এবং বন্ধনের বৈশিষ্ট্য।"},
            {"id": "ch-c9-che-6", "order": 6, "title": "৬ষ্ঠ অধ্যায়: মোলের ধারণা ও রাসায়নিক গণনা", "description": "মোল ও অ্যাভোগাড্রো সংখ্যা (৬.০২৩×১০²³), মোলার আয়তন (২২.৪ লিটার), শতকরা সংযুতি ও স্থূল সংকেত।"},
            {"id": "ch-c9-che-7", "order": 7, "title": "৭ম অধ্যায়: রাসায়নিক বিক্রিয়া (Chemical Reactions)", "description": "রেডক্স (জারণ-বিজারণ) বিক্রিয়া, ইলেকট্রন স্থানান্তর, লা-শাতেলিয়ার নীতি ও বিক্রিয়ার গতি।"},
            {"id": "ch-c9-che-8", "order": 8, "title": "৮ম অধ্যায়: রসায়ন ও শক্তি (Chemistry & Energy)", "description": "রাসায়নিক বিক্রিয়ায় তাপ পরিবর্তন (ΔH), তড়িৎ রাসায়নিক কোষ (গ্যালভানিক ও ভোল্টাইক সেল)।"},
            {"id": "ch-c9-che-9", "order": 9, "title": "৯ম অধ্যায়: এসিড-ক্ষার সমতা (Acids & Bases)", "description": "pH স্কেল, শক্তিশালী ও দুর্বল এসিড, প্রশমন তাপ ও কৃষিতে চুন ব্যবহারের গুরুত্ব।"},
            {"id": "ch-c9-che-10", "order": 10, "title": "১০ম অধ্যায়: খনিজ সম্পদ: ধাতু-অধাতু", "description": "ধাতু নিষ্কাশন (বক্সাইট, হেমাটাইট), ধাতু সংকর এবং সালফার ও অ্যামোনিয়া প্রস্তুতি।"},
            {"id": "ch-c9-che-11", "order": 11, "title": "১১শ অধ্যায়: খনিজ সম্পদ: জীবাশ্ম", "description": "হাইড্রোকার্বন, অ্যালকেন, অ্যালকিন, অ্যালকাইন, অ্যালকোহল ও কৃত্রিম পলিমার (পলিথিন)।"},
            {"id": "ch-c9-che-12", "order": 12, "title": "১২শ অধ্যায়: আমাদের জীবনে রসায়ন", "description": "গৃহস্থালি রসায়ন—বেকিং পাউডার, ভিনেগার, ব্লিচিং পাউডার, সাবান ও ডিটারজেন্টের ক্রিয়াকৌশল।"}
        ]
    },
    {
        "id": "biology", "name": "জীববিজ্ঞান",
        "chapters": [
            {"id": "ch-c9-bio-1", "order": 1, "title": "১ম অধ্যায়: জীবন পাঠ (Lesson of Life)", "description": "দ্বিপদ নামকরণ (Carolus Linnaeus), ট্যাক্সোনমির ধাপ ও জীববিজ্ঞানের প্রধান শাখাসমূহ।"},
            {"id": "ch-c9-bio-2", "order": 2, "title": "২য় অধ্যায়: জীবকোষ ও টিস্যু (Cells & Tissues)", "description": "উদ্ভিদ ও প্রাণীকোষের অঙ্গাণু, জাইলেম ও ফ্লোয়েম জটিল টিস্যু এবং আবরণী টিস্যু।"},
            {"id": "ch-c9-bio-3", "order": 3, "title": "৩য় অধ্যায়: কোষ বিভাজন (Cell Division)", "description": "মাইটোসিসের ৫টি পর্যায় (প্রোফেজ থেকে টেলোফেজ) এবং মিয়োসিসে ক্রসিং ওভার।"},
            {"id": "ch-c9-bio-4", "order": 4, "title": "৪র্থ অধ্যায়: জীবনীশক্তি (Bioenergetics)", "description": "এটিপি (ATP), সালোকসংশ্লেষণের আলোক ও অন্ধকার পর্যায় (Calvin Cycle) এবং শ্বসন।"},
            {"id": "ch-c9-bio-5", "order": 5, "title": "৫ম অধ্যায়: খাদ্য, পুষ্টি এবং পরিপাক", "description": "খাদ্যের উপাদান, ভিটামিনের অভাবজনিত রোগ, পৌষ্টিকতন্ত্রের অঙ্গ ও এনজাইমের পরিপাক।"},
            {"id": "ch-c9-bio-6", "order": 6, "title": "৬ষ্ঠ অধ্যায়: জীবে পরিবহন (Transport in Living Organisms)", "description": "রক্তের গ্রুপ (ABO ও Rh ফ্যাক্টর), রক্ত সঞ্চালন (সিস্টোল-ডায়াস্টোল), রক্তচাপ ও হার্ট অ্যাটাক।"},
            {"id": "ch-c9-bio-7", "order": 7, "title": "৭ম অধ্যায়: গ্যাসীয় বিনিময় (Gaseous Exchange)", "description": "মানব অ্যালভিওলাসের গঠন, হিমোগ্লোবিনের অক্সিজেন পরিবহন, হাঁপানি ও নিউমোনিয়া।"},
            {"id": "ch-c9-bio-8", "order": 8, "title": "৮ম অধ্যায়: রেচন প্রক্রিয়া (Excretory System & Kidney)", "description": "বৃক্ক ও নেফ্রনের অন্তর্গঠন, আল্ট্রাফিল্ট্রেশন, মূত্র তৈরি, কিডনি বিকল ও হিমোডায়ালিসিস।"},
            {"id": "ch-c9-bio-9", "order": 9, "title": "৯ম অধ্যায়: দৃঢ়তা প্রদান ও চলন (Support & Movement)", "description": "অস্থিসন্ধি, সাইনোভিয়াল ফ্লুইড, টেন্ডন ও লিগামেন্ট এবং অস্টিওপোরোসিস রোগ।"},
            {"id": "ch-c9-bio-10", "order": 10, "title": "১০ম অধ্যায়: সমন্বয় (Coordination)", "description": "নিউরনের ডেনড্রাইট ও অ্যাক্সন, সাইন্যাপ্স, মস্তিষ্ক ও অন্তঃক্ষরা গ্রন্থির হরমোন।"},
            {"id": "ch-c9-bio-11", "order": 11, "title": "১১শ অধ্যায়: জীবের প্রজনন (Reproduction in Organisms)", "description": "পরাগায়ন, পুং ও স্ত্রী গ্যামেটোফাইটের উৎপত্তি, দ্বিনিষেক ও মানব ভ্রূণের পরিস্ফুটন।"},
            {"id": "ch-c9-bio-12", "order": 12, "title": " ১২শ অধ্যায়: জীবের বংশগতি ও জৈব অভিব্যক্তি", "description": "ডিএনএ (DNA) ডাবল হেলিক্স মডেল, জিন, ক্রোমোজোম ও ডারউইনের প্রাকৃতিক নির্বাচন মতবাদ।"},
            {"id": "ch-c9-bio-13", "order": 13, "title": "১৩শ অধ্যায়: জীবের পরিবেশ (Ecosystem & Biomes)", "description": "বাস্তুতন্ত্রের ট্রফিক লেভেল, শক্তির পিরামিড, নাইট্রোজেন চক্র ও জীববৈচিত্র্য সংরক্ষণ।"},
            {"id": "ch-c9-bio-14", "order": 14, "title": "১৪শ অধ্যায়: জীবপ্রযুক্তি (Biotechnology)", "description": "টিস্যু কালচার পদ্ধতি, রিকম্বিনেন্ট ডিএনএ প্রযুক্তি, প্লাজমিড ও জিএম শস্যের উৎপাদন।"}
        ]
    },
    {
        "id": "bgs", "name": "বাংলাদেশ ও বিশ্বপরিচয়",
        "chapters": [
            {"id": "ch-c9-bgs-1", "order": 1, "title": "১ম অধ্যায়: পূর্ব বাংলার আন্দোলন ও জাতীয়তাবাদের উন্মেষ", "description": "১৯৫২-এর ভাষা আন্দোলন, যুক্তফ্রন্ট, ১৯৫৮-এর সামরিক শাসন ও বাঙালি জাতীয়তাবাদের বিকাশ।"},
            {"id": "ch-c9-bgs-2", "order": 2, "title": "২য় অধ্যায়: স্বাধীন বাংলাদেশ", "description": "১৯৭১ সালের গণহত্যা, প্রতিরোধ, মুজিবনগর সরকারের পরিচালনা এবং চূড়ান্ত মুক্তি ও বিজয়।"},
            {"id": "ch-c9-bgs-3", "order": 3, "title": "৩য় অধ্যায়: সৌরজগৎ ও ভূমণ্ডল", "description": "অক্ষরেখা, দ্রাঘিমারেখা, স্থানীয় সময় ও প্রমাণ সময় নির্ণয়, এবং জোয়ার-ভাটার বৈজ্ঞানিক কারণ।"},
            {"id": "ch-c9-bgs-4", "order": 4, "title": "৪র্থ অধ্যায়: বাংলাদেশের ভূপ্রকৃতি ও জলবায়ু", "description": "টারশিয়ারি যুগের পাহাড়, প্লাইস্টোসিন সোপান, সাম্প্রতিককালের প্লাবন সমভূমি ও মৌসুমি জলবায়ু।"},
            {"id": "ch-c9-bgs-5", "order": 5, "title": "৫ম অধ্যায়: বাংলাদেশের নদ-নদী ও প্রাকৃতিক সম্পদ", "description": "পদ্মা, মেঘনা, যমুনা, প্রাকৃতিক গ্যাস, কয়লা, বনভূমি ও সামুদ্রিক জলজ সম্পদের সুরক্ষা।"},
            {"id": "ch-c9-bgs-6", "order": 6, "title": "৬ষ্ঠ অধ্যায়: রাষ্ট্র, নাগরিকতা ও আইন", "description": "সার্বভৌমত্ব, আইনের শাসন, মৌলিক মানবাধিকার ও সুনাগরিকের সাংবিধানিক দায়িত্ব।"},
            {"id": "ch-c9-bgs-7", "order": 7, "title": "৭ম অধ্যায়: বাংলাদেশ সরকারের অঙ্গসমূহ ও শাসন ব্যবস্থা", "description": "রাষ্ট্রপতি, প্রধানমন্ত্রী, জাতীয় সংসদ, সুপ্রিম কোর্টের আপিল ও হাইকোর্ট বিভাগ।"},
            {"id": "ch-c9-bgs-8", "order": 8, "title": "৮ম অধ্যায়: বাংলাদেশের গণতন্ত্র ও নির্বাচন", "description": "সার্বজনীন ভোটাধিকার, রাজনৈতিক দল ও নিরপেক্ষ নির্বাচন কমিশনের সাংবিধানিক দায়িত্ব।"},
            {"id": "ch-c9-bgs-9", "order": 9, "title": "৯ম অধ্যায়: জাতিসংঘ ও বাংলাদেশ", "description": "জাতিসংঘের শান্তি রক্ষা মিশন, ইউনিসেফ, ইউনেস্কো এবং বাংলাদেশের সক্রিয় কূটনৈতিক ভূমিকা।"},
            {"id": "ch-c9-bgs-10", "order": 10, "title": "১০ম অধ্যায়: টেকসই উন্নয়ন অভীষ্ট (SDG 2030)", "description": "দারিদ্র্য দূরীকরণ, মানসম্মত শিক্ষা, জেন্ডার সমতা এবং জলবায়ু সুরক্ষার ১৭টি লক্ষ্যমাত্রা।"},
            {"id": "ch-c9-bgs-11", "order": 11, "title": "১১শ অধ্যায়: জাতীয় সম্পদ ও অর্থনৈতিক ব্যবস্থা", "description": "ধনাঢ্যতা বনাম সামাজিক বণ্টন, পুঁজিবাদী, সমাজতান্ত্রিক ও মিশ্র অর্থনৈতিক কাঠামোর তুলনা।"},
            {"id": "ch-c9-bgs-12", "order": 12, "title": "১২শ অধ্যায়: অর্থনৈতিক নির্দেশকসমূহ ও বাংলাদেশের অর্থনীতি", "description": "মোট দেশজ উৎপাদন (GDP), মোট জাতীয় উৎপাদন (GNP) ও মাথাপিছু আয়ের পরিমাপ।"},
            {"id": "ch-c9-bgs-13", "order": 13, "title": "১৩শ অধ্যায়: বাংলাদেশ সরকারের অর্থ ও ব্যাংক ব্যবস্থা", "description": "জাতীয় রাজস্ব বোর্ডের কর আদায়, সরকারের বাজেট এবং বাংলাদেশ ব্যাংকের মুদ্রানীতি।"},
            {"id": "ch-c9-bgs-14", "order": 14, "title": "১৪শ অধ্যায়: বাংলাদেশের পরিবার কাঠামো ও সামাজিকীকরণ", "description": "যৌথ পরিবারের রূপান্তর, সন্তান প্রতিপালন ও সমাজে মূল্যবোধের পরিবর্তন।"},
            {"id": "ch-c9-bgs-15", "order": 15, "title": "১৫শ অধ্যায়: বাংলাদেশের সামাজিক পরিবর্তন", "description": "শিল্পায়ন, নগরায়ণ, নারীর ক্ষমতায়ন ও ডিজিটাল তথ্যপ্রযুক্তির প্রভাব।"},
            {"id": "ch-c9-bgs-16", "order": 16, "title": "১৬শ অধ্যায়: বাংলাদেশের সামাজিক সমস্যা ও এর প্রতিকার", "description": "কিশোর অপরাধ, সড়ক দুর্ঘটনা, দুর্নীতি ও মাদকাসক্তি প্রতিরোধে সামাজিক আন্দোলন।"}
        ]
    }
]

# Generate Class 9 and Class 10 (with adjusted IDs for class 10)
generate_class_file("class-9", "৯ম শ্রেণি", ssc_subjects, "src/data/curriculum/class9Data.ts")

# For Class 10: adjust chapter IDs so they start with ch-c10-
c10_subjects = []
for sub in ssc_subjects:
    c10_ch = []
    for ch in sub["chapters"]:
        c10_ch.append({
            **ch,
            "id": ch["id"].replace("-c9-", "-c10-")
        })
    c10_subjects.append({
        **sub,
        "chapters": c10_ch
    })

generate_class_file("class-10", "১০ম শ্রেণি", c10_subjects, "src/data/curriculum/class10Data.ts")

# Generate index.ts uniting all 5 classes!
index_content = """import { ChapterInfo, Lesson, Quiz } from '../../types';
import { CLASS_6_CHAPTERS, CLASS_6_LESSONS, CLASS_6_QUIZZES } from './class6Data';
import { CLASS_7_CHAPTERS, CLASS_7_LESSONS, CLASS_7_QUIZZES } from './class7Data';
import { CLASS_8_CHAPTERS, CLASS_8_LESSONS, CLASS_8_QUIZZES } from './class8Data';
import { CLASS_9_CHAPTERS, CLASS_9_LESSONS, CLASS_9_QUIZZES } from './class9Data';
import { CLASS_10_CHAPTERS, CLASS_10_LESSONS, CLASS_10_QUIZZES } from './class10Data';

export const ALL_NCTB_COMPLETE_CHAPTERS: ChapterInfo[] = [
  ...CLASS_6_CHAPTERS,
  ...CLASS_7_CHAPTERS,
  ...CLASS_8_CHAPTERS,
  ...CLASS_9_CHAPTERS,
  ...CLASS_10_CHAPTERS,
];

export const ALL_NCTB_COMPLETE_LESSONS: Lesson[] = [
  ...CLASS_6_LESSONS,
  ...CLASS_7_LESSONS,
  ...CLASS_8_LESSONS,
  ...CLASS_9_LESSONS,
  ...CLASS_10_LESSONS,
];

export const ALL_NCTB_COMPLETE_QUIZZES: Quiz[] = [
  ...CLASS_6_QUIZZES,
  ...CLASS_7_QUIZZES,
  ...CLASS_8_QUIZZES,
  ...CLASS_9_QUIZZES,
  ...CLASS_10_QUIZZES,
];
"""

with open("src/data/curriculum/index.ts", "w", encoding="utf-8") as f:
    f.write(index_content)

print("Generated src/data/curriculum/index.ts uniting all classes.")
