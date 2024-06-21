import { Component, OnInit, inject, signal } from '@angular/core';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchResult, Product } from '../types';
import { ApiService } from '../api.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgbAlert, NgbAlertModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationErrorsComponent } from '../form-validation-errors/form-validation-errors.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgbAlertModule, NgbModalModule, FormValidationErrorsComponent],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  product = signal<FetchResult<Product>>({ result: "loading" });
  errors = signal<string[]>([]);

  form = new FormGroup({
    id: new FormControl<number>(-1),
    name: new FormControl<string>('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0.01)]),
    description: new FormControl<string>('', [Validators.required, Validators.minLength(4), Validators.maxLength(1024)])
  });

  ngOnInit() {
    this.fetch();
    // console.log(this.form);
  }

  async onSubmit() {
    if (this.form.valid) {
      this.form.disable();
      try {
        await O.lastValueFrom(this.api.saveProduct(this.form.value as Product));
        this.router.navigate(['/']);
      } catch (err) {
        this.errors.update(es => {
          const out = structuredClone(es);
          if (err instanceof HttpErrorResponse) {
            out.push(`Ошибка ${err.message}`);
          } else {
            out.push(`Неизвестная ошибка`);
          }
          return out; 
        });
      } finally {
        this.form.enable();
      }
    }
  }

  async cancel() {
    if (this.form.touched) {
      const ref = this.modalService.open(ConfirmModalComponent, { backdrop: 'static' });
      const confirm: ConfirmModalComponent = ref.componentInstance;
      confirm.question.set("Точно отменить? Изменения будут потеряны");
      confirm.yesColor.set("danger");
      confirm.noColor.set("primary");
      const res = await ref.result;
      if (res == "yes") {
        await this.router.navigate(['/']);
      }
    } else {
      await this.router.navigate(['/']);
    }
  }

  fetch() {
    this.route.params.pipe(
      Op.switchMap((ps) => {

        if (ps['id'] == "new") {
          return O.of({
            result: "ok",
            value: {
              id: -1,
              name: '',
              price: 0,
              description: ''
            }
          } as FetchResult<Product>);
        }

        return this.api.getProduct(Number.parseInt(ps['id']));
      })
    ).subscribe(result => {
      this.product.set(result);
      try {
        if (result.result == 'ok') {
          this.form.setValue(result.value);
          this.form.markAsPristine();
        }
      } catch (err) {
        console.error(err);
        this.product.set({
          result: "error",
          message: "Сервер вернул неверное значение"
        });
      }
    });
  }

  closeAlert(index: number) {
		this.errors.update(arr => {
      const out = structuredClone(arr);
      out.splice(index, 1);
      console.log(arr, out);
      return out;
    })
	}
}
