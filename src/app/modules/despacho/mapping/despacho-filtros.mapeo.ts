import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const DESPACHO_LISTA_FILTERS: FilterField[] = [
  {
    name: 'id',
    displayName: 'ID',
    type: 'number',
  },
  {
    name: 'vehiculo',
    displayName: 'Vehículo',
    type: 'relation',
    relationConfig: {
      endpoint: 'administracion/vehiculo/seleccionar/',
      valueField: 'id',
      displayField: 'placa',
      searchField: 'placa',
    },
  },
  {
    name: 'remolque',
    displayName: 'Remolque',
    type: 'relation',
    relationConfig: {
      endpoint: 'administracion/vehiculo/seleccionar/',
      valueField: 'id',
      displayField: 'placa',
      searchField: 'placa',
    },
  },
  {
    name: 'conductor',
    displayName: 'Conductor',
    type: 'relation',
    relationConfig: {
      endpoint: 'administracion/conductor/seleccionar/',
      valueField: 'id',
      displayField: 'nombre_corto',
      searchField: 'nombre_corto',
    },
  },
  {
    name: 'ciudad_origen',
    displayName: 'Ciudad origen',
    type: 'relation',
    relationConfig: {
      endpoint: 'general/ciudad/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre',
    },
  },
  {
    name: 'ciudad_destino',
    displayName: 'Ciudad destino',
    type: 'relation',
    relationConfig: {
      endpoint: 'general/ciudad/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre',
    },
  },
  {
    name: 'ruta',
    displayName: 'Ruta',
    type: 'relation',
    relationConfig: {
      endpoint: 'general/ruta/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre',
    },
  },
  {
    name: 'operacion',
    displayName: 'Operación',
    type: 'relation',
    relationConfig: {
      endpoint: 'general/operacion/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre',
    },
  },
  {
    name: 'pago',
    displayName: 'Pago',
    type: 'number',
  },
  {
    name: 'flete',
    displayName: 'Flete',
    type: 'number',
  },
  {
    name: 'comentario',
    displayName: 'Comentario',
    type: 'string',
  },
];
