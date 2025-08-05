import { authReducer } from '@app/modules/auth/store/reducers/auth.reducer';
import { AuthEffects } from '@app/modules/auth/store/effects/auth.effect';
import { ContenedorEffects } from '@app/modules/contenedor/store/effects/contenedor.effect';
import { contenedorReducer } from '@app/modules/contenedor/store/reducer/contenedor.reducer';

export const StoreApp = {
  auth: authReducer,
  contenedor: contenedorReducer,
};

export const EffectsApp = [AuthEffects, ContenedorEffects];
