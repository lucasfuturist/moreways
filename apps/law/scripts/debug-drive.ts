import { google } from 'googleapis';
import * as path from 'path';
import * as fs from 'fs';

const KEY_FILE_PATH = path.join(__dirname, '../credentials.json');
const TARGET_FOLDER_ID = '1YcdleYaAwjYoHO8P78og5i-eOYXdg61L';

async function runDebug() {
  console.log('--- DRIVE PERMISSION DEBUGGER ---');

  if (!fs.existsSync(KEY_FILE_PATH)) {
    console.error('❌ Credentials file missing.');
    return;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const drive = google.drive({ version: 'v3', auth });

  // 1. CHECK IDENTITY
  try {
    const about = await drive.about.get({ fields: 'user' });
    console.log(`\n🤖 I am logged in as: ${about.data.user?.emailAddress}`);
    console.log(`   (Make sure THIS email is added to the folder)`);
  } catch (e) {
    console.error('❌ Auth Failed:', e);
    return;
  }

  // 2. CHECK FOLDER ACCESS DIRECTLY
  try {
    console.log(`\n📂 Checking access to folder ID: ${TARGET_FOLDER_ID}...`);
    const folder = await drive.files.get({ fileId: TARGET_FOLDER_ID });
    console.log(`   ✅ SUCCESS! I can see the folder named: "${folder.data.name}"`);
  } catch (e: any) {
    console.error(`   ❌ FAIL. I cannot see this folder.`);
    console.error(`   Error: ${e.message}`);
    console.log(`\n👉 FIX: Go to the folder in browser > Share > Paste the email above.`);
  }

  // 3. LIST ROOT (To see if I can see ANYTHING at all)
  try {
    const list = await drive.files.list({ pageSize: 5 });
    console.log(`\n👀 Checking root visibility...`);
    if (list.data.files && list.data.files.length > 0) {
      console.log(`   I can see ${list.data.files.length} files in total (in my world).`);
      list.data.files.forEach(f => console.log(`   - ${f.name} (${f.id})`));
    } else {
      console.log(`   I see 0 files anywhere. I am lonely.`);
    }
  } catch (e) {
    console.error(e);
  }
}

runDebug();