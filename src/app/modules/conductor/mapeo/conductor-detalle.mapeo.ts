import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Conductor } from '../interfaces/conductor.interface';

/**
 * Función para crear los campos del detalle de conductor
 * @param datos Objeto con los datos del conductor
 * @returns Array de campos configurados
 */
export function obtenerCamposConductorDetalle(datos: Conductor): CampoDetalle[] {
  return [
    { clave: 'tipo_persona', etiqueta: 'Tipo persona', filaCompleta: true },
    { clave: 'nombre_corto', etiqueta: 'Nombre', filaCompleta: true },
    { clave: 'nombre1', etiqueta: 'Primer nombre' },
    { clave: 'nombre2', etiqueta: 'Segundo  nombre' },
    { clave: 'apellido1', etiqueta: 'Primer apellido	' },
    { clave: 'apellido2', etiqueta: 'Segundo apellido' },
    { clave: 'identificacion_abreviatura', etiqueta: 'Tipo identificación' },
    {
      clave: 'numero_identificacion',
      etiqueta: 'Identificación',
    },
    {
      clave: 'digito_verificacion',
      etiqueta: 'Digito verificación',
    },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    { clave: 'celular', etiqueta: 'Celular' },
    { clave: 'correo', etiqueta: 'Correo' },
    { clave: 'numero_licencia', etiqueta: 'Licencia' },
    { clave: 'categoria_licencia', etiqueta: 'Categoria' },
    { clave: 'fecha_vence_licencia', etiqueta: 'Vence' },
    { clave: 'direccion', etiqueta: 'Dirección', filaCompleta: true },
    { clave: 'regimen_nombre', etiqueta: 'Regimen', filaCompleta: true },
  ];
}
