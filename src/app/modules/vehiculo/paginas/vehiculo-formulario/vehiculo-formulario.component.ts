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
import { RouterModule } from '@angular/router';
import { VehiculoService } from '@app/modules/vehiculo/servicios/vehiculo.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import {
  respuestaSeleccionar,
  TransporteRepository,
} from '@app/common/repositories/transporte/transporte.repository';
import { ContactoRepository } from '@app/common/repositories/contacto/contacto.repository';
import { SelectSearchComponent } from '@app/common/components/ui/form/multi-select copy/select-search.component';

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
  private destroy$ = new Subject<void>();
  public arrColores = signal<respuestaSeleccionar[]>([]);
  public arrMarcas = signal<respuestaSeleccionar[]>([]);
  public arrCombustible = signal<respuestaSeleccionar[]>([]);
  public arrLinea = signal<respuestaSeleccionar[]>([]);
  public arrCarroceria = signal<respuestaSeleccionar[]>([]);
  public arrVehiculoConfiguracion = signal<respuestaSeleccionar[]>([]);
  public arrPoseedor = signal([]);
  public arrPropietario = signal([]);
  public arrAseguradora = signal([]);
  public formularioVehiculo: FormGroup;

  ngOnInit() {
    this.consultarInformacion();
    this.inicializarFormulario();

    // if (this.detalle) {
    //   this.consultardetalle();
    // }
  }

  inicializarFormulario() {
    const anioActual = new Date().getFullYear();

    this.formularioVehiculo = this._formBuilder.group({
      fecha_registro: [{ value: null, disabled: true }],
      placa: ['', [Validators.required, Validators.maxLength(6)]],
      modelo: [null, [Validators.required, Validators.min(1900), Validators.max(anioActual)]],
      modelo_repotenciado: [null, [Validators.min(1900), Validators.max(anioActual)]],
      motor: ['', Validators.maxLength(50)],
      chasis: ['', Validators.maxLength(50)],
      ejes: [null, [Validators.required, Validators.min(1)]],
      peso_vacio: [null, [Validators.required, Validators.min(0)]],
      capacidad: [null, [Validators.required, Validators.min(0)]],
      celular: ['', Validators.maxLength(50)],
      poliza: ['', Validators.maxLength(30)],
      vence_poliza: [null, Validators.required],
      tecnicomecanica: ['', Validators.maxLength(30)],
      vence_tecnicomecanica: [null, Validators.required],
      propio: [false],
      remolque: [false],
      estado_inactivo: [false],
      estado_revisado: [false],
      comentario: [null, Validators.maxLength(500)],
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
          console.log(marcaSeleccionar);

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

  onSubmit() {
    if (this.formularioVehiculo.valid) {
      this._vehiculoService.nuevo(this.formularioVehiculo.value).subscribe();
    } else {
      this.formularioVehiculo.markAllAsTouched();
    }
  }

  getControl(nombre: string): FormControl {
    return this.formularioVehiculo.get(nombre) as FormControl;
  }
}
