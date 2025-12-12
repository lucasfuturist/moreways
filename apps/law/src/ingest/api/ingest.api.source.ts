export interface FileMetadata {
  id: string;
  name: string;
  mimeType: string;
}

export interface IFileSource {
  /**
   * Lists all PDF files in a specific folder
   */
  listFiles(folderId: string): Promise<FileMetadata[]>;

  /**
   * Downloads the binary content of a file
   */
  downloadFile(fileId: string): Promise<Buffer>;
}