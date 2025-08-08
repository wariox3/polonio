import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { formatearMonedaCOP, formatearFechaISO } from '@app/common/utils/formatters';

/**
 * Función para crear los campos del detalle de negocio
 * @returns Array de campos configurados
 */
export function obtenerCamposNegocioDetalle(): CampoDetalle[] {
  return [
    { clave: 'id', etiqueta: 'ID' },
    {
      clave: 'fecha',
      etiqueta: 'Fecha',
      formato: valor => formatearFechaISO(valor),
    },
    { clave: 'contacto__nombre_corto', etiqueta: 'Contacto' },
    { clave: 'ciudad_origen__nombre', etiqueta: 'Origen' },
    { clave: 'ciudad_destino__nombre', etiqueta: 'Destino' },
    { clave: 'unidades', etiqueta: 'Unidades' },
    {
      clave: 'peso',
      etiqueta: 'Peso',
      formato: valor => `${valor} kg`,
    },
    {
      clave: 'volumen',
      etiqueta: 'Volumen',
      formato: valor => `${valor} m³`,
    },
    {
      clave: 'declara',
      etiqueta: 'Valor Declarado',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'pago',
      etiqueta: 'Pago',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'flete',
      etiqueta: 'Flete',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'manejo',
      etiqueta: 'Manejo',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'comentario',
      etiqueta: 'Comentario',
      filaCompleta: true,
    },
  ];
}
