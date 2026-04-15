const KEY_STORAGE = 'resume_builder_key';
const ALGO        = { name: 'AES-GCM', length: 256 } as const;

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

async function getOrCreateKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(KEY_STORAGE);
  if (stored) {
    return crypto.subtle.importKey('raw', fromBase64(stored), ALGO, false, ['encrypt', 'decrypt']);
  }
  const key     = await crypto.subtle.generateKey(ALGO, true, ['encrypt', 'decrypt']);
  const exported = await crypto.subtle.exportKey('raw', key);
  localStorage.setItem(KEY_STORAGE, toBase64(exported));
  return key;
}

export async function encryptData(data: object): Promise<string> {
  const key       = await getOrCreateKey();
  const iv        = crypto.getRandomValues(new Uint8Array(12));
  const encoded   = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  // Pack: [12-byte IV][ciphertext] → base64
  const combined = new Uint8Array(12 + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), 12);
  return toBase64(combined.buffer);
}

export async function decryptData<T>(encrypted: string): Promise<T | null> {
  try {
    const key      = await getOrCreateKey();
    const combined = fromBase64(encrypted);
    const iv        = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return JSON.parse(new TextDecoder().decode(decrypted)) as T;
  } catch {
    return null;
  }
}
