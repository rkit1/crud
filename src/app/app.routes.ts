import { Routes } from '@angular/router';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
  { path: 'list', component: ProductListComponent },
  { path: 'product/:id', component: ProductEditComponent },
  { path: '**', redirectTo: '/list', pathMatch: 'full' },
];
