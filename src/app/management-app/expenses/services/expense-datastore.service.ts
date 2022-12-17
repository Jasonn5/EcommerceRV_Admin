import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from 'src/app/models/expense';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}expenses`;

  constructor(private http: HttpClient) { }

  add(expense: Expense) {
    return this.http.post<Expense>(this.ROOT_URL, expense);
  }

  list(value) {
    return this.http.get<Expense[]>(this.ROOT_URL + '?search=' + value);
  }
}
