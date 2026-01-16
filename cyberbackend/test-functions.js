// Test script for backend functions
// Run with: node test-functions.js

const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json'); // You'll need to add this

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'your-project-id' // Replace with your project ID
});

const functions = require('./functions/index.js');

// Test password strength function
async function testPasswordStrength() {
  console.log('🧪 Testing password strength...');

  const testPasswords = [
    'weak',
    'Medium123',
    'StrongPassword123!',
    'VeryStrongPassword123!@#'
  ];

  for (const password of testPasswords) {
    try {
      // Mock context for testing
      const mockContext = {
        auth: { uid: 'test-user-id' }
      };

      const result = await functions.checkPasswordStrength({ password }, mockContext);
      console.log(`Password: "${password}" -> ${result.strength} (${result.score}%)`);
    } catch (error) {
      console.error(`Error testing password "${password}":`, error.message);
    }
  }
}

// Test submission creation
async function testSubmissions() {
  console.log('\n🧪 Testing submission creation...');

  const submissionHandler = require('./functions/utils/submissionHandler');

  try {
    // Test phishing submission
    const phishingId = await submissionHandler.createPhishingSubmission('test-user', 'https://example.com');
    console.log('✅ Created phishing submission:', phishingId);

    // Test malware submission
    const malwareId = await submissionHandler.createMalwareSubmission('test-user', {
      fileName: 'test.exe',
      fileHash: 'abc123'
    });
    console.log('✅ Created malware submission:', malwareId);

  } catch (error) {
    console.error('❌ Error creating submissions:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting backend function tests...\n');

  await testPasswordStrength();
  await testSubmissions();

  console.log('\n✅ All tests completed!');
  process.exit(0);
}

// Only run if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };