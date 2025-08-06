import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const GUIA_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  { name: 'numero', displayName: 'Número', type: 'number' },
  { name: 'ingreso', displayName: 'Ingreso', type: 'string' },
  { name: 'flete', displayName: 'Flete', type: 'number' },
  { name: 'manejo', displayName: 'Manejo', type: 'number' },
  { name: 'fecha_creacion', displayName: 'Fecha Creación', type: 'date' },
  { name: 'fecha_actualizacion', displayName: 'Fecha Actualización', type: 'date' },
  {
    name: 'estado_decodificado_alerta',
    displayName: 'Alerta',
    type: 'boolean',
  },
  // Ejemplo de campo de relación (descomenta y ajusta según tu API)
  // {
  //   name: 'conductor_id',
  //   displayName: 'Conductor',
  //   type: 'relation',
  //   relationConfig: {
  //     endpoint: 'transporte/conductor/',
  //     valueField: 'id',
  //     displayField: 'nombre_completo',
  //     searchField: 'search',
  //     preload: false
  //   }
  // }
];
