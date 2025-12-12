import { google } from 'googleapis';
import { IFileSource, FileMetadata } from '../../ingest/api/ingest.api.source';

const MIME_TYPES = {
  PDF: 'application/pdf',
  FOLDER: 'application/vnd.google-apps.folder',
  GOOGLE_DOC: 'application/vnd.google-apps.document',
  WORD_DOC: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PNG: 'image/png',
  JPEG: 'image/jpeg'
};

export class GoogleDriveSource implements IFileSource {
  private drive;

  /**
   * Initialize Google Drive Client.
   * 
   * [SECURITY UPDATE]
   * Accepts either:
   * 1. A file path (e.g., "./credentials.json") for local dev.
   * 2. A raw JSON string (e.g., process.env.GOOGLE_CREDENTIALS) for secure Docker/Production deployment.
   */
  constructor(keyOrPath: string) {
    let authOptions;

    // Detection Logic: Does it look like a JSON object?
    if (keyOrPath.trim().startsWith('{')) {
      try {
        console.log('[Drive] Initializing with RAW JSON credentials (Env Var)...');
        authOptions = {
          credentials: JSON.parse(keyOrPath),
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        };
      } catch (e) {
        throw new Error(`Failed to parse Google Credentials JSON from Env Var: ${e}`);
      }
    } else {
      console.log(`[Drive] Initializing with Key File: ${keyOrPath}`);
      authOptions = {
        keyFile: keyOrPath,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      };
    }

    const auth = new google.auth.GoogleAuth(authOptions);
    this.drive = google.drive({ version: 'v3', auth });
  }

  async listFiles(folderId: string): Promise<FileMetadata[]> {
    console.log(`[Drive] Listing supported files in folder: ${folderId}`);
    
    try {
      const res = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
        pageSize: 100, // Adjust pagination as needed
        includeItemsFromAllDrives: true, 
        supportsAllDrives: true
      });

      const files = res.data.files || [];
      console.log(`[Drive] Found ${files.length} total files.`);
      
      return files
        .filter((f: any) => {
          // [FILTER] Whitelist accepted types
          if (f.mimeType === MIME_TYPES.PDF) return true;
          if (f.mimeType === MIME_TYPES.GOOGLE_DOC) return true;
          if (f.mimeType === MIME_TYPES.WORD_DOC) return true;
          
          // Log discarded types for debugging
          if (f.mimeType?.startsWith('image/')) {
            console.log(`   ⚠️  Skipping Image "${f.name}" (Requires Azure OCR)`);
            return false;
          }
          return false;
        })
        .map((f: any) => ({
          id: f.id!,
          name: f.name!,
          mimeType: f.mimeType!
        }));

    } catch (error: any) {
      console.error(`[Drive] Failed to list files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Smart Download:
   * - If PDF -> Download Binary
   * - If Word/Doc -> Convert to PDF Stream
   */
  async downloadFile(fileId: string): Promise<Buffer> {
    
    // 1. Get Metadata first to know the type
    const meta = await this.drive.files.get({ 
      fileId, 
      fields: 'mimeType, name',
      supportsAllDrives: true 
    });
    
    const mime = meta.data.mimeType;
    console.log(`[Drive] Downloading "${meta.data.name}" (${mime})...`);

    let res;

    // 2. Choose Strategy
    if (mime === MIME_TYPES.GOOGLE_DOC || mime === MIME_TYPES.WORD_DOC) {
      // STRATEGY: CONVERT
      // Google Drive API can convert native docs to PDF on the fly
      console.log(`   -> Auto-converting to PDF...`);
      res = await this.drive.files.export({
        fileId,
        mimeType: 'application/pdf' 
      }, { responseType: 'arraybuffer' });
      
    } else {
      // STRATEGY: BINARY
      res = await this.drive.files.get({ 
        fileId, 
        alt: 'media',
        supportsAllDrives: true 
      }, { responseType: 'arraybuffer' });
    }

    return Buffer.from(res.data as ArrayBuffer);
  }
}