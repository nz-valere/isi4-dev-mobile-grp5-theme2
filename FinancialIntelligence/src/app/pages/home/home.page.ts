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
    this.transactions = await this.transactionService.getAllTransactions();
    await this.transactionService.init();
    this.fetchSummary();

  }

  fetchSummary() {
      this.transactionService.init().then(() => {
        this.transactionService.calculateTotal('income').then(res => this.totalIncome = res);
        this.transactionService.calculateTotal('expense').then(res => this.totalExpenses = res);
        this.transactionService.calculateMonthlyAverage('expense').then(res => this.averageExpenses = res);
        this.recommendation = this.recommendationService.getMonthlyRecommendation(this.totalExpenses);
      })
  }
}
