import { Injectable } from '@angular/core';
import { FinanceService } from './finance.service';
import { map } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';
import { 
  startOfDay, 
  startOfWeek, 
  startOfMonth, 
  startOfYear,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear
} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private financeService: FinanceService) {}

  getDashboardSummary() {
    return this.financeService.getTransactions().pipe(
      map(transactions => ({
        daily: this.calculatePeriodTotals(transactions, startOfDay(new Date()), endOfDay(new Date())),
        weekly: this.calculatePeriodTotals(transactions, startOfWeek(new Date()), endOfWeek(new Date())),
        monthly: this.calculatePeriodTotals(transactions, startOfMonth(new Date()), endOfMonth(new Date())),
        yearly: this.calculatePeriodTotals(transactions, startOfYear(new Date()), endOfYear(new Date())),
        currentMonthAverages: this.calculateCurrentMonthAverages(transactions)
      }))
    );
  }

  private calculatePeriodTotals(transactions: Transaction[], start: Date, end: Date) {
    const periodTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    });

    return {
      income: this.sumByType(periodTransactions, 'INCOME'),
      expense: this.sumByType(periodTransactions, 'EXPENSE'),
      loan: this.sumByType(periodTransactions, 'LOAN'),
      credit: this.sumByType(periodTransactions, 'CREDIT'),
      savings: this.sumByType(periodTransactions, 'SAVINGS')
    };
  }

  private calculateCurrentMonthAverages(transactions: Transaction[]) {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    });

    const expenses = this.sumByType(monthTransactions, 'EXPENSE');
    const income = this.sumByType(monthTransactions, 'INCOME');
    const daysInMonth = new Date(end).getDate();

    return {
      expenses: expenses / daysInMonth,
      income: income / daysInMonth
    };
  }

  private sumByType(transactions: Transaction[], type: Transaction['type']): number {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  }
}