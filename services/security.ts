
/**
 * VogueAI Security Layer
 * Cyber Security Architecture: Zero Trust Approach
 */

// Xavfsiz ID yaratish
export const generateSecureId = (): string => {
  return window.crypto.randomUUID();
};

// Matnni tozalash (XSS protection)
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Ma'lumotlarni shifrlash (Simple XOR for demo, productionda WebCrypto API ishlatiladi)
const SECRET_KEY = "vogue_ai_vault_key_2025";
export const encryptData = (data: string): string => {
  return btoa(data.split('').map((char, i) => 
    String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
  ).join(''));
};

export const decryptData = (encoded: string): string => {
  try {
    const data = atob(encoded);
    return data.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
    ).join('');
  } catch (e) {
    return "";
  }
};

// Rasm xavfsizligini tekshirish
export const validateImage = (file: File): Promise<boolean> => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
  return new Promise((resolve) => {
    if (!ALLOWED_TYPES.includes(file.type)) return resolve(false);
    if (file.size > MAX_SIZE) return resolve(false);
    resolve(true);
  });
};
