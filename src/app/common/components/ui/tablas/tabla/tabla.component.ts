import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class TablaComponent {
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

  // Alternar selección de todos los registros - CORRECCIÓN PRINCIPAL
  alternarSeleccionTodos(): void {
    const nuevoEstado = !this.seleccionTodos;
    this.seleccionTodos = nuevoEstado;

    this.registrosSeleccionados = [];

    if (nuevoEstado) {
      this.registrosSeleccionados = [...this.datos];
      // Emitimos pero NO limpiamos para que se mantengan seleccionados visualmente
      this.notificarSeleccion(false);
    } else {
      // Desmarcar todos → emitimos y limpiamos
      this.notificarSeleccion(true);
    }
  }

  // Alternar selección individual - CORRECCIÓN ADICIONAL
  alternarSeleccion(registro: any, event: Event): void {
    event.stopPropagation();

    const index = this.registrosSeleccionados.findIndex(
      r => r[this.claveCheckbox] === registro[this.claveCheckbox]
    );

    if (index === -1) {
      this.registrosSeleccionados.push(registro);
    } else {
      this.registrosSeleccionados.splice(index, 1);
    }

    this.seleccionTodos = this.registrosSeleccionados.length === this.datos.length;

    // En selección individual sí limpiamos después de emitir
    this.notificarSeleccion(true);
  }
  // Verificar selección
  estaSeleccionado(registro: any): boolean {
    return this.registrosSeleccionados.some(
      r => r[this.claveCheckbox] === registro[this.claveCheckbox]
    );
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

  private notificarSeleccion(limpiar = true): void {
    this.seleccionCambiada.emit([...this.registrosSeleccionados]);

    if (limpiar) {
      this.registrosSeleccionados = [];
      this.seleccionTodos = false;
    }
  }
}
