import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HabilitarEspecialistaComponent } from 'src/app/componentes/habilitar-especialista/habilitar-especialista.component';
import { ComponentesCreacionModule } from '../componentes-creacion/componentes-creacion.module';


@NgModule({
  declarations: [
    HomeComponent,
    HabilitarEspecialistaComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentesCreacionModule 
  ]
})
export class HomeModule { }
