import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrearEspecialistaComponent } from 'src/app/componentes/crear-especialista/crear-especialista.component';
import { CrearPacientesComponent } from 'src/app/componentes/crear-pacientes/crear-pacientes.component';
import { ComponentesCreacionComponent } from '../componentes-creacion/componentes-creacion.component';
import { ComponentesCreacionModule } from '../componentes-creacion/componentes-creacion.module';


@NgModule({
  declarations: [
    RegistroComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    RegistroRoutingModule,
    ReactiveFormsModule,
    ComponentesCreacionModule
  ]
})
export class RegistroModule { }
