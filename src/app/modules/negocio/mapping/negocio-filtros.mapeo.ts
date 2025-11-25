import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const NEGOCIO_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'Id', type: 'number' },
  { name: 'fecha', displayName: 'Fecha', type: 'date' },
];
