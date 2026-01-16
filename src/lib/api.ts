import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions";
import { app } from "./firebase";

const functions = getFunctions(app);

class ApiService {
  private async callFunction(functionName: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const callable = httpsCallable(functions, functionName);
      const result = await callable(data);
      return result.data as Record<string, unknown>;
    } catch (error) {
      console.error(`Firebase function ${functionName} failed:`, error);
      throw error;
    }
  }

  // User Management
  async setUserRole(role: string = 'user') {
    return this.callFunction('setUserRole', { role });
  }

  async getUserProfile() {
    return this.callFunction('getUserProfile');
  }

  // Password Strength
  async checkPasswordStrength(password: string) {
    return this.callFunction('checkPasswordStrength', { password });
  }

  // Phishing Detection
  async submitPhishingURL(url: string) {
    return this.callFunction('submitPhishingURL', { url });
  }

  async getUserPhishingSubmissions() {
    return this.callFunction('getUserPhishingSubmissions');
  }

  // Malware Detection
  async submitMalwareCheck(fileName?: string, fileHash?: string) {
    return this.callFunction('submitMalwareCheck', { fileName, fileHash });
  }

  async getUserMalwareSubmissions() {
    return this.callFunction('getUserMalwareSubmissions');
  }
}

export const apiService = new ApiService();