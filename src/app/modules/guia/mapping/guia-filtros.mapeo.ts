import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const GUIA_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'Id', type: 'number' },
  {
    name: 'ciudad_origen',
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
    name: 'ciudad_destino',
    displayName: 'Ciudad destino',
    type: 'relation',
    relationConfig: {
      endpoint: 'general/ciudad/seleccionar/',
      valueField: 'id',
      displayField: 'nombre',
      searchField: 'nombre__icontains',
    },
  },
];
