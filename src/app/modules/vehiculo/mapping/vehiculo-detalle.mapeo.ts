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
    { clave: 'modelo_repotenciado', etiqueta: 'Modelo Repotenciado' },
    { clave: 'motor', etiqueta: 'Motor' },
    { clave: 'chasis', etiqueta: 'Chasis' },
    { clave: 'ejes', etiqueta: 'Número ejes' },
    { clave: 'peso_vacio', etiqueta: 'Peso Vacío (kg)' },
    { clave: 'capacidad', etiqueta: 'Capacidad (kg)' },
    { clave: 'celular', etiqueta: 'Celular' },
    { clave: 'tecnicomecanica', etiqueta: 'Tecnomecánica' },
    { clave: 'vence_tecnicomecanica', etiqueta: 'Vence Tecnomecánica' },
    { clave: 'color__nombre', etiqueta: 'Color' },
    { clave: 'marca__nombre', etiqueta: 'Marca' },
    { clave: 'linea__nombre', etiqueta: 'Línea' },
    { clave: 'combustible__nombre', etiqueta: 'Combustible' },
    { clave: 'carroceria__nombre', etiqueta: 'Carrocería' },
    { clave: 'configuracion__nombre', etiqueta: 'Configuración' },
    { clave: 'poseedor__nombre_corto', etiqueta: 'Poseedor' },
    { clave: 'propietario__nombre_corto', etiqueta: 'Propietario' },
    {
      clave: 'propietario',
      etiqueta: 'Propio',
      formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
    },
    { clave: 'remolque', etiqueta: 'Remolque', formato: (valor: boolean) => (valor ? 'SI' : 'NO') },
    {
      clave: 'estado_inactivo',
      etiqueta: 'Inactivo',
      formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_revisado',
      etiqueta: 'Revisado',
      formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
    },
    { clave: 'aseguradora__nombre_corto', etiqueta: 'Aseguradora' },
    { clave: 'poliza', etiqueta: 'Póliza' },
    { clave: 'vence_poliza', etiqueta: 'Vence Póliza' },
    { clave: 'comentario', etiqueta: 'Comentario', filaCompleta: true },
  ];
}
