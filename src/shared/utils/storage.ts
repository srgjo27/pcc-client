import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY!;

export const encrypt = (value: string): string => {
  return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
};

export const decrypt = (cipherText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt storage item:', error);
    return '';
  }
};

export const setSecureItem = (key: string, value: unknown): void => {
  try {
    const stringValue = JSON.stringify(value);
    const encrypted = encrypt(stringValue);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`Error setting secure item for key "${key}":`, error);
  }
};

export const getSecureItem = <T>(key: string): T | null => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const decrypted = decrypt(encrypted);
    if (!decrypted) return null;

    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error(`Error getting secure item for key "${key}":`, error);
    return null;
  }
};

export const removeSecureItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const clearSecure = (): void => {
  localStorage.clear();
};
