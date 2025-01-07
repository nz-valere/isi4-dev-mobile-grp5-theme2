import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Device } from '@capacitor/device';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { PushNotifications } from '@capacitor/push-notifications';
import { Share } from '@capacitor/share';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class NativeService {
  constructor() {
    this.initializeApp();
  }

  initialize() {
    this.initializeApp();
  }

  // Initialise toutes les fonctionnalités natives de l'app
  private async initializeApp() {
    if (Capacitor.isNativePlatform()) {
      await this.initializePushNotifications();
      await this.setupStatusBar();
      await this.registerAppListeners();
    }
  }

  // Configure les notifications push
  private async initializePushNotifications() {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === 'granted') {
      await PushNotifications.register();
    }
  }

  // Configure la barre de statut pour un look cohérent
  private async setupStatusBar() {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#3880ff' });
  }

  // Gère les événements de l'app (mise en arrière-plan, etc.)
  private async registerAppListeners() {
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('État de l\'app modifié. Active ?', isActive);
    });
    App.addListener('backButton', () => {
      console.log('Bouton retour pressé');
    });
  }

  // Ouvre l'appareil photo et retourne l'image
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    return image;
  }

  // Planifie une notification locale
  async scheduleNotification(title: string, body: string, schedule: Date) {
    await LocalNotifications.schedule({
      notifications: [{
        title,
        body,
        id: new Date().getTime(),
        schedule: { at: schedule },
        sound: 'default',
        attachments: [],
        actionTypeId: '',
        extra: null
      }]
    });
  }

  // Ouvre le menu de partage natif
  async shareContent(title: string, text: string, url?: string) {
    await Share.share({
      title,
      text,
      url,
      dialogTitle: 'Partager via'
    });
  }

  // Fait vibrer le téléphone pour le retour haptique
  async vibrateDevice() {
    await Haptics.vibrate();
  }

  // Sauvegarde un fichier dans le stockage de l'app
  async saveFile(path: string, data: string) {
    await Filesystem.writeFile({
      path,
      data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
  }

  // Récupère les infos de l'appareil
  async getDeviceInfo() {
    return await Device.getInfo();
  }

  // Vérifie l'état de la connexion
  async getNetworkStatus() {
    return await Network.getStatus();
  }

  // Stocke une préférence utilisateur
  async setPreference(key: string, value: string) {
    await Preferences.set({ key, value });
  }

  // Récupère une préférence utilisateur
  async getPreference(key: string) {
    const { value } = await Preferences.get({ key });
    return value;
  }
  
}

