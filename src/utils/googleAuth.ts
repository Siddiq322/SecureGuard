export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

class GoogleAuthService {
  private clientId: string;
  private isInitialized = false;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  }

  // Initialize Google Identity Services
  async initGoogleSignIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.clientId) {
        reject(new Error('Google Client ID not configured'));
        return;
      }

      if (!window.google) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        this.isInitialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Handle the credential response from Google
  private handleCredentialResponse(response: { credential: string }) {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));

      const user: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        verified_email: payload.email_verified,
      };

      // Store the user data temporarily for the callback
      window.googleAuthUser = user;
    } catch (error) {
      console.error('Error parsing Google credential:', error);
    }
  }

  // Render the Google Sign-In button
  renderButton(elementId: string, onSuccess: (user: GoogleUser) => void, onError?: (error: Error) => void) {
    if (!this.isInitialized) {
      onError?.(new Error('Google Sign-In not initialized'));
      return;
    }

    // Set up a callback to handle the sign-in
    window.googleAuthCallback = (user: GoogleUser) => {
      onSuccess(user);
    };

    window.google.accounts.id.renderButton(
      document.getElementById(elementId)!,
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
      }
    );
  }

  // Sign in with Google (prompt)
  async signInWithGoogle(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('Google Sign-In not initialized'));
        return;
      }

      // Clear any previous user data
      window.googleAuthUser = undefined;

      // Prompt the user to sign in
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // User cancelled or skipped
          reject(new Error('User cancelled Google sign-in'));
        }
      });

      // Wait for the credential response
      const checkForUser = () => {
        const user = window.googleAuthUser;
        if (user) {
          resolve(user);
        } else {
          setTimeout(checkForUser, 100);
        }
      };

      // Start checking after a short delay
      setTimeout(checkForUser, 500);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!window.googleAuthUser) {
          reject(new Error('Google sign-in timeout'));
        }
      }, 30000);
    });
  }

  // Sign out from Google
  async signOut(): Promise<void> {
    return new Promise((resolve) => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.disableAutoSelect();
        // Clear any stored credential
        window.google.accounts.id.revoke('', () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Check if user is signed in (this is more complex with GIS)
  isSignedIn(): boolean {
    // Google Identity Services doesn't provide a direct way to check sign-in status
    // We rely on our stored user data instead
    return false;
  }
}

// Global type declarations for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select: boolean;
            cancel_on_tap_outside: boolean;
          }) => void;
          renderButton: (element: HTMLElement | null, config: {
            theme: string;
            size: string;
            width: string;
            text: string;
            shape: string;
          }) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          disableAutoSelect: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
    googleAuthUser?: GoogleUser;
    googleAuthCallback?: (user: GoogleUser) => void;
  }
}

export const googleAuthService = new GoogleAuthService();