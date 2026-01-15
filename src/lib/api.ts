const API_BASE_URL = 'http://localhost:3001';

// Mock authentication - get current user from localStorage
const getCurrentUser = () => {
  const storedUser = localStorage.getItem('mockUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  // Fallback for demo
  return {
    uid: 'user1',
    email: 'siddiqshaik613@gmail.com'
  };
};

class ApiService {
  private async makeRequest(endpoint: string, data?: any): Promise<any> {
    const currentUser = getCurrentUser();

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: currentUser.uid,
          userEmail: currentUser.email
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User Management
  async setUserRole(role: string = 'user') {
    return this.makeRequest('/functions/setUserRole', { role });
  }

  async getUserProfile() {
    return this.makeRequest('/functions/getUserProfile');
  }

  // Password Strength
  async checkPasswordStrength(password: string) {
    return this.makeRequest('/functions/checkPasswordStrength', { password });
  }

  // Phishing Detection
  async submitPhishingURL(url: string) {
    return this.makeRequest('/functions/submitPhishingURL', { url });
  }

  async getUserPhishingSubmissions() {
    return this.makeRequest('/functions/getUserPhishingSubmissions');
  }

  // Malware Detection
  async submitMalwareCheck(fileName?: string, fileHash?: string) {
    return this.makeRequest('/functions/submitMalwareCheck', { fileName, fileHash });
  }

  async getUserMalwareSubmissions() {
    return this.makeRequest('/functions/getUserMalwareSubmissions');
  }
}

export const apiService = new ApiService();
export { getCurrentUser };