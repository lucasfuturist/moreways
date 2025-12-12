import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleDriveSource } from '../../src/infra/google/infra.google.drive';

// --- MOCK SETUP ---
const mockList = vi.fn();
const mockGet = vi.fn();
const mockExport = vi.fn();
const mockAuthConstructor = vi.fn();

vi.mock('googleapis', () => {
  return {
    google: {
      auth: {
        // [FIX] Use a standard function (not arrow) so 'new' works
        GoogleAuth: vi.fn(function (args) {
            mockAuthConstructor(args);
            return {};
        })
      },
      // Mock the drive factory function
      drive: vi.fn(() => ({
        files: {
          list: mockList,
          get: mockGet,
          export: mockExport
        }
      }))
    }
  };
});

describe('Infrastructure - Google Drive Source', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor (Credential Injection)', () => {
    
    it('should detect a File Path and use keyFile', () => {
      new GoogleDriveSource('./credentials.json');
      
      expect(mockAuthConstructor).toHaveBeenCalledWith(expect.objectContaining({
        keyFile: './credentials.json'
      }));
    });

    it('should detect a JSON String and use credentials object', () => {
      const fakeJson = '{"type": "service_account", "project_id": "test"}';
      new GoogleDriveSource(fakeJson);
      
      expect(mockAuthConstructor).toHaveBeenCalledWith(expect.objectContaining({
        credentials: { type: "service_account", project_id: "test" }
      }));
    });

    it('should throw error on invalid JSON string', () => {
      const badJson = '{ "broken": ... ';
      expect(() => new GoogleDriveSource(badJson)).toThrow("Failed to parse");
    });
  });

  describe('List Files (Filtering)', () => {
    it('should filter out unsupported types (Images)', async () => {
      const source = new GoogleDriveSource('valid.json');
      
      // Mock Response
      mockList.mockResolvedValue({
        data: {
          files: [
            { id: '1', name: 'Contract.pdf', mimeType: 'application/pdf' },
            { id: '2', name: 'Notes.gdoc', mimeType: 'application/vnd.google-apps.document' },
            { id: '3', name: 'Scan.png', mimeType: 'image/png' } // Should be skipped
          ]
        }
      });

      const results = await source.listFiles('folder-123');

      expect(results.length).toBe(2);
      expect(results.find(f => f.name === 'Scan.png')).toBeUndefined();
      expect(results.find(f => f.name === 'Contract.pdf')).toBeDefined();
    });
  });

  describe('Smart Download', () => {
    it('should use binary download (get) for PDFs', async () => {
      const source = new GoogleDriveSource('valid.json');
      
      // 1. Mock Metadata check
      mockGet.mockResolvedValueOnce({
        data: { mimeType: 'application/pdf', name: 'test.pdf' }
      });

      // 2. Mock Download
      mockGet.mockResolvedValueOnce({
        data: new ArrayBuffer(8)
      });

      await source.downloadFile('file-pdf');

      // Should call .get() with alt='media'
      expect(mockGet).toHaveBeenLastCalledWith(
        expect.objectContaining({ alt: 'media' }), 
        expect.anything()
      );
      // Should NOT call export
      expect(mockExport).not.toHaveBeenCalled();
    });

    it('should use export for Google Docs', async () => {
      const source = new GoogleDriveSource('valid.json');
      
      // 1. Mock Metadata check
      mockGet.mockResolvedValueOnce({
        data: { mimeType: 'application/vnd.google-apps.document', name: 'notes' }
      });

      // 2. Mock Export
      mockExport.mockResolvedValueOnce({
        data: new ArrayBuffer(8)
      });

      await source.downloadFile('file-gdoc');

      // Should call .export() with pdf mimeType
      expect(mockExport).toHaveBeenCalledWith(
        expect.objectContaining({ 
            fileId: 'file-gdoc',
            mimeType: 'application/pdf' 
        }), 
        expect.anything()
      );
    });
  });
});