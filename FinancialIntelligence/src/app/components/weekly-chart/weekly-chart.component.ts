import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ChartService } from '../../services/chart.service';
import { FinanceService } from '../../services/finance.service';
import { formatWeekDate } from '../../utils/date.utils';
import { Transaction } from 'src/app/models/transaction.model';

Chart.register(...registerables);

@Component({
  selector: 'app-weekly-chart',
  templateUrl: './weekly-chart.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class WeeklyChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart<'doughnut', number[], string> | undefined;
  selectedDate = new Date();

  constructor(
    private chartService: ChartService,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Attendez que la vue soit complètement initialisée avant d'appeler initChart
    if (this.chartCanvas && this.chartCanvas.nativeElement) {
      this.initChart();
    }
  }

  private loadData() {
    this.financeService.getTransactions().subscribe((transactions) => {
      this.updateChart(transactions);
    });
  }

  private initChart(): void {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chartConfig: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels: ['Entrées', 'Sorties', 'Crédits', 'Prêts', 'Épargne'],
        datasets: [{
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            '#2dd36f',
            '#eb445a',
            '#3880ff',
            '#ffc409',
            '#5260ff'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            display: true
          }
        },
        animation: false
      }
    };

    this.chart = new Chart(ctx, chartConfig);
  }

  updateChart(transactions: Transaction[]) {
    // Vérifiez si le graphique existe, sinon initialisez-le
    if (!this.chart) {
      this.initChart();
    }

    const data = this.chartService.getWeeklyData(transactions, this.selectedDate);

    // Assurez-vous que le graphique et ses datasets sont valides avant de tenter de les mettre à jour
    if (this.chart && this.chart.data.datasets?.[0]) {
      this.chart.data.datasets[0].data = [
        data.datasets[0]?.data[0] ?? 0,
        data.datasets[0]?.data[1] ?? 0,
        data.datasets[0]?.data[2] ?? 0,
        data.datasets[0]?.data[3] ?? 0,
        data.datasets[0]?.data[4] ?? 0,
      ];
      this.chart.update();
    }
  }

  previousWeek() {
    this.selectedDate = new Date(
      this.selectedDate.setDate(this.selectedDate.getDate() - 7)
    );
    this.loadData();
  }

  nextWeek() {
    this.selectedDate = new Date(
      this.selectedDate.setDate(this.selectedDate.getDate() + 7)
    );
    this.loadData();
  }

  getCurrentWeek(): string {
    return formatWeekDate(this.selectedDate);
  }
}
