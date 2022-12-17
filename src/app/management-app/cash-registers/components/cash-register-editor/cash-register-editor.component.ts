import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { CashRegister } from 'src/app/models/cash-register';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { CashRegisterService } from '../../services/cash-register.service';

@Component({
  selector: 'app-cash-register-editor',
  templateUrl: './cash-register-editor.component.html',
  styleUrls: ['./cash-register-editor.component.scss']
})
export class CashRegisterEditorComponent implements OnInit {
  public cashRegisterEditorForm: FormGroup;
  public cashRegisterToEdit: CashRegister;
  public textButtom: string;
  public textHeader: string;

  constructor(
    private formBuilder: FormBuilder,
    private cashRegisterService: CashRegisterService,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.buildForm();
    this.buildFormToEdit();
  }

  private buildForm() {
    this.cashRegisterEditorForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(100)]],
      cashRegisterType: [1, Validators.required],
      amount: ['0', Validators.pattern(/^(0|[1-9]\d*)?[.]?(0|[1-9]\d*)$/)]
    });
  }

  buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.spinner.show();
        this.cashRegisterService.getCashRegisterById(params['id']).subscribe(cashRegister => {
          this.cashRegisterToEdit = cashRegister;
          this.cashRegisterEditorForm.patchValue({
            code: cashRegister.code,
            cashRegisterType: cashRegister.cashRegisterType,
            amount: cashRegister.amount
          });
          this.spinner.hide();
        });
        this.textButtom = "Actualizar";
        this.textHeader = "Editar Cuenta";
      } else {
        this.cashRegisterToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Cuenta";
      }
    });
  }

  addCashRegister() {
    var cashRegister = this.cashRegisterEditorForm.value;
    this.spinner.show();

    if (cashRegister.price == "") {
      cashRegister.price = 0;
    }

    if (this.cashRegisterToEdit) {
      this.cashRegisterService.updateCashRegister(this.cashRegisterToEdit, cashRegister).subscribe(() => {
        this.toastrService.primary('Cuenta actualizada', 'Éxito');
        this.buildFormToEdit();
        this.spinner.hide();
      });
    } else {
      this.cashRegisterService.addCashRegister(cashRegister).subscribe(() => {
        this.toastrService.primary('Cuenta registrada', 'Éxito');
        this.cashRegisterEditorForm.reset();
        this.buildForm();
        this.spinner.hide();
      });
    }
  }

  get code() {
    return this.cashRegisterEditorForm.get('code');
  }

  get amount() {
    return this.cashRegisterEditorForm.get('amount');
  }

  get cashRegisterType() {
    return this.cashRegisterEditorForm.get('cashRegisterType');
  }
}
