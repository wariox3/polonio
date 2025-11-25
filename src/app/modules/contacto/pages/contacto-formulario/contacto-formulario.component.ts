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
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { SelectSearchComponent } from '@app/common/components/ui/form/select-search/select-search.component';
import { SelectComponent } from '@app/common/components/ui/form/select/select.component';
import { RespuestaSeleccionarIdentificacion } from '@app/common/interfaces/identificacion.interface';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { DevuelveDigitoVerificacionService } from '@app/common/services/devuelve-digito-verificacion.service';
import { cambiarVacioPorNulo } from '@app/common/validators/campo-no-obligatorio.validator';
import { GeneralRepository } from '@app/core';
import { Contacto } from '@app/modules/contacto/interfaces/contacto.interface';
import { ContactoRepository } from '@app/modules/contacto/repositories/contacto.repository';
import { debounceTime, merge, Subject, takeUntil, zip } from 'rxjs';
import { ValidarNumeroIdentificacion } from '../../interfaces/validar-numero-identificacion.interface';

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
  public formularioContacto: FormGroup;
  public identificacionIdApiDetalleSignal = signal(0);

  @Input() visualizarBtnAtras = true;
  @Input() navegarAlGuardar = true;
  @Output() contactoCreado = new EventEmitter<Contacto>();

  ngOnInit() {
    this.consultarInformacion();
    this.inicializarFormulario();
    this._iniciarSuscripcionesFormularioContacto();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  inicializarFormulario() {
    this.formularioContacto = this._formBuilder.group({
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
    if (!this.formularioContacto.valid) {
      this.formularioContacto.markAllAsTouched();
      return;
    }
    if (this.detalleID() === 0) {
      this._nuevoContacto();
    } else {
      this._editarContacto();
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
          this.formularioContacto.patchValue({
            identificacion: this.filteredIdentificacionSignal()[0].valor,
          });
        }
      }
    );
  }

  private _nuevoContacto() {
    this._contactoRepository
      .nuevo(this.formularioContacto.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe(respuesta => {
        if (!this.navegarAlGuardar) {
          this.contactoCreado.emit(respuesta);
          return;
        }
        this._router.navigate(['administracion/contacto/detalle/', respuesta.id]);
      });
  }

  private _editarContacto() {
    this._contactoRepository
      .editar(this.detalleID(), this.formularioContacto.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe(respuesta => {
        this._router.navigate(['administracion/contacto/detalle/', respuesta.id]);
      });
  }

  getControl(nombre: string): FormControl {
    return this.formularioContacto.get(nombre) as FormControl;
  }

  actualizarNombreCorto() {
    let nombreCorto = '';
    const nombre1 = this.formularioContacto.get('nombre1')?.value;
    const nombre2 = this.formularioContacto.get('nombre2')?.value;
    const apellido1 = this.formularioContacto.get('apellido1')?.value;
    const apellido2 = this.formularioContacto.get('apellido2')?.value;

    nombreCorto = `${nombre1}`;
    if (nombre2 !== null) {
      nombreCorto += ` ${nombre2}`;
    }
    nombreCorto += ` ${apellido1}`;
    if (apellido2 !== null) {
      nombreCorto += ` ${apellido2}`;
    }

    this.formularioContacto.get('nombre_corto')?.patchValue(nombreCorto, { emitEvent: false });
  }

  calcularDigitoVerificacion() {
    const digito = this._devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContacto.get('numero_identificacion')?.value
    );
    this.formularioContacto.patchValue({
      digito_verificacion: digito,
    });
  }

  private _iniciarSuscripcionesFormularioContacto() {
    merge(
      this.formularioContacto.get('numero_identificacion')!.valueChanges.pipe(debounceTime(300)),
      this.formularioContacto.get('identificacion')!.valueChanges
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
      this.formularioContacto.get('numero_identificacion')!.setErrors(null);
      return;
    }
    this._consultarIdentificacionEnServicio();
  }

  private _consultarIdentificacionEnServicio() {
    const identificacionId = Number(this.formularioContacto.get('identificacion')?.value);
    const numeroIdentificacion = this.formularioContacto.get('numero_identificacion')?.value;

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
      Number(this.formularioContacto.get('numero_identificacion')?.value);

    const identificacionIdCambio =
      this.informacionContacto?.identificacion_id !==
      Number(this.formularioContacto.get('identificacion')?.value);

    return numeroIdentificacionCambio || identificacionIdCambio;
  }

  private _actualizarErroresNumeroIdentificacion(data: ValidarNumeroIdentificacion) {
    const errores: { numeroIdentificacionExistente: boolean } | null = data.validacion
      ? { numeroIdentificacionExistente: true }
      : null;
    this.formularioContacto.get('numero_identificacion')!.setErrors(errores);
    this.formularioContacto.get('numero_identificacion')!.markAsTouched();
    this._changeDetectorRef.detectChanges();
  }
}
