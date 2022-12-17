import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryDatastoreService } from './category-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private categoryDatastoreService: CategoryDatastoreService) { }

  public addCategory(category) {
    let newCategory = new Category();
    newCategory.name = category.name;
    newCategory.description = category.description;

    return this.categoryDatastoreService.add(newCategory);
  }

  public updateCategory(categoryToEdit: Category, category) {
    categoryToEdit.name = category.name;
    categoryToEdit.description = category.description;

    return this.categoryDatastoreService.update(categoryToEdit);
  }

  public listCategories() {
    return this.categoryDatastoreService.list();
  }

  public findById(id) {
    return this.categoryDatastoreService.findById(id);
  }

  public deleteCategory(id) {
    return this.categoryDatastoreService.delete(id);
  }
}
