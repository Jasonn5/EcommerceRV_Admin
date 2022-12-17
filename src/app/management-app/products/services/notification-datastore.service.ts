import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}notifications`;

  constructor(private http: HttpClient) { }

  update() {
    return this.http.get<Notification>(this.ROOT_URL + '/updateNotifications/notifications');
  }

  list() {
    return this.http.get<Notification[]>(this.ROOT_URL);
  }
}
