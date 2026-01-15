# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your cybersecurity web app.

## Prerequisites

1. A Google Cloud Console account
2. A Google Cloud Project

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Identity API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Identity API" and enable it

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - **App name**: Your app name (e.g., "SecureGuard")
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add your domain to the authorized domains if you have one
5. Save and continue

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Configure authorized origins and redirect URIs:
   - **Authorized JavaScript origins**: Add your development and production URLs
     - `http://localhost:8080` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**: Add the same URLs
5. Click "Create"
6. Copy the Client ID (you'll need this for the next step)

## Step 4: Configure Your Application

1. Open the `.env` file in your project root
2. Replace `your_google_client_id_here` with your actual Google Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login or register page
3. Click the "Continue with Google" button
4. You should see a Google OAuth popup
5. Sign in with your Google account
6. You should be redirected back to your app and logged in

## Troubleshooting

### Common Issues:

1. **"Google Sign-In is not ready yet"**
   - Wait a few seconds for the Google API to load
   - Check your internet connection

2. **"Invalid client" error**
   - Verify your Client ID is correct in the `.env` file
   - Make sure the OAuth consent screen is configured properly

3. **"Redirect URI mismatch"**
   - Add your current URL to the authorized redirect URIs in Google Cloud Console
   - For localhost development, add `http://localhost:8080`

4. **CORS errors**
   - Make sure your domain is added to authorized domains in the OAuth consent screen

### Development vs Production:

- **Development**: Use `http://localhost:8080` in authorized origins/redirect URIs
- **Production**: Use your actual domain (e.g., `https://yourapp.com`)

## Security Notes

- Never commit your `.env` file to version control
- Regularly rotate your OAuth credentials
- Monitor your Google Cloud Console for unusual activity
- Use HTTPS in production

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Overview](https://developers.google.com/identity/protocols/oauth2)