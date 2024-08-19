import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { access, constants, readFile, writeFile, copyFile } from 'fs/promises';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..', '..');

const serverSourceEnvPath = join(rootDir, 'server', '.env.example');
const serverDestEnvPath = join(rootDir, 'server', '.env');
const clientSourceEnvPath = join(rootDir, 'client', '.env.example');
const clientDestEnvPath = join(rootDir, 'client', '.env.production');
const adminPanelSourceEnvPath = join(rootDir, 'adminPanel', '.env.example');
const adminPanelDestEnvPath = join(rootDir, 'adminPanel', '.env.production');

function generateRandomSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

async function createServerEnvFile() {
  try {
    const envExample = await readFile(serverSourceEnvPath, 'utf8');
    const randomSecret = generateRandomSecret();
    const newEnvContent = envExample.replace('SESSION_SECRET=', `SESSION_SECRET=${randomSecret}`);

    await writeFile(serverDestEnvPath, newEnvContent);
    console.log('Server .env file has been created with a random session secret.');
  } catch (error) {
    console.error('Error creating server .env file:', error);
  }
}

async function copyEnvFile(sourcePath, destPath) {
  try {
    await copyFile(sourcePath, destPath);
    console.log(`${destPath} has been created.`);
  } catch (error) {
    console.error(`Error creating ${destPath}:`, error);
  }
}

async function init() {
  try {
    await access(serverDestEnvPath, constants.F_OK);
    console.log('Server .env file already exists. No action taken.');
  } catch {
    await createServerEnvFile();
  }

  await copyEnvFile(clientSourceEnvPath, clientDestEnvPath);
  await copyEnvFile(adminPanelSourceEnvPath, adminPanelDestEnvPath);
}

await init();
