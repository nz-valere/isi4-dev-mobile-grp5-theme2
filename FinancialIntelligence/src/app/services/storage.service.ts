import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Transaction } from '../models/transaction.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly TRANSACTIONS_KEY = 'transactions';
  private readonly PENDING_SYNC_KEY = 'pending_sync';
  private _storage: Storage | null = null;
  private initialized = new BehaviorSubject<boolean>(false);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.initialized.next(true);
    await this.loadInitialData();
  }

  private async loadInitialData() {
    const transactions = await this.getTransactions();
    this.transactionsSubject.next(transactions);
  }

  watchTransactions(): Observable<Transaction[]> {
    return this.transactionsSubject.asObservable();
  }

  private async ensureInitialized() {
    if (!this.initialized.value) {
      await new Promise<void>((resolve) => {
        this.initialized.subscribe((initialized) => {
          if (initialized) resolve();
        });
      });
    }
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    await this.ensureInitialized();

    const transactions = await this.getTransactions();

    const updatedTransactions: Transaction[] = [
      ...transactions,
      { ...transaction, needsSync: true },
    ];

    await this._storage?.set(this.TRANSACTIONS_KEY, updatedTransactions);
    this.transactionsSubject.next(updatedTransactions);

    const pendingSync = await this.getPendingSyncTransactions();
    await this._storage?.set(this.PENDING_SYNC_KEY, [...pendingSync, transaction.id]);
  }

  async getTransactions(): Promise<Transaction[]> {
    await this.ensureInitialized();
    const transactions: any[] = (await this._storage?.get(this.TRANSACTIONS_KEY)) || [];
    return transactions.map((t) => ({
      ...t,
      date: new Date(t.date), // Conversion en Date
    })) as Transaction[];
  }

  async getPendingSyncTransactions(): Promise<string[]> {
    await this.ensureInitialized();
    return (await this._storage?.get(this.PENDING_SYNC_KEY)) || [];
  }

  async markAsSynced(transactionIds: string[]): Promise<void> {
    await this.ensureInitialized();

    const transactions = await this.getTransactions();
    const pendingSync = await this.getPendingSyncTransactions();

    const updatedTransactions: Transaction[] = transactions.map((t) => ({
      ...t,
      needsSync: !transactionIds.includes(t.id) && t.needsSync,
    }));

    const updatedPendingSync = pendingSync.filter((id) => !transactionIds.includes(id));

    await this._storage?.set(this.TRANSACTIONS_KEY, updatedTransactions);
    await this._storage?.set(this.PENDING_SYNC_KEY, updatedPendingSync);
    this.transactionsSubject.next(updatedTransactions);
  }

  async clearStorage(): Promise<void> {
    await this.ensureInitialized();
    await this._storage?.clear();
    this.transactionsSubject.next([]);
  }
}
