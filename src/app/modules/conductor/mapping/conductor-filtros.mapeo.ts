import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const CONDUCTOR_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'Id', type: 'number' },
  { name: 'numero_identificacion', displayName: 'Identificación', type: 'string' },
  { name: 'nombre', displayName: 'Nombre', type: 'string' },
];
