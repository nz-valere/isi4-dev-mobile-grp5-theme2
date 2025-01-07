import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { Transaction } from '../models/transaction.model';
import { NetworkService } from './network.service';
import { ErrorHandlerService } from './error-handler.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private syncStatus = new BehaviorSubject<'syncing' | 'synced' | 'error'>('synced');

  constructor(
    private storage: StorageService,
    private googleDrive: GoogleDriveService,
    private network: NetworkService,
    private errorHandler: ErrorHandlerService,
    private loading: LoadingService
  ) {
    this.setupAutoSync();
  }

  private setupAutoSync() {
    this.network.onConnect().subscribe(() => {
      this.syncPendingTransactions();
    });
  }

  async loadTransactions(): Promise<Transaction[]> {
    return this.storage.getTransactions();
  }

  getOnlineStatus(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      observer.next(this.network.isOnline());
    });
  }
  private async syncPendingTransactions() {
    if (!this.network.isOnline()) return;

    try {
      this.syncStatus.next('syncing');
      await this.loading.show('Synchronisation en cours...');
      
      const pendingIds = await this.storage.getPendingSyncTransactions();
      if (pendingIds.length === 0) {
        this.syncStatus.next('synced');
        await this.loading.hide();
        return;
      }

      const transactions = await this.storage.getTransactions();
      const pendingTransactions = transactions.filter(t => pendingIds.includes(t.id));

      const filename = `finance_data_${Date.now()}.json`;
      await this.googleDrive.exportToGoogleDrive(pendingTransactions, filename);
      
      await this.storage.markAsSynced(pendingIds);
      this.syncStatus.next('synced');
    } catch (error) {
      this.syncStatus.next('error');
      await this.errorHandler.handleError(error, 'Erreur de synchronisation');
    } finally {
      await this.loading.hide();
    }
  }

  getSyncStatus(): Observable<'syncing' | 'synced' | 'error'> {
    return this.syncStatus.asObservable();
  }

  async addTransaction(transaction: Transaction): Promise<void> {
    try {
      await this.storage.saveTransaction(transaction);
      if (this.network.isOnline()) {
        await this.syncPendingTransactions();
      }
    } catch (error) {
      await this.errorHandler.handleError(error, 'Erreur lors de l\'ajout de la transaction');
      throw error;
    }
  }

  setSyncStatus(status: 'syncing' | 'synced' | 'error') {
    this.syncStatus.next(status);
  }

  synncPendingTransactions() {
    if (this.network.isOnline()) {
      this.syncPendingTransactions();
    }
  }
  sync() {
    if (this.network.isOnline()) {
      this.syncPendingTransactions();
    }
  }

  refresh() {
    this.syncPendingTransactions();
  }
}