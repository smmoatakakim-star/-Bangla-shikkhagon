import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  ReCaptchaV3Provider,
  getToken,
  AppCheck,
} from 'firebase/app-check';
import baseFirebaseConfig from '../firebase-applet-config.json';
import { RECAPTCHA_ENTERPRISE_SITE_KEY } from './services/recaptchaService';

// Production configuration for project gen-lang-client-0028107936
const PROD_FIREBASE_CONFIG = {
  projectId: 'gen-lang-client-0028107936',
  apiKey: 'AIzaSyCykkF1DfVbYWwx-zVp-jExa-1bQ5M0wW4',
  appId: '1:155792586537:web:2ac67192b3288616d2e938',
  authDomain: 'gen-lang-client-0028107936.firebaseapp.com',
  storageBucket: 'gen-lang-client-0028107936.firebasestorage.app',
  messagingSenderId: '155792586537',
  firestoreDatabaseId: '(default)',
};

// Dynamic project configuration resolver:
// Automatically uses production credentials on live Firebase Hosting, or falls back to dev config in AI Studio preview
const isBrowser = typeof window !== 'undefined';
const hostname = isBrowser ? window.location.hostname : '';

const isTarget0028 = hostname.includes('gen-lang-client-0028107936');
const isTarget0959 = hostname.includes('gen-lang-client-0959983549');

const targetConfig = isTarget0028
  ? PROD_FIREBASE_CONFIG
  : isTarget0959
  ? baseFirebaseConfig
  : hostname.includes('.web.app') || hostname.includes('.firebaseapp.com')
  ? PROD_FIREBASE_CONFIG
  : baseFirebaseConfig;

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : ((typeof process !== 'undefined' && process.env) ? process.env : {}) as any;

export const firebaseConfig = {
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string) || targetConfig.projectId,
  apiKey: (env.VITE_FIREBASE_API_KEY as string) || targetConfig.apiKey,
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN as string) || targetConfig.authDomain,
  appId: (env.VITE_FIREBASE_APP_ID as string) || targetConfig.appId,
  storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET as string) || targetConfig.storageBucket,
  messagingSenderId: targetConfig.messagingSenderId || baseFirebaseConfig.messagingSenderId,
  firestoreDatabaseId: targetConfig.firestoreDatabaseId || baseFirebaseConfig.firestoreDatabaseId,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// App Check instance holder
let appCheckInstance: AppCheck | null = null;

/**
 * Initializes Firebase App Check with reCAPTCHA v3
 * In dev preview or localhost, enables debug tokens to prevent false blocks.
 */
export function initAppCheck(): AppCheck | null {
  if (!isBrowser || appCheckInstance) return appCheckInstance;

  // In development environments, enable debug token for testing
  const isDev =
    Boolean(env.DEV) ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('run.app');

  if (isDev) {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN =
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN ?? true;
  }

  const enterpriseSiteKey =
    (env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY as string) ||
    RECAPTCHA_ENTERPRISE_SITE_KEY ||
    '';

  const v3SiteKey =
    (env.VITE_RECAPTCHA_SITE_KEY as string) ||
    (baseFirebaseConfig as any).recaptchaSiteKey ||
    '';

  const effectiveKey = enterpriseSiteKey || v3SiteKey;

  if (effectiveKey) {
    try {
      const provider = enterpriseSiteKey
        ? new ReCaptchaEnterpriseProvider(enterpriseSiteKey)
        : new ReCaptchaV3Provider(v3SiteKey);

      appCheckInstance = initializeAppCheck(app, {
        provider,
        isTokenAutoRefreshEnabled: true,
      });
      console.log(
        `🛡️ [Firebase App Check] Initialized with ${
          enterpriseSiteKey ? 'reCAPTCHA Enterprise' : 'reCAPTCHA v3'
        } provider.`
      );
    } catch (err) {
      console.warn('⚠️ [Firebase App Check] Initialization note:', err);
    }
  } else if (!isDev) {
    console.info(
      'ℹ️ [Firebase App Check]: To enforce App Check in production on Firebase Hosting, configure a reCAPTCHA Enterprise / v3 site key in Firebase Console -> App Check.'
    );
  }

  return appCheckInstance;
}

// Auto-run App Check init in browser
if (isBrowser) {
  try {
    initAppCheck();
  } catch (e) {
    // Non-blocking
  }
}

/**
 * Helper to retrieve current App Check token if available
 */
export async function getAppCheckToken(): Promise<string | null> {
  if (!appCheckInstance) return null;
  try {
    const tokenResult = await getToken(appCheckInstance, false);
    return tokenResult.token;
  } catch (e) {
    console.warn('Could not get App Check token:', e);
    return null;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code || '';

  // Gracefully handle offline or network unavailable status in Firestore
  if (
    code === 'unavailable' ||
    message.includes('unavailable') ||
    message.includes('client is offline') ||
    message.includes('offline mode') ||
    message.includes('Failed to get document because the client is offline')
  ) {
    console.warn(`Firestore operating in offline mode for ${operationType} on ${path || 'database'}`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Optional helper to check connection on demand without forcing unhandled failure on boot
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('the client is offline') || (error as any)?.code === 'unavailable')
    ) {
      console.warn('Firebase notice: client is operating in offline mode.');
    }
  }
}

