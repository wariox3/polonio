import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const RUTA_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'Id', type: 'number' },
  { name: 'nombre', displayName: 'Nombre', type: 'string' },
];
