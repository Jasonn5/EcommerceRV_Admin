import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProviderBill } from 'src/app/models/provider-bill';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ProviderBillService } from '../../services/provider-bill.service';

@Component({
  selector: 'app-provider-bill-editor',
  templateUrl: './provider-bill-editor.component.html',
  styleUrls: ['./provider-bill-editor.component.scss']
})
export class ProviderBillEditorComponent implements OnInit {
  public providerBillEditForm: FormGroup;
  public providerBillToEdit: ProviderBill;
  public textButtom: string;
  public textHeader: string;

  constructor(
    private formBuilder: FormBuilder,
    private providerBillService: ProviderBillService,
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
    this.providerBillEditForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      nit: ['', [Validators.required, Validators.maxLength(20)]],
      'authorization-number': ['', [Validators.required, Validators.pattern(/^(0|[0-9]\d*)?$/)]],
      'bill-number': ['', [Validators.required, Validators.pattern(/^(0|[0-9]\d*)?$/)]],
      'total-amount': ['', [Validators.required, Validators.pattern(/^(0|[1-9]\d*)?[.]?(0|[0-9]\d*)$/)]],
      'control-code': ['', [Validators.required, Validators.maxLength(100)]],
      'bill-date': ['', Validators.required],
      purchaseType: [1, Validators.required],
      duiNumber: ['', Validators.maxLength(100)]
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.providerBillService.findProviderBillById(params['id']).subscribe(providerBill => {
          this.providerBillToEdit = providerBill;
          this.providerBillEditForm.patchValue({
            name: this.providerBillToEdit.providerName,
            nit: this.providerBillToEdit.nit,
            'authorization-number': this.providerBillToEdit.authorizationNumber,
            'bill-number': this.providerBillToEdit.billNumber,
            'total-amount': this.providerBillToEdit.totalAmount,
            'control-code': this.providerBillToEdit.controlCode,
            'bill-date': this.datepipe.transform(this.providerBillToEdit.billDate, 'yyyy-MM-dd'),
            purchaseType: this.providerBillToEdit.purchaseType,
            duiNumber: this.providerBillToEdit.duiNumber
          });
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar facturación Proveedor";
      } else {
        this.providerBillToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar facturación Proveedor"
      }
    });
  }

  sendProviderBillData() {
    var providerBill = this.providerBillEditForm.value;
    this.spinner.show();

    if (this.providerBillToEdit) {
      this.providerBillService.updateProviderBill(this.providerBillToEdit, providerBill).subscribe(() => {
        this.toastrService.primary('Factura del proveedor', 'Éxito');
        this.spinner.hide();
      });
    } else {
      this.providerBillService.addProviderBill(providerBill).subscribe(() => {
        this.toastrService.primary('Factura del proveedor registrado', 'Éxito');
        this.providerBillEditForm.reset();
        this.spinner.hide();
      });
    }
  }

  get name() {
    return this.providerBillEditForm.get('name');
  }

  get nit() {
    return this.providerBillEditForm.get('nit');
  }

  get authorizationNumber() {
    return this.providerBillEditForm.get('authorization-number');
  }

  get billNummber() {
    return this.providerBillEditForm.get('bill-number');
  }

  get totalAmount() {
    return this.providerBillEditForm.get('total-amount');
  }

  get controlCode() {
    return this.providerBillEditForm.get('control-code');
  }

  get billDate() {
    return this.providerBillEditForm.get('bill-date');
  }

  get purchaseType() {
    return this.providerBillEditForm.get('purchaseType');
  }

  get duiNumber() {
    return this.providerBillEditForm.get('duiNumber');
  }
}
