import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import { Chart, CategoryScale,
BarController,
LinearScale,
BarElement,
Title,
Tooltip,
Legend } from 'chart.js/auto';

import { GraphComponent } from 'src/app/component/graph/graph.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  weeklyData: number[] = [];
  weeklyLabels: string[] = [];
  dailyData: number[] = [];
  dailyLabels: string[] = [];
  chartData: number[] = [];
  chartLabels: string[] = [];

  @ViewChild('barChart') barChart!: ElementRef;
  mode: 'daily' | 'weekly' = 'weekly'; // Track the current mode

  constructor(private transactionService: TransactionService) {     
    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  }

  async ngOnInit() {
    await this.loadWeeklyData();
    await this.loadDailyData();
  }

  async loadWeeklyData() {
    const data = await this.transactionService.getWeeklyData();
    this.weeklyData = data.map(d => d.amount);
    this.weeklyLabels = data.map(d => `Week ${d.week}`);
    if (this.mode === 'weekly') {
      this.chartData = this.weeklyData;
      this.chartLabels = this.weeklyLabels;
    }
  }

  async loadDailyData() {
    const data = await this.transactionService.getDailyData();
    this.dailyData = data.map(d => d.amount);
    this.dailyLabels = data.map(d => d.hour);
    if (this.mode === 'daily') {
      this.chartData = this.dailyData;
      this.chartLabels = this.dailyLabels;
    }
  }

  toggleMode() {
    if (this.mode === 'daily') {
      this.mode = 'weekly';
      this.loadWeeklyData();
    } else {
      this.mode = 'daily';
      this.loadDailyData();
    }
    console.log(this.mode);
    
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
