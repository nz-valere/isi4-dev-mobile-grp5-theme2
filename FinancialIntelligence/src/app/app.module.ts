import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { App } from './app.component';

@NgModule({
  imports: [
    IonicStorageModule.forRoot({
      name: 'finance_db',
      driverOrder: ['indexeddb', 'localstorage']
    })
  ]
})
export class AppModule {
  /// <reference types="@types/google.maps" />

}