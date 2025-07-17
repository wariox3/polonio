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
import { combineLatest, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { Guia } from '../../interfaces/guia.interface';
import { GuiaRepository } from '../../repository/guia.repository';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { SelectSearchComponent } from '@app/common/components/ui/form/select-search/select-search.component';
import { SwitchComponent } from '@app/common/components/ui/form/switch/switch.component';
import { TransporteRepository } from '@app/common/repositories/transporte/transporte.repository';
import { ContactoRepository } from '@app/common/repositories/contacto/contacto.repository';
import { CiudadRepository } from '@app/common/repositories/ciudad/ciudad.repository';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar';

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
    this.consultarInformacion();
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
      cliente: [null, Validators.required],
      destinatario: [null, Validators.required],
      operacion_ingreso: [null, Validators.required],
      operacion_cargo: [null, Validators.required],
      ciudad_origen: [null, Validators.required],
      ciudad_destino: [null, Validators.required],
      despacho: [null],
      servicio: [null, Validators.required],
      producto: [null, Validators.required],
      empaque: [null, Validators.required],
      ruta: [null],
      zona: [null],
    });
  }

  consultarInformacion() {
    combineLatest([
      this._contactoRepository.cliente(),
      this._ciudadRepository.ciudadSeleccionar(),
      this._transporteRepository.operacionSeleccionar(),
      this._transporteRepository.servicioSeleccionar(),
      this._transporteRepository.productoSeleccionar(),
      this._transporteRepository.empaqueSeleccionar(),
      this._transporteRepository.rutaSeleccionar(),
      this._transporteRepository.zonaSeleccionar(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([
          cliente,
          ciudadSeleccionar,
          operacionSeleccionar,
          servicioSeleccionar,
          productoSeleccionar,
          empaqueSeleccionar,
          rutaSeleccionar,
          zonaSeleccionar,
        ]) => {
          this.arrCliente.set(cliente.results);
          this.arrContacto.set(cliente.results);
          this.arrDestinatario.set(cliente.results);
          this.arrCiudades.set(ciudadSeleccionar);
          this.arrOperacionIngreso.set(operacionSeleccionar);
          this.arrOperacionCargo.set(operacionSeleccionar);
          this.arrServicio.set(servicioSeleccionar);
          this.arrProducto.set(productoSeleccionar);
          this.arrEmpaque.set(empaqueSeleccionar);
          this.arrRuta.set(rutaSeleccionar);
          this.arrZona.set(zonaSeleccionar);
        }
      );
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
        this._router.navigate(['administracion/guia/detalle/', respuesta.id]);
      });
  }

  private _editarVehiculo() {
    this._guiaRepository
      .editar(this.detalleID(), this.formularioGuia.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/guia/detalle/', respuesta.id]);
      });
  }

  private poblarFormulario(data: Guia) {
    this.formularioGuia.setValue({
      id: data.id,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioGuia.get(nombre) as FormControl;
  }
}
