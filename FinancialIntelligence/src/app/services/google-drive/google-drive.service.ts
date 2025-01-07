import { Injectable } from '@angular/core';
import { GoogleDriveAuthService } from './google-drive-auth.service';
import { GoogleDriveFileService } from './google-drive-file.service';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  constructor(
    private authService: GoogleDriveAuthService,
    private fileService: GoogleDriveFileService
  ) {}

  async exportToGoogleDrive(data: Transaction[], filename: string): Promise<string> {
    try {
      return await this.fileService.uploadFile(data, filename);
    } catch (error) {
      console.error('Erreur lors de l\'export vers Google Drive:', error);
      throw error;
    }
  }

  async getLatestData(lastSync: number): Promise<{ 
    transactions: Transaction[]; 
    timestamp: number; 
  } | null> {
    try {
      const result = await this.fileService.getLatestFile();
      
      if (!result || result.timestamp <= lastSync) {
        return null;
      }

      return {
        transactions: result.data,
        timestamp: result.timestamp
      };
    } catch (error) {
      console.error('Erreur lors de la récupération depuis Google Drive:', error);
      throw error;
    }
  }
}