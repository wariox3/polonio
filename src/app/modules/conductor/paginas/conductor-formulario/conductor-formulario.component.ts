import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { DevuelveDigitoVerificacionService } from '@app/common/services/devuelve-digito-verificacion.service';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { Conductor } from '../../interfaces/conductor.interface';
import { ConductorRepository } from '../../repository/conductor.repository';

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
    SelectSearchComponent,
  ],
  templateUrl: './conductor-formulario.component.html',
  styleUrl: './conductor-formulario.component.scss',
})
export default class ConductorFormularioComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _conductorRepository = inject(ConductorRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private _devuelveDigitoVerificacionService = inject(DevuelveDigitoVerificacionService);
  private _router = inject(Router);
  private destroy$ = new Subject<void>();
  public detalleID = signal(0);
  public arrRh = signal([]);
  public arrCiudad = signal([]);
  public arrIdentificacion = signal([]);
  public filteredIdentificacionSignal = computed(() =>
    this.arrIdentificacion().filter(item => item.tipo_persona === 2)
  );

  public formularioConductor: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
    this.consultardetalle();
  }

  inicializarFormulario() {
    this.formularioConductor = this._formBuilder.group({
      id: [],
      numero_identificacion: ['', [Validators.required, Validators.maxLength(20)]],
      digito_verificacion: ['', [Validators.maxLength(1)]],
      nombre1: ['', [Validators.required, Validators.maxLength(50)]],
      nombre2: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      apellido1: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      nombre_corto: ['', [Validators.required, Validators.maxLength(200)]],
      fecha_nacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      barrio: ['', [Validators.maxLength(200), cambiarVacioPorNulo.validar]],
      telefono: ['', [Validators.required, Validators.maxLength(50)]],
      celular: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
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
      comentario: ['', [Validators.maxLength(500), cambiarVacioPorNulo.validar]],
      identificacion: [null, [Validators.required]],
      identificacion__nombre: [null],
      ciudad: [null, [Validators.required]],
      ciudad__nombre: [null],
      rh: [null, [Validators.required]],
      rh__nombre: [null],
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
    }
  }

  private _nuevoVehiculo() {
    this.actualizarNombreCorto();
    this._conductorRepository
      .nuevo(this.formularioConductor.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/conductor/detalle/', respuesta.id]);
      });
  }

  private _editarVehiculo() {
    this.actualizarNombreCorto();
    this._conductorRepository
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
          return this._conductorRepository.detalle(param.id);
        })
      )
      .subscribe((respuesta: Conductor) => {
        this.poblarFormulario(respuesta);
      });
  }

  private poblarFormulario(data: Conductor) {
    this.formularioConductor.setValue({
      id: data.id,
      numero_identificacion: data.numero_identificacion,
      digito_verificacion: data.digito_verificacion,
      nombre1: data.nombre1,
      nombre2: data.nombre2,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      nombre_corto: data.nombre_corto,
      fecha_nacimiento: data.fecha_nacimiento,
      direccion: data.direccion,
      barrio: data.barrio,
      telefono: data.telefono,
      celular: data.celular,
      correo: data.correo,
      numero_licencia: data.numero_licencia,
      categoria_licencia: data.categoria_licencia,
      fecha_vence_licencia: data.fecha_vence_licencia,
      fecha_expedicion_licencia: data.fecha_expedicion_licencia,
      fecha_ingreso: data.fecha_ingreso,
      fecha_retiro: data.fecha_retiro,
      propio: data.propio,
      estado_inactivo: data.estado_inactivo,
      estado_revisado: data.estado_revisado,
      comentario: data.comentario,
      identificacion: data.identificacion,
      identificacion__nombre: data.identificacion__nombre,
      ciudad: data.ciudad,
      ciudad__nombre: data.ciudad__nombre,
      rh: data.rh,
      rh__nombre: data.rh__nombre,
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

  calcularDigitoVerificacion() {
    const digito = this._devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioConductor.get('numero_identificacion')?.value
    );
    this.formularioConductor.patchValue({
      digito_verificacion: digito,
    });
  }
}
