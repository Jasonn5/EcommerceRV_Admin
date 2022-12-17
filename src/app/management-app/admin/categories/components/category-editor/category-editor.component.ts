import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/models/category';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit {
  public categoryEditorForm: FormGroup;
  public categoryToEdit: Category;
  public textButtom: string;
  public textHeader: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private categoryService: CategoryService,
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
    this.categoryEditorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.categoryService.findById(params['id']).subscribe(category => {
          this.categoryToEdit = category;
          this.categoryEditorForm.patchValue({
            name: this.categoryToEdit.name,
            description: this.categoryToEdit.description
          });
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Categoría";
      } else {
        this.categoryToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Categoría"
      }
    });
  }

  addCategory() {
    var category = this.categoryEditorForm.value;
    this.sendCategory(category);
  }

  sendCategory(category) {
    this.spinner.show();
    if (this.categoryToEdit) {
      this.categoryService.updateCategory(this.categoryToEdit, category).subscribe(() => {
        this.toastrService.primary('Categoría actualizada', 'Éxito');
        this.buildFormToEdit();
        this.spinner.hide();
      });
    } else {
      this.categoryService.addCategory(category).subscribe(() => {
        this.toastrService.primary('Categoría registrada', 'Éxito');
        this.categoryEditorForm.reset();
        this.buildForm();
        this.spinner.hide();
      });
    }
  }

  get name() {
    return this.categoryEditorForm.get('name');
  }

  get description() {
    return this.categoryEditorForm.get('description');
  }
}
