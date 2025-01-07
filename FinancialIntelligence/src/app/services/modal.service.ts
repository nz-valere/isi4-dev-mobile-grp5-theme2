import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionModalComponent } from '../components/transaction-modal/transaction-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalCtrl: ModalController) {}

  async showTransactionModal(type: string, title: string) {
    const modal = await this.modalCtrl.create({
      component: TransactionModalComponent,
      componentProps: {
        type,
        title
      }
    });

    return modal.present();
  }
}