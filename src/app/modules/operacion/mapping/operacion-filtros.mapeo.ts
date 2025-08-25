import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const OPERACION_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'Id', type: 'number' },
  { name: 'nombre', displayName: 'Nombre', type: 'string' },
  { name: 'ciudad__nombre', displayName: 'Ciudad', type: 'string' },
];
