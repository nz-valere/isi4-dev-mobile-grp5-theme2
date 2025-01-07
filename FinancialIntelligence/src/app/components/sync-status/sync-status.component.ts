import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../services/finance.service';
import { NativeService } from '../../services/capacitor/native.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sync-status',
  templateUrl: './sync-status.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SyncStatusComponent implements OnInit, OnDestroy {
  syncStatus$ = this.financeService.getSyncStatus();
  isOnline$ = this.financeService.getOnlineStatus();
  private destroy$ = new Subject<void>();

  constructor(
    private financeService: FinanceService,
    private nativeService: NativeService
  ) {}

  ngOnInit() {
    // Surveiller le statut de synchronisation
    this.syncStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async status => {
        if (status === 'error') {
          await this.nativeService.vibrateDevice(); // Retour haptique pour les erreurs
          await this.nativeService.scheduleNotification(
            'Erreur de synchronisation',
            'La synchronisation des données a échoué',
            new Date()
          );
        } else if (status === 'synced') {
          await this.nativeService.scheduleNotification(
            'Synchronisation terminée',
            'Vos données sont à jour',
            new Date()
          );
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}