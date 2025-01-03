import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction/transaction.service';
import { RecommendationService } from '../../services/recommendation/recommendation.service';
import { Transaction } from 'src/app/models/transaction.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  transactions: Transaction[] = [];
  totalIncome = 0;
  totalExpenses = 0;
  averageExpenses = 0;
  recommendation = '';

  constructor(
    private transactionService: TransactionService,
    private recommendationService: RecommendationService
  ) {}

  async ngOnInit() {
    try {
      this.transactions = await this.transactionService.getAllTransactions();
      console.log('Transactions fetched:', this.transactions);
      await this.fetchSummary();
    } catch (error) {
      console.error('Error initializing HomePage:', error);
    }
  }

  async fetchSummary() {
    try {
      this.totalIncome = await this.transactionService.calculateTotal('income');
      this.totalExpenses = await this.transactionService.calculateTotal('expense');
      this.averageExpenses = await this.transactionService.calculateMonthlyAverage('expense');
      this.recommendation = this.recommendationService.getMonthlyRecommendation(this.totalExpenses);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }
}
