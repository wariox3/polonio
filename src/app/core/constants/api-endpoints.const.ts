import { environment } from '@environments/environment';

export const API_BASE_URL = environment.apiBase;
export const URL_API_SUBDOMINIO = environment.apiSubdomain;

export const API_ENDPOINTS = {
  VEHICULO: {
    LISTA: `transporte/vehiculo/`,
  },
  CONDUCTOR: {
    LISTA: `transporte/conductor/`,
  },
};
