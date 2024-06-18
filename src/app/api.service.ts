import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FetchResult, Product, ProductList } from './types';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  getProduct(id: number) {
    return this.http.get<Product>(`/api/products/${id}`).pipe(wrapApiCall);
  }

  // Возвращает id новой/обновленной записи
  saveProduct(product: Product) {
    return this.http.post<number>(`/api/products/update`, product).pipe(wrapApiCall);
  }

  deleteProduct(id: number) {
    return this.http.delete(`/api/products/${id}`).pipe(wrapApiCall);
  }

  listProducts = this.http.get<ProductList>(`/api/products/`).pipe(wrapApiCall);
}


function wrapApiCall<T>(call: O.Observable<T>): O.Observable<FetchResult<T>> {
  return call.pipe(
    Op.startWith({
      result: "loading"
    } as FetchResult<T>),

    Op.map(val => ({
      result: "ok",
      value: val
    }) as FetchResult<T>),

    Op.catchError(error => O.of({
      result: "error",
      message: JSON.stringify(error)
    } as FetchResult<T>)),
  )
}