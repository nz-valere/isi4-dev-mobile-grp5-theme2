import { Inject, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private dbInstance: SQLiteObject | null = null;
  private readonly dbName = 'FinancialIntelligenceDB.db';
  private readonly tableName = 'transactions';

  constructor(@Inject(SQLite) private sqlite: SQLite, private platform: Platform) {
    this.initDB();
  }

  // Initialize the SQLite database
  private async initDB(): Promise<void> {
    try {
      await this.platform.ready();
      const db = await this.sqlite.create({
        name: this.dbName,
        location: 'default',
      });
      this.dbInstance = db;
      await this.createTable();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  // Create the transactions table if it doesn't exist
  private async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        date TEXT,
        amount REAL
      )`;
    await this.executeSql(query, []);
  }

  // Helper function to execute SQL queries
  private async executeSql(query: string, params: any[]): Promise<any> {
    if (!this.dbInstance) throw new Error('Database not initialized.');
    return this.dbInstance.executeSql(query, params);
  }

  // Add a new transaction
  async addTransaction(transaction: Transaction): Promise<number | null> {
    try {
      const query = `
        INSERT INTO ${this.tableName} (type, date, amount)
        VALUES (?, ?, ?)`;
      const result = await this.executeSql(query, [
        transaction.type,
        transaction.date,
        transaction.amount,
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  }

  // Get all transactions
  async getAllTransactions(): Promise<Transaction[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await this.executeSql(query, []);
    const transactions: Transaction[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      transactions.push(result.rows.item(i));
    }
    return transactions;
  }

  // Get transactions by type
  async getTransactionsByType(type: string): Promise<Transaction[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE type = ?`;
    const result = await this.executeSql(query, [type]);
    const transactions: Transaction[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      transactions.push(result.rows.item(i));
    }
    return transactions;
  }

  // Get a transaction by ID
  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const result = await this.executeSql(query, [id]);
    return result.rows.length > 0 ? result.rows.item(0) : undefined;
  }

  // Update a transaction
  async updateTransaction(transaction: Transaction): Promise<void> {
    const query = `
      UPDATE ${this.tableName}
      SET type = ?, date = ?, amount = ?
      WHERE id = ?`;
    await this.executeSql(query, [
      transaction.type,
      transaction.date,
      transaction.amount,
      transaction.id,
    ]);
  }

  // Delete a transaction
  async deleteTransaction(id: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await this.executeSql(query, [id]);
  }

  // Calculate the total amount for transactions of a specific type
  async calculateTotal(type: string): Promise<number> {
    const query = `
      SELECT SUM(amount) AS total
      FROM ${this.tableName}
      WHERE type = ?`;
    const result = await this.executeSql(query, [type]);
    return result.rows.item(0)?.total || 0;
  }

  // Calculate the monthly average for transactions of a specific type
  async calculateMonthlyAverage(type: string): Promise<number> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const query = `
      SELECT AVG(amount) AS average
      FROM ${this.tableName}
      WHERE type = ? AND strftime('%Y', date) = ? AND strftime('%m', date) = ?`;
    const result = await this.executeSql(query, [
      type,
      currentYear.toString(),
      currentMonth.toString().padStart(2, '0'),
    ]);
    return result.rows.item(0)?.average || 0;
  }

  // Get weekly expenses grouped by week
  async getWeeklyExpenses(): Promise<{ week: number; amount: number }[]> {
    const query = `
      SELECT strftime('%W', date) AS week, SUM(amount) AS amount
      FROM ${this.tableName}
      WHERE type = 'expense'
      GROUP BY week
      ORDER BY week ASC;
    `;
    try {
      const result = await this.executeSql(query, []);
      const weeklyExpenses: { week: number; amount: number }[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        weeklyExpenses.push({
          week: parseInt(row.week, 10),
          amount: row.amount,
        });
      }
      return weeklyExpenses;
    } catch (error) {
      console.error('Error fetching weekly expenses:', error);
      return [];
    }
  }

  // Get daily expenses grouped by hour
  async getDailyExpenses(): Promise<{ hour: string; amount: number }[]> {
    const query = `
      SELECT strftime('%H', date) AS hour, SUM(amount) AS amount
      FROM ${this.tableName}
      WHERE type = 'expense'
      AND date >= date('now', 'start of day')
      GROUP BY hour
      ORDER BY hour ASC;
    `;
    try {
      const result = await this.executeSql(query, []);
      const dailyExpenses: { hour: string; amount: number }[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        dailyExpenses.push({
          hour: row.hour,
          amount: row.amount,
        });
      }
      return dailyExpenses;
    } catch (error) {
      console.error('Error fetching daily expenses:', error);
      return [];
    }
  }

}
