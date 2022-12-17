import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private activeNotifications = new BehaviorSubject(false);
  sharedResult = this.activeNotifications.asObservable();

  constructor() { }

  verifyActiveNotifications(result: boolean) {
    this.activeNotifications.next(result);
  }
}
