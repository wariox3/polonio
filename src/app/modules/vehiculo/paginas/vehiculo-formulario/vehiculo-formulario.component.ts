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
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { SwitchComponent } from '@app/common/components/ui/form/switch/switch.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehiculoService } from '@app/modules/vehiculo/servicios/vehiculo.service';
import { combineLatest, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { TransporteRepository } from '@app/common/repositories/transporte/transporte.repository';
import { ContactoRepository } from '@app/common/repositories/contacto/contacto.repository';
import { SelectSearchComponent } from '@app/common/components/ui/form/select-search/select-search.component';
import { Vehiculo } from '../../interfaces/vehiculo.interfeces';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuestaSeleccionar';

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
  private _vehiculoService = inject(VehiculoService);
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
    this.consultarInformacion();
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
      propietario: [null, Validators.required],
      aseguradora: [null, Validators.required],
      color: [null, Validators.required],
      marca: [null, Validators.required],
      linea: [null, Validators.required],
      combustible: [null, Validators.required],
      carroceria: [null, Validators.required],
      configuracion: [null, Validators.required],
    });
  }

  consultarInformacion() {
    combineLatest([
      this._transporteRepository.coloresSeleccionar(),
      this._transporteRepository.marcaSeleccionar(),
      this._transporteRepository.combustibleSeleccionar(),
      this._transporteRepository.lineaSeleccionar(),
      this._transporteRepository.carroceriaSeleccionar(),
      this._transporteRepository.vehiculoConfiguracionSeleccionar(),
      this._contactoRepository.aseguradora(),
      this._contactoRepository.poseedor(),
      this._contactoRepository.propietario(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([
          coloresSeleccionar,
          marcaSeleccionar,
          combustibleSeleccionar,
          lineaSeleccionar,
          carroceriaSeleccionar,
          vehiculoConfiguracionSeleccionar,
          aseguradora,
          poseedor,
          propietario,
        ]) => {
          this.arrColores.set(coloresSeleccionar);
          this.arrMarcas.set(marcaSeleccionar);
          this.arrLinea.set(lineaSeleccionar);
          this.arrCombustible.set(combustibleSeleccionar);
          this.arrCarroceria.set(carroceriaSeleccionar);
          this.arrVehiculoConfiguracion.set(vehiculoConfiguracionSeleccionar);
          this.arrAseguradora.set(aseguradora.results);
          this.arrPoseedor.set(poseedor.results);
          this.arrPropietario.set(propietario.results);
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
          return this._vehiculoService.detalle(param.id);
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
    this._vehiculoService
      .nuevo(this.formularioVehiculo.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/vehiculo/detalle/', respuesta.id]);
      });
  }

  private _editarVehiculo() {
    this._vehiculoService
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
      propietario: data.propietario,
      aseguradora: data.aseguradora,
      color: data.color,
      marca: data.marca,
      linea: data.linea,
      combustible: data.combustible,
      carroceria: data.carroceria,
      configuracion: data.configuracion,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioVehiculo.get(nombre) as FormControl;
  }
}
