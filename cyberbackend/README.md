# Cybersecurity Web App - Backend

This backend provides Firebase Cloud Functions for a cybersecurity web application with role-based access control.

## Features

- **Firebase Authentication** with role-based access (User/Admin)
- **Password Strength Analysis** (simulated)
- **Phishing URL Submission & Review System**
- **Malware File Submission & Review System**
- **Firestore Security Rules** with proper access control

## Architecture

### Collections

#### Users
```javascript
{
  email: string,
  role: "user" | "admin",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Phishing Submissions
```javascript
{
  userId: string,
  url: string,
  status: "pending" | "checked",
  verdict: "not_checked" | "safe" | "phishing",
  adminNote: string,
  submittedAt: timestamp,
  reviewedAt: timestamp | null,
  reviewedBy: string | null
}
```

#### Malware Submissions
```javascript
{
  userId: string,
  fileName: string,
  fileHash: string,
  status: "pending" | "checked",
  verdict: "not_checked" | "clean" | "malware",
  adminNote: string,
  submittedAt: timestamp,
  reviewedAt: timestamp | null,
  reviewedBy: string | null
}
```

#### Password Checks (logging)
```javascript
{
  userId: string,
  strength: "Weak" | "Medium" | "Strong",
  score: number,
  timestamp: timestamp
}
```

## API Functions

### Authentication & User Management
- `setUserRole(data: { role?: string })` - Set user role (default: "user")
- `getUserProfile()` - Get current user profile

### Password Strength
- `checkPasswordStrength(data: { password: string })` - Analyze password strength

### Phishing System
- `submitPhishingURL(data: { url: string })` - Submit URL for review
- `getUserPhishingSubmissions()` - Get user's submissions
- `getAllPhishingSubmissions()` - Admin: Get all submissions
- `updatePhishingVerdict(data: { submissionId, verdict, adminNote })` - Admin: Update verdict

### Malware System
- `submitMalwareCheck(data: { fileName?, fileHash? })` - Submit file for check
- `getUserMalwareSubmissions()` - Get user's submissions
- `getAllMalwareSubmissions()` - Admin: Get all submissions
- `updateMalwareVerdict(data: { submissionId, verdict, adminNote })` - Admin: Update verdict

## Security Rules

- **Users**: Can only access their own data
- **Admins**: Can access all data and update verdicts
- **Authentication Required**: All operations require valid Firebase auth

## Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize/Use existing project:
```bash
firebase use your-project-id
```

4. Deploy functions:
```bash
firebase deploy --only functions
```

5. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

## Development

1. Install dependencies:
```bash
cd functions
npm install
```

2. Run emulators:
```bash
firebase emulators:start
```

3. Test functions locally:
```bash
firebase functions:shell
```

## Integration with Frontend

The frontend should call these functions using Firebase SDK:

```javascript
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase-config';

// Example: Check password strength
const checkPassword = httpsCallable(functions, 'checkPasswordStrength');
const result = await checkPassword({ password: 'MyPassword123!' });
```

## Admin Setup

To make a user an admin, call the `setUserRole` function with `role: "admin"` after they register, or manually update their document in Firestore.

## Important Notes

- All security scanning is **simulated/dummy** - no real malware or phishing detection
- Password strength calculation is rule-based only
- Admin verdicts are manually set through the admin interface
- All data access is controlled through Firestore security rules