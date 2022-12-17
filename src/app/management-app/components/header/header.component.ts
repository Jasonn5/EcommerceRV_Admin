import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { NotificationService } from '../../products/services/notification.service';
import { SharedService } from '../../services/shared.service';
import { Notification } from 'src/app/models/notification';
import { NotificationsModalComponent } from '../notifications-modal/notifications-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public username: string;
  public userId;
  public activeNotifications: boolean;
  public typeButton;
  public modalOptions: NgbModalOptions;
  public notifications: Notification[] = [];
  public logoUrl: string;

  constructor(
    private sidebarService: NbSidebarService,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.sharedService.sharedResult.subscribe(result => {
      this.activeNotifications = result;
      this.typeButton = this.activeNotifications ? "btn-danger" : "btn-primary";
    });
    this.username = this.authService.getUsername();
    this.userId = this.authService.getUserId();
    this.logoUrl = environment.LOGO_URL;
  }

  viewNotifications() {
    this.spinner.show();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md'
    }
    this.notificationService.getLastFiveNotifications().subscribe(notifications => {
      this.spinner.hide();
      this.notifications = notifications;
      const modalRef = this.modalService.open(NotificationsModalComponent, this.modalOptions);
      modalRef.componentInstance.data = {
        notifications: this.notifications
      };
      modalRef.result.then((result) => {
        this.spinner.show();
        this.notificationService.updateNotifications().subscribe(() => {
          this.notifications = [];
          this.sharedService.verifyActiveNotifications(false);
          this.spinner.hide();
        });
      });
    });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changePassword() {
    this.router.navigate(['/change-password', this.userId]);
  }
}
