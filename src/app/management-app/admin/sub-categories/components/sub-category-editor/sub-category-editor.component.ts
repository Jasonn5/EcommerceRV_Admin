import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/sub-category';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { CategoryService } from '../../../categories/services/category.service';
import { SubCategoryService } from '../../services/sub-category.service';

@Component({
  selector: 'app-sub-category-editor',
  templateUrl: './sub-category-editor.component.html',
  styleUrls: ['./sub-category-editor.component.scss']
})
export class SubCategoryEditorComponent implements OnInit {
  public subCategoryEditorForm: FormGroup;
  public subCategoryToEdit: SubCategory;
  public textButtom: string;
  public textHeader: string;
  public categories: Category[] = [];
  public category: Category = new Category();

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private route: ActivatedRoute,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.internetConnectionService.verifyInternetConnection();
    this.categoryService.listCategories().subscribe(categories => {
      this.categories = categories;
      this.spinner.hide();
    });
    this.buildForm();
    this.buildFormToEdit();
  }

  buildForm() {
    this.subCategoryEditorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      description: ['', Validators.maxLength(500)],
      categoryId: ['', Validators.required]
    });
  }

  private buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.subCategoryService.findById(params['id']).subscribe(subCategory => {
          this.subCategoryToEdit = subCategory;
          this.subCategoryEditorForm.patchValue({
            name: this.subCategoryToEdit.name,
            description: this.subCategoryToEdit.description,
            categoryId: this.subCategoryToEdit.category.id ? this.subCategoryToEdit.category.id : ''
          });
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Subcategoría";
      } else {
        this.subCategoryToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Subcategoría"
      }
    });
  }

  subCategoryEditor() {
    var subCategory = this.subCategoryEditorForm.value;
    if (subCategory.categoryId != '') {
      this.category = this.categories.find(s => s.id.toString() == subCategory.categoryId);
    } else {
      this.category = null;
    }
    this.sendSubCategory(subCategory);
  }

  sendSubCategory(subCategory) {
    this.spinner.show();
    if (this.subCategoryToEdit) {
      this.subCategoryService.updateSubCategory(this.subCategoryToEdit, subCategory, this.category).subscribe(() => {
        this.toastrService.primary('Subcategoría actualizada', 'Éxito');
        this.buildFormToEdit();
        this.spinner.hide();
      });
    } else {
      this.subCategoryService.addSubCategory(subCategory, this.category).subscribe(() => {
        this.toastrService.primary('Subcategoría registrada', 'Éxito');
        this.subCategoryEditorForm.reset();
        this.buildForm();
        this.spinner.hide();
      });
    }
  }

  get name() {
    return this.subCategoryEditorForm.get('name');
  }

  get description() {
    return this.subCategoryEditorForm.get('description');
  }

  get categoryId() {
    return this.subCategoryEditorForm.get('categoryId');
  }
}
