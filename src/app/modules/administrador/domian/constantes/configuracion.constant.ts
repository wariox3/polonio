import { ModuloConfig } from '@app/interfaces/menu/configuracion.interface';
import { VEHICULOS_FILTERS } from '../mapeo/vehiculo.mapeo';
// import { CONTACTO_FILTERS } from "@modulos/general/domain/mapeos/contacto.mapeo";
// import { DOCUMENTO_FILTERS } from "src/app/core/constants/mapeo/documento.mapeo";

// const DocLista = 'cartera/documento/lista';
// const DocNuevo = 'cartera/documento/nuevo';
// const DocEditar = 'cartera/documento/editar';
// const DocDetalle = 'cartera/documento/detalle';

export const CARTERA_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'administador',
  funcionalidades: [
    {
      nombreFuncionalidad: 'administracion',
      modelos: [
        {
          key: 'TteVehiculo',
          nombreModelo: 'Vehiculo',
          documentacion: {
            id: 1039,
          },
          ajustes: {
            rutas: {
              lista: 'vehiculo/administracion/lista',
              nuevo: 'vehiculo/administracion/nuevo',
              detalle: 'vehiculo/administracion/detalle',
            },
            endpoint: 'general/vehiculo',
            queryParams: {
              ordering: '-id',
            },
            parametrosHttpConfig: {
              modelo: 'TteVehiculo',
              filtros: {
                ui: VEHICULOS_FILTERS,
              },
            },
            ui: {
              verBotonImportar: false,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        // {
        //   key: 'GenContacto',
        //   documentacion: {
        //     id: 1036,
        //   },
        //   nombreModelo: 'Contacto',
        //   ajustes: {
        //     rutas: {
        //       lista: 'cartera/administracion/lista',
        //       nuevo: 'cartera/administracion/nuevo',
        //       detalle: 'cartera/administracion/detalle',
        //     },
        //     endpoint: 'general/contacto',
        //     parametrosHttpConfig: {
        //       modelo: 'GenContacto',
        //       filtros: {
        //         ui: CONTACTO_FILTERS,
        //       },
        //     },
        //     archivos: {
        //       importar: {
        //         nombre: 'GenContacto',
        //         rutaEjemplo:
        //           'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/GenContacto.xlsx',
        //         verBotonEjemplo: true,
        //         verBotonImportar: true,
        //       },
        //     },
        //     ui: {
        //       verBotonImportar: true,
        //       verBotonNuevo: true,
        //       verColumnaEditar: true,
        //     },
        //   },
        // },
      ],
    },
  ],
};
