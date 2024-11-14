import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements AfterViewInit {
  @ViewChild('barChart') barChart!: ElementRef;

  constructor(private transactionService: TransactionService) { }

  ngAfterViewInit() {
    this.createBarChart();
  }

  createBarChart() {
    const expenses = this.transactionService.getDailyExpenses();
    const days = Object.keys(expenses);
    const amounts = Object.values(expenses);

    new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Daily Expenses',
            data: amounts,
          },
        ],
      },
    });
  }
}
