import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { SyncService } from './sync.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private transactions = new BehaviorSubject<Transaction[]>([]);
  
  constructor(private syncService: SyncService) {
    this.loadTransactions();
  }

  private async loadTransactions() {
    try {
      const transactions = await this.syncService.loadTransactions();
      this.transactions.next(transactions);
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    }
  }

  async addTransaction(transaction: Transaction) {
    try {
      await this.syncService.addTransaction(transaction);
      const currentTransactions = this.transactions.value;
      this.transactions.next([...currentTransactions, transaction]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
      throw error;
    }
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions.asObservable();
  }

  getSyncStatus(): Observable<'syncing' | 'synced' | 'error'> {
    return this.syncService.getSyncStatus();
  }

  getOnlineStatus(): Observable<boolean> {
    return this.syncService.getOnlineStatus();
  }

  calculateLoanPercentage(contactName: string): number {
    const transactions = this.transactions.value;
    const loans = transactions.filter(t => 
      t.type === 'LOAN' && t.contact === contactName
    );
    const totalLoan = loans.reduce((sum, t) => sum + t.amount, 0);
    const repayments = transactions.filter(t => 
      t.type === 'INCOME' && 
      t.description.includes(`Remboursement - ${contactName}`)
    );
    const totalRepaid = repayments.reduce((sum, t) => sum + t.amount, 0);
    return totalLoan > 0 ? (totalRepaid / totalLoan) * 100 : 0;
  }
  async refresh() {
    try {
      await this.syncService.refresh();
      this.loadTransactions();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données:', error);
    }
  }
}