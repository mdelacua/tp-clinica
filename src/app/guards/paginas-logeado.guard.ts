import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuariosService } from '../servicios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class PaginasLogeadoGuard implements CanActivate {
  
  constructor(private servicioUsuario:UsuariosService){}

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      
    return  this.servicioUsuario.VerificarSesionUsuarioGuardPaginaLogeada('login')
    //return true;
  }
  
}
