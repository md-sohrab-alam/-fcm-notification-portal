const fs = require('fs');

try {
  // Read the Firebase service account file
  const serviceAccount = fs.readFileSync('./firebase-service-account.json', 'utf8');
  
  // Parse and stringify to ensure it's valid JSON
  const parsed = JSON.parse(serviceAccount);
  const envValue = JSON.stringify(parsed);
  
  console.log('=== FIREBASE_SERVICE_ACCOUNT Environment Variable ===');
  console.log('Copy this value to your Render.com environment variables:');
  console.log('');
  console.log('FIREBASE_SERVICE_ACCOUNT=' + envValue);
  console.log('');
  console.log('=== Instructions ===');
  console.log('1. Go to your Render.com dashboard');
  console.log('2. Select your backend service');
  console.log('3. Go to Environment → Environment Variables');
  console.log('4. Add FIREBASE_SERVICE_ACCOUNT with the value above');
  console.log('5. Redeploy your service');
  
} catch (error) {
  console.error('Error reading Firebase service account file:', error.message);
  console.log('');
  console.log('Make sure firebase-service-account.json exists in the backend directory');
} 