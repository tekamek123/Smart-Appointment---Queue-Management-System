// Run this script once to create the first Super Admin
// Usage: node src/scripts/create-super-admin.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Your Firebase config (copy from .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function createSuperAdmin() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Super admin details (CHANGE THESE)
    const email = 'admin@smartappointment.com';
    const password = 'Test@1234'; // Change this to a secure password
    const displayName = 'Super Admin';

    console.log('Creating Super Admin account...');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore with super_admin role
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName,
      role: 'super_admin',
      createdAt: serverTimestamp(),
      isActive: true
    });

    console.log('✅ Super Admin created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Login at: http://localhost:3000/login');
    console.log('You will be redirected to: /dashboard/super-admin');
    
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message);
  }
}

createSuperAdmin();
