# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project" or "Create project"
3. Enter project name: `smart-appointment-system`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Get started"
2. Enable **Email/Password** provider:
   - Click "Email/Password"
   - Enable the provider
   - Click "Save"
3. Enable **Google** provider:
   - Click "Google" under "Sign-in method"
   - Enable Google Sign-in
   - Add your authorized domains:
     - `localhost` (for development)
     - `yourdomain.com` (for production)
4. Click "Save"

## Step 3: Set up Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location (choose nearest to your users)
4. Click "Create database"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (⚙️ icon)
2. Under "Your apps", click Web app (</>)
3. Copy the Firebase configuration object
4. Update your `.env.local` file with these values

## Step 5: Update Environment Variables

Replace the placeholder values in `.env.local` with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Step 6: Test the Integration

1. Restart your development server: `npm run dev`
2. Go to http://localhost:3000
3. Click "Sign In with Google"
4. Test authentication flow

## Security Rules (Production)

When ready for production, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Appointments: users can read/write their own appointments
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.customerId;
    }

    // Queues: read-only for authenticated users
    match /queues/{queueId} {
      allow read: if request.auth != null;
    }
  }
}
```

## Troubleshooting

- If authentication doesn't work, check that Google Auth is enabled
- If Firestore errors occur, verify database is created
- Make sure environment variables are correctly set
- Restart dev server after updating `.env.local`
