import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SummaryCardComponent } from '../summary-card/summary-card.component';

/**
 * Composant principal du tableau de bord
 * Affiche un résumé des transactions et des statistiques
 */
@Component({
  selector: 'app-dashboard-summary',
  templateUrl: './dashboard-summary.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, SummaryCardComponent]
})
export class DashboardSummaryComponent implements OnInit, OnDestroy {
  // Observable des données du tableau de bord
  summaryData$!: Observable<any>;
  
  // Subject pour gérer la désinscription des observables
  private destroy$ = new Subject<void>();
  
  // Message d'erreur éventuel
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    // Nettoyage des souscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Charge les données du tableau de bord
  private loadDashboardData() {
    this.summaryData$ = this.dashboardService.getDashboardSummary()
      .pipe(takeUntil(this.destroy$));
  }

  // Recharge les données en cas d'erreur
  async retryLoad() {
    this.error = null;
    this.loadDashboardData();
  }
}