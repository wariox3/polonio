import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import { ModalService } from '@app/common/services/modal.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { DespachoDetalleRepository } from '../../repositories/despacho-detalle.repository';

@Component({
  selector: 'app-despacho-modal-agregar-guia',
  standalone: true,
  imports: [
    ModalStandardComponent,
    FormsModule,
    ReactiveFormsModule,
    LabelComponent,
    InputComponent,
  ],
  templateUrl: './despacho-modal-agregar-guia.component.html',
})
export class DespachoModalAgregarGuiaComponent implements OnInit, OnDestroy {
  private _modalService = inject(ModalService);
  private _formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private _despachoDetalleRepository = inject(DespachoDetalleRepository);
  private _activatedRoute = inject(ActivatedRoute);

  public formularioAgregarGuia: FormGroup;
  @Output() registroExitoso = new EventEmitter<boolean>(false);
  @ViewChild(InputComponent) inputGuia!: InputComponent;

  ngOnInit() {
    this.inicializarFormulario();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarFormulario() {
    this.formularioAgregarGuia = this._formBuilder.group({
      guia_id: [123, [Validators.required, Validators.min(1)]],
    });
  }

  guardar() {
    if (!this.formularioAgregarGuia.valid) {
      this.formularioAgregarGuia.markAllAsTouched();
      return;
    }
    this._agregarGuia();
  }

  private _agregarGuia() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          const despachoId = Number(param.id);
          return this._despachoDetalleRepository.nuevo({
            id: despachoId,
            ...this.formularioAgregarGuia.value,
          });
        })
      )
      .subscribe(() => {
        this.registroExitoso.emit(true);
        this.formularioAgregarGuia.reset();
      });
    this._enfocarYSeleccionarInputGuia();
  }

  openModal() {
    this.formularioAgregarGuia.reset();
    this._modalService.open('agregarGuia');
    this._enfocarYSeleccionarInputGuia();
  }

  closeModal() {
    this._modalService.close('agregarGuia');
  }

  private _enfocarYSeleccionarInputGuia() {
    setTimeout(() => {
      this.inputGuia.focus();
      this.inputGuia.select();
    });
  }
}
