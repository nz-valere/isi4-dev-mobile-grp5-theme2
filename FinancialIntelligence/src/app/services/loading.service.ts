import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading?: HTMLIonLoadingElement;

  constructor(private loadingCtrl: LoadingController) {}

  async show(message: string = 'Chargement...'): Promise<void> {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: 'circular'
    });
    await this.loading.present();
  }

  async hide(): Promise<void> {
    await this.loading?.dismiss();
    this.loading = undefined;
  }
}