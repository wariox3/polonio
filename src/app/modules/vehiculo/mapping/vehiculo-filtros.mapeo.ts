import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const VEHICULO_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'Id', type: 'number' },
  { name: 'placa', displayName: 'Placa', type: 'string' },
];
