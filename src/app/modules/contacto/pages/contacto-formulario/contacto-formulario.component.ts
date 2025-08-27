import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { RespuestaSeleccionarIdentificacion } from '@app/common/interfaces/identificacion.interface';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { DevuelveDigitoVerificacionService } from '@app/common/services/devuelve-digito-verificacion.service';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { GeneralRepository } from '@app/core';
import { debounceTime, filter, merge, Subject, switchMap, takeUntil, zip } from 'rxjs';
import { Contacto } from '@app/modules/contacto/interfaces/contacto.interface';
import { ContactoRepository } from '@app/modules/contacto/repositories/contacto.repository';
import { ValidarNumeroIdentificacion } from '../../interfaces/validar-numero-identificacion.interface';
import { DetalleParametros } from '@app/common/interfaces/detalle-parametros.interface';

@Component({
  selector: 'app-contacto-formulario',
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
  templateUrl: './contacto-formulario.component.html',
  styleUrl: './contacto-formulario.component.scss',
})
export default class ContactoFormularioComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _contactoRepository = inject(ContactoRepository);
  private _generalRepository = inject(GeneralRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _devuelveDigitoVerificacionService = inject(DevuelveDigitoVerificacionService);
  private _router = inject(Router);
  private _destroy$ = new Subject<void>();

  public informacionContacto: Contacto | null = null;
  public detalleID = signal(0);
  public arrRh = signal([]);
  public arrCiudad = signal([]);
  public arrIdentificacion = signal([]);
  public arrRegimen = signal([]);
  public arrCategoriaLicencia = signal([]);
  public arrTipoPersona = signal([]);
  public filtroIdentificacionSignal = signal(2);
  public filteredIdentificacionSignal = computed(() =>
    this.arrIdentificacion().filter(item => item.tipo_persona === this.filtroIdentificacionSignal())
  );
  public formularioConductor: FormGroup;
  public identificacionIdApiDetalleSignal = signal(0);

  @Input() visualizarBtnAtras = true;
  @Input() navegarAlGuardar = true;
  @Output() conductorCreado = new EventEmitter<Contacto>();

  ngOnInit() {
    this.consultarInformacion();
    this.inicializarFormulario();
    this._iniciarSuscripcionesFormularioConductor();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  inicializarFormulario() {
    this.formularioConductor = this._formBuilder.group({
      id: [],
      tipo_persona: [2, Validators.compose([Validators.required])],
      regimen: [2, Validators.compose([Validators.required])],
      numero_identificacion: ['', [Validators.required, Validators.maxLength(20)]],
      digito_verificacion: ['', [Validators.maxLength(1)]],
      nombre1: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-ZÑñ ]+$/), Validators.maxLength(50)],
      ],
      nombre2: [null, [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      apellido1: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-ZÑñ ]+$/), Validators.maxLength(50)],
      ],
      apellido2: [null, [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      nombre_corto: [null, [Validators.required, Validators.maxLength(200)]],
      direccion: [null, [Validators.required, Validators.maxLength(100)]],
      barrio: [null, [Validators.maxLength(200), cambiarVacioPorNulo.validar]],
      telefono: ['', [Validators.required, Validators.maxLength(50)]],
      celular: ['', [Validators.maxLength(50), cambiarVacioPorNulo.validar]],
      correo: [null, [Validators.email, Validators.maxLength(255), Validators.required]],
      identificacion: [1, [Validators.required]],
      ciudad: [null, [Validators.required]],
      ciudad__nombre: [null],
      cliente: [true],
    });
  }

  onSubmit() {
    this.actualizarNombreCorto();
    if (!this.formularioConductor.valid) {
      this.formularioConductor.markAllAsTouched();
      return;
    }
    if (this.detalleID() === 0) {
      this._nuevoConductor();
    } else {
      this._editarConductor();
    }
  }

  consultarInformacion() {
    zip(
      this._generalRepository.get('general/regimen/seleccionar/'),
      this._generalRepository.get('general/tipo_persona/seleccionar/'),
      this._generalRepository.get('general/identificacion/seleccionar/'),
      this._generalRepository.get('transporte/categoria_licencia/seleccionar/')
    ).subscribe(
      (
        respuesta: [
          RespuestaSeleccionar[],
          RespuestaSeleccionar[],
          RespuestaSeleccionarIdentificacion[],
          RespuestaSeleccionar[],
        ]
      ): void => {
        this.arrRegimen.set(
          respuesta[0].map((item: RespuestaSeleccionar) => ({
            valor: item.id,
            nombre: item.nombre,
          }))
        );
        this.arrTipoPersona.set(
          respuesta[1].map((item: RespuestaSeleccionar) => ({
            valor: item.id,
            nombre: item.nombre,
          }))
        );
        this.arrIdentificacion.set(
          respuesta[2].map((item: RespuestaSeleccionarIdentificacion) => ({
            valor: item.id,
            nombre: item.nombre,
            tipo_persona: item.tipo_persona,
          }))
        );
        this.arrCategoriaLicencia.set(
          respuesta[3].map((item: RespuestaSeleccionar) => ({
            valor: item.id,
            nombre: item.nombre,
          }))
        );
        if (this.detalleID() === 0) {
          this.formularioConductor.patchValue({
            identificacion: this.filteredIdentificacionSignal()[0].valor,
          });
        }
      }
    );
  }

  private _nuevoConductor() {
    this._contactoRepository
      .nuevo(this.formularioConductor.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe(respuesta => {
        if (!this.navegarAlGuardar) {
          this.conductorCreado.emit(respuesta);
          return;
        }
        this._router.navigate(['administracion/contacto/detalle/', respuesta.id]);
      });
  }

  private _editarConductor() {
    this._contactoRepository
      .editar(this.detalleID(), this.formularioConductor.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/contacto/detalle/', respuesta.id]);
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
    merge(
      this.formularioConductor.get('numero_identificacion')!.valueChanges.pipe(debounceTime(300)),
      this.formularioConductor.get('identificacion')!.valueChanges
    )
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._validarNumeroIdenficacionExistente());
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
      this.formularioConductor.get('numero_identificacion')!.setErrors(null);
      return;
    }
    this._consultarIdentificacionEnServicio();
  }

  private _consultarIdentificacionEnServicio() {
    const identificacionId = Number(this.formularioConductor.get('identificacion')?.value);
    const numeroIdentificacion = this.formularioConductor.get('numero_identificacion')?.value;

    if (!identificacionId || !numeroIdentificacion) {
      return;
    }

    this._contactoRepository
      .validarNumeroIdentificacion({
        identificacion_id: identificacionId,
        numero_identificacion: numeroIdentificacion,
      })
      .subscribe({
        next: respuesta => {
          this._actualizarErroresNumeroIdentificacion(respuesta);
        },
      });
  }

  private _seHanModificadoDatosDeIdentificacion() {
    const numeroIdentificacionCambio =
      Number(this.informacionContacto?.numero_identificacion) !==
      Number(this.formularioConductor.get('numero_identificacion')?.value);

    const identificacionIdCambio =
      this.informacionContacto?.identificacion_id !==
      Number(this.formularioConductor.get('identificacion')?.value);

    return numeroIdentificacionCambio || identificacionIdCambio;
  }

  private _actualizarErroresNumeroIdentificacion(data: ValidarNumeroIdentificacion) {
    const errores: { numeroIdentificacionExistente: boolean } | null = data.validacion
      ? { numeroIdentificacionExistente: true }
      : null;
    this.formularioConductor.get('numero_identificacion')!.setErrors(errores);
    this.formularioConductor.get('numero_identificacion')!.markAsTouched();
    this._changeDetectorRef.detectChanges();
  }
}
