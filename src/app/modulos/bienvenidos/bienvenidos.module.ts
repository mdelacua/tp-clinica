import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BienvenidosRoutingModule } from './bienvenidos-routing.module';
import { BienvenidosComponent } from './bienvenidos.component';


@NgModule({
  declarations: [
    BienvenidosComponent
  ],
  imports: [
    CommonModule,
    BienvenidosRoutingModule
  ]
})
export class BienvenidosModule { }
