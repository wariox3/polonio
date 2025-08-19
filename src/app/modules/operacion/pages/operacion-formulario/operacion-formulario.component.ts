import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { OperacionRepository } from '../../repositories/operacion.repository';
import { Operacion } from '../../interfaces/operacion.interface';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { SelectSearchComponent } from '@app/common/components/ui/form/select-search/select-search.component';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { OperacionDetalleParametros } from '../../interfaces/operacion-detalle-parametros.interface';

@Component({
  selector: 'app-operacion-formulario',
  standalone: true,
  imports: [
    LabelComponent,
    SelectSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    RouterModule,
  ],
  templateUrl: './operacion-formulario.component.html',
})
export default class OperacionFormularioComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _activatedRoute = inject(ActivatedRoute);
  private _operacionRepository = inject(OperacionRepository);
  private _router = inject(Router);
  private destroy$ = new Subject<void>();
  public formularioOperacion: FormGroup;
  public detalleID = signal(0);

  ngOnInit() {
    this.inicializarFormulario();
    this.consultardetalle();
  }

  inicializarFormulario() {
    this.formularioOperacion = this._formBuilder.group({
      nombre: [null, [Validators.required, Validators.maxLength(50)]],
      ciudad: [null, Validators.required],
      ciudad_nombre: [null],
    });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        filter((param: OperacionDetalleParametros) => !!param.id),
        switchMap((param: OperacionDetalleParametros) => {
          const id = Number(param.id);
          this.detalleID.set(id);
          return this._operacionRepository.detalle(id);
        })
      )
      .subscribe((respuesta: Operacion) => {
        this.poblarFormulario(respuesta);
      });
  }

  onSubmit() {
    if (!this.formularioOperacion.valid) {
      this.formularioOperacion.markAllAsTouched();
      return;
    }
    if (this.detalleID() === 0) {
      this._nuevoOperacion();
    } else {
      this._editarEditar();
    }
  }

  private _editarEditar(): void {
    this._operacionRepository
      .editar(this.detalleID(), this.formularioOperacion.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/operacion/detalle/', respuesta.id]);
      });
  }

  private _nuevoOperacion(): void {
    this._operacionRepository
      .nuevo(this.formularioOperacion.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/operacion/detalle/', respuesta.id]);
      });
  }

  private poblarFormulario(data: Operacion) {
    this.formularioOperacion.patchValue({
      nombre: data.nombre,
      ciudad: data.ciudad,
      ciudad_nombre: data.ciudad__nombre,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioOperacion.get(nombre) as FormControl;
  }
}
