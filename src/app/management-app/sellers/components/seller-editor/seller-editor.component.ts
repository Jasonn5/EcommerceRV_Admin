import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Seller } from 'src/app/models/seller';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-seller-editor',
  templateUrl: './seller-editor.component.html',
  styleUrls: ['./seller-editor.component.scss']
})
export class SellerEditorComponent implements OnInit {
  public sellerEditorForm: FormGroup;
  public sellerToEdit: Seller = null;
  public textButtom: string;
  public textHeader: string;

  constructor(
    private formBuilder: FormBuilder,
    private sellerService: SellerService,
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
    this.sellerEditorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', Validators.maxLength(100)],
      address: ['', Validators.maxLength(500)],
      cellPhone: ['', [Validators.maxLength(50), Validators.minLength(5), Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
      landLine: ['', [Validators.maxLength(50), Validators.minLength(5), Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.sellerService.findById(params['id']).subscribe(seller => {
          this.sellerToEdit = seller;
          this.sellerEditorForm.patchValue({
            name: this.sellerToEdit.name,
            code: this.sellerToEdit.code,
            address: this.sellerToEdit.address,
            cellPhone: this.sellerToEdit.cellPhone,
            landLine: this.sellerToEdit.landLine,
            email: this.sellerToEdit.email,
          });
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Vendedor";
      } else {
        this.sellerToEdit = null;
        this.textHeader = "Agregar Vendedor";
        this.textButtom = "Registrar";
      }
    });
  }

  addOrUpdateSeller() {
    var seller = this.sellerEditorForm.value;
    this.spinner.show();

    if (this.sellerToEdit) {
      this.sellerService.updateSeller(this.sellerToEdit, seller).subscribe(() => {
        this.toastrService.primary('Vendedor actualizado', 'Éxito');
        this.spinner.hide();
      });
    } else {
      this.sellerService.addSeller(seller).subscribe(() => {
        this.toastrService.primary('Vendedor registrado', 'Éxito');
        this.sellerEditorForm.reset();
        this.spinner.hide();
      });
    }
  }

  get name() {
    return this.sellerEditorForm.get('name');
  }

  get code() {
    return this.sellerEditorForm.get('code');
  }

  get address() {
    return this.sellerEditorForm.get('address');
  }

  get cellPhone() {
    return this.sellerEditorForm.get('cellPhone');
  }

  get landLine() {
    return this.sellerEditorForm.get('landLine');
  }

  get email() {
    return this.sellerEditorForm.get('email');
  }
}
