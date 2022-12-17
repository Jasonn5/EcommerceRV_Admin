import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/authentication/models/user';
import { UserService } from 'src/app/authentication/services/user.service';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {
  public users: User[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public roles: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    }
    this.getUsers();
    this.loadData();
  }

  getUsers() {
    this.spinner.show();
    this.userService.listUsers().subscribe(users => {
      this.users = users;
      this.spinner.hide();
    });
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 15,
      onGridReady: (params) => {
        params.api.sizeColumnsToFit();
        params.api.collapseAll();
      },
      onGridSizeChanged: (params) => {
        params.api.collapseAll();
      },
      defaultColDef: {
        resizable: true
      },
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }

    this.columnDefs = [
      {
        headerName: 'Nombre',
        valueFormatter: (params) => { return params.data.givenName; }
      },
      {
        headerName: 'Usuario',
        valueFormatter: (params) => { return params.data.username; }
      },
      {
        headerName: 'Email',
        valueFormatter: (params) => { return params.data.email; }
      },
      {
        headerName: 'Estado',
        valueFormatter: (params) => { return params.data.isEnabled ? 'Activo' : 'Inactivo'; }
      },
      {
        headerName: 'Roles',
        valueFormatter: (params) => { return this.getRoles(params.data.roles); }
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendEmployeeId.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: true
        },
        width: 50,
        minWidth: 50
      }
    ];
  }

  getRoles(roles) {
    this.roles = '';
    roles.forEach(role => {
      this.roles = this.roles + ", " + role.name;
    });
    this.roles = this.roles.replace(/(^,)|(,$)/g, '');

    return this.roles;
  }

  sendEmployeeId(e) {
    this.ngZone.run(() => this.router.navigate(['/users/edit-user', e.rowData.id])).then();;
  }
}
