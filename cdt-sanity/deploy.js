import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the auth token from .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const tokenMatch = envContent.match(/SANITY_AUTH_TOKEN=([^\s]+)/);
const sanityAuthToken = tokenMatch ? tokenMatch[1] : null;

if (!sanityAuthToken) {
  console.error('❌ SANITY_AUTH_TOKEN not found in .env.local');
  process.exit(1);
}

console.log('🔑 Found SANITY_AUTH_TOKEN');
console.log('🚀 Starting Sanity deployment...');

try {
  // Set the auth token as environment variable
  process.env.SANITY_AUTH_TOKEN = sanityAuthToken;

  // Run the deployment
  const result = execSync('npx sanity deploy --yes', {
    cwd: __dirname,
    env: process.env,
    stdio: 'inherit'
  });

  console.log('✅ Deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:');
  console.error(error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout.toString());
  if (error.stderr) console.error('STDERR:', error.stderr.toString());
  process.exit(1);
}
