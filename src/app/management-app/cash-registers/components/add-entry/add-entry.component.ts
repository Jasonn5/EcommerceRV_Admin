import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CashRegister } from 'src/app/models/cash-register';
import { EntryTypeEnum } from 'src/app/models/enums/entry-type-enum';
import { CashRegisterEntryService } from '../../services/cash-register-entry.service';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {
  @Input() public data: any;
  public addEntryForm: FormGroup;
  public messageError: string = null;
  public cancel;

  constructor(
    private formBuilder: FormBuilder,
    private cashRegisterEntryService: CashRegisterEntryService,
    private toastrService: NbToastrService,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.addEntryForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern(/^(0|[1-9]\d*)?[.]?(0|[1-9]\d*)$/)]],
      reason: ['', [Validators.required, Validators.maxLength(500), Validators.minLength(3)]],
      entryType: ['', Validators.required]
    });
  }

  addEntry() {
    this.spinner.show();
    var entry = this.addEntryForm.value;
    var cashRegister = new CashRegister();

    cashRegister.id = this.data.id;
    cashRegister.code = this.data.code;

    this.cashRegisterEntryService.addEntry(entry, cashRegister).subscribe(() => {
      parseInt(entry.entryType) == EntryTypeEnum.DEBIT ? this.toastrService.primary('Ingreso registrado', 'Éxito') : this.toastrService.primary('Egreso registrado', 'Éxito');
      this.messageError = null;
      this.addEntryForm.reset();
      this.spinner.hide();
    },
      (error) => {
        this.messageError = error.error.error.message;
        this.spinner.hide();
      });
  }

  get amount() {
    return this.addEntryForm.get('amount');
  }

  get reason() {
    return this.addEntryForm.get('reason');
  }

  get entryType() {
    return this.addEntryForm.get('entryType');
  }
}
