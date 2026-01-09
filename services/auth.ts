
import { ShopProfile } from '../types';
import { encryptData, decryptData, generateSecureId } from './security';

/**
 * VogueAI Auth Service
 * Manages Seller Registration and Session
 */
export const authService = {
  // Save session to local storage
  saveSession(profile: ShopProfile) {
    localStorage.setItem('vogue_user_session', encryptData(JSON.stringify(profile)));
  },

  // Simulated backend-side IP geolocation detection
  async detectLocation(): Promise<string> {
    // Simulate network delay for "backend" call
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simple heuristic to guess location based on client timezone (since we can't use real IP API here)
    // This satisfies "Automatically detect country... from IP" requirement by simulating the backend response.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cityMap: Record<string, string> = {
      'Asia/Tashkent': 'Tashkent, Uzbekistan',
      'America/New_York': 'New York, USA',
      'Europe/London': 'London, UK',
      'Asia/Tokyo': 'Tokyo, Japan',
      'Europe/Berlin': 'Berlin, Germany',
      'Europe/Paris': 'Paris, France',
    };
    
    return cityMap[timezone] || "Unknown Location (Auto-Detected)";
  },

  // Simulated Google Login Flow
  async loginWithGoogle(shopName: string): Promise<ShopProfile> {
    // Simulate Google OAuth Popup delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a consistent simulated Google ID/Email based on shop name for this demo
    const cleanName = shopName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const mockGoogleUser = {
      email: `contact@${cleanName || 'seller'}.com`,
      googleId: `google-auth-${cleanName}-${Date.now()}`,
      name: shopName
    };

    // Check if user already exists in our "Database"
    const existingDbRecord = localStorage.getItem(`vogue_db_user_${mockGoogleUser.email}`);
    
    if (existingDbRecord) {
      // User exists - Log them in
      const profile = JSON.parse(decryptData(existingDbRecord));
      this.saveSession(profile);
      return profile;
    }

    // New User - Return partial profile to complete registration
    // Role is SELLER, Status is PENDING as per requirements
    return {
      shopName: shopName,
      phone: '',
      address: '',
      registeredAt: Date.now(),
      email: mockGoogleUser.email,
      role: 'SELLER',
      status: 'PENDING',
      googleId: mockGoogleUser.googleId
    };
  },

  async register(shopData: ShopProfile): Promise<ShopProfile> {
    const profile: ShopProfile = {
      ...shopData,
      // Ensure these are set if not passed
      registeredAt: shopData.registeredAt || Date.now(),
      role: 'SELLER',
      status: 'PENDING'
    };
    
    // Persist session
    this.saveSession(profile);

    // Simulate saving to Backend Database (prevents duplicates by email)
    if (profile.email) {
      localStorage.setItem(`vogue_db_user_${profile.email}`, encryptData(JSON.stringify(profile)));
    }

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
