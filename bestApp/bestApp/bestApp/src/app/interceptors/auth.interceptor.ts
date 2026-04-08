/**
 * @file interceptors/auth.interceptor.ts
 * @description HTTP-Interceptor, der automatisch den JWT-Bearer-Token an alle
 * ausgehenden HTTP-Requests anhängt.
 *
 * Kursanforderung Teil 3: Capacitor Preferences – Token wird aus dem nativen Speicher
 * ausgelesen und in den Authorization-Header eingefügt.
 *
 * Verwendet die moderne Angular functional interceptor API (HttpInterceptorFn),
 * registriert in main.ts via provideHttpClient(withInterceptors([authInterceptor])).
 *
 * Wichtig: TOKEN_KEY muss mit dem Schlüssel in AuthService.TOKEN_KEY übereinstimmen ('my-token').
 * Der Interceptor injiziert AuthService absichtlich NICHT direkt – das würde eine zirkuläre
 * Abhängigkeit erzeugen (AuthService → HttpClient → Interceptor → AuthService).
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'my-token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(Preferences.get({ key: TOKEN_KEY })).pipe(
    switchMap(result => {
      // Nur wenn ein Token vorhanden ist, wird der Header gesetzt.
      // Requests ohne Token (z.B. Login, Register) werden unverändert weitergeleitet.
      // req.clone() ist notwendig, weil HttpRequest-Objekte immutable sind.
      if (result.value) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${result.value}` }
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
