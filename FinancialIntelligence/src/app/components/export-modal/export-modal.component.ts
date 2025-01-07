import { Component } from '@angular/core';
import { IonicModule, ModalController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GoogleDriveService } from '../../services/google-drive.service';
import { FinanceService } from '../../services/finance.service';
import { NativeService } from '../../services/capacitor/native.service';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ExportModalComponent {
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private googleDriveService: GoogleDriveService,
    private financeService: FinanceService,
    private nativeService: NativeService
  ) {}

  async exportToGoogleDrive() {
    const loading = await this.loadingCtrl.create({
      message: 'Export en cours...'
    });
    await loading.present();

    try {
      const transactions = await this.financeService.getTransactions().toPromise();
      const filename = `finance_data_${new Date().toISOString()}.json`;
      
      await this.googleDriveService.exportToGoogleDrive(transactions, filename);
      
      await loading.dismiss();
      this.modalCtrl.dismiss();
      
      // Notification native
      await this.nativeService.scheduleNotification(
        'Export réussi',
        'Les données ont été exportées avec succès vers Google Drive',
        new Date()
      );

      // Retour haptique de succès
      await this.nativeService.vibrateDevice();
      
    } catch (error) {
      await loading.dismiss();
      
      // Notification native d'erreur
      await this.nativeService.scheduleNotification(
        'Erreur d\'export',
        'Une erreur est survenue lors de l\'export des données',
        new Date()
      );

      // Retour haptique d'erreur
      await this.nativeService.vibrateDevice();
    }
  }

  async shareData() {
    try {
      const transactions = await this.financeService.getTransactions().toPromise();
      const data = JSON.stringify(transactions, null, 2);
      
      await this.nativeService.shareContent(
        'Données financières',
        'Export de mes données financières',
        data
      );
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}