import { Injectable } from '@angular/core';
import { GoogleDriveAuthService } from './google-drive-auth.service';
import { GOOGLE_DRIVE_CONFIG } from './google-drive.config';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveFileService {
  private gapiInitialized = false;

  constructor(private authService: GoogleDriveAuthService) {}

  private async initializeGapi(): Promise<void> {
    if (this.gapiInitialized) return;

    await new Promise<void>(resolve => (window as any).gapi.load('client', resolve));
    await (window as any).gapi.client.load('drive', 'v3');
    await (window as any).gapi.client.init({
      apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
      discoveryDocs: [GOOGLE_DRIVE_CONFIG.DISCOVERY_DOC],
    });

    this.gapiInitialized = true;
  }

  async uploadFile(data: any, filename: string): Promise<string> {
    await this.authService.authenticate();
    await this.initializeGapi();

    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const metadata = { name: filename, mimeType: 'application/json' };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await (window as any).gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart' },
      body: form
    });

    return response.result.id;
  }
  async getLatestFile(): Promise<{ data: any; timestamp: number } | null> {
    await this.authService.authenticate();
    await this.initializeGapi();

    const response = await (window as any).gapi.client.drive.files.list({
      q: "mimeType='application/json'",
      orderBy: 'modifiedTime desc',
      pageSize: 1,
      fields: 'files(id, name, modifiedTime)'
    });

    const file = response.result.files?.[0];
    if (!file?.id) return null;

    const fileData = await this.downloadFile(file.id);

    return {
      data: fileData,
      timestamp: new Date(file.modifiedTime || '').getTime()
    };
  }
  private async downloadFile(fileId: string): Promise<any> {
    const response = await (window as any).gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });

    return JSON.parse(response.body);
  }
}