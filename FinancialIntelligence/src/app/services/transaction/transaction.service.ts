import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})

export class TransactionService extends Dexie {
  transactions!: Table<Transaction, number>;
  getDailyExpenses: any;


  constructor() {
    super('FinancialIntelligenceDB');
    this.version(1).stores({
      transactions: '++id, type, date, amount', // Define indexes
    });
    this.transactions = this.table('transactions');
  }

  // Initialize storage
  async init(): Promise<void> {
    const count = await this.transactions.count();
    if (count === 0) {
      console.log('Initializing sample data...');
    }
  }

  async addTransaction(transaction: Transaction): Promise<number | null> {
    try {
      // Use a custom unique check (e.g., based on type, date, and amount)
      const existingTransaction = await this.transactions
        .where({ type: transaction.type, date: transaction.date, amount: transaction.amount })
        .first();
  
      if (existingTransaction) {
        console.warn('Transaction already exists:', existingTransaction);
        return null; // Return null if a duplicate is detected
      }
  
      // Add the transaction if no duplicate is found
      return await this.transactions.add(transaction);
    } catch (error) {
      // Narrow the type of `error` to `Error` if possible
      if (error instanceof Dexie.ConstraintError) {
        console.error('ConstraintError: Duplicate key detected', error.message);
      } else if (error instanceof Error) {
        console.error('Error adding transaction:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return null; // Return null to indicate failure
    }
  }
  

  // Fetch all transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactions.toArray();
  }

  // Get transactions filtered by type
  async getTransactionsByType(type: string): Promise<Transaction[]> {
    return this.transactions.where('type').equals(type).toArray();
  }

  // Calculate the total amount for transactions of a specific type
  async calculateTotal(type: string): Promise<number> {
    const transactions = await this.getTransactionsByType(type);
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  // Calculate the monthly average for transactions of a specific type
  async calculateMonthlyAverage(type: string): Promise<number> {
    const transactions = await this.getTransactionsByType(type);
    const now = new Date();
    const currentMonth = now.getMonth();

    const monthlyTransactions = transactions.filter(
      (t) => new Date(t.date).getMonth() === currentMonth
    );

    const total = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    return monthlyTransactions.length > 0 ? total / monthlyTransactions.length : 0;
  }


}

