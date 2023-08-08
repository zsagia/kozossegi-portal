import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
class PermissionsService {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.checkLogin().pipe(
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
