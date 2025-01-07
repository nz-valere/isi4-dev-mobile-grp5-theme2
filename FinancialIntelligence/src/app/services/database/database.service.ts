import { Injectable } from '@angular/core';
import initSqlJs, { Database, SqlJsStatic, SqlValue } from 'sql.js';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private db: Database | null = null;
  private sqlJsInstance: SqlJsStatic | null = null;

  async initDatabase(): Promise<void> {
    if (!this.db) {
      if (!this.sqlJsInstance) {
        this.sqlJsInstance = await initSqlJs({
          locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
        });
      }

      this.db = new this.sqlJsInstance.Database();
      await this.createTables();
    }
  }

  private async createTables(): Promise<void> {
    this.db?.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        contact TEXT,
        loanPercentagePaid REAL,
        synced INTEGER DEFAULT 0
      );
    `);
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    await this.initDatabase();

    const stmt = this.db?.prepare(`
      INSERT OR REPLACE INTO transactions (
        id, type, amount, date, description, contact, loanPercentagePaid, synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `);

    stmt?.run([
      transaction.id,
      transaction.type,
      transaction.amount,
      transaction.date.toISOString(),
      transaction.description,
      transaction.contact || null,
      transaction.loanPercentagePaid || null,
    ]);
    stmt?.free();

    this.backupToLocalStorage();
  }

  async getTransactions(): Promise<Transaction[]> {
    await this.initDatabase();

    const result = this.db?.exec(`SELECT * FROM transactions ORDER BY date DESC`);
    if (!result?.[0]?.values) {
      return this.getBackupFromLocalStorage();
    }

    return result[0].values.map((row: SqlValue[]) => ({
      id: row[0] as string,
      type: row[1] as Transaction['type'],
      amount: row[2] as number,
      date: new Date(row[3] as string),
      description: row[4] as string,
      contact: row[5] as string | undefined,
      loanPercentagePaid: row[6] as number | undefined,
      needsSync: row[7] === 0,
    }));
  }
  private backupToLocalStorage(): void {
    const transactions = this.db?.exec(`SELECT * FROM transactions`);
    if (transactions?.[0]?.values) {
      localStorage.setItem('transactions_backup', JSON.stringify(transactions[0].values));
    }
  }

  private getBackupFromLocalStorage(): Transaction[] {
    const backup = localStorage.getItem('transactions_backup');
    if (!backup) return [];

    try {
      const data = JSON.parse(backup);
      return data.map((row: any[]) => ({
        id: row[0],
        type: row[1],
        amount: row[2],
        date: new Date(row[3]),
        description: row[4],
        contact: row[5],
        loanPercentagePaid: row[6],
      }));
    } catch {
      return [];
    }
  }

  async getUnsyncedTransactions(): Promise<Transaction[]> {
    await this.initDatabase();

    const result = this.db?.exec(`SELECT * FROM transactions WHERE synced = 0`);
    if (!result?.[0]?.values) return [];

    return result[0].values.map((row: SqlValue[]) => ({
      id: row[0] as string,
      type: row[1] as Transaction['type'],
      amount: row[2] as number,
      date: new Date(row[3] as string),
      description: row[4] as string,
      contact: row[5] as string | undefined,
      loanPercentagePaid: row[6] as number | undefined,
      needsSync: row[7] === 0,
    }));
  }

  async markAsSynced(ids: string[]): Promise<void> {
    await this.initDatabase();

    const placeholders = ids.map(() => '?').join(',');
    const stmt = this.db?.prepare(`
      UPDATE transactions SET synced = 1 
      WHERE id IN (${placeholders})
    `);

    stmt?.run(ids);
    stmt?.free();

    this.backupToLocalStorage();
  }
}
