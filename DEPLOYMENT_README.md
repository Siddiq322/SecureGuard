# 🚀 SecureGuard - Cybersecurity Web App

A modern, full-featured cybersecurity web application built with React, TypeScript, and Tailwind CSS.

## 🌐 Live Demo

[View Live App](https://your-app-name.onrender.com) *(Replace with your actual Render URL)*

## ✨ Features

- 🔐 **Authentication**: Email/password and Google OAuth
- 🔒 **Password Strength Checker**: 7-criteria analysis
- 🛡️ **URL Phishing Scanner**: Risk assessment with AI-powered analysis
- 🦠 **Malware File Scanner**: Advanced threat detection
- 📊 **Security Dashboard**: Comprehensive security insights
- 🎨 **Modern UI**: Glassmorphism design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Authentication**: Google OAuth + localStorage
- **Deployment**: Render (Static Site)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cyberproject/cyberfrontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Deployment to Render

### Method 1: GitHub Integration (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Sign in with your account
   - Click **"New"** → **"Static Site"**

3. **Configure Build Settings**
   - **Name**: `secureguard-cyber-app` (or your choice)
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variables**
   ```
   VITE_GOOGLE_CLIENT_ID=651176287348-goe8ad22d2ih9pef68gbflse0edd8ihd.apps.googleusercontent.com
   ```

5. **Deploy**
   - Click **"Create Static Site"**
   - Wait for deployment to complete
   - Your app will be live at: `https://your-app-name.onrender.com`

### Method 2: Manual Upload

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder**
   - Go to Render dashboard
   - Create new Static Site
   - Upload the `dist` folder contents
   - Configure as above

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Google Identity API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `https://your-app-name.onrender.com`
6. Copy the Client ID to your environment variables

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 📱 Usage

### Authentication
- **Login**: Use existing accounts or Google OAuth
- **Register**: Create new accounts with email or Google
- **Demo Account**: `user@cyberguard.com` / `user123`

### Security Tools
- **Password Checker**: Analyze password strength
- **URL Scanner**: Check websites for phishing
- **File Scanner**: Upload files for malware analysis

## 🏗️ Project Structure

```
cyberfrontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── utils/        # Utility functions
│   └── lib/          # Library configurations
├── dist/             # Build output (generated)
└── render.yaml       # Render deployment config
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
- Create an issue on GitHub
- Check the deployment logs on Render
- Verify environment variables are set correctly

---

**Built with ❤️ for cybersecurity awareness and education**