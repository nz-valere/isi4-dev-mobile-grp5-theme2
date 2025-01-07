import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private readonly CLIENT_ID = ''; // À remplir avec votre Client ID Google
  private readonly API_KEY = ''; // À remplir avec votre API Key Google
  private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.file';

  constructor(private http: HttpClient) {
    this.loadGapiScript();
  }

  private loadGapiScript(): void {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => this.initializeGapiClient();
    document.body.appendChild(script);
  }

  private async initializeGapiClient(): Promise<void> {
    await new Promise<void>((resolve) => (window as any).gapi.load('client', resolve));
    await (window as any).gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });
  }
  async authenticate(): Promise<void> {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: () => {},
    });
    return new Promise((resolve, reject) => {
      client.callback = (resp: { error: undefined; }) => {
        if (resp.error !== undefined) {
          reject(resp);
        }
        resolve();
      };
      client.requestAccessToken();
    });
  }
  async exportToGoogleDrive(data: any, filename: string): Promise<string> {
    try {
      await this.authenticate();
      
      const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const metadata = {
        name: filename,
        mimeType: 'application/json',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await (window as any).gapi.client.drive.files.create({
        resource: metadata,
        media: {
          mimeType: 'application/json',
          body: file,
        },
      });

      return response.result.id;
    } catch (error) {
      console.error('Erreur lors de l\'export vers Google Drive:', error);
      throw error;
    }
  }}