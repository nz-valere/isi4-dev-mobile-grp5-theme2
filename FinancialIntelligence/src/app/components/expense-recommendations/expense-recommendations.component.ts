import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExpenseAnalyzerService } from '../../services/expense-analyzer.service';
import { ExpenseSuggestionsService } from '../../services/expense-suggestions.service';
import { FinanceService } from '../../services/finance.service';
import { ExpenseAnalysis } from '../../models/expense-level.model';

@Component({
  selector: 'app-expense-recommendations',
  templateUrl: './expense-recommendations.component.html',
  styleUrls: ['./expense-recommendations.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ExpenseRecommendationsComponent implements OnInit {
  analysis?: ExpenseAnalysis;
  suggestions: string[] = [];
  shouldShow = false;

  constructor(
    private expenseAnalyzer: ExpenseAnalyzerService,
    private expenseSuggestions: ExpenseSuggestionsService,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    this.checkAndShowRecommendations();
  }

  private checkAndShowRecommendations() {
    const today = new Date();
    const isStartOfMonth = today.getDate() <= 5;
    
    if (isStartOfMonth) {
      this.financeService.getTransactions().subscribe(transactions => {
        this.analysis = this.expenseAnalyzer.analyzeExpenses(transactions);
        this.suggestions = this.expenseSuggestions.getSuggestions(this.analysis.level);
        this.shouldShow = true;
      });
    }
  }

  getLevelColor(): string {
    switch (this.analysis?.level) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'Important': return 'danger';
      default: return 'medium';
    }
  }

  dismiss() {
    this.shouldShow = false;
  }
}