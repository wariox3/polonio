import { LOCALSTORAGE_KEYS } from '@app/core/constants/localstorage-keys.constant';
import { createReducer, on } from '@ngrx/store';
import { getCookie } from 'typescript-cookie';
import { Contenedor } from '../../interfaces/contenedor.interface';
import { ContenedorActionInit } from '../actions/contenedor.action';

// Definir la interfaz del estado de autenticación
export interface ContenedorState {
  contenedor: Contenedor | null;
  loading: boolean;
  error: any | null;
}

// Estado inicial con rehidratación desde cookie
const contenedorCookie: string | undefined = getCookie(LOCALSTORAGE_KEYS.CONTENEDOR);

// Estado inicial por defecto
const defaultState: ContenedorState = {
  contenedor: null,
  loading: false,
  error: null,
};

// Rehidratar el estado desde la cookie si existe
export const initialState: ContenedorState = contenedorCookie
  ? {
      contenedor: JSON.parse(contenedorCookie),
      loading: false,
      error: null,
    }
  : defaultState;

export const contenedorReducer = createReducer(
  initialState,

  // Manejar la acción de inicialización del contenedor
  on(ContenedorActionInit, (state, { contenedor }) => ({
    ...state,
    contenedor,
    loading: false,
    error: null,
  }))
);
