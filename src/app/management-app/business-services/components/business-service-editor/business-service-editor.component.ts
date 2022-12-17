import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusinessService } from 'src/app/models/business-service';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { BusinessServiceService } from '../../services/business-service.service';

@Component({
  selector: 'app-business-service-editor',
  templateUrl: './business-service-editor.component.html',
  styleUrls: ['./business-service-editor.component.scss']
})
export class BusinessServiceEditorComponent implements OnInit {
  public businessServiceEditorForm: FormGroup;
  public serviceToEdit: BusinessService = null;
  public textButtom: string;
  public textHeader: string;

  constructor(
    private formBuilder: FormBuilder,
    private businessServiceService: BusinessServiceService,
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
    this.businessServiceEditorForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      description: ['', Validators.maxLength(500)],
      price: [0, Validators.pattern(/^(0|[1-9]\d*)?[.]?(0|[0-9]\d*)$/)],
      duration: ['', Validators.maxLength(100)],
      durationMeasureId: 0,
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.businessServiceService.findBusinessServiceById(params['id']).subscribe(businessService => {
          this.serviceToEdit = businessService;
          this.businessServiceEditorForm.patchValue({
            code: businessService.code,
            name: businessService.businessServiceName,
            description: businessService.description,
            price: businessService.price,
            duration: businessService.durationTime,
            durationMeasureId: businessService.durationMeasureId
          });
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Servicio";
      } else {
        this.serviceToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Servicio";
      }
    });
  }

  businessServiceEditor() {
    var businessService = this.businessServiceEditorForm.value;
    this.spinner.show();

    if (businessService.price == "") {
      businessService.price = 0;
    }

    if (this.serviceToEdit) {
      this.businessServiceService.updateBusinessService(this.serviceToEdit, businessService).subscribe(() => {
        this.toastrService.primary('Servicio actualizado', 'Éxito');
        this.buildFormToEdit();
        this.spinner.hide();
      });
    } else {
      this.businessServiceService.addBusinessService(businessService).subscribe(() => {
        this.toastrService.primary('Servicio registrado', 'Éxito');
        this.businessServiceEditorForm.reset();
        this.buildForm();
        this.spinner.hide();
      });
    }
  }

  get code() {
    return this.businessServiceEditorForm.get('code');
  }

  get name() {
    return this.businessServiceEditorForm.get('name');
  }

  get description() {
    return this.businessServiceEditorForm.get('description');
  }

  get price() {
    return this.businessServiceEditorForm.get('price');
  }

  get duration() {
    return this.businessServiceEditorForm.get('duration');
  }

  get durationMeasureId() {
    return this.businessServiceEditorForm.get('duration-measure-id');
  }
}
