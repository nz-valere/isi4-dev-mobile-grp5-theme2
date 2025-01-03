import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables, CategoryScale,
  BarController,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss'],
    standalone: false
})
export class GraphComponent implements OnInit, AfterViewInit {

  
  @Input() chartData: number[] = []; // Data for the graph
  @Input() chartLabels: string[] = []; // Labels for the data
  @Input() chartType: 'line' | 'bar' | 'pie' = 'line'; // Chart type

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;

  constructor() {
    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
}

  ngOnInit() {}
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeChart();
    });  
  }

  initializeChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    if (!ctx) {
      console.error('Unable to get 2D context from chartCanvas.');
      return
    }
    
      this.chart = new Chart(ctx, {
        
        type: this.chartType, 
        data: {
          labels: this.chartLabels, // Ensure this is a string array
          datasets: [
            {
              label: 'Transactions Overview',
              data: this.chartData, // Ensure this is a number array
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
        },
      });
    
  }
  
}
