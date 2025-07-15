import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { SwitchComponent } from '@app/common/components/ui/form/switch/switch.component';
import { SelectComponent } from '@app/common/components/ui/form/select/select.component';

@Component({
  selector: 'app-conductor-formulario',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LabelComponent,
    InputComponent,
    SwitchComponent,
    RouterModule,
    SelectComponent,
  ],
  templateUrl: './conductor-formulario.component.html',
  styleUrl: './conductor-formulario.component.scss',
})
export default class ConductorFormularioComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  public formularioConductor: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
    this.consultarInformacion();
    // if (this.detalle) {
    //   this.consultardetalle();
    // }
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
      identificacion: [null, [Validators.required]], // Relación foránea
      ciudad: [null, [Validators.required]],
      rh: [null, [Validators.required]],
    });
  }

  consultarInformacion() {}

  onSubmit() {
    if (this.formularioConductor.valid) {
    } else {
      this.formularioConductor.markAllAsTouched();
    }
  }

  getControl(nombre: string): FormControl {
    return this.formularioConductor.get(nombre) as FormControl;
  }
}
