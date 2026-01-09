
import { Product } from '../types';
import { encryptData, decryptData, generateSecureId } from './security';

/**
 * VogueAI Database Service
 * Handles Product CRUD operations
 */
export const dbService = {
  async getProducts(): Promise<Product[]> {
    const raw = localStorage.getItem('vogue_products_db');
    if (!raw) return [];
    try {
      const decrypted = decryptData(raw);
      return JSON.parse(decrypted);
    } catch {
      return [];
    }
  },

  async saveProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const updated = [product, ...products];
    localStorage.setItem('vogue_products_db', encryptData(JSON.stringify(updated)));
  },

  async updateProduct(updatedProduct: Product): Promise<void> {
    const products = await this.getProducts();
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    localStorage.setItem('vogue_products_db', encryptData(JSON.stringify(updated)));
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem('vogue_products_db', encryptData(JSON.stringify(updated)));
  }
};
