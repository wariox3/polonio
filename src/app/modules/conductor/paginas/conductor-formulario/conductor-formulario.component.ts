import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
import { DevuelveDigitoVerificacionService } from '@app/common/services/devuelve-digito-verificacion.service';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { GeneralRepository } from '@app/core';
import { debounceTime, filter, Subject, switchMap, takeUntil, zip } from 'rxjs';
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
    SelectComponent,
  ],
  templateUrl: './conductor-formulario.component.html',
  styleUrl: './conductor-formulario.component.scss',
})
export default class ConductorFormularioComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _conductorRepository = inject(ConductorRepository);
  private _generalRepository = inject(GeneralRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private _devuelveDigitoVerificacionService = inject(DevuelveDigitoVerificacionService);
  private _router = inject(Router);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _destroy$ = new Subject<void>();
  public informacionContacto: any = {
    id: 0,
    identificacion: 0,
    digito_verificacion: 0,
    ciudad: 0,
    ciudad__nombre: '',
    ciudad__estado__nombre: '',
    numero_identificacion: '',
    nombre_corto: '',
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    direccion: '',
    barrio: '',
    telefono: '',
    celular: '',
    correo: '',
    numero_licencia: '',
    categoria_licencia: '',
    fecha_vence_licencia: '',
    identificacion_id: 0,
  };
  public detalleID = signal(0);
  public arrRh = signal([]);
  public arrCiudad = signal([]);
  public arrIdentificacion = signal([]);
  public arrRegimen = signal([]);
  public arrTipoPersona = signal([]);
  public filtroIdentificacionSignal = signal(1);
  public filteredIdentificacionSignal = computed(() =>
    this.arrIdentificacion().filter(item => item.tipo_persona === this.filtroIdentificacionSignal())
  );
  public formularioConductor: FormGroup;
  public identificacionIdApiDetalleSignal = signal(0);

  ngOnInit() {
    this.inicializarFormulario();
    this.consultardetalle();
    this.consultarInformacion();
    this._iniciarSuscripcionesFormularioConductor();
  }

  inicializarFormulario() {
    this.formularioConductor = this._formBuilder.group({
      id: [],
      tipo_persona: [1, Validators.compose([Validators.required])],
      regimen: [1, Validators.compose([Validators.required])],
      numero_identificacion: ['', [Validators.required, Validators.maxLength(20)]],
      digito_verificacion: ['', [Validators.maxLength(1)]],
      nombre1: ['', [Validators.required, Validators.maxLength(50)]],
      nombre2: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      apellido1: ['', [Validators.required, Validators.maxLength(50)]],
      apellido2: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      nombre_corto: ['', [Validators.required, Validators.maxLength(200)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      barrio: ['', [Validators.maxLength(200), cambiarVacioPorNulo.validar]],
      telefono: ['', [Validators.required, Validators.maxLength(50)]],
      celular: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      numero_licencia: ['', [Validators.required, Validators.maxLength(50)]],
      categoria_licencia: ['', [Validators.required, Validators.maxLength(2)]],
      fecha_vence_licencia: ['', [Validators.required]],
      identificacion: [1, [Validators.required]],
      ciudad: [null, [Validators.required]],
      ciudad__nombre: [null],
    });
  }

  onSubmit() {
    if (this.formularioConductor.valid) {
      if (this.detalleID() === 0) {
        this._nuevoConductor();
      } else {
        this._editarConductor();
      }
    } else {
      this.formularioConductor.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  consultarInformacion() {
    zip(
      this._generalRepository.get('general/regimen/seleccionar/'),
      this._generalRepository.get('general/tipo_persona/seleccionar/'),
      this._generalRepository.get('general/identificacion/seleccionar/')
    ).subscribe((respuesta: any) => {
      this.arrRegimen.set(
        respuesta[0].map((item: any) => ({
          valor: item.id,
          nombre: item.nombre,
        }))
      );
      this.arrTipoPersona.set(
        respuesta[1].map((item: any) => ({
          valor: item.id,
          nombre: item.nombre,
        }))
      );
      this.arrIdentificacion.set(
        respuesta[2].map((item: any) => ({
          valor: item.id,
          nombre: item.nombre,
          tipo_persona: item.tipo_persona,
        }))
      );
      this.formularioConductor.patchValue({
        identificacion: this.filteredIdentificacionSignal()[0].valor,
      });
    });
  }

  private _nuevoConductor() {
    this.actualizarNombreCorto();
    this._conductorRepository
      .nuevo(this.formularioConductor.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/conductor/detalle/', respuesta.id]);
      });
  }

  private _editarConductor() {
    if (this.formularioConductor.get('tipo_persona')?.value == 1) {
      this.formularioConductor.patchValue({
        nombre1: null,
        nombre2: null,
        apellido1: null,
        apellido2: null,
      });
    }
    this._conductorRepository
      .editar(this.detalleID(), this.formularioConductor.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/conductor/detalle/', respuesta.id]);
      });
  }

  consultardetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this._destroy$),
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

  private poblarFormulario(data: any) {
    this.informacionContacto = data;
    this.identificacionIdApiDetalleSignal.update(() => data.identificacion_id);
    this.formularioConductor.setValue({
      id: data.id,
      numero_identificacion: data.numero_identificacion,
      digito_verificacion: data.digito_verificacion,
      nombre1: data.nombre1,
      nombre2: data.nombre2,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      nombre_corto: data.nombre_corto,
      direccion: data.direccion,
      barrio: data.barrio,
      telefono: data.telefono,
      celular: data.celular,
      correo: data.correo,
      numero_licencia: data.numero_licencia,
      categoria_licencia: data.categoria_licencia,
      fecha_vence_licencia: data.fecha_vence_licencia,
      identificacion: data.identificacion_id,
      ciudad: data.ciudad_id,
      ciudad__nombre: data.ciudad_nombre,
      tipo_persona: data.tipo_persona_id,
      regimen: data.regimen_id,
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

  private _iniciarSuscripcionesFormularioConductor() {
    this.formularioConductor.get('tipo_persona')?.valueChanges.subscribe((valor: any) => {
      const valorPersonaTipo = parseInt(valor);
      this.filtroIdentificacionSignal.set(valorPersonaTipo);

      if (valorPersonaTipo === 1) {
        this._setValidators('nombre1', [
          Validators.pattern(/^[a-zA-ZÑñ ]+$/),
          Validators.maxLength(50),
        ]);
        this._setValidators('apellido1', [
          Validators.pattern(/^[a-zA-ZÑñ ]+$/),
          Validators.maxLength(50),
        ]);
        this._setValidators('nombre_corto', [Validators.required, Validators.maxLength(200)]);

        if (this.detalleID() === 0) {
          this.formularioConductor.patchValue(
            {
              nombre1: null,
              nombre2: null,
              apellido1: null,
              apellido2: null,
              identificacion: this.filteredIdentificacionSignal()[0].valor,
              tipo_persona: valorPersonaTipo,
            },
            { emitEvent: false }
          );
        } else {
          this.formularioConductor.patchValue(
            {
              identificacion: this.filteredIdentificacionSignal()[0].valor,
              tipo_persona: valorPersonaTipo,
            },
            { emitEvent: false }
          );
        }
      }

      if (valorPersonaTipo === 2) {
        this._setValidators('nombre1', [
          Validators.required,
          Validators.pattern(/^[a-zA-ZÑñ ]+$/),
          Validators.maxLength(50),
        ]);
        this._setValidators('apellido1', [
          Validators.required,
          Validators.pattern(/^[a-zA-ZÑñ ]+$/),
          Validators.maxLength(50),
        ]);
        this._setValidators('nombre_corto', [Validators.maxLength(200)]);

        if (this.detalleID() === 0) {
          this.formularioConductor.patchValue(
            {
              identificacion: this.filteredIdentificacionSignal()[0].valor,
              tipo_persona: valorPersonaTipo,
            },
            { emitEvent: false }
          );
        }
        if (this.detalleID() > 0) {
          console.log(this.filteredIdentificacionSignal());

          this.formularioConductor.patchValue(
            {
              identificacion: this.identificacionIdApiDetalleSignal(),
              tipo_persona: valorPersonaTipo,
            },
            { emitEvent: false }
          );
        }
      }
    });
    this.formularioConductor
      .get('numero_identificacion')!
      .valueChanges.pipe(debounceTime(300))
      .subscribe(value => {
        if (value !== null) {
          this._validarNumeroIdenficacionExistente();
        }
      });
    this.formularioConductor.get('identificacion')!.valueChanges.subscribe(() => {
      this._validarNumeroIdenficacionExistente();
    });
  }

  private _validarNumeroIdenficacionExistente() {
    if (!this.detalleID) {
      this._consultarIdentificacionEnServicio();
    } else {
      this._procesarValidacionNumeroIdentificacion();
    }
  }

  private _procesarValidacionNumeroIdentificacion() {
    if (!this._seHanModificadoDatosDeIdentificacion()) {
      // No hay errores si los datos no han cambiado
      this.formularioConductor.get('numero_identificacion')!.setErrors(null);
      return;
    }

    // Si los datos han cambiado, consulta al servicio
    this._consultarIdentificacionEnServicio();
  }

  private _consultarIdentificacionEnServicio() {
    const identificacionId = parseInt(this.formularioConductor.get('identificacion')?.value);
    const numeroIdentificacion = this.formularioConductor.get('numero_identificacion')?.value;

    if (!identificacionId || !numeroIdentificacion) {
      return; // Salir si no hay valores para validar
    }

    this._conductorRepository
      .validarNumeroIdentificacion({
        identificacion_id: identificacionId,
        numero_identificacion: numeroIdentificacion,
      })
      .subscribe({
        next: respuesta => {
          this._actualizarErroresNumeroIdentificacion(respuesta.validacion);
        },
      });
  }

  private _seHanModificadoDatosDeIdentificacion() {
    const numeroIdentificacionCambio =
      parseInt(this.informacionContacto.numero_identificacion) !==
      parseInt(this.formularioConductor.get('numero_identificacion')?.value);

    const identificacionIdCambio =
      parseInt(this.informacionContacto.identificacion_id) !==
      parseInt(this.formularioConductor.get('identificacion')?.value);

    return numeroIdentificacionCambio || identificacionIdCambio;
  }

  private _actualizarErroresNumeroIdentificacion(esValido: boolean) {
    const errores: { numeroIdentificacionExistente: boolean } | null = esValido
      ? { numeroIdentificacionExistente: true }
      : null;

    this.formularioConductor.get('numero_identificacion')!.setErrors(errores);
    this.formularioConductor.get('numero_identificacion')!.markAsTouched();
    this._changeDetectorRef.detectChanges();
  }

  private _setValidators(fieldName: string, validators: any[]) {
    const control = this.formularioConductor.get(fieldName);
    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();
  }
}
