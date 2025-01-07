import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private toastCtrl: ToastController) {}

  async handleError(error: any, message: string = 'Une erreur est survenue'): Promise<void> {
    console.error('Error:', error);
    
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    
    await toast.present();
  }
}