/**
 * @file app.routes.ts
 * @description Root-Routing-Konfiguration der Ionic/Angular-App.
 *
 * Route-Struktur:
 *   /         → Redirect zu /login (kein direkter Zugriff auf Root)
 *   /login    → Lazy-loaded LoginPage (öffentlich)
 *   /register → Lazy-loaded RegisterPage (öffentlich)
 *   /tabs     → Lazy-loaded TabsPage mit Kindrouten (geschützt durch AuthGuard)
 *
 * Kursanforderung Teil 3: AuthGuard sichert alle /tabs-Routen –
 * Benutzer ohne gültiges Token werden zu /login weitergeleitet.
 *
 * Lazy Loading (loadComponent/loadChildren) verbessert die initiale Ladezeit:
 * Login und Register werden sofort geladen, das Tab-Bundle erst nach der Authentifizierung.
 */

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard]
  },
];
