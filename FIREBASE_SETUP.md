# Firebase Authentication Setup Guide

## 🔥 Setting up Firebase Authentication

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "post-dashboard")
4. Follow the setup wizard (you can disable Google Analytics for simplicity)

### 2. Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Click on "Google" and enable it
4. Add your domain to the authorized domains (for local development, `localhost` should already be there)
5. Configure the OAuth consent screen if prompted

### 3. Get Your Firebase Configuration

1. Go to Project Settings (gear icon in the left sidebar)
2. Scroll down to the "Your apps" section
3. Click on "Web app" icon (</>) to create a web app
4. Register your app with a name (e.g., "Post Dashboard Web")
5. Copy the Firebase configuration object

### 4. Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase configuration values:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Configure OAuth Consent Screen (Google Cloud Console)

If you encounter issues with Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to "APIs & Services" > "OAuth consent screen"
4. Configure the consent screen with your app information
5. Add authorized domains if needed

### 6. Test the Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Click "Continue with Google"
4. Complete the Google sign-in flow
5. You should be redirected to the dashboard and see your profile in the header

## 🛠️ Features Implemented

### Authentication Features
- ✅ Google Sign-in with Firebase
- ✅ User profile display in header
- ✅ Sign-out functionality
- ✅ Guest access (continue without signing in)
- ✅ Protected routes (optional)
- ✅ Responsive design for mobile and desktop

### Login Page Features
- ✅ Beautiful login UI with gradient background
- ✅ Google sign-in button with official Google colors
- ✅ Error handling and loading states
- ✅ Guest access option
- ✅ Features list to show app benefits
- ✅ Terms of service and privacy policy links

### Header Integration
- ✅ User avatar and name display
- ✅ Dropdown menu with user info and sign-out
- ✅ Mobile-responsive user menu
- ✅ Sign-in button for unauthenticated users

## 🔧 Customization Options

### Making Routes Protected
To make any page require authentication, wrap it with the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function SomePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <YourPageContent />
    </ProtectedRoute>
  );
}
```

### Additional Authentication Providers
To add more providers (Facebook, Twitter, etc.):

1. Enable them in Firebase Console
2. Add the provider to `lib/firebase.ts`
3. Create sign-in functions in `contexts/AuthContext.tsx`
4. Add buttons to the login page

### Custom Styling
The login page and header components use Tailwind CSS classes that match your existing design system. You can customize:
- Colors by changing gradient classes
- Layout by modifying the component structure
- Icons by replacing SVG elements

## 🚨 Troubleshooting

### Common Issues

1. **"Firebase config not found"**
   - Make sure your `.env.local` file is in the root directory
   - Check that all Firebase config variables are set
   - Restart your development server after adding environment variables

2. **Google sign-in popup blocked**
   - Make sure popup blockers are disabled
   - Try using `signInWithRedirect` instead of `signInWithPopup` for mobile

3. **"This app isn't verified"**
   - This is normal during development
   - Click "Advanced" then "Go to your-app (unsafe)" to proceed
   - For production, complete the OAuth consent screen verification

4. **CORS errors**
   - Add your domain to authorized domains in Firebase Console
   - For local development, make sure localhost is authorized

### Getting Help
- Check the browser console for detailed error messages
- Review Firebase documentation: https://firebase.google.com/docs/auth
- Check your Firebase project settings and configuration
