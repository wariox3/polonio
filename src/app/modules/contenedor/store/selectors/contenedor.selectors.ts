import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContenedorState } from '../reducer/contenedor.reducer';

const ContenedorState = createFeatureSelector<ContenedorState>('contenedor');

export const obtenerContenedorSeleccion = createSelector(
  ContenedorState,
  state => state.contenedor?.seleccion || false
);

export const obtenerContenedorNombre = createSelector(
  ContenedorState,
  state => state.contenedor?.nombre || ''
);

export const obtenerContenedorImagen = createSelector(
  ContenedorState,
  state => state.contenedor?.imagen || ''
);

export const obtenerContenedorId = createSelector(
  ContenedorState,
  state => state.contenedor?.id?.toString() || ''
);

export const obtenerContenedorSubdominio = createSelector(
  ContenedorState,
  state => state.contenedor?.subdominio || ''
);

export const obtenerContenedorPlanId = createSelector(
  ContenedorState,
  state => state.contenedor?.plan_id || null
);
