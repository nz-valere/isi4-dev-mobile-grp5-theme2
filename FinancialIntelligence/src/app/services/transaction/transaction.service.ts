import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: Transaction[] = [];

  addTransaction(transaction: Transaction) {
    transaction.id = this.generateId();
    this.transactions.push(transaction);
  }

  calculateTotal(type: 'income' | 'expense'): number {
    return this.transactions
      .filter((t) => t.type === type)
      .reduce((total, t) => total + t.amount, 0);
  }

  calculateMonthlyAverage(type: 'income' | 'expense'): number {
    const filteredTransactions = this.transactions.filter((t) => t.type === type);
    // Calculate monthly average here based on filteredTransactions
    return 0; // placeholder
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
