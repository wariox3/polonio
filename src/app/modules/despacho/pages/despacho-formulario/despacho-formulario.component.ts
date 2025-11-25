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
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { AlertaService } from '@app/common/services/alerta.service';
import { FechaService } from '@app/common/services/fecha.service';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { Usuario } from '@app/modules/auth/interfaces/usuario.interface';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { OperacionRepository } from '@app/modules/operacion/repositories/operacion.repository';
import { Store } from '@ngrx/store';
import { catchError, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { DespachoDetalleParametros } from '../../interfaces/despacho-detalle/despacho-detalle-parametros.interface';
import { Despacho } from '../../interfaces/despacho.interface';
import { DespachoRepository } from '../../repositories/despacho.repository';

@Component({
  selector: 'app-despacho-formulario',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LabelComponent,
    InputComponent,
    RouterModule,
    SelectSearchComponent,
  ],
  templateUrl: './despacho-formulario.component.html',
  styleUrl: './despacho-formulario.component.scss',
})
export default class DespachoFormularioComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _activatedRoute = inject(ActivatedRoute);
  private _despachoRepository = inject(DespachoRepository);
  private _fechaService = inject(FechaService);
  private _router = inject(Router);
  private destroy$ = new Subject<void>();
  private _alertaService = inject(AlertaService);
  private _store = inject(Store);
  private _operacionRepository = inject(OperacionRepository);

  public formularioDespacho: FormGroup;
  public detalleID = signal(0);
  public arrVehiculo = signal<RespuestaSeleccionar[]>([]);
  public arrRemolque = signal<RespuestaSeleccionar[]>([]);
  public arrConductor = signal<RespuestaSeleccionar[]>([]);
  public arrCiudadOrigen = signal<RespuestaSeleccionar[]>([]);
  public arrCiudadDestino = signal<RespuestaSeleccionar[]>([]);
  public arrRuta = signal<RespuestaSeleccionar[]>([]);
  public arrOperacion = signal<RespuestaSeleccionar[]>([]);
  public usuarioOperacionId = signal<number | null>(null);

  ngOnInit() {
    this._consultarDataInicial();
    this.inicializarFormulario();
    this._consultarInformacion();
    this.consultardetalle();
    this._iniciarSuscripcionesFormularioVehiculo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarFormulario() {
    this.formularioDespacho = this._formBuilder.group({
      fecha: [this._fechaService.obtenerFechaHoy(), [Validators.required]],
      contacto: [null],
      servicio: [null, [Validators.required]],
      servicio__nombre: [null],
      despacho_tipo: [null, [Validators.required]],
      despacho_tipo__nombre: [null],
      vehiculo: [null, [Validators.required]],
      vehiculo__placa: [null],
      remolque: [null],
      remolque__placa: [null],
      conductor: [null, [Validators.required]],
      conductor__nombre_corto: [null],
      ciudad_origen: [null, [Validators.required]],
      ciudad_origen__nombre: [null],
      ciudad_destino: [null, [Validators.required]],
      ciudad_destino__nombre: [null],
      pago: [0, [Validators.required, Validators.min(0), Validators.maxLength(20)]],
      comentario: [null, [Validators.maxLength(500), cambiarVacioPorNulo.validar]],
      ruta: [null],
      ruta__nombre: [null],
      operacion: [null, [Validators.required]],
      operacion__nombre: [null],
      precinto: [null, [Validators.maxLength(30)]],
    });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        filter((param: DespachoDetalleParametros) => !!param.id),
        switchMap((param: DespachoDetalleParametros) => {
          const id = Number(param.id);
          this.detalleID.set(id);
          return this._despachoRepository.detalle(id);
        })
      )
      .subscribe((respuesta: Despacho) => {
        this.poblarFormulario(respuesta);
      });
  }

  guardar() {
    if (!this.formularioDespacho.valid) {
      this.formularioDespacho.markAllAsTouched();
      return;
    }
    if (this.detalleID() === 0) {
      this._nuevoDespacho();
    } else {
      this._editarDespacho();
    }
  }

  private _nuevoDespacho() {
    this._despachoRepository
      .nuevo(this.formularioDespacho.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['movimiento/despacho/detalle/', respuesta.id]);
      });
  }

  private _editarDespacho() {
    this._despachoRepository
      .editar(this.detalleID(), this.formularioDespacho.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['movimiento/despacho/detalle/', respuesta.id]);
      });
  }

  private poblarFormulario(data: Despacho) {
    this.formularioDespacho.patchValue({
      despacho_tipo: data.despacho_tipo,
      despacho_tipo__nombre: data.despacho_tipo__nombre,
      vehiculo: data.vehiculo,
      vehiculo__placa: data.vehiculo__placa,
      remolque: data.remolque,
      remolque__placa: data.remolque__placa,
      conductor: data.conductor,
      conductor__nombre_corto: data.conductor__nombre_corto,
      ciudad_origen: data.ciudad_origen,
      ciudad_origen__nombre: data.ciudad_origen__nombre,
      ciudad_destino: data.ciudad_destino,
      ciudad_destino__nombre: data.ciudad_destino__nombre,
      pago: data.pago,
      comentario: data.comentario,
      ruta: data.ruta,
      ruta__nombre: data.ruta__nombre,
      operacion: data.operacion,
      operacion__nombre: data.operacion__nombre,
      servicio: data.servicio,
      servicio__nombre: data.servicio__nombre,
      precinto: data.precinto,
    });
  }

  private _iniciarSuscripcionesFormularioVehiculo() {
    this.formularioDespacho.get('conductor')?.valueChanges.subscribe((valor: number) => {
      this.formularioDespacho.patchValue(
        {
          contacto: valor,
        },
        { emitEvent: false }
      );
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioDespacho.get(nombre) as FormControl;
  }

  private _consultarInformacion(): void {
    if (this.usuarioOperacionId() === null) {
      this._redireccionarSinOperacion();
      return;
    }

    this._operacionRepository
      .lista({ id: this.usuarioOperacionId()! })
      .pipe(
        takeUntil(this.destroy$),
        switchMap(respuesta => {
          if (respuesta.count === 0 || respuesta.results.length === 0) {
            this._redireccionarSinOperacion();
            return [];
          }
          return [respuesta.results[0]];
        }),
        catchError(() => {
          this._alertaService.mostrarError('Error al consultar la operación');
          this._router.navigate(['/movimiento/guia/lista']);
          return [];
        })
      )
      .subscribe((operacion: Despacho) => {
        if (operacion) {
          this.formularioDespacho.patchValue({
            operacion: operacion.id,
          });
        }
      });
  }

  private _consultarDataInicial() {
    this._store
      .select(selectCurrentUser)
      .pipe(
        takeUntil(this.destroy$),
        filter((user: Usuario | null) => !!user)
      )
      .subscribe(user => {
        this.usuarioOperacionId.set(user.operacion_id);
      });
  }

  private _redireccionarSinOperacion(): void {
    this._alertaService
      .mostrarInfo('El usuario no tiene una operación asignada')
      .then(() => this._router.navigate(['/movimiento/despacho/lista']));
  }
}
