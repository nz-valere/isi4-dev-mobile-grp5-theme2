import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ChartService } from '../../services/chart.service';
import { FinanceService } from '../../services/finance.service';
import { formatDayDate } from '../../utils/date.utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import 'chartjs-adapter-date-fns';


// Assurez-vous d'importer l'adaptateur de date
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-daily-chart',
  templateUrl: './daily-chart.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DailyChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined;
  selectedDate = new Date();
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private chartService: ChartService,
    private financeService: FinanceService
  ) {
    // Enregistrer les composants de Chart.js nécessaires
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadChartData();
  }

  ngAfterViewInit() {
    // Vérifiez si le canvas est bien disponible avant de charger les données
    setTimeout(() => {
      if (this.chartCanvas && this.chartCanvas.nativeElement) {
        this.loadChartData();
      }
    }, 0); // Utilisation de setTimeout pour s'assurer que la vue a été complètement rendue
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadChartData() {
    this.financeService.getTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          const data = this.chartService.getDailyData(transactions, this.selectedDate);
          this.updateChart(data);
          this.error = null;
        },
        error: (err) => {
          console.error('Error loading chart data:', err);
          this.error = 'Impossible de charger les données du graphique';
        }
      });
  }

  updateChart(data: any) {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) return; // Sécuriser l'accès à nativeElement

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy(); // Détruire l'ancien graphique pour éviter des conflits
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((dataset: any) => ({
          ...dataset,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            type: 'time', // Type de l'axe X
            time: {
              unit: 'hour'
            },
            display: true,
            title: {
              display: true,
              text: 'Heure'
            }
          },
          y: {
            type: 'linear',
            display: true,
            title: {
              display: true,
              text: 'Montant'
            },
            beginAtZero: true
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  previousDay() {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1));
    this.loadChartData();
  }

  nextDay() {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + 1));
    this.loadChartData();
  }

  getCurrentDay(): string {
    return formatDayDate(this.selectedDate);
  }
}
