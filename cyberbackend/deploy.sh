#!/bin/bash

# Cybersecurity Backend Deployment Script

echo "🚀 Deploying Cybersecurity Backend..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Install with: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Run: firebase login"
    exit 1
fi

echo "📦 Installing dependencies..."
cd functions
npm install
cd ..

echo "🔥 Deploying Firestore rules..."
firebase deploy --only firestore:rules

echo "⚡ Deploying Cloud Functions..."
firebase deploy --only functions

echo "✅ Deployment complete!"
echo ""
echo "📋 Available functions:"
echo "  - setUserRole"
echo "  - getUserProfile"
echo "  - checkPasswordStrength"
echo "  - submitPhishingURL"
echo "  - getUserPhishingSubmissions"
echo "  - getAllPhishingSubmissions"
echo "  - updatePhishingVerdict"
echo "  - submitMalwareCheck"
echo "  - getUserMalwareSubmissions"
echo "  - getAllMalwareSubmissions"
echo "  - updateMalwareVerdict"
echo ""
echo "🔒 Security rules deployed with role-based access control"