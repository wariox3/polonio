import { BadgeColor } from '../estado-badge/estado-badge.component';

export interface ConfiguracionBadge {
  clave: string; // Propiedad en el objeto de datos
  etiqueta: string; // Texto a mostrar en el badge
  mostrar?: boolean | ((datos: any) => boolean); // Condición para mostrar este badge
  colorMap?: {
    // Mapeo de valores a colores
    [key: string]: BadgeColor;
    _default?: BadgeColor; // Color por defecto
  };
  // Para estados booleanos simples
  colorTrue?: BadgeColor; // Color cuando es true (default: green)
  colorFalse?: BadgeColor; // Color cuando es false (default: gray)
}
