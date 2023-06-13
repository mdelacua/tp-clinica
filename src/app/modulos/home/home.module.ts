import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HabilitarEspecialistaComponent } from 'src/app/componentes/habilitar-especialista/habilitar-especialista.component';
import { ComponentesCreacionModule } from '../componentes-creacion/componentes-creacion.module';
import { LoadingModule } from '../loading/loading.module';
import { SacarTurnoComponent } from 'src/app/componentes/sacar-turno/sacar-turno.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnosPacienteComponent } from 'src/app/componentes/turnos-paciente/turnos-paciente.component';
import { TurnosEspecialistaComponent } from 'src/app/componentes/turnos-especialista/turnos-especialista.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TurnosAdministradorComponent } from 'src/app/componentes/turnos-administrador/turnos-administrador.component';

@NgModule({
  declarations: [
    HomeComponent,
    HabilitarEspecialistaComponent,
    SacarTurnoComponent,
    TurnosPacienteComponent, 
    TurnosEspecialistaComponent, 
    TurnosAdministradorComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentesCreacionModule ,
    LoadingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule
  ]
})
export class HomeModule { }
