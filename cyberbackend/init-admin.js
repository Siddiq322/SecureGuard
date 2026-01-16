#!/usr/bin/env node

// Initialize script for setting up admin users
// Run with: node init-admin.js

const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to set up service account key)
try {
  const serviceAccount = require('./service-account-key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('❌ Service account key not found. Please add service-account-key.json');
  console.log('Download from: Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

async function createAdminUser(email) {
  try {
    console.log(`👤 Creating admin user: ${email}`);

    // Note: This requires the user to already exist in Firebase Auth
    // In production, you'd create the user through Firebase Auth first

    // For now, we'll just set the role in Firestore
    // Assuming the user already exists in Firebase Auth

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Set admin role in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`✅ Admin user created: ${email} (UID: ${userRecord.uid})`);

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ User ${email} not found in Firebase Auth`);
      console.log('Please register the user first through your frontend, then run this script');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
}

async function listUsers() {
  try {
    console.log('\n👥 Current users:');
    const usersSnapshot = await admin.firestore().collection('users').get();

    if (usersSnapshot.empty) {
      console.log('No users found');
      return;
    }

    usersSnapshot.forEach(doc => {
      const user = doc.data();
      console.log(`- ${user.email} (${user.role}) - ${doc.id}`);
    });

  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🔧 Firebase Admin Setup Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node init-admin.js list                    # List all users');
    console.log('  node init-admin.js create <email>          # Create admin user');
    console.log('');
    console.log('Examples:');
    console.log('  node init-admin.js create admin@example.com');
    console.log('  node init-admin.js list');
    return;
  }

  const command = args[0];

  switch (command) {
    case 'create':
      if (args.length < 2) {
        console.error('❌ Please provide an email address');
        console.log('Usage: node init-admin.js create <email>');
        return;
      }
      await createAdminUser(args[1]);
      break;

    case 'list':
      await listUsers();
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      break;
  }

  // Always show current users at the end
  await listUsers();
}

// Run the script
main().catch(console.error).finally(() => {
  admin.app().delete();
  process.exit(0);
});