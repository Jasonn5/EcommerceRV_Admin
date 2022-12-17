import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from "src/app/models/location";
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location-editor',
  templateUrl: './location-editor.component.html',
  styleUrls: ['./location-editor.component.scss']
})
export class LocationEditorComponent implements OnInit {
  public locationEditorForm: FormGroup;
  public locationToEdit: Location;
  public textButtom: string;
  public textHeader: string;

  constructor(
    private locationService: LocationService,
    private formBuilder: FormBuilder,
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

  buildForm() {
    this.locationEditorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', Validators.maxLength(500)],
      city: ['', Validators.maxLength(500)],
      phone: ['', [Validators.maxLength(50), Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]]
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.locationService.findLocationById(params['id']).subscribe(location => {
          this.locationToEdit = location;
          this.locationEditorForm.patchValue({
            name: this.locationToEdit.name,
            address: this.locationToEdit.address,
            city: this.locationToEdit.city,
            phone: this.locationToEdit.phone,
          });
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Ubicación";
      } else {
        this.locationToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Ubicación"
      }
    });
  }

  addLocation() {
    var location = this.locationEditorForm.value;
    this.spinner.show();

    if (this.locationToEdit) {
      this.locationService.updateLocation(this.locationToEdit, location).subscribe(() => {
        this.toastrService.primary('Ubicación actualizada', 'Éxito');
        this.buildFormToEdit();
        this.spinner.hide();
      });
    } else {
      this.locationService.addLocation(location).subscribe(() => {
        this.toastrService.primary('Ubicación registrada', 'Éxito');
        this.locationEditorForm.reset();
        this.buildForm();
        this.spinner.hide();
      });
    }
  }

  get name() {
    return this.locationEditorForm.get('name');
  }

  get address() {
    return this.locationEditorForm.get('address');
  }

  get city() {
    return this.locationEditorForm.get('city');
  }

  get phone() {
    return this.locationEditorForm.get('phone');
  }
}
