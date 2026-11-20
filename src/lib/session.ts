/**
 * نظام جلسة موقّع — متوافق مع Edge Runtime و Node
 * يستخدم Web Crypto API بدل node:crypto
 */

const SESSION_COOKIE = 'courseflow_session';
const ROLE_COOKIE = 'courseflow_role';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 أيام

export type SessionPayload = {
  userId: string;
  role: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET must be set in production (min 16 chars)');
    }
    return 'dev-only-insecure-session-secret-change-me';
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i]);
  }
  // btoa works in Edge + Browser; in Node use Buffer fallback
  const b64 =
    typeof btoa !== 'undefined'
      ? btoa(str)
      : Buffer.from(arr).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  if (typeof atob !== 'undefined') {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(padded, 'base64'));
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** إنشاء توكن جلسة موقّع */
export async function createSessionToken(
  userId: string,
  role: string
): Promise<string> {
  const payload: SessionPayload = {
    userId,
    role: role.toUpperCase(),
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getHmacKey(getSecret());
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payloadB64)
  );
  return `${payloadB64}.${toBase64Url(signature)}`;
}

/** التحقق من التوكن */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;
  try {
    const key = await getHmacKey(getSecret());
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      new Uint8Array(fromBase64Url(sigB64)),
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return null;

    const json = new TextDecoder().decode(fromBase64Url(payloadB64));
    const payload = JSON.parse(json) as SessionPayload;
    if (!payload.userId || !payload.role || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE_SECONDS,
};

export { SESSION_COOKIE, ROLE_COOKIE, MAX_AGE_SECONDS };