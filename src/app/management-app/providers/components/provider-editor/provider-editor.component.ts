import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Provider } from 'src/app/models/provider';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-provider-editor',
  templateUrl: './provider-editor.component.html',
  styleUrls: ['./provider-editor.component.scss']
})
export class ProviderEditorComponent implements OnInit {
  public providerEditForm: FormGroup;
  public providerToEdit: Provider;
  public textButtom: string;
  public textHeader: string;

  constructor(
    private formBuilder: FormBuilder,
    private providerService: ProviderService,
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
    this.providerEditForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      address: ['', Validators.maxLength(500)],
      'land-line': ['', [Validators.maxLength(50), Validators.minLength(5), Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
      'cell-phone': ['', [Validators.maxLength(50), Validators.minLength(5), Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
      email: [null, Validators.email]
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.providerService.findProviderById(params['id']).subscribe(provider => {
          this.providerToEdit = provider;
          this.providerEditForm.patchValue({
            name: this.providerToEdit.name,
            address: this.providerToEdit.address,
            'land-line': this.providerToEdit.landLine,
            'cell-phone': this.providerToEdit.cellPhone,
            email: this.providerToEdit.email
          });
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Proveedor";
      } else {
        this.providerToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Proveedor"
      }
    });
  }

  sendProviderData() {
    var provider = this.providerEditForm.value;
    this.spinner.show();

    if (this.providerToEdit) {
      this.providerService.updateProvider(this.providerToEdit, provider).subscribe(() => {
        this.toastrService.primary('Proveedor actualizado', 'Éxito');
        this.buildFormToEdit();
        this.spinner.hide();
      });
    } else {
      this.providerService.addProvider(provider).subscribe(() => {
        this.toastrService.primary('Proveedor registrado', 'Éxito');
        this.providerEditForm.reset();
        this.buildForm();
        this.spinner.hide();
      });
    }
  }

  get name() {
    return this.providerEditForm.get('name');
  }

  get address() {
    return this.providerEditForm.get('address');
  }

  get landLine() {
    return this.providerEditForm.get('land-line');
  }

  get cellphone() {
    return this.providerEditForm.get('cell-phone');
  }

  get email() {
    return this.providerEditForm.get('email');
  }
}
