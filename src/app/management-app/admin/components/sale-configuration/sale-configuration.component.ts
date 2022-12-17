import { Component, OnInit } from '@angular/core';
import { SaleConfiguration } from 'src/app/models/sale-configuration';
import { Location } from 'src/app/models/location';
import { BillConfiguration } from 'src/app/models/bill-configuration';
import { CashRegister } from 'src/app/models/cash-register';
import { SaleConfigurationService } from '../../services/sale-configuration.service';
import { NbToastrService } from '@nebular/theme';
import { LocationService } from '../../locations/services/location.service';
import { CashRegisterService } from 'src/app/management-app/cash-registers/services/cash-register.service';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { BillConfigurationService } from 'src/app/management-app/billing/services/bill-configuration.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sale-configuration',
  templateUrl: './sale-configuration.component.html',
  styleUrls: ['./sale-configuration.component.scss']
})
export class SaleConfigurationComponent implements OnInit {
  public saleConfiguration: SaleConfiguration;
  public locations: Location[] = [];
  public locationId: number = 0;
  public billConfigurations: BillConfiguration[] = [];
  public billConfigurationId: number = 0;
  public cashRegisters: CashRegister[] = [];
  public cashRegisterId: number = 0;
  public isBilling: boolean;

  constructor(
    private saleConfigurationService: SaleConfigurationService,
    private toastrService: NbToastrService,
    private locationService: LocationService,
    private billConfigurationService: BillConfigurationService,
    private cashRegisterService: CashRegisterService,
    private authService: AuthService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.isBilling = this.authService.getRoles().includes('Billing');
    this.loadAllData();
  }

  saveChanges() {
    this.spinner.show();
    if (this.locationId) {
      if (this.locationId != 0) {
        var location = this.locations.find(l => l.id.toString() === this.locationId.toString());
        location.id = location.id;
        this.saleConfiguration.location = location;
      }
      else {
        this.saleConfiguration.location = null;
      }
    }

    if (this.billConfigurationId) {
      if (this.billConfigurationId != 0) {
        var billConfiguration = this.billConfigurations.find(bc => bc.id.toString() === this.billConfigurationId.toString());
        billConfiguration.id = billConfiguration.id;
        this.saleConfiguration.billConfiguration = billConfiguration;
      } else {
        this.saleConfiguration.billConfiguration = null;
      }
    }

    if (this.cashRegisterId) {
      if (this.cashRegisterId != 0) {
        var cashRegister = this.cashRegisters.find(cr => cr.id.toString() === this.cashRegisterId.toString());
        cashRegister.id = cashRegister.id;
        this.saleConfiguration.cashRegister = cashRegister;
      } else {
        this.saleConfiguration.cashRegister = null;
      }
    }

    this.saleConfigurationService.updateConfiguration(this.saleConfiguration).subscribe(() => {
      this.toastrService.primary('Configuración modificada', 'Éxito');;
      this.spinner.hide();
    });
  }

  loadAllData() {
    this.spinner.show();
    Promise.all([
      this.saleConfigurationService.getConfiguration(this.authService.getUsername()).subscribe(configuration => {
        this.saleConfiguration = configuration;
        this.locationId = this.saleConfiguration.location ? this.saleConfiguration.location.id : 0;
        this.billConfigurationId = this.saleConfiguration.billConfiguration ? this.saleConfiguration.billConfiguration.id : 0;
        this.cashRegisterId = this.saleConfiguration.cashRegister ? this.saleConfiguration.cashRegister.id : 0;
      }),
      this.locationService.listLocations().subscribe(locations => {
        this.locations = locations;
      }),
      this.billConfigurationService.listBillConfigurations().subscribe(billConfigurations => {
        this.billConfigurations = billConfigurations;
      }),
      this.cashRegisterService.listCashRegisters().subscribe(cashRegisters => {
        this.cashRegisters = cashRegisters;
      })
    ]).then((values) => {
      if (values) {
        this.spinner.hide();
      }
    });
  }
}
