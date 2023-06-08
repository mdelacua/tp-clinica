import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BienvenidosRoutingModule } from './bienvenidos-routing.module';
import { BienvenidosComponent } from './bienvenidos.component';
import { LoadingComponent } from '../loading/loading.component';
import { LoadingModule } from '../loading/loading.module';

@NgModule({
  declarations: [
    BienvenidosComponent,    
  ],
  imports: [
    CommonModule,
    BienvenidosRoutingModule,
    LoadingModule
  ]
})
export class BienvenidosModule { }
