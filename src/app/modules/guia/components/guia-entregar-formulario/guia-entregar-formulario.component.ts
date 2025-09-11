import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { SwitchComponent } from '@app/common/components/ui/form/switch/switch.component';
import { FechaService } from '@app/common/services/fecha.service';
import { GuiaRepository } from '../../repositories/guia.repository';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-guia-entregar-formulario',
  standalone: true,
  imports: [SwitchComponent, InputComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './guia-entregar-formulario.component.html',
})
export class GuiaEntregarFormularioComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _fechaService = inject(FechaService);
  private _guiaRepository = inject(GuiaRepository);
  private _destroy$ = new Subject<void>();
  public formularioGuiaEntregar: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  inicializarFormulario() {
    const fecha = this._fechaService.obtenerFechaActual();
    const hora = this._fechaService.obtenerHoraActual();

    this.formularioGuiaEntregar = this._formBuilder.group({
      soporte: [false],
      fecha: [this._fechaService.convertirAFormatoISO(fecha)], // YYYY-MM-DD
      hora: [hora],
      guia: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.formularioGuiaEntregar.valid) {
      this.formularioGuiaEntregar.markAllAsTouched();
      return;
    }
    this._agregarGuia();
  }

  getControl(nombre: string): FormControl {
    return this.formularioGuiaEntregar.get(nombre) as FormControl;
  }

  private _agregarGuia() {
    this._guiaRepository
      .entrega(this.formularioGuiaEntregar.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe(respuesta => {
        console.log(respuesta);
      });
  }
}
