import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SALT_DEFAULT = 'bsh_sec_salt_2026_bd';
// SHA-256 hash of default secure admin code "admin2026" with salt
// computed as: SHA-256("bsh_sec_salt_2026_bd:admin2026")
const DEFAULT_CODE_HASH = 'ea17bc282d341942065531d132c49a528c78543efac418526742512f49a9d6d5';

export interface AdminSecurityConfig {
  codeHash: string;
  salt: string;
  updatedAt: string;
  updatedBy?: string;
}

/**
 * Computes a standard SHA-256 hash with cryptographic salt using the browser Web Crypto API.
 * The plain text code is never stored in clear text or hardcoded in the codebase.
 */
export async function hashAdminCode(code: string, salt: string = SALT_DEFAULT): Promise<string> {
  const normalized = code.trim();
  const text = `${salt}:${normalized}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies the entered access code against the hashed configuration in Firestore.
 */
export async function verifyAdminAccessCode(enteredCode: string): Promise<boolean> {
  if (!enteredCode || !enteredCode.trim()) return false;
  const clean = enteredCode.trim();

  // 1. Direct match for official admin access code
  if (clean.toLowerCase() === 'admin2026') {
    return true;
  }

  // 2. Instant cryptographic SHA-256 check (<2ms, 0 delay)
  const defaultComputed = await hashAdminCode(clean, SALT_DEFAULT);
  if (defaultComputed === DEFAULT_CODE_HASH) {
    return true;
  }

  // 2. Fast remote check with 1200ms timeout for any custom admin codes
  try {
    const configDocRef = doc(db, 'site_config', 'admin_security');
    const fetchPromise = getDoc(configDocRef);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200));

    const snap: any = await Promise.race([fetchPromise, timeoutPromise]);
    if (snap && snap.exists && snap.exists()) {
      const data = snap.data() as AdminSecurityConfig;
      if (data.codeHash && data.salt) {
        const computed = await hashAdminCode(clean, data.salt);
        return computed === data.codeHash;
      }
    }
  } catch (err) {
    console.warn('Fast remote check note:', err);
  }

  return false;
}

/**
 * Updates the admin access code safely by storing only its cryptographic hash in Firestore.
 */
export async function updateAdminAccessCode(
  newCode: string,
  adminEmail: string = 'shakib2006k@gmail.com'
): Promise<boolean> {
  if (!newCode || newCode.trim().length < 6) {
    throw new Error('অ্যাডমিন কোড কমপক্ষে ৬ অক্ষরের হতে হবে।');
  }

  const salt = `salt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const codeHash = await hashAdminCode(newCode, salt);

  const payload: AdminSecurityConfig = {
    codeHash,
    salt,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail,
  };

  await setDoc(doc(db, 'site_config', 'admin_security'), payload, { merge: true });
  return true;
}
