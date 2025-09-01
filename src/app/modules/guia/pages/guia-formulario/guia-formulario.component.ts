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
import { SwitchComponent } from '@app/common/components/ui/form/switch/switch.component';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { AlertaService } from '@app/common/services/alerta.service';
import { FechaService } from '@app/common/services/fecha.service';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { Usuario } from '@app/modules/auth/interfaces/usuario.interface';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Conductor } from '@app/modules/conductor/interfaces/conductor.interface';
import { CiudadOperacion } from '@app/modules/operacion/interfaces/ciudad-operacion.interface';
import { OperacionRepository } from '@app/modules/operacion/repositories/operacion.repository';
import { Store } from '@ngrx/store';
import { catchError, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { Guia } from '../../interfaces/guia.interface';
import { GuiaRepository } from '../../repositories/guia.repository';
import { ModalService } from '@app/common/services/modal.service';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import ContactoFormularioComponent from '@app/modules/contacto/pages/contacto-formulario/contacto-formulario.component';
import { Contacto } from '@app/modules/contacto/interfaces/contacto.interface';
import { DetalleParametros } from '@app/common/interfaces/detalle-parametros.interface';
import { Negocio } from '@app/modules/negocio/interfaces/negocio.interface';
import { NegocioSeleccionar } from '@app/modules/negocio/interfaces/negocio-seleccionar.interface';

@Component({
  selector: 'app-guia-formulario',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LabelComponent,
    InputComponent,
    SwitchComponent,
    RouterModule,
    SelectSearchComponent,
    ModalStandardComponent,
    ContactoFormularioComponent,
  ],
  templateUrl: './guia-formulario.component.html',
})
export default class GuiaFormularioComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _activatedRoute = inject(ActivatedRoute);
  private _guiaRepository = inject(GuiaRepository);
  private _operacionRepository = inject(OperacionRepository);
  private _alertaService = inject(AlertaService);
  private _fechaService = inject(FechaService);
  private _router = inject(Router);
  private _store = inject(Store);
  private _modalService = inject(ModalService);

  private destroy$ = new Subject<void>();

  public formularioGuia: FormGroup;
  public detalleID = signal(0);
  public arrCliente = signal([]);
  public arrContacto = signal([]);
  public arrDestinatario = signal([]);
  public arrOperacionIngreso = signal<RespuestaSeleccionar[]>([]);
  public arrOperacionCargo = signal<RespuestaSeleccionar[]>([]);
  public arrServicio = signal<RespuestaSeleccionar[]>([]);
  public arrProducto = signal<RespuestaSeleccionar[]>([]);
  public arrEmpaque = signal<RespuestaSeleccionar[]>([]);
  public arrRuta = signal<RespuestaSeleccionar[]>([]);
  public arrZona = signal<RespuestaSeleccionar[]>([]);
  public arrCiudades = signal<RespuestaSeleccionar[]>([]);
  public usuarioOperacionId = signal<number | null>(null);
  public modalAbierto = signal(false);

  ngOnInit() {
    this._consultarDataInicial();
    this.inicializarFormulario();
    this._consultarInformacion();
    this.consultardetalle();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarFormulario() {
    this.formularioGuia = this._formBuilder.group({
      fecha: [this._fechaService.obtenerFechaHoy(), Validators.required],
      documento: [
        null,
        [
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z0-9,\- ]*$/),
          cambiarVacioPorNulo.validar,
        ],
      ],
      remitente_nombre: [null, [Validators.required, Validators.maxLength(150)]],
      destinatario_nombre: [null, [Validators.required, Validators.maxLength(150)]],
      destinatario_direccion: [null, [Validators.required, Validators.maxLength(150)]],
      destinatario_telefono: [null, [Validators.maxLength(50)]],
      destinatario_correo: [null, [Validators.email, Validators.maxLength(255)]],
      unidades: [0, [Validators.required, Validators.min(1)]],
      peso: [0, [Validators.required, Validators.min(1)]],
      volumen: [0, [Validators.required, Validators.min(1)]],
      peso_facturado: [0, [Validators.required, Validators.min(1)]],
      declara: [0, [Validators.required, Validators.min(0), Validators.maxLength(20)]],
      flete: [0, [Validators.required, Validators.min(0), Validators.maxLength(20)]],
      manejo: [0, [Validators.required, Validators.min(0), Validators.maxLength(20)]],
      recaudo: [0, [Validators.required, Validators.min(0), Validators.maxLength(20)]],
      estado_novedad_solucionada: [false],
      contenido_verificado: [false],
      mercancia_peligrosa: [false],
      requiere_cita: [false],
      comentario: [null, [Validators.maxLength(500), cambiarVacioPorNulo.validar]],
      contacto: [null, Validators.required],
      contacto__nombre: [null],
      cliente: [null, Validators.required],
      cliente__nombre_corto: [null],
      destinatario: [null],
      destinatario_nombre_busqueda: [null],
      operacion_ingreso: [1, Validators.required],
      operacion_cargo: [1, Validators.required],
      operacion_cargo__nombre: [null],
      ciudad_origen: [null, Validators.required],
      ciudad_destino: [null, Validators.required],
      ciudad_destino__nombre: [null],
      despacho: [null],
      servicio: [3, Validators.required],
      servicio__nombre: ['PAQUETEO'],
      producto: [1, Validators.required],
      producto__nombre: ['VARIOS'],
      empaque: [17, Validators.required],
      empaque__nombre: ['VARIOS'],
      liquidacion: ['k'],
      negocio: [null],
      negocio__nombre: [null],
    });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        filter((param: DetalleParametros) => !!param.id),
        switchMap((param: DetalleParametros) => {
          const id = Number(param.id);
          this.detalleID.set(id);
          return this._guiaRepository.detalle(id);
        })
      )
      .subscribe((respuesta: Guia) => {
        this.poblarFormulario(respuesta);
      });
  }

  onSubmit() {
    if (!this.formularioGuia.valid) {
      this.formularioGuia.markAllAsTouched();
      return;
    }

    if (this.detalleID() === 0) {
      this._nuevoGuia();
    } else {
      this._editarGuia();
    }
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
      .subscribe((operacion: CiudadOperacion) => {
        if (operacion) {
          this._actualizarCiudadOrigen(operacion);
        }
      });
  }

  private _nuevoGuia() {
    this._guiaRepository
      .nuevo(this.formularioGuia.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['movimiento/guia/detalle/', respuesta.id]);
      });
  }

  private _editarGuia() {
    this._guiaRepository
      .editar(this.detalleID(), this.formularioGuia.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['movimiento/guia/detalle/', respuesta.id]);
      });
  }

  private poblarFormulario(data: Guia) {
    this.formularioGuia.patchValue({
      fecha: data.fecha,
      fecha_recogida: this._fechaService.convertirAFormatoISO(data.fecha_recogida),
      fecha_ingreso: this._fechaService.convertirAFormatoISO(data.fecha_ingreso),
      fecha_despacho: this._fechaService.convertirAFormatoISO(data.fecha_despacho),
      fecha_entrega: this._fechaService.convertirAFormatoISO(data.fecha_entrega),
      fecha_soporte: this._fechaService.convertirAFormatoISO(data.fecha_soporte),
      documento: data.documento,
      numero_rndc: data.numero_rndc,
      remitente_nombre: data.remitente_nombre,
      destinatario_nombre: data.destinatario_nombre,
      destinatario_direccion: data.destinatario_direccion,
      destinatario_telefono: data.destinatario_telefono,
      destinatario_correo: data.destinatario_correo,
      unidades: data.unidades,
      peso: data.peso,
      volumen: data.volumen,
      peso_facturado: data.peso_facturado,
      declara: data.declara,
      flete: data.flete,
      manejo: data.manejo,
      recaudo: data.recaudo,
      estado_recogido: data.estado_recogido,
      estado_ingreso: data.estado_ingreso,
      estado_embarcado: data.estado_embarcado,
      estado_despachado: data.estado_despachado,
      estado_entregado: data.estado_entregado,
      estado_soporte: data.estado_soporte,
      estado_novedad: data.estado_novedad,
      estado_novedad_solucionada: data.estado_novedad_solucionada,
      estado_rndc: data.estado_rndc,
      contenido_verificado: data.contenido_verificado,
      mercancia_peligrosa: data.mercancia_peligrosa,
      requiere_cita: data.requiere_cita,
      liquidacion: data.liquidacion,
      comentario: data.comentario,
      contacto: data.contacto,
      contacto__nombre: data.contacto,
      cliente: data.cliente,
      cliente__nombre_corto: data.cliente__nombre_corto,
      destinatario: data.destinatario,
      destinatario_nombre_busqueda: data.destinatario__nombre_corto,
      operacion_ingreso: data.operacion_ingreso,
      operacion_ingreso__nombre: data.operacion_ingreso__nombre,
      operacion_cargo: data.operacion_cargo,
      operacion_cargo__nombre: data.operacion_cargo__nombre,
      ciudad_origen: data.ciudad_origen,
      ciudad_origen__nombre: data.ciudad_origen__nombre,
      ciudad_destino: data.ciudad_destino,
      ciudad_destino__nombre: data.ciudad_destino__nombre,
      despacho: data.despacho,
      servicio: data.servicio,
      servicio__nombre: data.servicio__nombre,
      producto: data.producto,
      producto__nombre: data.producto__nombre,
      empaque: data.empaque,
      empaque__nombre: data.empaque__nombre,
      zona: data.zona,
      zona__nombre: data.zona__nombre,
      negocio: data.negocio,
      negocio__nombre: data.negocio__nombre,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioGuia.get(nombre) as FormControl;
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

  private _redireccionarSinOperacion() {
    this._alertaService
      .mostrarInfo('El usuario no tiene una operación asignada')
      .then(() => this._router.navigate(['/movimiento/guia/lista']));
  }

  actualizarNegocio(data: NegocioSeleccionar) {
    if (data) {
      this.formularioGuia.patchValue({
        negocio: data.id,
        negocio__nombre: data.nombre,
        unidades: data.unidades,
        peso: data.peso,
        volumen: data.volumen,
        declara: data.declara,
        flete: data.flete,
        manejo: data.manejo,
        ciudad_destino: data.ciudad_destino_id,
        ciudad_destino__nombre: data.ciudad_destino__nombre,
        destinatario_nombre: data.destinatario_nombre,
        destinatario_direccion: data.destinatario_direccion,
        destinatario_telefono: data.destinatario_telefono,
        destinatario_correo: data.destinatario_correo,
        peso_facturado: data.peso,
      });
    }
  }

  private _actualizarCiudadOrigen(data: CiudadOperacion) {
    this.formularioGuia.patchValue({
      ciudad_origen: data.id,
    });
  }

  public actualizarDestinatario(data: Conductor) {
    this.formularioGuia.patchValue({
      destinatario_nombre: data?.nombre_corto,
      destinatario_direccion: data?.direccion,
      destinatario_telefono: data?.telefono,
      destinatario_correo: data?.correo,
      ciudad_destino: data?.ciudad,
      ciudad_destino__nombre: data?.ciudad__nombre,
    });
  }

  public actualizarRemitente(data: Conductor) {
    this.formularioGuia.patchValue({
      remitente_nombre: data?.nombre_corto,
      contacto: data?.id,
      contacto__nombre: data?.nombre_corto,
    });
  }

  abrirFormularioNuevo(data: boolean) {
    if (data) {
      this.modalAbierto.set(true);
      this._modalService.open('modalNuevo');
    }
  }

  onClienteCreado(conductor: Contacto) {
    // cierra el modal
    this._modalService.close('modalNuevo');
    this.modalAbierto.set(false); // destruye defer
    this.formularioGuia.patchValue({
      destinatario: conductor.id,
      destinatario_nombre: conductor.nombre_corto,
      destinatario_nombre_busqueda: conductor.nombre_corto,
      destinatario_direccion: conductor?.direccion,
      destinatario_telefono: conductor?.telefono,
      destinatario_correo: conductor?.correo,
      ciudad_destino: conductor?.ciudad_id,
      ciudad_destino__nombre: conductor?.ciudad_nombre,
    });
  }

  formatearSelectNegocio = (item: any): string => {
    if (!item) return '';
    return `${item.id} - ${item.fecha} - ${item.nombre}`;
  };
}
