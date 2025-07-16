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
import { SelectComponent } from '@app/common/components/ui/form/select/select.component';
import { CiudadService } from '@app/common/repositories/ciudad/ciudad.service';
import { ContactoRepository } from '@app/common/repositories/contacto/contacto.repository';
import { RhService } from '@app/common/repositories/rh/rh.service';
import { TransporteRepository } from '@app/common/repositories/transporte/transporte.repository';
import { combineLatest, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { Conductor } from '../../interfaces/conductor';
import { ConductorService } from '../../servicios/conductor.service';

@Component({
  selector: 'app-conductor-formulario',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LabelComponent,
    InputComponent,
    RouterModule,
    SelectComponent,
    SelectSearchComponent,
  ],
  templateUrl: './conductor-formulario.component.html',
  styleUrl: './conductor-formulario.component.scss',
})
export default class ConductorFormularioComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _contactoRepository = inject(ContactoRepository);
  private _conductorService = inject(ConductorService);
  private _rhService = inject(RhService);
  private _ciudadService = inject(CiudadService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private destroy$ = new Subject<void>();
  private _transporteRepository = inject(TransporteRepository);
  public detalleID = signal(0);
  public arrRh = signal([]);
  public arrCiudad = signal([]);

  public formularioConductor: FormGroup;

  ngOnInit() {
    this.consultarInformacion();
    this.inicializarFormulario();
    this.consultardetalle();
  }

  inicializarFormulario() {
    this.formularioConductor = this._formBuilder.group({
      numero_identificacion: ['', [Validators.required, Validators.maxLength(20)]],
      digito_verificacion: ['', [Validators.maxLength(1)]],
      nombre1: ['', [Validators.required, Validators.maxLength(50)]],
      nombre2: ['', [Validators.maxLength(50)]],
      apellido1: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2: ['', [Validators.maxLength(50)]],
      nombre_corto: ['', [Validators.required, Validators.maxLength(200)]],
      fecha_nacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      barrio: ['', [Validators.maxLength(200)]],
      telefono: ['', [Validators.required, Validators.maxLength(50)]],
      celular: ['', [Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      numero_licencia: ['', [Validators.required, Validators.maxLength(50)]],
      categoria_licencia: ['', [Validators.required, Validators.maxLength(2)]],
      fecha_vence_licencia: ['', [Validators.required]],
      fecha_expedicion_licencia: ['', [Validators.required]],
      fecha_ingreso: [''],
      fecha_retiro: [''],
      propio: [false],
      estado_inactivo: [false],
      estado_revisado: [false],
      comentario: ['', [Validators.maxLength(500)]],
      identificacion: [null, [Validators.required]],
      ciudad: [null, [Validators.required]],
      rh: [null, [Validators.required]],
    });
  }

  consultarInformacion() {
    combineLatest([this._rhService.rhSeleccionar(), this._ciudadService.ciudadSeleccionar()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([rhSeleccionar, ciudadSeleccionar]) => {
        this.arrRh.set(rhSeleccionar);
        this.arrCiudad.set(ciudadSeleccionar);
      });
  }

  onSubmit() {
    this.actualizarNombreCorto();

    if (this.formularioConductor.valid) {
      if (this.detalleID() === 0) {
        this._nuevoVehiculo();
      } else {
        this._editarVehiculo();
      }
    } else {
      this.formularioConductor.markAllAsTouched();
      Object.keys(this.formularioConductor.controls).forEach(campo => {
        const control = this.formularioConductor.get(campo);
        if (control && control.invalid) {
          console.log(`Campo con error: ${campo}`, control.errors);
        }
      });
    }
  }

  private _nuevoVehiculo() {
    this.actualizarNombreCorto();
    this._conductorService
      .nuevo(this.formularioConductor.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/conductor/detalle/', respuesta.id]);
      });
  }

  private _editarVehiculo() {
    this.actualizarNombreCorto();
    this._conductorService
      .editar(this.detalleID(), this.formularioConductor.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/conductor/detalle/', respuesta.id]);
      });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        filter((param: any) => !!param.id),
        switchMap((param: { id: number }) => {
          this.detalleID.set(param.id);
          return this._conductorService.detalle(param.id);
        })
      )
      .subscribe((respuesta: Conductor) => {
        this.poblarFormulario(respuesta);
      });
  }

  private poblarFormulario(data: Conductor) {
    this.formularioConductor.setValue({
      id: data.id,
      // fecha_registro: data.fecha_registro,
      // placa: data.placa,
      // modelo: data.modelo,
      // modelo_repotenciado: data.modelo_repotenciado,
      // motor: data.motor,
      // chasis: data.chasis,
      // ejes: data.ejes,
      // peso_vacio: data.peso_vacio,
      // capacidad: data.capacidad,
      // celular: data.celular,
      // poliza: data.poliza,
      // vence_poliza: data.vence_poliza,
      // tecnicomecanica: data.tecnicomecanica,
      // vence_tecnicomecanica: data.vence_tecnicomecanica,
      // propio: data.propio,
      // remolque: data.remolque,
      // estado_inactivo: data.estado_inactivo,
      // estado_revisado: data.estado_revisado,
      // comentario: data.comentario,
      // poseedor: data.poseedor,
      // propietario: data.propietario,
      // aseguradora: data.aseguradora,
      // color: data.color,
      // marca: data.marca,
      // linea: data.linea,
      // combustible: data.combustible,
      // carroceria: data.carroceria,
      // configuracion: data.configuracion,
    });
  }

  getControl(nombre: string): FormControl {
    return this.formularioConductor.get(nombre) as FormControl;
  }

  actualizarNombreCorto() {
    let nombreCorto = '';
    const nombre1 = this.formularioConductor.get('nombre1')?.value;
    const nombre2 = this.formularioConductor.get('nombre2')?.value;
    const apellido1 = this.formularioConductor.get('apellido1')?.value;
    const apellido2 = this.formularioConductor.get('apellido2')?.value;

    nombreCorto = `${nombre1}`;
    if (nombre2 !== null) {
      nombreCorto += ` ${nombre2}`;
    }
    nombreCorto += ` ${apellido1}`;
    if (apellido2 !== null) {
      nombreCorto += ` ${apellido2}`;
    }

    this.formularioConductor.get('nombre_corto')?.patchValue(nombreCorto, { emitEvent: false });
  }
}
