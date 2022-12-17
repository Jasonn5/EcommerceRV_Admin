import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/sub-category';
import { SubCategoryDatastoreService } from './sub-category-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(private subCategoryDatastoreService: SubCategoryDatastoreService) { }

  public addSubCategory(subCategory, category: Category) {
    let newSubCategory = new SubCategory();
    newSubCategory.name = subCategory.name;
    newSubCategory.description = subCategory.description;
    newSubCategory.category = category;

    return this.subCategoryDatastoreService.add(newSubCategory);
  }

  public updateSubCategory(subCategoryToEdit: SubCategory, subCategory, category: Category) {
    subCategoryToEdit.name = subCategory.name;
    subCategoryToEdit.description = subCategory.description;
    subCategoryToEdit.category = category;

    return this.subCategoryDatastoreService.update(subCategoryToEdit);
  }

  public listSubCategories() {
    return this.subCategoryDatastoreService.list();
  }

  public listSubcategoriesByCategory(categoryId: number) {
    return this.subCategoryDatastoreService.listSubcategoriesByCategory(categoryId);
  }

  public findById(id) {
    return this.subCategoryDatastoreService.findById(id);
  }

  public deleteCategory(id) {
    return this.subCategoryDatastoreService.delete(id);
  }
}
