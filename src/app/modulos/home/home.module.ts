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
import { PerfilEspecialistaComponent } from 'src/app/componentes/perfil-especialista/perfil-especialista.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { PerfilAdminComponent } from 'src/app/componentes/perfil-admin/perfil-admin.component';
import { PerfilPacienteComponent } from 'src/app/componentes/perfil-paciente/perfil-paciente.component';
import { PacienteHistoriaClinicaComponent } from 'src/app/componentes/paciente-historia-clinica/paciente-historia-clinica.component';
import { ExportarUsuariosComponent } from 'src/app/componentes/exportar-usuarios/exportar-usuarios.component';
@NgModule({
  declarations: [
    HomeComponent,
    HabilitarEspecialistaComponent,
    SacarTurnoComponent,
    TurnosPacienteComponent, 
    TurnosEspecialistaComponent, 
    TurnosAdministradorComponent,
    PerfilEspecialistaComponent,
    PerfilAdminComponent,
    PerfilPacienteComponent,
    PacienteHistoriaClinicaComponent,
    ExportarUsuariosComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentesCreacionModule ,
    LoadingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule,
    MatSlideToggleModule,
    MatSelectModule
  ]
})
export class HomeModule { }
