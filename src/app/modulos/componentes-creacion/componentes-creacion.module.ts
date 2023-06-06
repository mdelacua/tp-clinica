import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentesCreacionRoutingModule } from './componentes-creacion-routing.module';
import { ComponentesCreacionComponent } from './componentes-creacion.component';
import { CrearEspecialistaComponent } from 'src/app/componentes/crear-especialista/crear-especialista.component';
import { CrearPacientesComponent } from 'src/app/componentes/crear-pacientes/crear-pacientes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrearAdminComponent } from 'src/app/componentes/crear-admin/crear-admin.component';

@NgModule({
  declarations: [
    ComponentesCreacionComponent,    
    CrearEspecialistaComponent,
    CrearPacientesComponent,
    CrearAdminComponent
  ],
  imports: [
    CommonModule,
    ComponentesCreacionRoutingModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
  ],
  exports:[
    CrearEspecialistaComponent,
    CrearPacientesComponent,
    CrearAdminComponent
  ]
})
export class ComponentesCreacionModule { }
