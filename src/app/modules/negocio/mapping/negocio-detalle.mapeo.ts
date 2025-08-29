import { ConfiguracionBadge } from '@app/common/components/ui/badges/estado-badges-container/estado-badges-container.interface';
import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { formatearMonedaCOP, formatearFechaISO } from '@app/common/utils/formatters';

/**
 * Función para crear los campos del detalle de negocio
 * @returns Array de campos configurados
 */
export function obtenerCamposNegocioDetalle(): CampoDetalle[] {
  return [
    {
      clave: 'fecha',
      etiqueta: 'Fecha',
      formato: valor => formatearFechaISO(valor),
    },
    { clave: 'contacto__nombre_corto', etiqueta: 'Contacto' },
    {
      clave: 'pago',
      etiqueta: 'Pago',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    { clave: 'ciudad_origen__nombre', etiqueta: 'Origen' },
    { clave: 'ciudad_destino__nombre', etiqueta: 'Destino' },
    {
      clave: 'flete',
      etiqueta: 'Flete',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    { clave: 'unidades', etiqueta: 'Unidades' },
    {
      clave: 'peso',
      etiqueta: 'Peso',
      formato: valor => `${valor} kg`,
    },
    {
      clave: 'declara',
      etiqueta: 'Declarado',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    {
      clave: 'volumen',
      etiqueta: 'Volumen',
      formato: valor => `${valor}`,
    },
    { clave: '', etiqueta: '' },
    {
      clave: 'manejo',
      etiqueta: 'Manejo',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    {
      clave: 'publicar',
      etiqueta: 'Publicar',
      formato: valor => (valor ? 'Sí' : 'No'),
    },
    { clave: '', etiqueta: '' },
    { clave: '', etiqueta: '' },
    {
      clave: 'comentario',
      etiqueta: 'Comentario',
      filaCompleta: true,
    },
  ];
}

/**
 * Configuración de los estados para la guía
 */
export const configuracionEstados: ConfiguracionBadge[] = [
  { clave: 'estado_aprobado', etiqueta: 'Aprobado' },
];
