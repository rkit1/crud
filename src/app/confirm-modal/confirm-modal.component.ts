import { ChangeDetectionStrategy, Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';

export type BootstrapColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"

@Component({
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModalComponent {
	activeModal = inject(NgbActiveModal);

  yesColor: WritableSignal<BootstrapColor> = signal("danger");
  noColor: WritableSignal<BootstrapColor> = signal("secondary");

	question: WritableSignal<string> = signal("FIXME");
}