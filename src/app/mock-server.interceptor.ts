import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';
import { Product } from './types';

class Database {
  products: Product[] = [
    {
      id: 0,
      name: "test",
      price: 12.99,
      description: "test product"
    },
    {
      id: 0,
      name: "test1",
      price: 12.99,
      description: "test product"
    },
    {
      id: 0,
      name: "test3",
      price: 12.99,
      description: "test product"
    }
  ]

  constructor() {
    const st = localStorage.getItem("database");
    if (st) {
      this.products = JSON.parse(st);
    }
  }

  list() {
    return this.products.map(({id, name, price}) => {
      return {id, name, price};
    });
  }

  get(id: number): Product | null {
    for (const p of this.products) {
      if (p.id == id) {
        return p;
      }
    }
    return null;
  }

  update(np: Product) {
    if (np.id == -1) {
      np.id = Math.floor(Math.random() * 10000);
      this.products.push(np);
      localStorage.setItem("database", JSON.stringify(this.products));
      return np;
    } else {
      for (let i = 0; i < this.products.length; ++i) {
        if (this.products[i].id == np.id) {
          this.products[i] = np;
          localStorage.setItem("database", JSON.stringify(this.products));
          return np;
        }
      }
      return null;
    }
  }

  delete(id: number) {
    const ix = this.products.findIndex((p) => p.id === id);
    if (ix >= 0) {
      this.products.splice(ix, 1);
      localStorage.setItem("database", JSON.stringify(this.products));
    }
    return null;
  }
}

const state = new Database();

export const mockServer: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  let res: RegExpMatchArray | null;
  let response: object | null = null;

  if (res = req.url.match(/^\/api\/products\/([0-9]+)\/?$/)) {
    if (req.method == "GET") {
      response = state.get(Number.parseInt(res[1]));
    } else if (req.method == "DELETE") {
      response = state.delete(Number.parseInt(res[1]));
    }
  } else if (res = req.url.match(/^\/api\/products\/?$/)) {
    response = state.list();
  } else if ((res = req.url.match(/^\/api\/products\/update\/?$/)) && req.method == "POST") {
    response = state.update(structuredClone(req.body as Product));
  } 

  return O.timer(1000).pipe( // Симулируем сетевую задержку
    Op.concatMap(() => {
      if (response) {
        return O.of(new HttpResponse({
          status: 200,
          body: response,
          url: req.url
        }));
      }
      
      console.dir(req);
      return O.throwError(new HttpErrorResponse({
        status: 404,
        url: req.url
      }));
    })
  );
}