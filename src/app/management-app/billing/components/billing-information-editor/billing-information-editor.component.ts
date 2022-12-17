import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { BillConfiguration } from 'src/app/models/bill-configuration';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { BillConfigurationService } from '../../services/bill-configuration.service';

@Component({
  selector: 'app-billing-information-editor',
  templateUrl: './billing-information-editor.component.html',
  styleUrls: ['./billing-information-editor.component.scss']
})
export class BillingInformationEditorComponent implements OnInit {
  public billConfigurationForm: FormGroup;
  public billConfigurationToEdit: BillConfiguration;
  public textButtom: string;
  public textHeader: string;

  constructor(
    private formBuilder: FormBuilder,
    private billConfigurationService: BillConfigurationService,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.buildForm();
    this.buildFormToEdit();
  }

  private buildForm() {
    this.billConfigurationForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(100)]],
      companyNit: ['', [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      authorizationNumber: ['', [Validators.required, Validators.pattern(/^(0|[0-9]\d*)?$/)]],
      emissionLimitDate: ['', Validators.required],
      billStartNumber: [1, [Validators.required, Validators.pattern(/^(0|[0-9]\d*)?$/)]],
      billActualNumber: [1, [Validators.required, Validators.pattern(/^(0|[0-9]\d*)?$/)]],
      dosageKey: ['', Validators.required],
      economicActivity: ['', Validators.required],
      legend: ['', Validators.required],
      providerName: [''],
      matrixHouse: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.billConfigurationService.findById(params['id']).subscribe(billConfiguration => {
          this.billConfigurationToEdit = billConfiguration;
          this.billConfigurationForm.patchValue({
            code: this.billConfigurationToEdit.code,
            companyNit: this.billConfigurationToEdit.companyNit,
            name: this.billConfigurationToEdit.name,
            authorizationNumber: this.billConfigurationToEdit.authorizationNumber,
            emissionLimitDate: this.datepipe.transform(this.billConfigurationToEdit.emissionLimitDate, 'yyyy-MM-dd'),
            billStartNumber: this.billConfigurationToEdit.billStartNumber,
            billActualNumber: this.billConfigurationToEdit.billActualNumber,
            dosageKey: this.billConfigurationToEdit.dosageKey,
            economicActivity: this.billConfigurationToEdit.economicActivity,
            legend: this.billConfigurationToEdit.legend,
            providerName: this.billConfigurationToEdit.providerName,
            matrixHouse: this.billConfigurationToEdit.matrixHouse,
            location: this.billConfigurationToEdit.location
          });
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Datos de dosificación";
      } else {
        this.billConfigurationToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Datos de dosificación"
      }
    });
  }

  addBillConfiguration() {
    var billConfiguration = this.billConfigurationForm.value;
    this.spinner.show();

    if (this.billConfigurationToEdit) {
      this.billConfigurationService.updateBillConfiguration(this.billConfigurationToEdit, billConfiguration).subscribe(() => {
        this.toastrService.primary('Configuración de factura actualizada', 'Éxito');
        this.buildFormToEdit();
        this.spinner.hide();
      });
    } else {
      this.billConfigurationService.addBillConfigruation(billConfiguration).subscribe(() => {
        this.toastrService.primary('Configuración de factura registrada', 'Éxito');
        this.buildForm();
        this.spinner.hide();
        this.billConfigurationForm.reset();
      });
    }
  }

  get code() {
    return this.billConfigurationForm.get('code');
  }

  get companyNit() {
    return this.billConfigurationForm.get('companyNit');
  }

  get name() {
    return this.billConfigurationForm.get('name');
  }

  get authorizationNumber() {
    return this.billConfigurationForm.get('authorizationNumber');
  }

  get emissionLimitDate() {
    return this.billConfigurationForm.get('emissionLimitDate');
  }

  get billStartNumber() {
    return this.billConfigurationForm.get('billStartNumber');
  }

  get billActualNumber() {
    return this.billConfigurationForm.get('billActualNumber');
  }

  get dosageKey() {
    return this.billConfigurationForm.get('dosageKey');
  }

  get economicActivity() {
    return this.billConfigurationForm.get('economicActivity');
  }

  get legend() {
    return this.billConfigurationForm.get('legend');
  }

  get providerName() {
    return this.billConfigurationForm.get('providerName');
  }

  get matrixHouse() {
    return this.billConfigurationForm.get('matrixHouse');
  }

  get location() {
    return this.billConfigurationForm.get('location');
  }
}
