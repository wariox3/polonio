import { Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import { ModalService } from '@app/common/services/modal.service';
import { Subject } from 'rxjs';
import { GuiaEntregarFormularioComponent } from '../guia-entregar-formulario/guia-entregar-formulario.component';
@Component({
  selector: 'app-guia-entrega-masivo',
  standalone: true,
  imports: [ModalStandardComponent, GuiaEntregarFormularioComponent],
  templateUrl: './guia-entrega-masivo.component.html',
})
export class GuiaEntregaMasivoComponent implements OnDestroy {
  private _modalService = inject(ModalService);
  private destroy$ = new Subject<void>();
  @Output() procesoCompleto = new EventEmitter<any>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal() {
    //this.formularioAgregarGuia.reset();
    this._modalService.open('entregarMaasivo');
    //this._enfocarYSeleccionarInputGuia();
  }

  procesoEntregaMavisoCompleto() {
    this.procesoCompleto.emit(true);
  }
}
