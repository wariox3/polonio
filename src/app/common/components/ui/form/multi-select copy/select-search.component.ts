import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

export interface MultiSelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule], // ✅ Aquí se importa
})
export class SelectSearchComponent {
  @Input() options: any[] = [];
  @Input() selectedOptions: any[] = [];
  @Input() label: string = 'nombre';
  @Input() value: string = 'id';
  @Input() multiSelect: boolean = false;
  @Input() notFoundText = 'Sin elementos';
  @Input() placeholder = 'Selecciona un elemento';
  @Input() control!: FormControl;
  @Input() errors: { [key: string]: string } = {};

  @Output() selectionChange = new EventEmitter<any[]>();

  constructor() {}

  emitirSeleccion() {
    this.selectionChange.emit(this.selectedOptions);
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) {
      return null;
    }

    for (const key of Object.keys(this.control.errors)) {
      if (this.errors[key]) {
        return this.errors[key]; // Mensaje personalizado
      }
    }

    // Fallback genérico si no hay mensaje definido para la clave
    return 'Este campo no es válido.';
  }
}
