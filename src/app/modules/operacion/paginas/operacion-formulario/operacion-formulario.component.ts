import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
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
import { OperacionRepository } from '../../repository/operacion.repository';
import { Operacion } from '../../interfaces/operacion.interface';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { SelectSearchComponent } from '@app/common/components/ui/form/select-search/select-search.component';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';

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
  private _changeDetectorRef = inject(ChangeDetectorRef);
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
        tap((param: any) => console.log(param)),
        takeUntil(this.destroy$),
        filter((param: any) => !!param.id),
        switchMap((param: { id: number }) => {
          this.detalleID.set(param.id);
          return this._operacionRepository.detalle(param.id);
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
    const acciones: Record<string, () => void> = {
      nuevo: () => this._nuevoOperacion(),
      editar: () => this._editarEditar(),
    };
    if (this.detalleID() === 0) {
      acciones['nuevo']?.();
    } else {
      acciones['editar']?.();
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
    console.log(this.formularioOperacion.value);
  }

  getControl(nombre: string): FormControl {
    return this.formularioOperacion.get(nombre) as FormControl;
  }
}
