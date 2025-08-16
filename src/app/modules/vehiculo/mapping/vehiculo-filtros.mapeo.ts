import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const VEHICULO_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  { name: 'placa', displayName: 'Placa', type: 'string' },
  { name: 'marca', displayName: 'Marca', type: 'string' },
  { name: 'modelo', displayName: 'Modelo', type: 'string' },
  { name: 'year', displayName: 'Año', type: 'number' },
  { name: 'color', displayName: 'Color', type: 'string' },
  { name: 'fecha_creacion', displayName: 'Fecha Creación', type: 'date' },
  { name: 'fecha_actualizacion', displayName: 'Fecha Actualización', type: 'date' },
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
