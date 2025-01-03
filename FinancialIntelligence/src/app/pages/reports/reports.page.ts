import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import {
  Chart,
  CategoryScale,
  BarController,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.page.html',
    styleUrls: ['./reports.page.scss'],
    standalone: false
})
export class ReportsPage implements OnInit {
  weeklyData: number[] = [];
  weeklyLabels: string[] = [];
  dailyData: number[] = [];
  dailyLabels: string[] = [];
  chartData: number[] = [];
  chartLabels: string[] = [];
  currentChart: Chart | null = null;

  @ViewChild('barChart', { static: false }) barChart!: ElementRef;
  mode: 'daily' | 'weekly' = 'weekly';

  constructor(private transactionService: TransactionService) {
    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  }

  async ngOnInit() {
    await this.loadWeeklyData();
    await this.loadDailyData();
    this.updateChart();
  }

  async loadWeeklyData() {
    try {
      const data = await this.transactionService.getWeeklyExpenses(); // Adjust method name if necessary
      this.weeklyData = data.map((d) => d.amount);
      this.weeklyLabels = data.map((d) => `Week ${d.week}`);
      if (this.mode === 'weekly') {
        this.chartData = this.weeklyData;
        this.chartLabels = this.weeklyLabels;
      }
    } catch (error) {
      console.error('Error loading weekly data:', error);
    }
  }

  async loadDailyData() {
    try {
      const data = await this.transactionService.getDailyExpenses(); // Adjust method name if necessary
      this.dailyData = data.map((d) => d.amount);
      this.dailyLabels = data.map((d) => d.hour);
      if (this.mode === 'daily') {
        this.chartData = this.dailyData;
        this.chartLabels = this.dailyLabels;
      }
    } catch (error) {
      console.error('Error loading daily data:', error);
    }
  }

  toggleMode() {
    this.mode = this.mode === 'daily' ? 'weekly' : 'daily';
    this.chartData = this.mode === 'daily' ? this.dailyData : this.weeklyData;
    this.chartLabels = this.mode === 'daily' ? this.dailyLabels : this.weeklyLabels;
    this.updateChart();
  }

  updateChart() {
    if (this.currentChart) {
      this.currentChart.destroy(); // Destroy the existing chart to avoid overlapping
    }

    this.currentChart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.mode === 'daily' ? 'Daily Expenses' : 'Weekly Expenses',
            data: this.chartData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }
}
