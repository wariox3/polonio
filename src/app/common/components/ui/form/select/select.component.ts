import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface Opciones {
  valor: string;
  nombre: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() control: AbstractControl | null = null;
  @Input() opciones: Opciones[] = [];
  @Input() errors: { [key: string]: string } = {};

  value: string | null = null;
  disabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  // -------------------
  // Métodos de ControlValueAccessor
  // -------------------
  writeValue(value: any): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // -------------------
  // Manejo de cambios en el select
  // -------------------
  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value || null; // "" → null
    this.onChange(this.value);
    this.onTouched();
  }

  // -------------------
  // Manejo de errores
  // -------------------
  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) {
      return null;
    }

    for (const key of Object.keys(this.control.errors)) {
      if (this.errors[key]) {
        return this.errors[key];
      }
    }

    return 'Este campo no es válido.';
  }
}

// import { CommonModule } from '@angular/common';
// import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// import { FormControl, ReactiveFormsModule } from '@angular/forms';

// interface Opciones {
//   valor: string;
//   nombre: string;
// }

// @Component({
//   selector: 'app-select',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './select.component.html',
//   styleUrl: './select.component.css',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class SelectComponent {
//   @Input({ required: true }) control = new FormControl();
//   @Input() opciones: Opciones[] = [];
// }
