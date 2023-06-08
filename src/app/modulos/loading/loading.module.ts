import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingRoutingModule } from './loading-routing.module';
import { LoadingComponent } from './loading.component';
import { LoadingCompComponent } from 'src/app/componentes/loading-comp/loading-comp.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoadingComponent,
    LoadingCompComponent    
  ],
  imports: [
    CommonModule,
    LoadingRoutingModule,
    FormsModule
  ],
  exports:[
    LoadingCompComponent 
  ]
})
export class LoadingModule { }
