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
import { SelectSearchComponent } from '@app/common/components/ui/form/select-search/select-search.component';
import { SwitchComponent } from '@app/common/components/ui/form/switch/switch.component';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { CiudadRepository } from '@app/common/repositories/ciudad/ciudad.repository';
import { ContactoRepository } from '@app/common/repositories/contacto/contacto.repository';
import { TransporteRepository } from '@app/common/repositories/transporte/transporte.repository';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { Guia } from '../../interfaces/guia.interface';
import { GuiaRepository } from '../../repository/guia.repository';

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
  ],
  templateUrl: './guia-formulario.component.html',
  styleUrl: './guia-formulario.component.scss',
})
export default class GuiaFormularioComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _activatedRoute = inject(ActivatedRoute);
  private _guiaRepository = inject(GuiaRepository);
  private _transporteRepository = inject(TransporteRepository);
  private _ciudadRepository = inject(CiudadRepository);
  private _contactoRepository = inject(ContactoRepository);
  private _router = inject(Router);
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

  ngOnInit() {
    this.inicializarFormulario();
    this.consultardetalle();
  }

  inicializarFormulario() {
    const fechaHoy = new Date();
    const fechaFormateada = fechaHoy.toISOString().split('T')[0]; // Formato: 'YYYY-MM-DD'
    this.formularioGuia = this._formBuilder.group({
      fecha: [fechaFormateada, Validators.required],
      fecha_recogida: [null],
      fecha_ingreso: [null],
      fecha_despacho: [null],
      fecha_entrega: [null],
      fecha_soporte: [null],
      documento: [null, [Validators.maxLength(30)]],
      numero_rndc: [null],
      remitente_nombre: [null, [Validators.required, Validators.maxLength(150)]],
      destinatario_nombre: [null, [Validators.required, Validators.maxLength(150)]],
      destinatario_direccion: [null, [Validators.required, Validators.maxLength(150)]],
      destinatario_telefono: [null, [Validators.maxLength(50)]],
      destinatario_correo: [null, [Validators.email, Validators.maxLength(255)]],
      unidades: [0, [Validators.required, Validators.min(0)]],
      peso: [0, [Validators.required, Validators.min(0)]],
      volumen: [0, [Validators.required, Validators.min(0)]],
      peso_facturado: [0, [Validators.required, Validators.min(0)]],
      declara: [0, [Validators.required, Validators.min(0)]],
      flete: [0, [Validators.required, Validators.min(0)]],
      manejo: [0, [Validators.required, Validators.min(0)]],
      recaudo: [0, [Validators.required, Validators.min(0)]],
      cobro_entrega: [0, [Validators.required, Validators.min(0)]],
      estado_recogido: [false],
      estado_ingreso: [false],
      estado_embarcado: [false],
      estado_despachado: [false],
      estado_entregado: [false],
      estado_soporte: [false],
      estado_novedad: [false],
      estado_novedad_solucionada: [false],
      estado_rndc: [false],
      contenido_verificado: [false],
      mercancia_peligrosa: [false],
      requiere_cita: [false],
      liquidacion: [null, [Validators.required, Validators.maxLength(1)]],
      comentario: [null, [Validators.maxLength(500)]],
      contacto: [null, Validators.required],
      contacto__nombre: [null],
      cliente: [null, Validators.required],
      cliente__nombre_corto: [null],
      destinatario: [null, Validators.required],
      destinatario__nombre: [null],
      operacion_ingreso: [null, Validators.required],
      operacion_ingreso__nombre: [null],
      operacion_cargo: [null, Validators.required],
      operacion_cargo__nombre: [null],
      ciudad_origen: [null, Validators.required],
      ciudad_origen__nombre: [null],
      ciudad_destino: [null, Validators.required],
      ciudad_destino__nombre: [null],
      despacho: [null],
      servicio: [null, Validators.required],
      servicio__nombre: [null],
      producto: [null, Validators.required],
      producto__nombre: [null],
      empaque: [null, Validators.required],
      empaque__nombre: [null],
      ruta: [null],
      ruta__nombre: [null],
      zona: [null],
      zona__nombre: [null],
    });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        filter((param: any) => !!param.id),
        switchMap((param: { id: number }) => {
          this.detalleID.set(param.id);
          return this._guiaRepository.detalle(param.id);
        })
      )
      .subscribe((respuesta: Guia) => {
        this.poblarFormulario(respuesta);
      });
  }

  onSubmit() {
    if (this.formularioGuia.valid) {
      if (this.detalleID() === 0) {
        this._nuevoVehiculo();
      } else {
        this._editarVehiculo();
      }
    } else {
      this.formularioGuia.markAllAsTouched();
      // Mostrar errores simples en consola
      Object.keys(this.formularioGuia.controls).forEach(campo => {
        const control = this.formularioGuia.get(campo);
        if (control && control.invalid) {
          console.warn(`Error en el campo "${campo}":`, control.errors);
        }
      });
    }
  }

  private _nuevoVehiculo() {
    this._guiaRepository
      .nuevo(this.formularioGuia.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['movimiento/guia/detalle/', respuesta.id]);
      });
  }

  private _editarVehiculo() {
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
      fecha_recogida: this.formatearFechaISO(data.fecha_recogida),
      fecha_ingreso: this.formatearFechaISO(data.fecha_ingreso),
      fecha_despacho: this.formatearFechaISO(data.fecha_despacho),
      fecha_entrega: this.formatearFechaISO(data.fecha_entrega),
      fecha_soporte: this.formatearFechaISO(data.fecha_soporte),
      documento: data.documento,
      numero_rndc: data.numero_rndc,
      remitente_nombre: data.remitente_nombre,
      destinatario_nombre: data.destinatario__nombre_corto,
      destinatario_direccion: data.destinatario__direccion,
      destinatario_telefono: data.destinatario__telefono,
      destinatario_correo: data.destinatario__correo,
      unidades: data.unidades,
      peso: data.peso,
      volumen: data.volumen,
      peso_facturado: data.peso_facturado,
      declara: data.declara,
      flete: data.flete,
      manejo: data.manejo,
      recaudo: data.recaudo,
      cobro_entrega: data.cobro_entrega,
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
      destinatario__nombre: data.destinatario__nombre_corto,
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
      ruta: data.ruta,
      ruta__nombre: data.ruta__nombre,
      zona: data.zona,
      zona__nombre: data.zona__nombre,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioGuia.get(nombre) as FormControl;
  }

  private formatearFechaISO(fecha: string | null | undefined): string | null {
    if (!fecha) return null;

    const fechaValida = new Date(fecha);
    return isNaN(fechaValida.getTime()) ? null : fechaValida.toISOString().split('T')[0];
  }
}
