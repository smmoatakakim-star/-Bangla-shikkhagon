#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Full Generator for SSC and HSC curriculum data files.
"""

import json
import os

os.makedirs('src/data/curriculum', exist_ok=True)

# -------------------------------------------------------------
# 1. SSC SUBJECTS DEFINITION
# -------------------------------------------------------------
SSC_SUBJECTS = [
    {
        "id": "bangla",
        "name": "বাংলা",
        "banglaName": "বাংলা সাহিত্য ও ব্যাকরণ",
        "classId": "ssc",
        "iconName": "BookOpen",
        "badgeColor": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        "description": "বাংলা সাহিত্য, কবিতা, গল্প, উপন্যাস এবং বাংলা ২য় পত্রের ব্যাকরণ ও নির্মিতি অংশ।",
        "code": "101",
        "group": "general",
        "paper": "আবশ্যিক"
    },
    {
        "id": "english",
        "name": "English",
        "banglaName": "ইংরেজি ১ম ও ২য় পত্র",
        "classId": "ssc",
        "iconName": "BookMarked",
        "badgeColor": "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        "description": "Reading comprehension, vocabulary, grammar mastery, and formal writing.",
        "code": "107",
        "group": "general",
        "paper": "আবশ্যিক"
    },
    {
        "id": "math",
        "name": "সাধারণ গণিত",
        "banglaName": "আবশ্যিক গণিত",
        "classId": "ssc",
        "iconName": "Calculator",
        "badgeColor": "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        "description": "বীজগণিত, জ্যামিতি, ত্রিকোণমিতি, পরিমিতি ও পরিসংখ্যানের সমাহার।",
        "code": "109",
        "group": "general",
        "paper": "আবশ্যিক"
    },
    {
        "id": "ict",
        "name": "তথ্য ও যোগাযোগ প্রযুক্তি",
        "banglaName": "আইসিটি",
        "classId": "ssc",
        "iconName": "Sparkles",
        "badgeColor": "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
        "description": "কম্পিউটার নেটওয়ার্ক, তথ্য নিরাপত্তা, ই-লার্নিং, স্প্রেডশিট ও ডাটাবেজের ব্যবহার।",
        "code": "154",
        "group": "general",
        "paper": "আবশ্যিক"
    },
    {
        "id": "physics",
        "name": "পদার্থবিজ্ঞান",
        "banglaName": "বিজ্ঞান শাখা পদার্থবিজ্ঞান",
        "classId": "ssc",
        "iconName": "Atom",
        "badgeColor": "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
        "description": "বলবিদ্যা, গতি, কাজ-ক্ষমতা-শক্তি, তরঙ্গ, আলো, স্থির ও চলবিদ্যুৎ এবং আধুনিক পদার্থবিজ্ঞান।",
        "code": "136",
        "group": "science",
        "paper": "বিজ্ঞান নৈর্বাচনিক"
    },
    {
        "id": "chemistry",
        "name": "রসায়ন",
        "banglaName": "বিজ্ঞান শাখা রসায়ন",
        "classId": "ssc",
        "iconName": "Atom",
        "badgeColor": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        "description": "পদার্থের গঠন, পর্যায় সারণি, রাসায়নিক বন্ধন, মোল ও গণনা, এসিড-ক্ষার এবং খনিজ সম্পদ।",
        "code": "137",
        "group": "science",
        "paper": "বিজ্ঞান নৈর্বাচনিক"
    },
    {
        "id": "biology",
        "name": "জীববিজ্ঞান",
        "banglaName": "বিজ্ঞান শাখা জীববিজ্ঞান",
        "classId": "ssc",
        "iconName": "Sparkles",
        "badgeColor": "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
        "description": "কোষ ও কলা, জীবনীশক্তি, খাদ্য ও পরিপাক, রক্ত সংবহন, রেচন, জীবের প্রজনন ও জেনেটিক্স।",
        "code": "138",
        "group": "science",
        "paper": "বিজ্ঞান নৈর্বাচনিক"
    },
    {
        "id": "higher_math",
        "name": "উচ্চতর গণিত",
        "banglaName": "বিজ্ঞান শাখা উচ্চতর গণিত",
        "classId": "ssc",
        "iconName": "Calculator",
        "badgeColor": "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        "description": "সেট ও ফাংশন, বীজগণিতীয় রাশি, জ্যামিতিক অঙ্কন, স্থানাঙ্ক জ্যামিতি, ভেক্টর ও সম্ভাবনা।",
        "code": "126",
        "group": "science",
        "paper": "ঐচ্ছিক / অতিরিক্ত"
    },
    {
        "id": "bgs",
        "name": "বাংলাদেশ ও বিশ্বপরিচয়",
        "banglaName": "বিজিএস",
        "classId": "ssc",
        "iconName": "BookOpen",
        "badgeColor": "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800",
        "description": "ইতিহাস, মুক্তিযুদ্ধ, সংবিধান ও নাগরিক অধিকার, রাষ্ট্র কাঠামো এবং সামাজিক সমস্যা।",
        "code": "150",
        "group": "general",
        "paper": "আবশ্যিক"
    },
    {
        "id": "history_bangladesh",
        "name": "ইতিহাস ও বিশ্বসভ্যতা",
        "banglaName": "বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা",
        "classId": "ssc",
        "iconName": "BookOpen",
        "badgeColor": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        "description": "প্রাচীন বাংলার ইতিহাস, মধ্যযুগ, ঔপনিবেশিক শাসন, মুক্তিযুদ্ধ ও সমকালীন বাংলাদেশ।",
        "code": "153",
        "group": "humanities",
        "paper": "মানবিক শাখা"
    },
    {
        "id": "geography",
        "name": "ভূগোল ও পরিবেশ",
        "banglaName": "ভূগোল ও পরিবেশ বিজ্ঞান",
        "classId": "ssc",
        "iconName": "Compass",
        "badgeColor": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        "description": "সৌরজগত ও পৃথিবী, বায়ুমণ্ডল, বারিমণ্ডল, জলবায়ু পরিবর্তন এবং বাংলাদেশের প্রাকৃতিক সম্পদ।",
        "code": "110",
        "group": "humanities",
        "paper": "মানবিক শাখা"
    },
    {
        "id": "civics",
        "name": "পৌরনীতি ও নাগরিকতা",
        "banglaName": "পৌরনীতি ও সুশাসন",
        "classId": "ssc",
        "iconName": "Users",
        "badgeColor": "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        "description": "পরিবার, সমাজ, রাষ্ট্র, সরকার কাঠামো, সংবিধান, মৌলিক অধিকার ও আন্তর্জাতিক সংস্থা।",
        "code": "140",
        "group": "humanities",
        "paper": "মানবিক শাখা"
    },
    {
        "id": "economics",
        "name": "অর্থনীতি",
        "banglaName": "অর্থনীতি পরিচিতি",
        "classId": "ssc",
        "iconName": "Briefcase",
        "badgeColor": "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
        "description": "অর্থনৈতিক সমস্যা ও নির্বাচন, উৎপাদন, চাহিদা ও যোগান, জাতীয় আয় ও অর্থনৈতিক উন্নয়ন।",
        "code": "141",
        "group": "humanities",
        "paper": "মানবিক শাখা"
    },
    {
        "id": "general_science",
        "name": "সাধারণ বিজ্ঞান",
        "banglaName": "সাধারণ বিজ্ঞান (মানবিক ও ব্যবসায়)",
        "classId": "ssc",
        "iconName": "Atom",
        "badgeColor": "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
        "description": "উন্নততর জীবনধারা, পানি, পলিমার, অম্ল-ক্ষারক, তড়িৎ প্রবাহ ও আধুনিক জীবনের বিজ্ঞান।",
        "code": "127",
        "group": "humanities",
        "paper": "মানবিক ও বাণিজ্য"
    },
    {
        "id": "accounting",
        "name": "হিসাববিজ্ঞান",
        "banglaName": "ব্যবসায় শিক্ষা হিসাববিজ্ঞান",
        "classId": "ssc",
        "iconName": "Briefcase",
        "badgeColor": "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        "description": "দুতরফা দাখিলা, জাবেদা, খতিয়ান, রেওয়ামিল, নগদান বই এবং আর্থিক বিবরণীর প্রস্তুতকরণ।",
        "code": "146",
        "group": "business_studies",
        "paper": "ব্যবসায় শিক্ষা"
    },
    {
        "id": "finance",
        "name": "ফিন্যান্স ও ব্যাংকিং",
        "banglaName": "ফিন্যান্স ও ব্যাংকিং",
        "classId": "ssc",
        "iconName": "Award",
        "badgeColor": "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
        "description": "অর্থায়ন ও ব্যবসায়ের অর্থায়ন, অর্থের সময়মূল্য, মূলধনী আয়-ব্যয় প্রাক্কলন ও ব্যাংকিং ব্যবস্থা।",
        "code": "152",
        "group": "business_studies",
        "paper": "ব্যবসায় শিক্ষা"
    },
    {
        "id": "business_ent",
        "name": "ব্যবসায় উদ্যোগ",
        "banglaName": "ব্যবসায় উদ্যোগ ও ব্যবস্থাপনা",
        "classId": "ssc",
        "iconName": "Briefcase",
        "badgeColor": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        "description": "উদ্যোক্তা গঠন, ব্যবসায় পরিবেশ, ব্যবসা পরিকল্পনা ও সফল ব্যবসায়ী হওয়ার নিয়ামক।",
        "code": "143",
        "group": "business_studies",
        "paper": "ব্যবসায় শিক্ষা"
    }
]

# -------------------------------------------------------------
# 2. HSC SUBJECTS DEFINITION
# -------------------------------------------------------------
HSC_SUBJECTS = [
    {
        "id": "bangla",
        "name": "বাংলা",
        "banglaName": "বাংলা ১ম ও ২য় পত্র",
        "classId": "hsc",
        "iconName": "BookOpen",
        "badgeColor": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        "description": "উচ্চ মাধ্যমিক সাহিত্য পাঠ, সহপাঠ এবং বাংলা ২য় পত্রের ব্যাকরণ ও প্রায়োগিক নির্মিতি।",
        "code": "101",
        "group": "general",
        "paper": "আবশ্যিক"
    },
    {
        "id": "english",
        "name": "English",
        "banglaName": "ইংরেজি ১ম ও ২য় পত্র",
        "classId": "hsc",
        "iconName": "BookMarked",
        "badgeColor": "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        "description": "Advanced comprehension, theme writing, academic vocabulary, and advanced grammar.",
        "code": "107",
        "group": "general",
        "paper": "আবশ্যিক"
    },
    {
        "id": "ict",
        "name": "তথ্য ও যোগাযোগ প্রযুক্তি",
        "banglaName": "উচ্চ মাধ্যমিক আইসিটি",
        "classId": "hsc",
        "iconName": "Sparkles",
        "badgeColor": "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
        "description": "যোগাযোগ ব্যবস্থা ও নেটওয়ার্কিং, সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস, ওয়েব ডিজাইন ও HTML, সি প্রোগ্রামিং এবং ডিবিএমএস।",
        "code": "275",
        "group": "general",
        "paper": "আবশ্যিক"
    },
    {
        "id": "physics_1st",
        "name": "পদার্থবিজ্ঞান ১ম পত্র",
        "banglaName": "উচ্চ মাধ্যমিক পদার্থবিজ্ঞান ১ম পত্র",
        "classId": "hsc",
        "iconName": "Atom",
        "badgeColor": "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
        "description": "ভৌত জগত, ভেক্টর, গতিবিদ্যা, নিউটোনীয় বলবিদ্যা, কাজ-শক্তি-ক্ষমতা, মহাকর্ষ, গাঠনিক ধর্ম, পর্যাবৃত্ত গতি ও আদর্শ গ্যাস।",
        "code": "174",
        "group": "science",
        "paper": "১ম পত্র"
    },
    {
        "id": "physics_2nd",
        "name": "পদার্থবিজ্ঞান ২য় পত্র",
        "banglaName": "উচ্চ মাধ্যমিক পদার্থবিজ্ঞান ২য় পত্র",
        "classId": "hsc",
        "iconName": "Atom",
        "badgeColor": "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
        "description": "তাপগতিবিদ্যা, স্থির তড়িৎ, চল তড়িৎ, তড়িৎ প্রবাহের চৌম্বক ক্রিয়া, তাড়িতচৌম্বক আবেশ, জ্যামিতিক ও ভৌত আলোকবিজ্ঞান, আধুনিক পদার্থবিজ্ঞান ও সেমিকন্ডাক্টর।",
        "code": "175",
        "group": "science",
        "paper": "২য় পত্র"
    },
    {
        "id": "chemistry_1st",
        "name": "রসায়ন ১ম পত্র",
        "banglaName": "উচ্চ মাধ্যমিক রসায়ন ১ম পত্র",
        "classId": "hsc",
        "iconName": "Atom",
        "badgeColor": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        "description": "ল্যাবরেটরির নিরাপদ ব্যবহার, গুণগত রসায়ন, পর্যায়বৃত্ত ধর্ম ও বন্ধন, রাসায়নিক পরিবর্তন এবং কর্মমুখী রসায়ন।",
        "code": "176",
        "group": "science",
        "paper": "১ম পত্র"
    },
    {
        "id": "chemistry_2nd",
        "name": "রসায়ন ২য় পত্র",
        "banglaName": "উচ্চ মাধ্যমিক রসায়ন ২য় পত্র",
        "classId": "hsc",
        "iconName": "Atom",
        "badgeColor": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        "description": "পরিবেশ রসায়ন, জৈব রসায়ন, পরিমাণগত রসায়ন, তড়িৎ রসায়ন এবং অর্থনৈতিক রসায়ন।",
        "code": "177",
        "group": "science",
        "paper": "২য় পত্র"
    },
    {
        "id": "biology_1st",
        "name": "জীববিজ্ঞান ১ম পত্র",
        "banglaName": "উদ্ভিদবিজ্ঞান (Botany)",
        "classId": "hsc",
        "iconName": "Sparkles",
        "badgeColor": "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
        "description": "কোষ ও এর গঠন, কোষ বিভাজন, অণুজীব, শৈবাল ও ছত্রাক, ব্রায়োফাইটা, টিস্যুতন্ত্র, উদ্ভিদ শারীরতত্ত্ব, প্রজনন ও জীবপ্রযুক্তি।",
        "code": "178",
        "group": "science",
        "paper": "১ম পত্র"
    },
    {
        "id": "biology_2nd",
        "name": "জীববিজ্ঞান ২য় পত্র",
        "banglaName": "প্রাণিবিজ্ঞান (Zoology)",
        "classId": "hsc",
        "iconName": "Sparkles",
        "badgeColor": "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
        "description": "প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস, পরিচিত প্রাণি (হাইড্রা, ঘাসফড়িং, রুই মাছ), মানব শারীরতত্ত্ব, জিনতত্ত্ব ও বিবর্তন।",
        "code": "179",
        "group": "science",
        "paper": "২য় পত্র"
    },
    {
        "id": "higher_math_1st",
        "name": "উচ্চতর গণিত ১ম পত্র",
        "banglaName": "উচ্চ মাধ্যমিক উচ্চতর গণিত ১ম পত্র",
        "classId": "hsc",
        "iconName": "Calculator",
        "badgeColor": "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        "description": "ম্যাট্রিক্স ও নির্ণায়ক, ভেক্টর, সরলরেখা, বৃত্ত, বিন্যাস ও সমাবেশ, ত্রিকোণমিতি এবং অন্তরীকরণ ও যৌগিকীকরণ (ক্যালকুলাস)।",
        "code": "265",
        "group": "science",
        "paper": "১ম পত্র"
    },
    {
        "id": "higher_math_2nd",
        "name": "উচ্চতর গণিত ২য় পত্র",
        "banglaName": "উচ্চ মাধ্যমিক উচ্চতর গণিত ২য় পত্র",
        "classId": "hsc",
        "iconName": "Calculator",
        "badgeColor": "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        "description": "বাস্তব সংখ্যা ও অসমতা, জটিল সংখ্যা, বহুপদী, কনিক্স, বিপরীত ত্রিকোণমিতিক ফাংশন, স্থিতিবিদ্যা, গতিবিদ্যা ও সম্ভাবনা।",
        "code": "266",
        "group": "science",
        "paper": "২য় পত্র"
    },
    {
        "id": "civics_1st",
        "name": "পৌরনীতি ও সুশাসন ১ম পত্র",
        "banglaName": "পৌরনীতি ও সুশাসন ১ম পত্র",
        "classId": "hsc",
        "iconName": "Users",
        "badgeColor": "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        "description": "পৌরনীতি ও সুশাসনের ধারণা, মূল্যবোধ, আইন, স্বাধীনতা ও সাম্য, নাগরিক অধিকার, রাজনৈতিক দল ও সংবিধান।",
        "code": "269",
        "group": "humanities",
        "paper": "১ম পত্র"
    },
    {
        "id": "civics_2nd",
        "name": "পৌরনীতি ও সুশাসন ২য় পত্র",
        "banglaName": "পৌরনীতি ও সুশাসন ২য় পত্র",
        "classId": "hsc",
        "iconName": "Users",
        "badgeColor": "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        "description": "ব্রিটিশ ভারতে প্রতিনিধিত্বশীল সরকার, পাকিস্তানের শাসন, বাংলাদেশের স্বাধীনতা সংগ্রাম, সংবিধান ও পররাষ্ট্রনীতি।",
        "code": "270",
        "group": "humanities",
        "paper": "২য় পত্র"
    },
    {
        "id": "economics_1st",
        "name": "অর্থনীতি ১ম পত্র",
        "banglaName": "ব্যষ্টিক অর্থনীতি (Microeconomics)",
        "classId": "hsc",
        "iconName": "Briefcase",
        "badgeColor": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        "description": "মৌলিক অর্থনৈতিক সমস্যা, ভোক্তা ও উৎপাদকের আচরণ, উৎপাদন ও ব্যয়, বাজার ও খাজনা তত্ত্ব।",
        "code": "109",
        "group": "humanities",
        "paper": "১ম পত্র"
    },
    {
        "id": "economics_2nd",
        "name": "অর্থনীতি ২য় পত্র",
        "banglaName": "সামষ্টিক অর্থনীতি ও বাংলাদেশ অর্থনীতি",
        "classId": "hsc",
        "iconName": "Briefcase",
        "badgeColor": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        "description": "বাংলাদেশের কৃষি, শিল্প ও বাণিজ্য, জনসংখ্যা ও মানবসম্পদ, মুদ্রাস্ফীতি, রাজস্ব নীতি ও অর্থনৈতিক পরিকল্পনা।",
        "code": "110",
        "group": "humanities",
        "paper": "২য় পত্র"
    },
    {
        "id": "accounting_1st",
        "name": "হিসাববিজ্ঞান ১ম পত্র",
        "banglaName": "হিসাববিজ্ঞান ১ম পত্র",
        "classId": "hsc",
        "iconName": "Briefcase",
        "badgeColor": "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        "description": "হিসাববিজ্ঞানের পরিচিতি, হিসাবের বইসমূহ, ব্যাংক সমন্বয় বিবরণী, রেওয়ামিল, কার্যপত্র, অবচয় এবং একতরফা দাখিলা।",
        "code": "253",
        "group": "business_studies",
        "paper": "১ম পত্র"
    },
    {
        "id": "accounting_2nd",
        "name": "হিসাববিজ্ঞান ২য় পত্র",
        "banglaName": "হিসাববিজ্ঞান ২য় পত্র",
        "classId": "hsc",
        "iconName": "Briefcase",
        "badgeColor": "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        "description": "অংশীদারি ব্যবসায়ের হিসাব, যৌথ মূলধনী কোম্পানির মূলধন, আর্থিক বিবরণী বিশ্লেষণ, উৎপাদন ব্যয় ও ব্যবস্থাপনা হিসাববিজ্ঞান।",
        "code": "254",
        "group": "business_studies",
        "paper": "২য় পত্র"
    },
    {
        "id": "finance_1st",
        "name": "ফিন্যান্স ১ম পত্র",
        "banglaName": "অর্থায়ন নীতিমালা ও অর্থের সময়মূল্য",
        "classId": "hsc",
        "iconName": "Award",
        "badgeColor": "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
        "description": "অর্থায়নের পরিচিতি, আর্থিক বাজার, অর্থের সময়মূল্য, ঝুঁকি ও মুনাফা, মূলধন বাজেটিং ও মূলধন ব্যয়।",
        "code": "292",
        "group": "business_studies",
        "paper": "১ম পত্র"
    },
    {
        "id": "finance_2nd",
        "name": "ফিন্যান্স ২য় পত্র",
        "banglaName": "ব্যাংকিং ও বিমা তত্ত্ব",
        "classId": "hsc",
        "iconName": "Award",
        "badgeColor": "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
        "description": "ব্যাংক ব্যবস্থার প্রাথমিক ধারণা, কেন্দ্রীয় ব্যাংক, বাণিজ্যিক ব্যাংক, হস্তান্তরযোগ্য দলিল, বিমা চুক্তি ও জীবন বিমা।",
        "code": "293",
        "group": "business_studies",
        "paper": "২য় পত্র"
    },
    {
        "id": "business_org_1st",
        "name": "ব্যবসায় সংগঠন ১ম পত্র",
        "banglaName": "ব্যবসায় সংগঠন ও প্রতিষ্ঠান",
        "classId": "hsc",
        "iconName": "Briefcase",
        "badgeColor": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        "description": "ব্যবসায়ের মৌলিক ধারণা, ব্যবসায় পরিবেশ, একমালিকানা, অংশীদারি, যৌথ মূলধনী কোম্পানি ও সমবায় সমিতি।",
        "code": "277",
        "group": "business_studies",
        "paper": "১ম পত্র"
    },
    {
        "id": "business_org_2nd",
        "name": "ব্যবসায় সংগঠন ২য় পত্র",
        "banglaName": "ব্যবস্থাপনার নীতি ও প্রয়োগ",
        "classId": "hsc",
        "iconName": "Briefcase",
        "badgeColor": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        "description": "ব্যবস্থাপনার ধারণা ও নীতি, পরিকল্পনা, সংগঠন, কর্মীসংস্থান, নেতৃত্ব ও প্রেষণা, যোগাযোগ এবং নিয়ন্ত্রণ।",
        "code": "278",
        "group": "business_studies",
        "paper": "২য় পত্র"
    }
]

# Write SSC_SUBJECTS.ts and HSC_SUBJECTS.ts
with open('src/data/curriculum/sscSubjects.ts', 'w', encoding='utf-8') as f:
    f.write('import { SubjectInfo } from "../../types";\n\n')
    f.write('export const SSC_SUBJECTS: SubjectInfo[] = ')
    f.write(json.dumps(SSC_SUBJECTS, ensure_ascii=False, indent=2))
    f.write(';\n')

with open('src/data/curriculum/hscSubjects.ts', 'w', encoding='utf-8') as f:
    f.write('import { SubjectInfo } from "../../types";\n\n')
    f.write('export const HSC_SUBJECTS: SubjectInfo[] = ')
    f.write(json.dumps(HSC_SUBJECTS, ensure_ascii=False, indent=2))
    f.write(';\n')

print("Wrote sscSubjects.ts and hscSubjects.ts")
