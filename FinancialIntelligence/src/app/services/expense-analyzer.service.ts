import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { ExpenseAnalysis, ExpenseLevel } from '../models/expense-level.model';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ExpenseAnalyzerService {
  analyzeExpenses(transactions: Transaction[]): ExpenseAnalysis {
    const previousMonth = subMonths(new Date(), 1);
    const startDate = startOfMonth(previousMonth);
    const endDate = endOfMonth(previousMonth);

    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });

    const totalIncome = this.calculateTotalIncome(monthlyTransactions);
    const totalExpenses = this.calculateTotalExpenses(monthlyTransactions);
    const expensePercentage = (totalExpenses / totalIncome) * 100;

    return {
      level: this.determineExpenseLevel(expensePercentage),
      percentage: expensePercentage,
      recommendations: this.generateRecommendations(expensePercentage, monthlyTransactions)
    };
  }

  private calculateTotalIncome(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private calculateTotalExpenses(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private determineExpenseLevel(percentage: number): ExpenseLevel {
    if (percentage <= 30) return 'Low';
    if (percentage <= 60) return 'Medium';
    return 'Important';
  }

  private generateRecommendations(percentage: number, transactions: Transaction[]): string[] {
    const recommendations: string[] = [];

    if (percentage <= 30) {
      recommendations.push(
        'Excellent niveau de dépenses ! Continuez ainsi.',
        'Pensez à investir ou épargner l\'excédent.',
        'Vous pourriez augmenter votre épargne de précaution.'
      );
    } else if (percentage <= 60) {
      recommendations.push(
        'Niveau de dépenses correct mais restez vigilant.',
        'Identifiez les dépenses non essentielles.',
        'Établissez un budget mensuel plus précis.'
      );
    } else {
      recommendations.push(
        'Attention, vos dépenses sont élevées !',
        'Réduisez les dépenses non essentielles.',
        'Évitez les nouveaux crédits pour le moment.',
        'Consultez le détail de vos dépenses pour identifier les postes à optimiser.'
      );
    }

    return recommendations;
  }
}