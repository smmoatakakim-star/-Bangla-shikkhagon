/**
 * Google reCAPTCHA Enterprise Service
 * Score-based (v3) verification for user interaction & AI Chat requests.
 * Zero UI friction, no checkboxes, 100% score-based.
 * 
 * Secret keys are strictly server-side. Public Site Key is loaded safely.
 */

// Safe client-side Site Key resolution:
// Users can provide via VITE_RECAPTCHA_ENTERPRISE_SITE_KEY, VITE_RECAPTCHA_SITE_KEY, or window.__RECAPTCHA_SITE_KEY__
const getEnvironmentSiteKey = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const viteEnterpriseKey = (import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY as string)?.trim();
      if (viteEnterpriseKey && !viteEnterpriseKey.includes('[') && !viteEnterpriseKey.includes('Site Key')) {
        return viteEnterpriseKey;
      }
      const viteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string)?.trim();
      if (viteKey && !viteKey.includes('[') && !viteKey.includes('Site Key')) {
        return viteKey;
      }
    }
    if (typeof window !== 'undefined' && (window as any).__RECAPTCHA_SITE_KEY__) {
      return String((window as any).__RECAPTCHA_SITE_KEY__).trim();
    }
  } catch {
    // Ignore error
  }
  return '';
};

export const RECAPTCHA_ENTERPRISE_SITE_KEY = getEnvironmentSiteKey();

let isScriptLoading = false;
let isScriptLoaded = false;

/**
 * Checks if reCAPTCHA Enterprise has an active configured site key
 */
export function isRecaptchaConfigured(): boolean {
  const key = RECAPTCHA_ENTERPRISE_SITE_KEY;
  return Boolean(key && key.length > 5 && !key.includes('[') && !key.includes('Site Key'));
}

/**
 * Dynamically loads the official Google reCAPTCHA Enterprise script
 */
export async function loadRecaptchaEnterpriseScript(siteKey?: string): Promise<boolean> {
  const key = siteKey || RECAPTCHA_ENTERPRISE_SITE_KEY;
  if (!key || key.includes('[') || key.includes('Site Key')) {
    return false;
  }

  if (typeof window === 'undefined') return false;

  if ((window as any).grecaptcha?.enterprise) {
    isScriptLoaded = true;
    return true;
  }

  if (isScriptLoaded) return true;

  if (isScriptLoading) {
    return new Promise((resolve) => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if ((window as any).grecaptcha?.enterprise) {
          clearInterval(interval);
          resolve(true);
        } else if (attempts > 30) {
          clearInterval(interval);
          resolve(false);
        }
      }, 100);
    });
  }

  isScriptLoading = true;

  return new Promise((resolve) => {
    try {
      // Check if already injected
      const existingScript = document.querySelector('script[src*="recaptcha/enterprise.js"]');
      if (existingScript) {
        isScriptLoading = false;
        isScriptLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(key)}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        isScriptLoading = false;
        isScriptLoaded = true;
        console.log('🛡️ [reCAPTCHA Enterprise] Script loaded successfully.');
        resolve(true);
      };
      script.onerror = (e) => {
        isScriptLoading = false;
        console.warn('⚠️ [reCAPTCHA Enterprise] Script load failed:', e);
        resolve(false);
      };
      document.head.appendChild(script);
    } catch (err) {
      isScriptLoading = false;
      console.warn('⚠️ [reCAPTCHA Enterprise] Injection error:', err);
      resolve(false);
    }
  });
}

/**
 * Executes a score-based assessment action using Google reCAPTCHA Enterprise
 * Returns the assessment token to be sent to the backend/API
 */
export async function executeRecaptchaEnterprise(action: string = 'ai_chat'): Promise<string | null> {
  if (!isRecaptchaConfigured() || typeof window === 'undefined') {
    return null;
  }

  const key = RECAPTCHA_ENTERPRISE_SITE_KEY;

  try {
    const loaded = await loadRecaptchaEnterpriseScript(key);
    if (!loaded) return null;

    const grecaptcha = (window as any).grecaptcha?.enterprise || (window as any).grecaptcha;
    if (!grecaptcha || typeof grecaptcha.execute !== 'function') {
      return null;
    }

    return new Promise((resolve) => {
      grecaptcha.ready(async () => {
        try {
          const token = await grecaptcha.execute(key, { action });
          resolve(token || null);
        } catch (execErr) {
          console.warn('[reCAPTCHA Enterprise] Token generation note:', execErr);
          resolve(null);
        }
      });
    });
  } catch (err) {
    console.warn('[reCAPTCHA Enterprise] Execution exception:', err);
    return null;
  }
}
