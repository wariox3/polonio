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
import { ContactoRepository } from '@app/common/repositories/contacto/contacto.repository';
import { TransporteRepository } from '@app/common/repositories/transporte/transporte.repository';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { Vehiculo } from '../../interfaces/vehiculo.interface';
import { VehiculoRepository } from '../../repository/vehiculo.repository';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { VehiculoDetalleParametros } from '../../interfaces/vehiculo-detalle-parametros.interface';

@Component({
  selector: 'app-vehiculo-formulario',
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
  templateUrl: './vehiculo-formulario.component.html',
})
export default class VehiculoFormularioComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _vehiculoRepository = inject(VehiculoRepository);
  private _transporteRepository = inject(TransporteRepository);
  private _contactoRepository = inject(ContactoRepository);
  private _activatedRoute = inject(ActivatedRoute);

  private _router = inject(Router);
  private destroy$ = new Subject<void>();
  public arrColores = signal<RespuestaSeleccionar[]>([]);
  public arrMarcas = signal<RespuestaSeleccionar[]>([]);
  public arrCombustible = signal<RespuestaSeleccionar[]>([]);
  public arrLinea = signal<RespuestaSeleccionar[]>([]);
  public arrCarroceria = signal<RespuestaSeleccionar[]>([]);
  public arrVehiculoConfiguracion = signal<RespuestaSeleccionar[]>([]);
  public arrPoseedor = signal([]);
  public arrPropietario = signal([]);
  public arrAseguradora = signal([]);
  public detalleID = signal(0);
  public formularioVehiculo: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
    this.consultardetalle();
  }

  inicializarFormulario() {
    const anioActual = new Date().getFullYear();
    this.formularioVehiculo = this._formBuilder.group({
      id: [],
      fecha_registro: [{ value: null, disabled: true }],
      placa: ['', [Validators.required, Validators.maxLength(6)]],
      modelo: [null, [Validators.required, Validators.min(1900), Validators.max(anioActual)]],
      modelo_repotenciado: [null, [Validators.min(1900), Validators.max(anioActual)]],
      motor: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      chasis: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      ejes: [null, [Validators.required, Validators.min(1)]],
      peso_vacio: [null, [Validators.required, Validators.min(0)]],
      capacidad: [null, [Validators.required, Validators.min(0)]],
      celular: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      poliza: ['', [Validators.maxLength(30), cambiarVacioPorNulo.validar]],
      vence_poliza: [null, Validators.required],
      tecnicomecanica: [null, Validators.maxLength(30)],
      vence_tecnicomecanica: [null, Validators.required],
      propio: [false],
      remolque: [false],
      estado_inactivo: [false],
      estado_revisado: [false],
      comentario: ['', [Validators.maxLength(500), cambiarVacioPorNulo.validar]],
      poseedor: [null, Validators.required],
      poseedor__nombre_corto: [null],
      propietario: [null, Validators.required],
      propietario__nombre_corto: [null],
      aseguradora: [null, Validators.required],
      aseguradora__nombre_corto: [null],
      color: [null, Validators.required],
      color__nombre: [null],
      marca: [null, Validators.required],
      marca__nombre: [null],
      linea: [null, Validators.required],
      linea__nombre: [null],
      combustible: [null, Validators.required],
      combustible__nombre: [null],
      carroceria: [null, Validators.required],
      carroceria__nombre: [null],
      configuracion: [null, Validators.required],
      configuracion__nombre: [null],
    });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        filter((param: VehiculoDetalleParametros) => !!param.id),
        switchMap((param: VehiculoDetalleParametros) => {
          const id = Number(param.id);
          this.detalleID.set(id);
          return this._vehiculoRepository.detalle(id);
        })
      )
      .subscribe((respuesta: Vehiculo) => {
        this.poblarFormulario(respuesta);
      });
  }

  onSubmit() {
    if (this.formularioVehiculo.valid) {
      if (this.detalleID() === 0) {
        this._nuevoVehiculo();
      } else {
        this._editarVehiculo();
      }
    } else {
      this.formularioVehiculo.markAllAsTouched();
    }
  }

  private _nuevoVehiculo() {
    this._vehiculoRepository
      .nuevo(this.formularioVehiculo.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/vehiculo/detalle/', respuesta.id]);
      });
  }

  private _editarVehiculo() {
    this._vehiculoRepository
      .editar(this.detalleID(), this.formularioVehiculo.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/vehiculo/detalle/', respuesta.id]);
      });
  }

  private poblarFormulario(data: Vehiculo) {
    this.formularioVehiculo.setValue({
      id: data.id,
      fecha_registro: data.fecha_registro,
      placa: data.placa,
      modelo: data.modelo,
      modelo_repotenciado: data.modelo_repotenciado,
      motor: data.motor,
      chasis: data.chasis,
      ejes: data.ejes,
      peso_vacio: data.peso_vacio,
      capacidad: data.capacidad,
      celular: data.celular,
      poliza: data.poliza,
      vence_poliza: data.vence_poliza,
      tecnicomecanica: data.tecnicomecanica,
      vence_tecnicomecanica: data.vence_tecnicomecanica,
      propio: data.propio,
      remolque: data.remolque,
      estado_inactivo: data.estado_inactivo,
      estado_revisado: data.estado_revisado,
      comentario: data.comentario,
      poseedor: data.poseedor,
      poseedor__nombre_corto: data.poseedor__nombre_corto,
      propietario: data.propietario,
      propietario__nombre_corto: data.propietario__nombre_corto,
      aseguradora: data.aseguradora,
      aseguradora__nombre_corto: data.aseguradora__nombre_corto,
      color: data.color,
      color__nombre: data.color__nombre,
      marca: data.marca,
      marca__nombre: data.marca__nombre,
      linea: data.linea,
      linea__nombre: data.linea__nombre,
      combustible: data.combustible,
      combustible__nombre: data.combustible__nombre,
      carroceria: data.carroceria,
      carroceria__nombre: data.carroceria__nombre,
      configuracion: data.configuracion,
      configuracion__nombre: data.configuracion__nombre,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioVehiculo.get(nombre) as FormControl;
  }
}
