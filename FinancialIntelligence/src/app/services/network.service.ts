import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private online = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.online.next(true));
    window.addEventListener('offline', () => this.online.next(false));
  }

  isOnline(): boolean {
    return this.online.value;
  }

  onConnect(): Observable<boolean> {
    return this.online.pipe(
      filter(online => online)
    );
  }

  onDisconnect(): Observable<boolean> {
    return this.online.pipe(
      filter(online => !online)
    );
  }
}