#!/bin/bash
echo "🚀 Deploying SecureGuard Cybersecurity App to Render..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to https://render.com"
    echo "2. Sign in or create an account"
    echo "3. Click 'New' → 'Static Site'"
    echo "4. Connect your GitHub repository"
    echo "5. Configure build settings:"
    echo "   - Build Command: npm run build"
    echo "   - Publish Directory: dist"
    echo "6. Add environment variables:"
    echo "   - VITE_GOOGLE_CLIENT_ID=651176287348-goe8ad22d2ih9pef68gbflse0edd8ihd.apps.googleusercontent.com"
    echo "7. Click 'Create Static Site'"
    echo ""
    echo "🌐 Your app will be live at: https://your-app-name.onrender.com"
else
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi