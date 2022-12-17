import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { environment } from 'src/environments/environment';
import { NotificationDatastoreService } from './notification-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private notificationDatastoreService: NotificationDatastoreService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public verifyActiveNotifications() {
    var url = environment.BACK_END_HOST + 'notifications/VerifyActiveNotifications';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json').set('Authorization', 'bearer ' + this.authService.getToken());

    return this.http.get(url, { headers: headers });
  }

  public getLastFiveNotifications() {
    return this.notificationDatastoreService.list();
  }

  public updateNotifications() {
    return this.notificationDatastoreService.update();
  }
}
