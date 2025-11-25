import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';

/**
 * Función para crear los campos del detalle de vehículo
 * @param datos Objeto con los datos del vehículo
 * @returns Array de campos configurados
 */
export function obtenerCamposVehiculoDetalle(): CampoDetalle[] {
  return [
    { clave: 'placa', etiqueta: 'Placa' },
    { clave: 'modelo', etiqueta: 'Modelo' },
    { clave: 'modelo_repotenciado', etiqueta: 'Modelo repotenciado' },
    { clave: 'marca__nombre', etiqueta: 'Marca' },
    { clave: 'linea__nombre', etiqueta: 'Línea' },
    { clave: 'color__nombre', etiqueta: 'Color' },
    { clave: 'configuracion__nombre', etiqueta: 'Configuración' },
    { clave: 'carroceria__nombre', etiqueta: 'Carrocería' },
    { clave: 'combustible__nombre', etiqueta: 'Combustible' },
    { clave: 'chasis', etiqueta: 'Chasis' },
    { clave: 'motor', etiqueta: 'Motor' },
    { clave: 'ejes', etiqueta: 'Número ejes' },
    { clave: 'peso_vacio', etiqueta: 'Peso Vacío (kg)' },
    { clave: 'capacidad', etiqueta: 'Capacidad (kg)' },
    { clave: 'remolque', etiqueta: 'Remolque', formato: (valor: boolean) => (valor ? 'SI' : 'NO') },
    { clave: 'propietario__nombre_corto', etiqueta: 'Propietario' },
    { clave: 'poseedor__nombre_corto', etiqueta: 'Poseedor' },
    {
      clave: 'propietario',
      etiqueta: 'Propio',
      formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
    },

    { clave: 'celular', etiqueta: 'Celular' },
    { clave: '', etiqueta: '' },
    { clave: 'aseguradora__nombre_corto', etiqueta: 'Aseguradora' },
    { clave: 'poliza', etiqueta: 'Póliza' },
    { clave: 'tecnicomecanica', etiqueta: 'Tecnomecánica' },
    { clave: 'vence_tecnicomecanica', etiqueta: 'Vence tecnomecánica' },
    { clave: 'vence_poliza', etiqueta: 'Vence póliza' },
    { clave: '', etiqueta: '' },
    {
      clave: 'estado_revisado',
      etiqueta: 'Revisado',
      formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_inactivo',
      etiqueta: 'Inactivo',
      formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
    },
    { clave: 'comentario', etiqueta: 'Comentario', filaCompleta: true },
  ];
}
