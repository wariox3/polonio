import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const OPERACION_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  { name: 'nombre', displayName: 'Nombre', type: 'number' },
  { name: 'ciudad__nombre', displayName: 'Ciudad', type: 'string' },
];
