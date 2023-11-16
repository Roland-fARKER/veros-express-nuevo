import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../Services/authentication.service";

@Injectable({ providedIn: "root" })
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {

    if (!this.authService.isAuthenticated()) {
      return this.router.parseUrl("/Account/Login"); // Redirige a la ruta de inicio de sesión si el usuario no está autenticado
    }

    return true;
  }
}




