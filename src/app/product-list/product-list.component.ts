import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../api.service';
import { FetchResult, ProductList } from '../types';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private api = inject(ApiService);
  private modalService = inject(NgbModal);

  products = signal<FetchResult<ProductList>>({result: "loading"});

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.api.listProducts.subscribe(result => this.products.set(result));
  }

  async delete(p: ProductList[number]) {
    const ref = this.modalService.open(ConfirmModalComponent, { backdrop: 'static' });
    const confirm: ConfirmModalComponent = ref.componentInstance;
    confirm.question.set(`Точно удалить товар ${p.name}?`);
    confirm.yesColor.set("danger");
    confirm.noColor.set("primary");
    const res = await ref.result;
    if (res == "yes") {
      this.products.set({result: "loading"});
      try {
        await O.lastValueFrom(this.api.deleteProduct(p.id));
      } finally {
        this.fetch();
      }
    }
  }
}
