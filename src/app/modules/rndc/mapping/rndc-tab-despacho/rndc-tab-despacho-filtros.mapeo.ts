import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const DESPACHO_LISTA_FILTERS: FilterField[] = [
  {
    name: 'id',
    displayName: 'Id',
    type: 'number',
  },
  {
    name: 'vehiculo__placa',
    displayName: 'Vehículo',
    type: 'string',
  },
  {
    name: 'remolque__placa',
    displayName: 'Remolque',
    type: 'string',
  },
  {
    name: 'conductor_id',
    displayName: 'Conductor',
    type: 'relation',
    relationConfig: {
      endpoint: 'general/contacto/seleccionar/',
      valueField: 'id',
      displayField: 'nombre_corto',
      searchField: 'nombre_corto__icontains',
      queryParams: {
        conductor: 'True',
      },
    },
  },
  {
    name: 'ciudad_origen_id',
    displayName: 'Ciudad origen',
    type: 'relation',
    relationConfig: {
      endpoint: 'general/ciudad/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre__icontains',
    },
  },
  {
    name: 'ciudad_destino_id',
    displayName: 'Ciudad destino',
    type: 'relation',
    relationConfig: {
      endpoint: 'general/ciudad/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre__icontains',
    },
  },
  {
    name: 'ruta_id',
    displayName: 'Ruta',
    type: 'relation',
    relationConfig: {
      endpoint: 'transporte/ruta/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre__icontains',
    },
  },
  {
    name: 'operacion_id',
    displayName: 'Operación',
    type: 'relation',
    relationConfig: {
      endpoint: 'transporte/operacion/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre__icontains',
    },
  },
];
