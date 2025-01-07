import { Injectable } from '@angular/core';
import { GOOGLE_DRIVE_CONFIG } from './google-drive.config';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveAuthService {
  private gapiInitialized = false;

  async initializeGapi(): Promise<void> {
    if (this.gapiInitialized) return;

    await new Promise<void>((resolve) => (window as any).gapi.load('client', resolve));
    await (window as any).gapi.client.init({
      apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
      discoveryDocs: [GOOGLE_DRIVE_CONFIG.DISCOVERY_DOC],
    });
    
    this.gapiInitialized = true;
  }
  async authenticate(): Promise<void> {
    await this.initializeGapi();
    
    return new Promise((resolve, reject) => {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_DRIVE_CONFIG.CLIENT_ID,
        scope: GOOGLE_DRIVE_CONFIG.SCOPES,
        callback: (response: { error: any; }) => {
          if (response.error) {
            reject(response);
          } else {
            resolve();
          }
        },
      });
      
      client.requestAccessToken();
    });  }
}