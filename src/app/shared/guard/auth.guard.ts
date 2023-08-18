import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Observable, map } from "rxjs";
import { AuthUtilService } from "src/app/auth/service/auth-util.service";

@Injectable({
  providedIn: 'root'
})
class PermissionsService {

  constructor(private router: Router, private authUtilService: AuthUtilService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authUtilService.checkLogin().pipe(
        map(isAuthenticated => {
          if (isAuthenticated) {
            return true;
          } else {
            this.router.navigate(['/signin']);
            return false;
          }
        })
      );
  }
}

export const AuthGuard: CanActivateFn =
  (next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    return inject(PermissionsService).canActivate(next, state);
  }
