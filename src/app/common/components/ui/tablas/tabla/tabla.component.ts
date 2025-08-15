import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipDirective } from '@app/common/directives/tooltip';
import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TooltipDirective],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
})
export class TablaComponent implements OnChanges {
  // Propiedades de entrada
  @Input() columnas: ColumnaTabla[] = [];
  @Input() datos: any[] = [];
  @Input() claveCheckbox: string = 'id';
  @Input() mostrarAcciones: boolean = true;
  @Input() mostrarCheckbox: boolean = true;
  @Input() textoVacio: string = 'No hay datos disponibles';
  @Input() rutas: { editar: string; detalle: string } = { editar: '', detalle: '' };

  // Eventos de salida
  @Output() seleccionCambiada = new EventEmitter<any[]>();

  // Estado interno
  seleccionTodos: boolean = false;
  registrosSeleccionados: any[] = [];

  @ViewChild('checkboxGlobal', { static: false })
  checkboxGlobal: ElementRef<HTMLInputElement>;

  // Implementación del ciclo de vida OnChanges
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && !changes['datos'].firstChange) {
      // Reiniciar registrosSeleccionados si los datos cambian
      this.registrosSeleccionados = [];
      this.seleccionCambiada.emit(this.registrosSeleccionados);

      if (this.checkboxGlobal) {
        this.checkboxGlobal.nativeElement.checked = false;
      }

      this.seleccionTodos = false;
    }
  }

  // Alternar selección de todos los registros
  alternarSeleccionTodos(): void {
    this.seleccionTodos = !this.seleccionTodos;

    if (this.seleccionTodos) {
      this.agregarTodosLosRegistros();
    } else {
      this.removerTodosLosRegistros();
    }

    this.seleccionCambiada.emit([...this.registrosSeleccionados]);
  }

  // Alternar selección individual
  alternarSeleccion(registro: any, event: Event): void {
    event.stopPropagation();

    if (this.estaSeleccionado(registro)) {
      this.removerRegistroDeSeleccion(registro[this.claveCheckbox]);
    } else {
      this.agregarRegistroASeleccion(registro);
    }

    // Actualizar estado del checkbox global
    this.seleccionTodos = this.registrosSeleccionados.length === this.datos.length;

    this.seleccionCambiada.emit([...this.registrosSeleccionados]);
  }
  // Verificar selección
  estaSeleccionado(registro: any): boolean {
    return this.registrosSeleccionados.some(
      r => r[this.claveCheckbox] === registro[this.claveCheckbox]
    );
  }

  // Agregar un registro a la selección
  agregarRegistroASeleccion(registro: any): void {
    if (!this.estaSeleccionado(registro)) {
      this.registrosSeleccionados.push(registro);
    }
  }

  // Remover un registro de la selección
  removerRegistroDeSeleccion(id: any): void {
    this.registrosSeleccionados = this.registrosSeleccionados.filter(
      r => r[this.claveCheckbox] !== id
    );
  }

  // Agregar todos los registros a la selección
  agregarTodosLosRegistros(): void {
    this.registrosSeleccionados = [];
    this.datos.forEach(item => {
      if (!this.estaSeleccionado(item)) {
        this.registrosSeleccionados.push(item);
      }
    });
  }

  // Remover todos los registros de la selección
  removerTodosLosRegistros(): void {
    this.registrosSeleccionados = [];
  }

  // Formatear valor si hay función de formato
  formatearValor(columna: any, valor: any): string {
    return columna.formato ? columna.formato(valor) : valor;
  }

  // Estado indeterminado para mejor UX
  get estadoIndeterminado(): boolean {
    return (
      this.registrosSeleccionados.length > 0 &&
      this.registrosSeleccionados.length < this.datos.length
    );
  }

  getClaseAlineacion(columna: ColumnaTabla): string {
    switch (columna.alineacion) {
      case 'derecha':
        return 'text-end';
      case 'centro':
        return 'text-center';
      case 'izquierda':
      default:
        return 'text-start'; // valor por defecto
    }
  }
}
