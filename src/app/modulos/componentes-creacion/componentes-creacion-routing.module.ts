import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentesCreacionComponent } from './componentes-creacion.component';

const routes: Routes = [{ path: '', component: ComponentesCreacionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentesCreacionRoutingModule { }
