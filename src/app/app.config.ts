import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { tokenInterceptor } from './common/interceptors/token.interceptor';
import { httpErrorInterceptor } from './common/interceptors/error-handler/http-error.interceptor';
import { EffectsApp, StoreApp } from './store';
import { environment } from '../environments/environment';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor, httpErrorInterceptor]),
      withInterceptorsFromDi()
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore(StoreApp),
    provideEffects(EffectsApp),
    provideStoreDevtools({
      maxAge: 25, // Número de estados a mantener en el historial
      logOnly: !environment.production, // Restringir la extensión a solo registrar en producción
      autoPause: true, // Pausar automáticamente las grabaciones cuando la ventana pierde el enfoque
      trace: false, // Incluir información de seguimiento de la pila para cada acción
      traceLimit: 75, // Limitar la longitud de la pila de seguimiento
      connectInZone: true, // Si es true, conecta la extensión en la zona Angular
    }),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
