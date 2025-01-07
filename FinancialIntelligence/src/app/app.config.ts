import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(),
    provideAnimations(),
    Storage,
    {
      provide: 'STORAGE_CONFIG',
      useValue: {
        name: 'finance_db',
        driverOrder: ['indexeddb', 'localstorage']
      }
    }
  ]
};