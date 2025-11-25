import { CommonModule } from '@angular/common';
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
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { RutaDetalleParametros } from '../../interfaces/ruta-detalle-parametros.interface';
import { Ruta } from '../../interfaces/ruta.interface';
import { RutaRepository } from '../../repositories/ruta.repository';

@Component({
  selector: 'app-ruta-formulario',
  standalone: true,
  imports: [
    LabelComponent,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './ruta-formulario.component.html',
})
export default class RutaFormularioComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _activatedRoute = inject(ActivatedRoute);
  private _rutaRepository = inject(RutaRepository);
  private _router = inject(Router);
  private destroy$ = new Subject<void>();
  public formularioRuta: FormGroup;
  public detalleID = signal(0);

  ngOnInit() {
    this.inicializarFormulario();
    this.consultardetalle();
  }

  inicializarFormulario() {
    this.formularioRuta = this._formBuilder.group({
      nombre: [null, [Validators.required, Validators.maxLength(100)]],
    });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        filter((param: RutaDetalleParametros) => !!param.id),
        switchMap((param: RutaDetalleParametros) => {
          const id = Number(param.id);
          this.detalleID.set(id);
          return this._rutaRepository.detalle(id);
        })
      )
      .subscribe((respuesta: Ruta) => {
        this.poblarFormulario(respuesta);
      });
  }

  onSubmit() {
    if (!this.formularioRuta.valid) {
      this.formularioRuta.markAllAsTouched();
      return;
    }
    if (this.detalleID() === 0) {
      this._nuevoRuta();
    } else {
      this._editarEditar();
    }
  }

  private _editarEditar(): void {
    this._rutaRepository
      .editar(this.detalleID(), this.formularioRuta.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/ruta/detalle/', respuesta.id]);
      });
  }

  private _nuevoRuta(): void {
    this._rutaRepository
      .nuevo(this.formularioRuta.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/ruta/detalle/', respuesta.id]);
      });
  }

  private poblarFormulario(data: Ruta) {
    this.formularioRuta.patchValue({
      nombre: data.nombre,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioRuta.get(nombre) as FormControl;
  }
}
