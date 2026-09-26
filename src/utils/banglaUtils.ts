/**
 * Utility functions for Bengali language formatting and numbers
 */

export const toBengaliDigits = (num: number | string): string => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bn[parseInt(d, 10)]);
};

/**
 * Detects whether a string is a raw HTML document or contains unwanted HTML structure tags
 * (such as <!DOCTYPE, <html, <head, <meta, <title, <body, og:title, etc.)
 * Used to ensure raw HTML code is never displayed as text to the user.
 */
export const isRawHtmlDocument = (text: unknown): boolean => {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return (
    lower.includes('<!doctype') ||
    lower.includes('<html') ||
    lower.includes('<head') ||
    lower.includes('<meta') ||
    lower.includes('og:title') ||
    lower.includes('og:description') ||
    lower.includes('twitter:card') ||
    (lower.includes('<title') && lower.includes('</title>')) ||
    (lower.includes('<body') && lower.includes('</body>'))
  );
};

/**
 * Strips all automated greetings, welcome intros, and forbidden phrases
 * ensuring AI Teacher answers start directly and educationally.
 */
export const sanitizeAiDirectAnswer = (rawText: string): string => {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText.trim();

  // Remove any raw HTML if accidentally present
  if (isRawHtmlDocument(text)) return '';

  // Patterns to strip from start of response
  const forbiddenPrefixPatterns = [
    /^[\s*#_~-]*আসসালামু\s*আলাইকুম[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*আপনাকে\s*(এই\s*)?(ওয়েবসাইটে|ওয়েবসাইটে|আমাদের\s*প্ল্যাটফর্মে|বাংলা\s*শিক্ষাগরে)?\s*স্বাগতম[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*বাংলা\s*শিক্ষাগরে\s*(আপনাকে\s*)?স্বাগতম[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*স্বাগতম[!,।\s\n]*/iu,
    /^[\s*#_~-]*আমি\s*আপনার\s*(AI|এআই)?\s*(শিক্ষক|সহায়ক|সহায়ক)[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*কীভাবে\s*(আপনাকে\s*)?সাহায্য\s*করতে\s*পারি\??[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*আমি\s*(Mostakim|মস্তাকিম)[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*Controller\s*—?\s*Mostakim[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*কন্ট্রোলার\s*—?\s*মস্তাকিম[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*হ্যালো[^\n।!?]*[।!?\n]*/iu,
    /^[\s*#_~-]*নমস্কার[^\n।!?]*[।!?\n]*/iu,
  ];

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 5) {
    changed = false;
    iterations++;
    for (const pattern of forbiddenPrefixPatterns) {
      if (pattern.test(text)) {
        text = text.replace(pattern, '').trim();
        changed = true;
      }
    }
  }

  // Remove specific restricted phrases throughout text
  text = text.replace(/আমি\s*Mostakim-?এর\s*তৈরি\s*(AI|এআই)/gi, '');
  text = text.replace(/Controller\s*—?\s*Mostakim/gi, '');
  text = text.replace(/কন্ট্রোলার\s*—?\s*মস্তাকিম/gi, '');

  return text.trim();
};

/**
 * Prepares Bengali text for speech synthesis by removing Markdown, LaTeX, and symbols
 */
export const cleanTextForSpeech = (rawText: string): string => {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = sanitizeAiDirectAnswer(rawText);

  // Remove markdown headers, links, images, bold/italics
  text = text
    .replace(/^#+\s+/gm, '') // # Header
    .replace(/!\[.*?\]\(.*?\)/g, '') // Images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/[*_~`]/g, '') // formatting
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 এর $2 ভাগ') // LaTeX fractions
    .replace(/\$\$?[^$]+\$\$?/g, '') // LaTeX blocks
    .replace(/[-*•]\s+/g, '। ') // list bullets into pauses
    .replace(/\s+/g, ' ')
    .trim();

  return text;
};

