import { FilterField } from '@app/common/components/ui/filtro/interface/filtro.interface';

export const VERIFICACION_LISTA_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'Id', type: 'number' },
  { name: 'placa', displayName: 'Placa', type: 'string' },
  { name: 'verificado', displayName: 'Verificado', type: 'boolean' },
  { name: 'estado_proceso', displayName: 'Proceso', type: 'boolean' },
];
