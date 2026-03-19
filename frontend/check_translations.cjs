const fs = require('fs'); 
const content = fs.readFileSync('src/pages/auth/Signup.tsx', 'utf8'); 
const ar = JSON.parse(fs.readFileSync('src/locales/ar.json', 'utf8')); 

const keys = new Set(); 
const regex1 = /t\(['"]([^'"]+)['"]/g; 
const regex2 = /t\(`([^`]+)`/g; 

let match; 
while ((match = regex1.exec(content)) !== null) { keys.add(match[1]); }
while ((match = regex2.exec(content)) !== null) { keys.add(match[1]); }

const missing = Array.from(keys).filter(k => !ar[k]); 
console.log('Missing in Signup.tsx:\n', missing.join('\n'));

const contentOnboarding = fs.readFileSync('src/pages/Onboarding.tsx', 'utf8');
const keysOnboarding = new Set();
while ((match = regex1.exec(contentOnboarding)) !== null) { keysOnboarding.add(match[1]); }
while ((match = regex2.exec(contentOnboarding)) !== null) { keysOnboarding.add(match[1]); }
const missingOnboarding = Array.from(keysOnboarding).filter(k => !ar[k]); 
console.log('\nMissing in Onboarding.tsx:\n', missingOnboarding.join('\n'));
