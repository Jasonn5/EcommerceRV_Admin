import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Role } from 'src/app/authentication/models/role';
import { User } from 'src/app/authentication/models/user';
import { UserService } from 'src/app/authentication/services/user.service';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  public userEditorForm: FormGroup;
  public user: User;
  public textButtom: string;
  public textHeader: string;
  public isEnabled;
  public userRoles: FormArray;
  public checkedRoles;
  public roles;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.buildForm();
    this.buildFormToEdit();
  }

  private buildForm() {
    this.userEditorForm = this.formBuilder.group({
      username: [''],
      firstName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3), Validators.pattern('^[a-zA-Z \-\']+')]],
      lastName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3), Validators.pattern('^[a-zA-Z \-\']+')]],
      email: ['', [Validators.required, Validators.email]],
      userRoles: this.formBuilder.array([]),
      isEnabled: null,
    });

    this.userRoles = this.userEditorForm.get('userRoles') as FormArray;
    this.roles = environment.ROLES.split(',');
    this.route.params.subscribe(params => {
      if (!params['id']) {
        this.roles.forEach(role => {
          this.userRoles.push(this.formBuilder.group({ name: role, selected: false }));
        });
      }
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      this.spinner.show();
      var userId = params['id'];
      if (userId) {
        this.userService.findById(userId).subscribe(user => {
          this.user = user;
          this.userEditorForm.patchValue({
            username: this.user.username,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            isEnabled: this.user.isEnabled
          });
          this.isEnabled = this.user.isEnabled;
          this.checkedRoles = this.user.roles;
          this.roles.forEach(role => {
            this.userRoles.push(this.formBuilder.group({ name: role, selected: this.checkedRoles.find(cr => cr.name == role) ? true : false }));
          });
          this.spinner.hide();
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Usuario";
      } else {
        this.user = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Usuario"
        this.spinner.hide();
      }
    });
  }

  addUser() {
    var user = this.userEditorForm.value;
    var selectedRoles = [];

    user.isEnabled = this.isEnabled;
    user.userRoles.filter(r => r.selected).forEach(r => {
      var newRole = new Role();
      newRole.id = r.name;
      newRole.name = r.name;
      selectedRoles.push(newRole);
    });

    user.selectedRoles = selectedRoles;
    this.spinner.show();
    this.sendUserData(user);
  }

  sendUserData(user) {
    if (this.user) {
      this.userService.updateUser(this.user, user).subscribe(() => {
        this.toastrService.primary('Usuario actualizado', 'Éxito');
        this.ngZone.run(() => this.router.navigate(['/users/view-users'])).then();
        this.spinner.hide();
      },
        error => {
          this.toastrService.danger(error.error.message, 'Error');
          this.spinner.hide();
        });
    } else {
      this.userService.addUser(user).subscribe(() => {
        this.toastrService.primary('Usuario registrado', 'Éxito');
        this.userEditorForm.reset();
        this.buildForm();
        this.spinner.hide();
      },
        error => {
          this.toastrService.danger(error.error.message, 'Error');
          this.spinner.hide();
        });
    }
  }

  get username() {
    return this.userEditorForm.get('username');
  }

  get firstName() {
    return this.userEditorForm.get('firstName');
  }

  get lastName() {
    return this.userEditorForm.get('lastName');
  }

  get email() {
    return this.userEditorForm.get('email');
  }
}
