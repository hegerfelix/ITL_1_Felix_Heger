import { HttpInterceptorFn } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'my-token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(Preferences.get({ key: TOKEN_KEY })).pipe(
    switchMap(result => {
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
