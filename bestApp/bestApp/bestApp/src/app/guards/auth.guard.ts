/**
 * @file guards/auth.guard.ts
 * @description Routen-Guard für alle geschützten Bereiche der App (z.B. /tabs).
 * Prüft ob ein Token in Capacitor Preferences vorhanden ist.
 * Nicht authentifizierte Benutzer werden zu /login weitergeleitet.
 *
 * Kursanforderung Teil 3: Capacitor Preferences – Token-basierte Zugriffskontrolle
 *
 * Verwendet die moderne Angular functional guard API (CanActivateFn statt Klasse),
 * die seit Angular 15 der empfohlene Ansatz für Standalone-Applikationen ist.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // isAuthenticated() prüft nur die Existenz des Tokens, nicht seine Gültigkeit.
  // Für Produktions-Apps: Token gegen Backend verifizieren (verifyToken()) und
  // bei abgelaufenem Token ebenfalls zu /login weiterleiten.
  const isAuthenticated = await authService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
