import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { SelectSearchComponent } from '@app/common/components/ui/form/select-search/select-search.component';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { FechaService } from '@app/common/services/fecha.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { Negocio } from '../../interfaces/negocio.interface';
import { NegocioRepository } from '../../repositories/negocio.repository';
import { NegocioDetalleParametros } from '../../interfaces/negocio-detalle-parametros.interface';
import { SwitchComponent } from '@app/common/components/ui/form/switch/switch.component';

@Component({
  selector: 'app-negocio-formulario',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LabelComponent,
    InputComponent,
    RouterModule,
    SelectSearchComponent,
    SwitchComponent,
  ],
  templateUrl: './negocio-formulario.component.html',
})
export default class NegocioFormularioComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _negocioRepository = inject(NegocioRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _fechaService = inject(FechaService);
  private destroy$ = new Subject<void>();

  public detalleID = signal(0);
  public formularioNegocio: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
    this.consultardetalle();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarFormulario() {
    this.formularioNegocio = this._formBuilder.group({
      id: [],
      fecha: [this._fechaService.obtenerFechaHoy(), [Validators.required]],
      unidades: [0, [Validators.required, Validators.min(1)]],
      peso: [0, [Validators.required, Validators.min(0.1)]],
      volumen: [0, [Validators.required, Validators.min(0.1)]],
      declara: [0, [Validators.required, Validators.min(0), Validators.maxLength(14)]],
      pago: [null, [Validators.required, Validators.min(1), Validators.maxLength(14)]],
      flete: [null, [Validators.required, Validators.min(1), Validators.maxLength(14)]],
      manejo: [0, [Validators.required, Validators.min(0), Validators.maxLength(14)]],
      comentario: ['', [Validators.maxLength(500), cambiarVacioPorNulo.validar]],
      contacto: [null, [Validators.required]],
      contacto__nombre_corto: [null],
      ciudad_origen: [null, [Validators.required]],
      ciudad_origen__nombre: [null],
      ciudad_destino: [null, [Validators.required]],
      ciudad_destino__nombre: [null],
      publicar: [false],
      servicio: [null, [Validators.required]],
      servicio__nombre: [null],
      operacion: [null, [Validators.required]],
      operacion__nombre: [null],
      producto: [null, [Validators.required]],
      producto__nombre: [null],
      empaque: [null, [Validators.required]],
      empaque__nombre: [null],
      destinatario_nombre: [null, [Validators.maxLength(150), cambiarVacioPorNulo.validar]],
      destinatario_direccion: [null, [Validators.maxLength(150), cambiarVacioPorNulo.validar]],
      destinatario_telefono: [
        null,
        [Validators.maxLength(50), Validators.pattern('^[0-9]*$'), cambiarVacioPorNulo.validar],
      ],
      destinatario_correo: [
        null,
        [Validators.email, Validators.maxLength(255), cambiarVacioPorNulo.validar],
      ],
    });
  }

  onSubmit() {
    if (!this.formularioNegocio.valid) {
      this.formularioNegocio.markAllAsTouched();
      return;
    }

    if (this.detalleID() === 0) {
      this._nuevoNegocio();
    } else {
      this._editarNegocio();
    }
  }

  private _nuevoNegocio() {
    this._negocioRepository
      .nuevo(this.formularioNegocio.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['movimiento/negocio/detalle/', respuesta.id]);
      });
  }

  private _editarNegocio() {
    this._negocioRepository
      .editar(this.detalleID(), this.formularioNegocio.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['movimiento/negocio/detalle/', respuesta.id]);
      });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        filter((param: NegocioDetalleParametros) => !!param.id),
        switchMap((param: NegocioDetalleParametros) => {
          const id = Number(param.id);
          this.detalleID.set(id);
          return this._negocioRepository.detalle(id);
        })
      )
      .subscribe((respuesta: Negocio) => {
        this.poblarFormulario(respuesta);
      });
  }

  private poblarFormulario(data: Negocio) {
    this.formularioNegocio.patchValue({
      fecha: data.fecha,
      unidades: data.unidades,
      peso: data.peso,
      volumen: data.volumen,
      declara: data.declara,
      pago: data.pago,
      flete: data.flete,
      manejo: data.manejo,
      comentario: data.comentario,
      contacto: data.contacto,
      contacto__nombre_corto: data.contacto__nombre_corto,
      ciudad_origen: data.ciudad_origen,
      ciudad_origen__nombre: data.ciudad_origen__nombre,
      ciudad_destino: data.ciudad_destino,
      ciudad_destino__nombre: data.ciudad_destino__nombre,
      publicar: data.publicar,
      servicio: data.servicio,
      servicio__nombre: data.servicio__nombre,
      operacion: data.operacion,
      operacion__nombre: data.operacion__nombre,
      producto: data.producto,
      producto__nombre: data.producto__nombre,
      empaque: data.empaque,
      empaque__nombre: data.empaque__nombre,
      destinatario_nombre: data.destinatario_nombre,
      destinatario_direccion: data.destinatario_direccion,
      destinatario_telefono: data.destinatario_telefono,
      destinatario_correo: data.destinatario_correo,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioNegocio.get(nombre) as FormControl;
  }
}
