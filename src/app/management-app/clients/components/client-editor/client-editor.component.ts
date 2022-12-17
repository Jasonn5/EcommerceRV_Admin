import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Client } from 'src/app/models/client';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ClientService } from '../../services/client.service';
import { MouseEvent } from '@agm/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-client-editor',
  templateUrl: './client-editor.component.html',
  styleUrls: ['./client-editor.component.scss']
})
export class ClientEditorComponent implements OnInit {
  public clientEditorForm: FormGroup;
  public clientToEdit: Client;
  public lat: number = -17.372752;
  public lng: number = -66.159048;
  public zoom: number = 15;
  public textButtom: string;
  public textHeader: string;
  public styles;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.styles = [
      {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [{
          visibility: "off",
        }]
      },
      {
        "featureType": "poi.medical",
        "elementType": "all",
        "stylers": [{
          visibility: "off",
        }]
      },
      {
        "featureType": "poi.government",
        "elementType": "all",
        "stylers": [{
          visibility: "off",
        }]
      },
      {
        "featureType": "poi.attraction",
        "elementType": "all",
        "stylers": [{
          visibility: "off",
        }]
      },
      {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [{
          visibility: "off",
        }]
      }
    ];
    this.buildForm();
    this.buildFormToEdit();
  }

  private buildForm() {
    this.clientEditorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      address: ['', Validators.maxLength(500)],
      businessName: ['', Validators.maxLength(200)],
      'cell-phone': ['', [Validators.maxLength(50), Validators.minLength(5), Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
      'land-line': ['', [Validators.maxLength(50), Validators.minLength(5), Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
      email: [null, [Validators.email]],
      nit: [0, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clientService.findClientById(params['id']).subscribe(client => {
          this.clientToEdit = client;
          this.clientEditorForm.patchValue({
            name: client.name,
            description: client.description,
            address: client.address,
            'cell-phone': client.cellPhone,
            'land-line': client.landLine,
            email: client.email,
            businessName: client.businessName,
            nit: client.nit
          });
          this.lat = parseFloat(client.latitude);
          this.lng = parseFloat(client.longitude);
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Cliente";
      } else {
        this.clientToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Cliente";
      }
    });
  }

  mapClicked($event: MouseEvent) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }

  markerDragEnd($event: MouseEvent) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }

  addClient() {
    var client = this.clientEditorForm.value;
    client.latitude = this.lat.toString();
    client.longitude = this.lng.toString();
    this.spinner.show();

    if (client.nit == "") {
      client.nit = 0;
    } 

    if (this.clientToEdit) {
      this.clientService.updateClient(this.clientToEdit, client).subscribe(() => {
        this.toastrService.primary('Cliente actualizado', 'Éxito');
        this.buildFormToEdit();
        this.spinner.hide();
      });
    } else {
      this.clientService.addClient(client).subscribe(() => {
        this.toastrService.primary('Cliente registrado', 'Éxito');
        this.clientEditorForm.reset();
        this.buildForm();
        this.spinner.hide();
      });
    }
  }

  get name() {
    return this.clientEditorForm.get('name');
  }

  get description() {
    return this.clientEditorForm.get('description');
  }

  get address() {
    return this.clientEditorForm.get('address');
  }

  get cellphone() {
    return this.clientEditorForm.get('cell-phone');
  }

  get landline() {
    return this.clientEditorForm.get('land-line');
  }

  get email() {
    return this.clientEditorForm.get('email');
  }

  get nit() {
    return this.clientEditorForm.get('nit');
  }

  get businessName() {
    return this.clientEditorForm.get('businessName');
  }
}
