import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidosComponent } from './bienvenidos.component';

const routes: Routes = [{ path: '', component: BienvenidosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BienvenidosRoutingModule { }
