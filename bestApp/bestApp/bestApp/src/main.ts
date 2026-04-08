/**
 * @file main.ts
 * @description Bootstrap-Einstiegspunkt der Ionic/Angular-Standalone-Anwendung.
 *
 * Kursanforderung Teil 3: provideHttpClient(withInterceptors([authInterceptor]))
 * registriert den Auth-Interceptor global, sodass jeder HTTP-Request automatisch
 * das Bearer-Token aus Capacitor Preferences enthält.
 *
 * IonicRouteStrategy: Ionic-spezifische Erweiterung der Angular RouteReuseStrategy,
 * die das Caching des DOM-Zustands von Seiten (z.B. Scroll-Position) ermöglicht.
 *
 * PreloadAllModules: Lädt alle Lazy-Loaded-Module im Hintergrund nach dem ersten Render,
 * damit Navigationen nach dem Login sofort ohne Ladepause funktionieren.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
});
