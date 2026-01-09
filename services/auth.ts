
import { ShopProfile } from '../types';
import { encryptData, decryptData, generateSecureId } from './security';

/**
 * VogueAI Auth Service
 * Manages Seller Registration and Session
 */
export const authService = {
  async register(shopData: Omit<ShopProfile, 'registeredAt'>): Promise<ShopProfile> {
    const profile: ShopProfile = {
      ...shopData,
      registeredAt: Date.now()
    };
    
    // Simulate Firebase Auth and Firestore Save
    localStorage.setItem('vogue_user_session', encryptData(JSON.stringify(profile)));
    return profile;
  },

  async getCurrentUser(): Promise<ShopProfile | null> {
    const session = localStorage.getItem('vogue_user_session');
    if (!session) return null;
    
    try {
      const decrypted = decryptData(session);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('vogue_user_session');
  }
};
