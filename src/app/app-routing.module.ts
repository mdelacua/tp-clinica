import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginasLogeadoGuard } from './guards/paginas-logeado.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: 'bienvenidos',canActivate: [LoginGuard], loadChildren: () => import('./modulos/bienvenidos/bienvenidos.module').then(m => m.BienvenidosModule) },
 { path: 'login', canActivate: [LoginGuard],loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule) },
 { path: 'registro', loadChildren: () => import('./modulos/registro/registro.module').then(m => m.RegistroModule) },
 { path: 'home' , canActivate: [PaginasLogeadoGuard], loadChildren: () => import('./modulos/home/home.module').then(m => m.HomeModule) },
 { path: '', canActivate: [LoginGuard],loadChildren: () => import('./modulos/bienvenidos/bienvenidos.module').then(m => m.BienvenidosModule) },
  { path: 'modulos/componentes-creacion', loadChildren: () => import('./modulos/componentes-creacion/componentes-creacion.module').then(m => m.ComponentesCreacionModule) },
  { path: 'modulos/loading', loadChildren: () => import('./modulos/loading/loading.module').then(m => m.LoadingModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
