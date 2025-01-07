import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

// Components
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';

// Services
import { NativeService } from './services/capacitor/native.service';
import { FinanceService } from './services/finance.service';
import { StorageService } from './services/storage.service';
import { HomePage } from "./pages/home/home.page";
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    IonicModule,
    HomePage,
],
providers: [ModalService],
})
export class App implements OnInit {
  // Menu items for the side menu
  appPages = [
    { title: 'Tableau de bord', url: '/home', icon: 'home' },
    { title: 'Transactions', url: '/transactions', icon: 'list' },
    { title: 'Statistiques', url: '/stats', icon: 'stats-chart' },
    { title: 'Paramètres', url: '/settings', icon: 'settings' }
  ];

  constructor(
    private platform: Platform,
    private nativeService: NativeService,
    private financeService: FinanceService,
    private storageService: StorageService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // Initialize storage and load initial data
    this.storageService.init();
  }

  private async initializeApp() {
    await this.platform.ready();
    
    if (this.platform.is('capacitor')) {
      await this.initializeNativeFeatures();
    }

    // Handle back button
    this.setupBackButtonHandler();
  }

  private async initializeNativeFeatures() {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#3880ff' });

      await SplashScreen.hide({
        fadeOutDuration: 500
      });

      // Utiliser des méthodes publiques à la place
      await this.nativeService.initialize();
    } catch (error) {
      console.error('Error initializing native features:', error);
    }
  }

  private setupBackButtonHandler() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (window.location.pathname === '/home') {
        CapacitorApp.exitApp();
      }
    });
  }

  // Method to handle refreshing data
  async refreshData() {
    try {
      await this.financeService.refresh();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }

  // Method to handle dark mode toggle
  toggleDarkMode(event: any) {
    document.body.classList.toggle('dark', event.detail.checked);
  }
}