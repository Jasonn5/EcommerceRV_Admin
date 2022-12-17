import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuService } from './services/menu.service';

@Component({
  selector: 'app-management-app',
  templateUrl: './management-app.component.html',
  styleUrls: ['./management-app.component.scss']
})
export class ManagementAppComponent implements OnInit {
  menu = this.menuService.getMenu();
  public currentYear = new Date().getFullYear();
  public companyName = environment.COMPANY_NAME;

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
  }

}
