import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { SubCategory } from 'src/app/models/sub-category';
import { environment } from 'src/environments/environment';
import { ProductDatastoreService } from './product-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private productDatastoreService: ProductDatastoreService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public addProduct(product, category: Category, subCategory: SubCategory) {
    let newProduct = new Product();
    newProduct.name = product.name;
    newProduct.code = product.code;
    newProduct.description = product.description;
    newProduct.price = parseFloat(product.price);
    newProduct.priceB = parseFloat(product.priceB);
    newProduct.priceC = parseFloat(product.priceC);
    newProduct.priceD = parseFloat(product.priceD);
    newProduct.priceE = parseFloat(product.priceE);
    newProduct.discount = parseFloat(product.discount);
    newProduct.imageUrl = product.thumbnailUrl;
    newProduct.pack = product.pack;
    newProduct.size = product.size;
    newProduct.codebar = product.codebar;
    newProduct.measureTypeId = parseInt(product.measureTypeId);
    newProduct.stockAlarm = parseFloat(product.stockAlarm);
    newProduct.category = category;
    newProduct.subCategory = subCategory;

    return this.productDatastoreService.add(newProduct);
  }

  public updateProduct(productToEdit: Product, product, category: Category, subCategory: SubCategory) {
    productToEdit.name = product.name;
    productToEdit.code = product.code;
    productToEdit.description = product.description;
    productToEdit.price = parseFloat(product.price);
    productToEdit.priceB = parseFloat(product.priceB);
    productToEdit.priceC = parseFloat(product.priceC);
    productToEdit.priceD = parseFloat(product.priceD);
    productToEdit.priceE = parseFloat(product.priceE);
    productToEdit.discount = parseFloat(product.discount);
    productToEdit.imageUrl = product.thumbnailUrl;
    productToEdit.pack = product.pack;
    productToEdit.size = product.size;
    productToEdit.codebar = product.codebar;
    productToEdit.measureTypeId = parseInt(product.measureTypeId);
    productToEdit.stockAlarm = parseFloat(product.stockAlarm);
    productToEdit.category = category;
    productToEdit.subCategory = subCategory;

    return this.productDatastoreService.update(productToEdit);
  }

  public findProductById(id) {
    return this.productDatastoreService.findById(id);
  }


  public searchProducts(value: string) {
    return this.productDatastoreService.list(value);
  }

  public deleteProduct(id) {
    return this.productDatastoreService.delete(id);
  }

  public importExcel(file: File): Observable<any> {
    var url = environment.BACK_END_HOST + "imports-data/import-excel";
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').set('Authorization', 'bearer ' + this.authService.getToken());

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData, { headers: headers, responseType: 'blob' });
  }
}
