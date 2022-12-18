import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { CategoryService } from 'src/app/management-app/admin/categories/services/category.service';
import { SubCategoryService } from 'src/app/management-app/admin/sub-categories/services/sub-category.service';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { SubCategory } from 'src/app/models/sub-category';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { UploadService } from 'src/app/services/upload.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit {
  public productEditorForm: FormGroup;
  public thumbnail = null;
  public thumbnailData = null;
  public imageErrorSize = null;
  public file;
  private FILE_MAX_SIZE = 1000000;
  public productToEdit: Product;
  public categories: Category[] = [];
  public subcategories: SubCategory[] = [];
  public folderName: string = "productos";
  public textButtom: string;
  public textHeader: string;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private toastrService: NbToastrService,
    private cd: ChangeDetectorRef,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.categoryService.listCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.buildForm();
    this.buildFormToEdit();
  }

  private buildForm() {
    this.productEditorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      price: [0, Validators.pattern(/^(0|[1-9]\d*)?[.]?(0|[0-9]\d*)$/)],
      description: ['', Validators.maxLength(500)],
      file: null,
      stockAlarm: 0
    });
  }

  buildFormToEdit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productService.findProductById(params['id']).subscribe(product => {
          this.productToEdit = product;
          if (this.productToEdit.category != null) {
            this.subCategoryService.listSubcategoriesByCategory(this.productToEdit.category.id).subscribe(subcategories => {
              this.subcategories = subcategories;
            });
          }
          this.productEditorForm.patchValue({
            name: this.productToEdit.name,
            price: this.productToEdit.price,
            description: this.productToEdit.description,
            stockAlarm: this.productToEdit.stockAlarm
          });
          this.thumbnail = this.productToEdit.imageUrl;
          this.thumbnailData = this.productToEdit.imageUrl;
        });
        this.textButtom = "Guardar";
        this.textHeader = "Editar Producto";
      } else {
        this.productToEdit = null;
        this.textButtom = "Registrar";
        this.textHeader = "Agregar Producto"
      }
    });
  }

  getSubCategories() {
    this.subCategoryService.listSubcategoriesByCategory(this.productEditorForm.value.categoryId).subscribe(subcategories => {
      this.productEditorForm.value.subCategoryId = 0;
      this.subcategories = subcategories;
    });
  }

  productEditor() {
    var product = this.productEditorForm.value;
    var component = this;
    this.spinner.show();

    var category = new Category();
    var subCategory = new SubCategory();

    if (product.price == "") {
      product.price = 0;
    }
    if (product.priceB == "") {
      product.priceB = 0;
    }
    if (product.priceC == "") {
      product.priceC = 0;
    }
    if (product.priceD == "") {
      product.priceD = 0;
    }
    if (product.priceE == "") {
      product.priceE = 0;
    }

    if (product.categoryId != 0) {
      category = this.categories.find(c => c.id == product.categoryId);
    } else {
      category = null;
      product.subCategoryId = 0;
    }

    if (product.subCategoryId != 0) {
      var subCategory = this.subcategories.find(sc => sc.id == product.subCategoryId);
    } else {
      subCategory = null;
    }

    if (this.file) {
      this.uploadService.uploadFile(this.file, this.folderName)
        .then(function (data) {
          product.thumbnailUrl = data.Location;
          if (component.productToEdit) {
            component.sendProductToEditData(component.productToEdit, product, category, subCategory);
          } else {
            component.sendProductData(product, category, subCategory);
          }
        })
        .catch(function (error) {
          console.log('There was an error uploading your file: ', error);
          component.spinner.hide();
        });
    } else {
      if (this.productToEdit) {
        product.thumbnailUrl = this.thumbnailData ? this.productToEdit.imageUrl : null;
        this.sendProductToEditData(this.productToEdit, product, category, subCategory);
      } else {
        product.thumbnailUrl = null;
        this.sendProductData(product, category, subCategory);
      }
    }
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      [this.file] = event.target.files;
      const fileSize = this.file.size;
      reader.readAsDataURL(this.file);

      reader.onload = (event: any) => {
        if (fileSize > this.FILE_MAX_SIZE) {
          this.thumbnailData = null;
          this.file = null;
          this.imageErrorSize = "La imagen no puede exceder el tamaño de 1 MB";
          this.productEditorForm.controls['file'].setErrors({ incorrect: true });
        } else {
          this.imageErrorSize = null;
          this.thumbnailData = event.target.result;
          // need to run CD since file load runs outside of zone
          this.productEditorForm.controls['file'].reset();
          this.cd.markForCheck();
        }
      }
    }
  }

  removeFile() {
    this.file = null;
    this.thumbnailData = null;
  }

  sendProductData(product, category, subCategory) {
    this.spinner.show();
    this.productService.addProduct(product, category, subCategory).subscribe(() => {
      this.toastrService.primary('Producto registrado', 'Éxito');
      this.thumbnailData = null;
      this.file = null;
      this.spinner.hide();
      this.productEditorForm.reset();
      this.buildForm();
    });
  }

  sendProductToEditData(productToEdit, product, category, subCategory) {
    this.spinner.show();
    this.productService.updateProduct(productToEdit, product, category, subCategory).subscribe(() => {
      if (this.thumbnail && (this.thumbnailData != this.thumbnail)) {
        this.uploadService.deleteFile(this.thumbnail, this.folderName);
      }
      this.toastrService.primary('Producto actualizado', 'Éxito');
      this.file = null;
      this.buildFormToEdit();
      this.spinner.hide();
    });
  }

  get name() {
    return this.productEditorForm.get('name');
  }

  get code() {
    return this.productEditorForm.get('code');
  }

  get price() {
    return this.productEditorForm.get('price');
  }

  get priceB() {
    return this.productEditorForm.get('priceB');
  }

  get priceC() {
    return this.productEditorForm.get('priceC');
  }

  get priceD() {
    return this.productEditorForm.get('priceD');
  }

  get priceE() {
    return this.productEditorForm.get('priceE');
  }

  get discount() {
    return this.productEditorForm.get('discount');
  }

  get description() {
    return this.productEditorForm.get('description');
  }

  get pack() {
    return this.productEditorForm.get('pack');
  }

  get size() {
    return this.productEditorForm.get('size');
  }

  get lot() {
    return this.productEditorForm.get('lot');
  }

  get codebar() {
    return this.productEditorForm.get('codebar');
  }
}
