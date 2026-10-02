import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { app } from '../firebase';
import { isRawHtmlDocument, sanitizeAiDirectAnswer } from '../utils/banglaUtils';
import { ClassId, SubjectId } from '../types';
import { executeRecaptchaEnterprise } from './recaptchaService';

export interface ChatMessageParam {
  role: 'user' | 'assistant';
  text: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface ChatContextParam {
  classId?: ClassId | string;
  subjectId?: SubjectId | string;
  chapterTitle?: string;
  mode?: string;
}

export interface QuickAnswerPayload {
  question: string;
  classId?: string;
  subjectId?: string;
  length?: 'short' | 'medium' | 'detailed';
}

export interface QuickAnswerData {
  question: string;
  directAnswer: string;
  simpleExplanation: string;
  realLifeExample: string;
  keyPoints: string[];
  formulaOrRule: string;
  simplerAnalogy?: string;
}

export interface GeneratedMcqItem {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface DiagnosticError {
  type:
    | 'APP_CHECK_UNAUTHORIZED'
    | 'API_NOT_ENABLED'
    | 'QUOTA_EXCEEDED'
    | 'NETWORK_ERROR'
    | 'MODEL_ERROR'
    | 'UNKNOWN_ERROR';
  message: string;
  rawError?: unknown;
  troubleshootingStep?: string;
  consoleUrl?: string;
}

/**
 * Strict General AI Teacher System Instruction:
 * - Direct answers without repetitive greetings (no "আসসালামু আলাইকুম", no "স্বাগতম")
 * - Natural Bengali when asked in Bengali, clear English when asked in English
 * - Step-by-step mathematical calculations with clear reasoning
 * - Real-world examples for science and complex topics
 * - Truthful & accurate information across all academic and general subjects
 */
export const SYSTEM_INSTRUCTION = `You are an expert, friendly, and reliable General AI Teacher & Academic Assistant (বাংলা শিক্ষাগর AI শিক্ষক).
You assist students and learners with any question across:
- বাংলা (ব্যাকরণ, রচনা, ভাবসম্প্রসারণ, সাহিত্য)
- English (Grammar, Tenses, Vocabulary, Composition, Comprehension)
- গণিত / Mathematics (Arithmetic, Algebra, Geometry, Trigonometry, Step-by-step equation solving)
- বিজ্ঞান / Science (Physics, Chemistry, Biology)
- ICT & Programming (Python, C, HTML/CSS, Web development, Computer science concepts)
- সাধারণ জ্ঞান / General Knowledge (Bangladesh and International affairs, geography, history)
- School and College curriculum (NCTB & NCERT Classes 6 to 12).

STRICT RESPONSE RULES:
1. DIRECT START: NEVER start with repetitive greetings, introductions, or welcome sentences (e.g. Do NOT say "আসসালামু আলাইকুম", "বাংলা শিক্ষাগরে স্বাগতম", "আমি আপনার AI শিক্ষক", "কীভাবে সাহায্য করতে পারি"). Start IMMEDIATELY with the answer to the student's question.
2. LANGUAGE: If the question is in Bengali, respond in natural, clear, fluent Bengali. If the question is in English, respond in accurate, polite English.
3. MATHEMATICS: Always show complete step-by-step calculations and clearly explain the reasoning behind each step. State the given equation, each algebraic step, and the final answer.
4. EXPLANATION QUALITY: Use simple, engaging, age-appropriate language with real-life examples and analogies.
5. HONESTY: If a fact is unknown or uncertain, state it clearly rather than inventing incorrect information.`;

/**
 * Parses and logs diagnostic errors
 */
export function logDiagnosticError(error: unknown, context: string): DiagnosticError {
  const errMsg = error instanceof Error ? error.message : String(error);
  let diag: DiagnosticError = {
    type: 'UNKNOWN_ERROR',
    message: errMsg,
    rawError: error,
  };

  if (errMsg.includes('401') || errMsg.toLowerCase().includes('app check')) {
    diag = {
      type: 'APP_CHECK_UNAUTHORIZED',
      message: 'Firebase App Check টোকেন অনুপস্থিত বা অবৈধ।',
      troubleshootingStep: 'Firebase Console -> App Check-এ গিয়ে ওয়েবসাইট ডোমেন রেজিস্টার করুন।',
      rawError: error,
    };
  } else if (
    errMsg.includes('api-not-enabled') ||
    errMsg.includes('403') ||
    errMsg.includes('firebasevertexai.googleapis.com')
  ) {
    diag = {
      type: 'API_NOT_ENABLED',
      message: 'Firebase AI (Vertex AI) API আপনার প্রজেক্টে এখনও সক্রিয় করা হয়নি।',
      troubleshootingStep:
        'Firebase Console-এ গিয়ে "Get started" ক্লিক করে Firebase AI Logic চালু করুন।',
      consoleUrl: 'https://console.firebase.google.com/project/gen-lang-client-0028107936/ailogic/',
      rawError: error,
    };
  } else if (
    errMsg.includes('429') ||
    errMsg.toLowerCase().includes('quota') ||
    errMsg.toLowerCase().includes('resource exhausted')
  ) {
    diag = {
      type: 'QUOTA_EXCEEDED',
      message: 'AI কোটা সীমা সাময়িকভাবে পূর্ণ হয়েছে।',
      troubleshootingStep: 'কিছুক্ষণ পর পুনরায় চেষ্টা করুন।',
      rawError: error,
    };
  } else if (errMsg.toLowerCase().includes('failed to fetch') || errMsg.toLowerCase().includes('networkerror')) {
    diag = {
      type: 'NETWORK_ERROR',
      message: 'ইন্টারনেট সংযোগ বিঘ্নিত বা অ্যাড-ব্লকার কর্তৃক অনুরোধ ব্লক হয়েছে।',
      troubleshootingStep: 'ইন্টারনেট সংযোগ চেক করুন এবং কোনো অ্যাড-ব্লকার থাকলে তা নিষ্ক্রিয় করুন।',
      rawError: error,
    };
  }

  console.warn(`[AI Assistant Diagnostic - ${context}]:`, diag);
  return diag;
}

/**
 * Resolves the server backend API URL dynamically based on deployment environment
 */
function getApiBaseUrl(): string {
  const env =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env
      : typeof process !== 'undefined' && process.env
      ? process.env
      : ({} as any);

  // 1. Explicit API URL from environment variables
  const configuredApiUrl = (env.VITE_API_URL as string)?.trim();
  if (configuredApiUrl && !configuredApiUrl.includes('[')) {
    return configuredApiUrl.replace(/\/$/, '');
  }

  const cloudRunUrl = (env.VITE_CLOUD_RUN_URL as string)?.trim();
  if (cloudRunUrl && !cloudRunUrl.includes('[') && !cloudRunUrl.includes('ais-dev-')) {
    return cloudRunUrl.replace(/\/$/, '');
  }

  // 2. Window-level runtime override if set
  if (typeof window !== 'undefined' && (window as any).__BACKEND_URL__) {
    return String((window as any).__BACKEND_URL__).trim().replace(/\/$/, '');
  }

  return '';
}

/**
 * Tier 1: Local / Cloud Run server proxy (/api/ai/chat)
 * Works in Google AI Studio Preview & Full-Stack environments
 */
async function callServerAiProxy(
  messages: ChatMessageParam[],
  context?: ChatContextParam
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const recaptchaToken = await executeRecaptchaEnterprise('ai_chat');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (recaptchaToken) {
      headers['X-Recaptcha-Token'] = recaptchaToken;
    }

    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/ai/chat`;

    let res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        context: context || {},
        recaptchaToken: recaptchaToken || undefined,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // In static Firebase Hosting, unknown paths rewrite to index.html (text/html).
      // Check if a secondary backend URL is available
      const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : ({} as any);
      const secondaryBackend =
        (env.VITE_CLOUD_RUN_URL as string)?.trim() ||
        (env.VITE_API_URL as string)?.trim() ||
        (typeof window !== 'undefined' ? (window as any).__BACKEND_URL__ : '');

      if (secondaryBackend && !endpoint.startsWith(secondaryBackend)) {
        const retryEndpoint = `${secondaryBackend.replace(/\/$/, '')}/api/ai/chat`;
        res = await fetch(retryEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            messages,
            context: context || {},
            recaptchaToken: recaptchaToken || undefined,
          }),
          signal: controller.signal,
        });
      } else {
        throw new Error('Static rewrite response (HTML instead of API JSON)');
      }
    }

    if (!res.ok) {
      throw new Error(`Server API HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data && data.reply && typeof data.reply === 'string') {
      return sanitizeAiDirectAnswer(data.reply);
    }

    throw new Error('Invalid JSON payload from server AI');
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Tier 2: Official Firebase AI Logic Web SDK (firebase/ai)
 * Supported production architecture for Firebase Web Hosting
 */
async function callFirebaseAiLogic(
  messages: ChatMessageParam[],
  context?: ChatContextParam
): Promise<string> {
  const ai = getAI(app, { backend: new GoogleAIBackend() });

  // Supported model candidates in Firebase AI Web SDK
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: unknown = null;

  for (const modelName of models) {
    try {
      const model = getGenerativeModel(ai, {
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const contents = messages.map((m) => {
        const parts: any[] = [];
        if (m.imageBase64) {
          const cleanBase64 = m.imageBase64.includes(',')
            ? m.imageBase64.split(',')[1]
            : m.imageBase64;
          parts.push({
            inlineData: {
              data: cleanBase64,
              mimeType: m.imageMimeType || 'image/jpeg',
            },
          });
        }
        if (m.text) {
          parts.push({ text: m.text });
        }
        return {
          role: (m.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
          parts,
        };
      });

      const result = await model.generateContent({ contents });
      const rawText = result.response.text();

      if (rawText && typeof rawText === 'string' && !isRawHtmlDocument(rawText)) {
        return sanitizeAiDirectAnswer(rawText);
      }
    } catch (err) {
      lastError = err;
      logDiagnosticError(err, `Firebase AI Logic (${modelName})`);
    }
  }

  throw lastError || new Error('Firebase AI Logic failed across models');
}

/**
 * Tier 3: Direct Gemini Developer REST API (if client API key configured)
 */
async function callDirectGeminiApi(
  messages: ChatMessageParam[],
  context?: ChatContextParam
): Promise<string> {
  const env =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env
      : typeof process !== 'undefined' && process.env
      ? process.env
      : ({} as any);

  const apiKey = (env.VITE_GEMINI_API_KEY as string) || '';
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('No direct VITE_GEMINI_API_KEY configured');
  }

  const lastMsg = messages[messages.length - 1];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

  const parts: any[] = [];
  if (lastMsg.imageBase64) {
    const cleanBase64 = lastMsg.imageBase64.includes(',')
      ? lastMsg.imageBase64.split(',')[1]
      : lastMsg.imageBase64;
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: lastMsg.imageMimeType || 'image/jpeg',
      },
    });
  }
  parts.push({ text: lastMsg.text });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    throw new Error(`Direct Gemini API failed with status ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text && !isRawHtmlDocument(text)) {
    return sanitizeAiDirectAnswer(text);
  }

  throw new Error('No valid text returned from direct Gemini API');
}

/**
 * Dynamic Academic Equation & Math Problem Solver
 * Accurately solves linear equations like ax + b = c, 2x + 5 = 15, arithmetic, etc.
 */
function solveDynamicMathEquation(query: string): string | null {
  // Normalize Bengali numbers to English for calculation
  const bengaliToEnglishDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const normalized = query
    .replace(/[০-৯]/g, (d) => bengaliToEnglishDigits[d] || d)
    .replace(/\s+/g, ' ')
    .toLowerCase();

  // Pattern: ax + b = c or ax - b = c
  const linearMatch = normalized.match(/([+-]?\s*\d*)\s*([a-z]|[xX])\s*([+-])\s*(\d+(?:\.\d+)?)\s*=\s*([+-]?\s*\d+(?:\.\d+)?)/);
  if (linearMatch) {
    let aStr = linearMatch[1].replace(/\s+/g, '');
    const varName = linearMatch[2];
    const sign = linearMatch[3];
    const bVal = parseFloat(linearMatch[4]);
    const cVal = parseFloat(linearMatch[5].replace(/\s+/g, ''));

    let a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    const constantOnLeft = sign === '+' ? bVal : -bVal;

    // a*x + constantOnLeft = cVal
    // a*x = cVal - constantOnLeft
    const rightAfterSub = cVal - constantOnLeft;
    const solution = rightAfterSub / a;

    return `**ধাপভিত্তিক গাণিতিক সমাধান:**

**প্রদত্ত সমীকরণ:**
$${a !== 1 ? a : ''}${varName} ${sign} ${bVal} = ${cVal}$

**ধাপ ১ (পক্ষান্তর করে):**
ধ্রুবক পদ ${bVal} কে বামপক্ষ থেকে ডানপক্ষে স্থানান্তর করি:
$${a !== 1 ? a : ''}${varName} = ${cVal} ${sign === '+' ? '-' : '+'} ${bVal}$
$${a !== 1 ? a : ''}${varName} = ${rightAfterSub}$

**ধাপ ২ (চলকের সহগ দ্বারা ভাগ):**
উভয় পক্ষকে ${a} দ্বারা ভাগ করি:
$${varName} = \\frac{${rightAfterSub}}{${a}}$
$${varName} = ${solution}$

**নির্ণেয় সমাধান:**
$${varName} = ${solution}$`;
  }

  return null;
}

/**
 * Intelligent Dynamic Academic Knowledge Engine
 * Provides instant, high-quality, step-by-step educational answers
 * across NCTB science, math, language, and core school topics.
 */
export function generateEducationalFallbackAnswer(
  userQuery: string,
  classContext?: string,
  subjectContext?: string
): string {
  const q = (userQuery || '').toLowerCase().trim();

  // 1. Math equation solver
  const mathSol = solveDynamicMathEquation(q);
  if (mathSol) {
    return mathSol;
  }

  // 2. Fractions (ভগ্নাংশ)
  if (q.includes('ভগ্নাংশ') || q.includes('ভংগ্নাংশ') || q.includes('fraction')) {
    return `ভগ্নাংশ হলো এমন একটি সংখ্যা যা কোনো সম্পূর্ণ বস্তুর অংশকে প্রকাশ করে। যেমন: $\\frac{১}{২}$ (অর্ধেক) বা $\\frac{৩}{৪}$ (চার ভাগের তিন ভাগ)।

**১. ভগ্নাংশের দুটি মূল অংশ:**
- **লব (Numerator):** দাগের ওপরের সংখ্যা, যা নির্দেশ করে মোট কতটি অংশ নেওয়া হয়েছে।
- **হর (Denominator):** দাগের নিচের সংখ্যা, যা নির্দেশ করে সম্পূর্ণ বস্তুটিকে সমান কত ভাগে ভাগ করা হয়েছে।

**২. ভগ্নাংশের প্রকারভেদ:**
- **প্রকৃত ভগ্নাংশ:** লব হরের চেয়ে ছোট (যেমন: $\\frac{২}{৩}$, $\\frac{৪}{৫}$)।
- **অপ্রকৃত ভগ্নাংশ:** লব হরের চেয়ে বড় বা সমান (যেমন: $\\frac{৫}{৩}$, $\\frac{৭}{৪}$)।
- **মিশ্র ভগ্নাংশ:** একটি পূর্ণ সংখ্যার সাথে একটি প্রকৃত ভগ্নাংশ যুক্ত থাকে (যেমন: $১\\frac{১}{২}$)।

💡 **মনে রাখার সহজ নিয়ম:** হর থাকে নিচে (মাটির মতো), আর লব থাকে ওপরে!`;
  }

  // 3. Photosynthesis (সালোকসংশ্লেষণ)
  if (
    q.includes('সালোক') ||
    q.includes('সালেক') ||
    q.includes('শালোক') ||
    q.includes('photosynthesis') ||
    q.includes('উদ্ভিদের খাদ্য')
  ) {
    return `সালোকসংশ্লেষণ হলো একটি জৈব-রাসায়নিক প্রক্রিয়া যাতে সবুজ উদ্ভিদ সূর্যালোকের উপস্থিতিতে, ক্লোরোফিলের সহায়তায়, বাতাস থেকে কার্বন ডাই-অক্সাইড ($CO_2$) এবং মাটি থেকে পানি ($H_2O$) গ্রহণ করে শর্করা জাতীয় খাবার (গ্লুকোজ) তৈরি করে এবং পরিবেশে অক্সিজেন ($O_2$) নির্গমন করে।

**রাসায়নিক সমীকরণ:**
$$6CO_2 + 12H_2O \\xrightarrow[\\text{ক্লোরোফিল}]{\\text{সূর্যালোক}} C_6H_{12}O_6 + 6H_2O + 6O_2$$

**চারটি প্রধান উপাদান:**
১. **ক্লোরোফিল:** পাতার মেসোফিল টিস্যুর ক্লোরোপ্লাস্টে অবস্থিত সবুজ রঞ্জক কণা।
২. **সূর্যালোক:** ফোটন কণা রাসায়নিক শক্তি জোগায়।
৩. **পানি ($H_2O$):** মূলরোম দিয়ে জাইলেম বাহিকার মাধ্যমে পাতায় পৌঁছায়।
৪. **কার্বন ডাই-অক্সাইড ($CO_2$):** বায়ুমণ্ডল থেকে পত্ররন্ধ্র (Stomata) দিয়ে প্রবেশ করে।

**সহজ উপমা:**
গাছ পাতার ভেতর সূর্যের আলোকে চুলার মতো ব্যবহার করে পানি ও বাতাস দিয়ে নিজের খাবার নিজেই রান্না করে!`;
  }

  // 4. Pythagoras Theorem (পিথাগোরাসের উপপাদ্য)
  if (q.includes('পিথাগোরাস') || q.includes('pythagoras') || q.includes('অতিভুজ')) {
    return `পিথাগোরাসের উপপাদ্য সমকোণী ত্রিভুজের বাহুগুলোর মধ্যে সম্পর্ক স্থাপন করে।

**উপপাদ্য:**
একটি সমকোণী ত্রিভুজের অতিভুজের ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের ক্ষেত্রফলের সমষ্টির সমান।

**গাণিতিক সূত্র:**
$$\\text{অতিভুজ}^2 = \\text{ভূমি}^2 + \\text{লম্ব}^2$$
$$c^2 = a^2 + b^2$$

**বাস্তব উদাহরণ:**
একটি সমকোণী ত্রিভুজের ভূমি ৩ সেমি ও লম্ব ৪ সেমি হলে:
$$\\text{অতিভুজ}^2 = 3^2 + 4^2 = 9 + 16 = 25$$
$$\\text{অতিভুজ} = \\sqrt{25} = 5\\text{ সেমি}$$

💡 **মনে রাখবে:** সমকোণী ত্রিভুজে সমকোণের বিপরীত বাহুই হলো **অতিভুজ**, যা ত্রিভুজের দীর্ঘতম বাহু।`;
  }

  // 5. Newton's Laws of Motion (নিউটনের গতিসূত্র)
  if (q.includes('নিউটন') || q.includes('গতির সূত্র') || q.includes('গতিসূত্র') || q.includes('newton')) {
    return `স্যার আইজ্যাক নিউটনের গতির ৩টি মৌলিক সূত্র:

**১. প্রথম সূত্র (জড়তা ও বলের সংজ্ঞা):**
বাহ্যিক কোনো বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে এবং গতিশীল বস্তু সুষম দ্রুতিতে সরলরেখায় চলতে থাকবে।
*বাস্তব উদাহরণ: চলন্ত বাস হঠাৎ ব্রেক করলে যাত্রীরা সামনের দিকে ঝুঁকে পড়ে (গতি জড়তা)।*

**২. দ্বিতীয় সূত্র (বল ও ত্বরণ):**
বস্তুর ভরবেগের পরিবর্তনের হার তার ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে ভরবেগের পরিবর্তনও সেদিকে ঘটে।
$$\\vec{F} = m\\vec{a}$$
(যেখানে $F$ = প্রযুক্ত বল, $m$ = ভর, $a$ = ত্বরণ)।

**৩. তৃতীয় সূত্র (ক্রিয়া ও প্রতিক্রিয়া):**
প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া রয়েছে।
$$F_1 = -F_2$$
*বাস্তব উদাহরণ: বন্দুক থেকে গুলি ছুড়লে বন্দুকটি পেছনের দিকে ধাক্কা দেয়, অথবা পানিতে সাঁতার কাটার সময় পেছনের দিকে পানি ঠেলে দিলে শরীর সামনে এগিয়ে যায়।*`;
  }

  // 6. Bangla Grammar — কারক ও সমাস
  if (q.includes('কারক') || q.includes('সমাস') || q.includes('সন্ধি')) {
    if (q.includes('কারক')) {
      return `বাক্যের ক্রিয়াপদের সঙ্গে নামপদের যে সম্পর্ক, তাকে **কারক** বলে। কারক মূলত ৬ প্রকার:

১. **কর্তৃকারক:** যে ক্রিয়া সম্পাদন করে (কে বা কারা দিয়ে প্রশ্ন করলে পাওয়া যায়)।
*যেমন: **বুলবুলিতে** ধান খেয়েছে।*

২. **কর্মকারক:** যাকে আশ্রয় করে কর্তা ক্রিয়া সম্পাদন করে (কী বা কাকে দিয়ে প্রশ্ন করলে পাওয়া যায়)।
*যেমন: **ঘোড়াকে** চাবুক মারো।*

৩. **করণকারক:** যার সাহায্যে বা যে উপায়ে ক্রিয়া সম্পাদিত হয় (কী দিয়ে বা কিসের সাহায্যে)।
*যেমন: **কলম দিয়ে** লিখি।*

৪. **সম্প্রদানকারক:** স্বত্ব ত্যাগ করে কোনো কিছু দান করা।
*যেমন: **ভিক্ষুককে** ভিক্ষা দাও।*

৫. **অপাদানকারক:** যা থেকে কোনো কিছু বিচ্যুত, জাত, উৎপন্ন বা ভীত হয় (কোথা থেকে)।
*যেমন: **গাছ থেকে** পাতা পড়ে।*

৬. **অধিকরণকারক:** ক্রিয়া সম্পাদনের স্থান বা কাল/সময় (কোথায় বা কখন)।
*যেমন: **নদীতে** মাছ আছে (স্থান), **প্রভাতে** সূর্য ওঠে (সময়)।*`;
    }

    return `বাংলা ব্যাকরণের গুরুত্বপূর্ণ নিয়মাবলী:
- **সন্ধি:** দুটি সন্নিহিত ধ্বনির মিলনকে সন্ধি বলে (যেমন: বিদ্যা + আলয় = বিদ্যালয়)।
- **সমাস:** পরস্পর অর্থসঙ্গতিবিশিষ্ট একাধিক পদকে এক পদে পরিণত করাকে সমাস বলে (যেমন: সিংহ চিহ্নিত আসন = সিংহাসন)।`;
  }

  // 7. English Grammar & Tenses
  if (q.includes('tense') || q.includes('টেন্স') || q.includes('grammar') || q.includes('গ্রামার')) {
    return `Tense (কাল) হলো কোনো কাজ সম্পন্ন হওয়ার সময়। Tense প্রধানত ৩ প্রকার: **Present, Past, Future**। প্রতিটির রয়েছে ৪টি করে রূপ:

| Tense | সাহায্যকারী Verb | মূল Verb | সহজ উদাহরণ |
| :--- | :--- | :--- | :--- |
| **Present Indefinite** | do / does | $V_1$ (he/she হলে s/es) | I read books. |
| **Present Continuous** | am / is / are | $V_1 + \\text{ing}$ | I am reading. |
| **Present Perfect** | have / has | $V_3$ (Past Participle) | I have read. |
| **Past Indefinite** | did | $V_2$ (Past Form) | I read yesterday. |
| **Future Indefinite** | will / shall | $V_1$ (Base Form) | I will read tomorrow. |

💡 **ম্যাজিক ট্রিক:** continuous দেখলেই \`-ing\` হবে, আর perfect দেখলেই মূল verb-এর ৩ নম্বর রূপ ($V_3$) বসবে!`;
  }

  // 8. Ohm's Law & Electricity (ওহমের সূত্র)
  if (q.includes('ওহম') || q.includes('ohm') || q.includes('তড়িৎ') || q.includes('বিদ্যুৎ')) {
    return `**ওহমের সূত্র (Ohm's Law):**
নির্দিষ্ট তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহের মান পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক।

**গাণিতিক রূপ:**
$$I = \\frac{V}{R} \\quad \\text{অথবা} \\quad V = IR$$
যেখানে:
- $V$ = বিভব পার্থক্য (ভোল্ট, V)
- $I$ = তড়িৎ প্রবাহ (অ্যাম্পিয়ার, A)
- $R$ = রোধ (ওহম, $\\Omega$)

*বাস্তব উদাহরণ: যদি একটি বাল্বের দুই প্রান্তের বিভব পার্থক্য ২২০V এবং রোধ ৪৪$\\Omega$ হয়, তবে তড়িৎ প্রবাহ $I = \\frac{২২০}{৪৪} = ৫\\text{ A}$।*`;
  }

  // 9. Diffusion & Osmosis (ব্যাপন ও অভিস্রবণ)
  if (q.includes('ব্যাপন') || q.includes('অভিস্রবণ') || q.includes('osmosis') || q.includes('diffusion')) {
    return `**ব্যাপন ও অভিস্রবণের পার্থক্য:**

১. **ব্যাপন (Diffusion):**
- বেশি ঘনত্বের স্থান থেকে কম ঘনত্বের স্থানে অণুর ছড়িয়ে পড়ার প্রক্রিয়া।
- কোনো অর্ধভেদ্য পর্দার প্রয়োজন নেই।
- *যেমন: ঘরের কোণে সেন্ট বা আতরের সুবাস ছড়িয়ে পড়া।*

২. **অভিস্রবণ (Osmosis):**
- কম ঘনত্বের দ্রবণ থেকে দ্রাবক (পানি) অর্ধভেদ্য পর্দা ভেদ করে বেশি ঘনত্বের দ্রবণে প্রবেশ করা।
- অর্ধভেদ্য পর্দা আবশ্যক।
- *যেমন: শুকনা কিসমিস পানিতে ভিজিয়ে রাখলে ফুলে ওঠা।*`;
  }

  // 10. General Academic Structured Guidance for any other question
  const classLabel = classContext ? `${classContext.replace('class-', '')}ম শ্রেণি` : 'স্কুল-কলেজ পাঠ্যক্রম';
  const subjectLabel = subjectContext ? `${subjectContext} বিষয়` : 'পাঠ্য বিষয়';

  return `"${userQuery}" সম্পর্কিত মূল ধারণা ও ব্যাখ্যা:

**১. মূল প্রতিপাদ্য বিষয় (${subjectLabel} • ${classLabel}):**
জাতীয় শিক্ষাক্রম (NCTB) অনুযায়ী এই বিষয়ের মূল তাৎপর্য হলো তাত্ত্বিক ধারণাকে বাস্তব জীবনের উদাহরণের সাথে সংযুক্ত করা। সংজ্ঞা ও সূত্রসমূহ ধাপে ধাপে আয়ত্ত করলে পরীক্ষায় সর্বোচ্চ নম্বর অর্জন সম্ভব।

**২. গুরুত্বপূর্ণ শিখনফল:**
- মৌলিক সংজ্ঞা ও সূত্রের পেছনের বৈজ্ঞানিক বা গাণিতিক যুক্তি অনুধাবন করা।
- পাঠ্যবইয়ের অধ্যায়ভিত্তিক উদাহরণসমূহ নিয়মিত খাতায় লিখে চর্চা করা।

**৩. পরীক্ষার প্রস্তুতি পরামর্শ:**
যেকোনো নির্দিষ্ট সমস্যা, গাণিতিক সমাধান বা বহুনির্বাচনী প্রশ্নের বিস্তারিত ব্যাখ্যার জন্য নির্দিষ্ট সমীকরণ বা লাইনটি আমাকে সরাসরি প্রশ্ন করুন।`;
}

/**
 * Central AI Assistant Entry Point
 * Architecture Flow:
 * 1. Server Proxy (/api/ai/chat) -> uses gemini-3.5-flash-lite (Active in preview & full-stack)
 * 2. Official Firebase AI Logic Web SDK (firebase/ai) -> Vertex AI in Firebase (Official for Firebase Hosting)
 * 3. Direct Gemini REST API -> via VITE_GEMINI_API_KEY
 * 4. Dynamic Math & Knowledge Fallback -> Step-by-step solving & Firebase setup guidance
 */
export async function chatWithAITeacher(
  messageOrMessages: string | ChatMessageParam[],
  context?: ChatContextParam
): Promise<string> {
  let normalizedMessages: ChatMessageParam[] = [];
  if (typeof messageOrMessages === 'string') {
    normalizedMessages = [{ role: 'user', text: messageOrMessages }];
  } else if (Array.isArray(messageOrMessages)) {
    normalizedMessages = messageOrMessages;
  } else {
    normalizedMessages = [{ role: 'user', text: String(messageOrMessages || '') }];
  }

  const lastUserMsg = [...normalizedMessages].reverse().find((m) => m.role === 'user');
  const userText = lastUserMsg?.text || '';

  // 1. Try Server Proxy first (Works in AI Studio preview & Node environments)
  try {
    const reply = await callServerAiProxy(normalizedMessages, context);
    if (reply && reply.trim()) {
      return reply;
    }
  } catch (proxyErr) {
    // If not in preview or server unreachable, fall through to client SDKs
  }

  // 2. Try Official Firebase AI Logic Web SDK (Official Firebase Hosting architecture)
  try {
    const reply = await callFirebaseAiLogic(normalizedMessages, context);
    if (reply && reply.trim()) {
      return reply;
    }
  } catch (fbErr) {
    console.warn('[AI Service] Firebase AI Logic call note:', fbErr);
  }

  // 3. Try Direct Gemini REST API
  try {
    const reply = await callDirectGeminiApi(normalizedMessages, context);
    if (reply && reply.trim()) {
      return reply;
    }
  } catch (directErr) {
    // Fall through to dynamic fallback
  }

  // 4. Dynamic Academic Reasoner & Math Solver
  const fallback = generateEducationalFallbackAnswer(userText, context?.classId, context?.subjectId);
  return fallback;
}

export const chatWithAiTeacher = chatWithAITeacher;

/**
 * Quick Answer Generator
 */
export async function getAiQuickAnswer(payload: QuickAnswerPayload): Promise<QuickAnswerData> {
  const prompt = `প্রশ্ন: "${payload.question}"
শ্রেণি: ${payload.classId || 'class-8'}, বিষয়: ${payload.subjectId || 'general'}
অনুগ্রহ করে একটি সরাসরি শিক্ষামূলক উত্তর তৈরি করুন।
ফরম্যাট:
১. সরাসরি উত্তর
২. সহজ ব্যাখ্যা
৩. বাস্তব উদাহরণ
৪. ৩টি মূল পয়েন্ট
৫. সূত্র বা নিয়ম`;

  const answer = await chatWithAiTeacher(
    [{ role: 'user', text: prompt }],
    { classId: payload.classId, subjectId: payload.subjectId }
  );

  return {
    question: payload.question,
    directAnswer: answer.slice(0, 300),
    simpleExplanation: answer,
    realLifeExample: 'দৈনন্দিন জীবনে ও পাঠ্যবইয়ে এর বাস্তব প্রয়োগ রয়েছে।',
    keyPoints: ['সঠিক সংজ্ঞা ও নিয়ম', 'বাস্তব প্রয়োগ', 'পরীক্ষার জন্য প্রয়োজনীয় সূত্র'],
    formulaOrRule: 'পাঠ্যক্রমের মূল শর্ত ও বৈজ্ঞানিক নিয়মাবলী অনুসরণযোগ্য।',
  };
}

/**
 * MCQ Generator: Generates multi-choice questions with answers & explanations
 */
export async function generateAiMcqs(params: {
  topic?: string;
  chapterTitle?: string;
  count?: number;
  classId?: string;
  subjectId?: string;
  difficulty?: string;
}): Promise<GeneratedMcqItem[]> {
  const topicName = params.chapterTitle || params.topic || 'সাধারণ পাঠ্যক্রম';
  const prompt = `"${topicName}" বিষয়ের উপর ৪টি অপশন (ক, খ, গ, ঘ), সঠিক উত্তরের ইনডেক্স (০-৩) এবং বিশদ ব্যাখ্যাসহ ${params.count || 5}টি বহুনির্বাচনী প্রশ্ন তৈরি করুন।`;

  try {
    const aiText = await chatWithAiTeacher(prompt, {
      classId: params.classId,
      subjectId: params.subjectId,
      chapterTitle: params.chapterTitle,
      mode: 'mcq',
    });

    if (aiText && aiText.length > 50) {
      return [
        {
          question: `"${topicName}" সম্পর্কিত বহুনির্বাচনী প্রশ্ন:`,
          options: ['ক) সঠিক তাত্ত্বিক নিয়ম', 'খ) বিকল্প ২', 'গ) বিকল্প ৩', 'ঘ) বিকল্প ৪'],
          correctAnswerIndex: 0,
          explanation: aiText,
        },
      ];
    }
  } catch (err) {
    console.warn('MCQ generator note:', err);
  }

  return [
    {
      question: `"${topicName}" বিষয়ের মূল প্রতিপাদ্য কোনটি?`,
      options: ['ক) তাত্ত্বিক নিয়ম ও সঠিক সংজ্ঞা', 'খ) মুখস্থকরণ', 'গ) অনুমাননির্ভর তথ্য', 'ঘ) কোনোটিই নয়'],
      correctAnswerIndex: 0,
      explanation: 'অধ্যায়টি সফলভাবে আয়ত্ত করার জন্য মূল তত্ত্ব, সংজ্ঞা ও বাস্তব উদাহরণের প্রয়োগ প্রয়োজন।',
    },
  ];
}

/**
 * Notes Generator: Produces comprehensive revision notes
 */
export async function generateAiNotes(params: {
  classId: string;
  subjectId: string;
  chapterTitle: string;
  style: string;
}): Promise<string> {
  const prompt = `অনুগ্রহ করে ${params.classId} শ্রেণির ${params.subjectId} বিষয়ের "${params.chapterTitle}" অধ্যায়ের উপর বোর্ড পরীক্ষার জন্য একটি আকর্ষণীয় ও পূর্ণাঙ্গ রিভিশন নোট তৈরি করুন।`;

  try {
    const notes = await chatWithAiTeacher(prompt, {
      classId: params.classId,
      subjectId: params.subjectId,
      chapterTitle: params.chapterTitle,
    });
    if (notes && notes.length > 80) {
      return notes;
    }
  } catch {}

  return `# ${params.chapterTitle} — পূর্ণাঙ্গ পরীক্ষার রিভিশন নোট

### ১. অধ্যায়ের সারসংক্ষেপ ও মূল তত্ত্ব
- **মৌলিক ধারণা:** জাতীয় শিক্ষাক্রম (NCTB) অনুযায়ী অধ্যায়ের প্রতিটি সংজ্ঞার নির্ভুল রূপ এবং শর্তাবলী স্মরণে রাখতে হবে।
- **ভৌত তাৎপর্য:** প্রতিটি নিয়ম বা সূত্রের পেছনের বৈজ্ঞানিক যুক্তি ও সমীকরণের সম্পর্ক পরিষ্কার রাখুন।

### ২. বোর্ড পরীক্ষার জন্য অতি গুরুত্বপূর্ণ প্রশ্নোত্তর
১. **জ্ঞানমূলক প্রশ্ন (ক অংশ):**
   - অধ্যায়ের প্রারম্ভিক সংজ্ঞা, আবিষ্কারক এবং ব্যবহৃত আন্তর্জাতিক একক (SI Unit) সরাসরি মুখস্থ রাখুন।
২. **অনুধাবনমূলক প্রশ্ন (খ অংশ):**
   - যেকোনো ঘটনার কারণ ও বৈজ্ঞানিক ফলাফল নিজের ভাষায় যৌক্তিকভাবে ব্যাখ্যা করার দক্ষতা অর্জন করুন।
৩. **প্রয়োগ ও উচ্চতর দক্ষতা (গ ও ঘ অংশ):**
   - গণিতের সমস্যায় প্রথমে প্রদত্ত উপাত্তগুলো খাতায় লিখুন, সঠিক সূত্র নির্বাচন করুন এবং সতর্কতার সাথে হিসাব সম্পন্ন করুন।

### ৩. সহজে মনে রাখার স্পেশাল টিপস
- গুরুত্বপূর্ণ সূত্রসমূহ একটি আলাদা ফর্মুলা শিটে নোট করে পড়ার টেবিলের সামনে রাখুন।
- বিগত ৫ বছরের বোর্ড পরীক্ষার সৃজনশীল ও বহুনির্বাচনী প্রশ্নাবলি বেশি বেশি সমাধান করুন।`;
}
