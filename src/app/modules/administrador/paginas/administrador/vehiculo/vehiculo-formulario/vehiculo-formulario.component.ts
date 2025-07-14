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
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { SwitchComponent } from '@app/common/components/ui/form/switch/switch.component';
import { RouterModule } from '@angular/router';

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
  ],
  templateUrl: './vehiculo-formulario.component.html',
})
export default class VehiculoFormularioComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  public formularioVehiculo: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
    this.consultarInformacion();
    // if (this.detalle) {
    //   this.consultardetalle();
    // }
  }

  inicializarFormulario() {
    const anioActual = new Date().getFullYear();

    this.formularioVehiculo = this._formBuilder.group({
      fecha_registro: [{ value: null, disabled: true }], // Campo automático
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
      comentario: ['', Validators.maxLength(500)],
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

  consultarInformacion() {}

  onSubmit() {
    if (this.formularioVehiculo.valid) {
    } else {
      this.formularioVehiculo.markAllAsTouched();
    }
  }

  getControl(nombre: string): FormControl {
    return this.formularioVehiculo.get(nombre) as FormControl;
  }
}
