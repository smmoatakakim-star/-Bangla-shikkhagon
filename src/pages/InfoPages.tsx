import React, { useState } from 'react';
import {
  BookOpen,
  Shield,
  FileText,
  Mail,
  Phone,
  Send,
  CheckCircle,
  Heart,
  HelpCircle,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { classes, lessons, quizzes, navigate } = useApp();

  return (
    <div id="about-page" className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-8 sm:p-12 rounded-3xl shadow-lg text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto text-emerald-100">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">
          বাংলা শিক্ষাগর — আমাদের গল্প ও লক্ষ্য
        </h1>
        <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          বাংলাদেশের ৬ষ্ঠ, ৭ম ও ৮ম শ্রেণির প্রতিটি শিক্ষার্থীর জন্য মানসম্মত, আধুনিক ও সম্পূর্ণ বিনামূল্যে শিক্ষামূলক সহায়তার নির্ভরযোগ্য ডিজিটাল ঠিকানা।
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          আমাদের মূল উদ্দেশ্য (Mission)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          অনেক সময় কঠিন ও জটিল পাঠ্যবই শিক্ষার্থীদের মনে ভীতির সৃষ্টি করে। "বাংলা শিক্ষাগর" তৈরির মূল লক্ষ্য হলো প্রতিটি বিষয়ের কঠিন অধ্যায়গুলোকে সহজ প্রমিত ভাষায়, বাস্তব জীবনের উদাহরণ ও সংক্ষিপ্ত রিভিশন নোটের মাধ্যমে বোধগম্য করে তোলা। একই সাথে যেন শিক্ষার্থীরা নিজের মতো পরীক্ষা দিয়ে কুইজ অনুশীলন করতে পারে এবং সহপাঠী ও শিক্ষকদের সাথে সুস্থ পরিবেশে পড়াশোনা নিয়ে আলোচনা করতে পারে।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 space-y-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">সহজবোধ্য ব্যাখ্যা</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              জটিল বৈজ্ঞানিক বা গাণিতিক সূত্রগুলোকে স্পষ্ট ও সাবলীল বাংলায় বুঝিয়ে দেওয়া হয়েছে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 space-y-2">
            <Award className="w-6 h-6 text-purple-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">লাইভ কুইজ যাচাই</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              তাৎক্ষণিক উত্তর, সমাধান বিশ্লেষণ ও নম্বর দেখার সুবিধা সম্বলিত আধুনিক কুইজ।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 space-y-2">
            <Users className="w-6 h-6 text-sky-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">শিক্ষার্থী কমিউনিটি</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              নিজের প্রশ্ন জিজ্ঞাসা, গুরুত্বপূর্ণ নোট শেয়ার এবং সহপাঠীদের মতামত নেওয়ার প্ল্যাটফর্ম।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div id="privacy-page" className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>সুরক্ষা নীতি</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          গোপনীয়তা নীতি (Privacy Policy)
        </h1>
        <p className="text-xs text-slate-500 mt-1">সর্বশেষ হালনাগাদ: জানুয়ারি ২০২৬</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ১. শিক্ষার্থীদের তথ্যের গোপনীয়তা ও সুরক্ষা
          </h3>
          <p>
            বাংলা শিক্ষাগর অপ্রাপ্তবয়স্ক শিক্ষার্থী ও তাদের পরিবারের তথ্যের সর্বোচ্চ নিরাপত্তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ। আমরা কোনো অপ্রয়োজনীয় ব্যক্তিগত তথ্য সংগ্রহ করি না এবং কোনো তথ্য বাণিজ্যিক উদ্দেশ্যে কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ২. কী কী তথ্য সংরক্ষণ করা হয়
          </h3>
          <p>
            রেজিস্ট্রেশনের সময় প্রদত্ত শিক্ষার্থীর নাম, ইমেইল, বিদ্যালয়ের নাম এবং কুইজে অংশ নেওয়ার স্কোরবোর্ড তথ্য প্ল্যাটফর্মের অ্যাকাউন্টে সংরক্ষিত থাকে যাতে পরবর্তীতে অগ্রগতি দেখতে সুবিধা হয়।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ৩. ব্রাউজার ও লোকাল মেমোরি
          </h3>
          <p>
            শিক্ষার্থীর ডার্ক মোড পছন্দ, সেভ করা পোস্ট এবং সাম্প্রতিক কুইজ দ্রুত লোড করার জন্য নিরাপদ লোকাল ব্রাউজার স্টোরেজ ব্যবহার করা হয়।
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div id="terms-page" className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>ব্যবহারের নীতিমালা</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          ব্যবহারের শর্তাবলী (Terms & Conditions)
        </h1>
        <p className="text-xs text-slate-500 mt-1">সর্বশেষ হালনাগাদ: জানুয়ারি ২০২৬</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ১. শিক্ষামূলক পরিবেশ বজায় রাখা
          </h3>
          <p>
            বাংলা শিক্ষাগর কেবল শিক্ষা সংক্রান্ত আলোচনার জন্য উন্মুক্ত। কোনো প্রকার রাজনৈতিক, আপত্তিকর, বিদ্বেষমূলক বা পড়ালেখা বহির্ভূত বক্তব্য পোস্ট বা কমেন্টে প্রকাশ করা সম্পূর্ণ নিষিদ্ধ।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ২. কনটেন্টের কপিরাইট ও উন্মুক্ত ব্যবহার
          </h3>
          <p>
            এখানে প্রকাশিত সকল পাঠ ও নোট শিক্ষার্থীদের ব্যক্তিগত পড়ার জন্য ফ্রি। তবে বাণিজ্যিক উদ্দেশ্যে কোনো উপাদান বিক্রি করা আইনত নিষিদ্ধ।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ৩. মডারেশন ও একাউন্ট বাতিলকরণ
          </h3>
          <p>
            শর্তাবলী ভঙ্গ করলে অ্যাডমিন যেকোনো অনুপযুক্ত পোস্ট অবিলম্বে মুছে ফেলতে এবং সংশ্লিষ্ট অ্যাকাউন্ট সাময়িকভাবে বা স্থায়ীভাবে স্থগিত করতে পারেন।
          </p>
        </section>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { settings } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          যোগাযোগ ও ফিডব্যাক (Contact Us)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          পড়াশোনা সংক্রান্ত যে কোনো পরামর্শ বা জিজ্ঞাসা থাকলে আমাদের মেসেজ পাঠান।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Mail className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">ইমেইল করুন</h4>
            <p className="text-xs text-slate-500">{settings.contactEmail}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">সহায়তা সময়</h4>
            <p className="text-xs text-slate-500">শনিবার — বৃহস্পতিবার (সকাল ৯টা হতে রাত ৮টা)</p>
          </div>
        </div>

        <div className="md:col-span-2">
          {submitted ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                ধন্যবাদ! আপনার বার্তাটি আমরা পেয়েছি।
              </h3>
              <p className="text-xs text-slate-500">
                আমাদের শিক্ষকমণ্ডলী শীঘ্রই আপনার ইমেইলে উত্তর প্রদান করবেন।
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                আরেকটি বার্তা পাঠান
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  আপনার নাম:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ইমেইল:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বার্তা বা মতামত:
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার পরামর্শ বা সমস্যা জানান..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
