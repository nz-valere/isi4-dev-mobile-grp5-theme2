import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction/transaction.service';
import { RecommendationService } from '../../services/recommendation/recommendation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  totalIncome = 0;
  totalExpenses = 0;
  averageExpenses = 0;
  recommendation = '';

  constructor(
    private transactionService: TransactionService,
    private recommendationService: RecommendationService
  ) {}

  ngOnInit() {
    this.fetchSummary();
  }

  fetchSummary() {
    // Fetch total income, expenses, and calculate averages and recommendations
    this.totalIncome = this.transactionService.calculateTotal('income');
    this.totalExpenses = this.transactionService.calculateTotal('expense');
    this.averageExpenses = this.transactionService.calculateMonthlyAverage('expense');
    // this.recommendation = this.recommendationService.getRecommendation(this.totalExpenses);
  }

}
