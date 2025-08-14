import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para definir un campo de la tabla de detalles
 */
export interface CampoDetalle {
  /** Clave del campo en el objeto de datos */
  clave: string;
  /** Etiqueta que se mostrará en la tabla */
  etiqueta: string;
  /** Función opcional para formatear el valor antes de mostrarlo */
  formato?: (valor: any) => string;
  /** Ancho opcional para la columna de etiqueta (ej: 'w-1/4', '150px') */
  anchoEtiqueta?: string;
  /** Ancho opcional para la columna de valor (ej: 'w-1/4', '150px') */
  anchoValor?: string;
  /** Si el campo debe ocupar una fila completa (para comentarios largos) */
  filaCompleta?: boolean;
}

@Component({
  selector: 'app-tabla-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-detalles.component.html',
  styleUrls: ['./tabla-detalles.component.scss'],
})
export class TablaDetallesComponent {
  /**
   * Datos a mostrar en la tabla de detalles
   */
  @Input() datos: any = {};

  /**
   * Configuración de los campos a mostrar
   */
  @Input() campos: CampoDetalle[] = [];

  /**
   * Número de columnas para mostrar (2, 4, 6 u 8)
   * - 2: Una etiqueta y un valor por fila
   * - 4: Dos pares de etiqueta-valor por fila
   * - 6: Tres pares de etiqueta-valor por fila
   * - 8: Cuatro pares de etiqueta-valor por fila
   */
  @Input() columnas: 2 | 4 | 6 | 8 = 4;

  /**
   * Texto a mostrar cuando no hay datos
   */
  @Input() textoVacio: string = 'No hay datos disponibles';

  /**
   * Estilo de borde para la tabla
   */
  @Input() estiloBorde: 'redondeado' | 'cuadrado' | 'ninguno' = 'redondeado';

  /**
   * Estilo de fondo para las etiquetas
   */
  @Input() estiloFondo: 'gris' | 'azul' | 'ninguno' = 'gris';

  /**
   * Obtener el valor formateado de un campo
   */
  obtenerValor(campo: CampoDetalle): string {
    if (!this.datos || this.datos[campo.clave] === undefined) {
      return '';
    }

    const valor = this.datos[campo.clave];
    return campo.formato ? campo.formato(valor) : valor;
  }

  /**
   * Verificar si hay datos disponibles
   */
  get hayDatos(): boolean {
    return this.datos && Object.keys(this.datos).length > 0;
  }

  /**
   * Obtener clase CSS para el contenedor de la tabla
   */
  get clasesContenedor(): string {
    let clases = 'overflow-x-auto';

    if (this.estiloBorde === 'redondeado') {
      clases += ' rounded-xl';
    }

    clases += ' bg-white border border-gray-200';

    return clases;
  }

  /**
   * Obtener clase CSS para las celdas de etiqueta
   */
  get clasesEtiqueta(): string {
    let clases = 'px-4 py-3 font-semibold text-sm text-gray-700 border-r border-gray-200';

    if (this.estiloFondo === 'gris') {
      clases += ' bg-gray-50';
    } else if (this.estiloFondo === 'azul') {
      clases += ' bg-blue-50';
    }

    return clases;
  }

  /**
   * Obtener el número de campos por fila según la configuración de columnas
   */
  get camposPorFila(): number {
    switch (this.columnas) {
      case 2:
        return 1; // 1 par por fila
      case 4:
        return 2; // 2 pares por fila
      case 6:
        return 3; // 3 pares por fila
      case 8:
        return 4; // 4 pares por fila
      default:
        return 2; // Valor por defecto
    }
  }

  /**
   * Obtener el ancho base para las celdas según el número de columnas
   */
  get anchoCelda(): string {
    switch (this.columnas) {
      case 2:
        return 'w-1/3'; // Etiqueta: 1/3, Valor: 2/3
      case 4:
        return 'w-1/4'; // Cada celda ocupa 1/4
      case 6:
        return 'w-1/6'; // Cada celda ocupa 1/6
      case 8:
        return 'w-1/8'; // Cada celda ocupa 1/8
      default:
        return 'w-1/4';
    }
  }
}
