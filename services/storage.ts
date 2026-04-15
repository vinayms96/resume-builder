import { Resume } from '../types';
import { encryptData, decryptData } from './cryptoService';

export const STORAGE_KEY   = 'resume_builder_data';
export const TEMPLATE_KEY  = 'resume_builder_template';
export const VIEW_MODE_KEY = 'resume_builder_view_mode';

// Encrypted data is base64 (never starts with '{').
// Legacy plain-JSON data starts with '{' — migrate it on first load.
function isLegacyJson(value: string): boolean {
  return value.trimStart().startsWith('{');
}

export async function saveResume(data: Resume): Promise<void> {
  const encrypted = await encryptData(data);
  localStorage.setItem(STORAGE_KEY, encrypted);
}

export async function loadResume(): Promise<Resume | null> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  if (isLegacyJson(stored)) {
    // Migrate: re-save as encrypted, return parsed value
    try {
      const parsed = JSON.parse(stored) as Resume;
      await saveResume(parsed); // encrypt in place
      return parsed;
    } catch {
      return null;
    }
  }

  return decryptData<Resume>(stored);
}

export function clearResume(): void {
  localStorage.removeItem(STORAGE_KEY);
  // Note: keep the key — clearing data doesn't invalidate the key
}
