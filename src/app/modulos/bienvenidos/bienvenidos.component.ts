import { Component } from '@angular/core';

@Component({
  selector: 'app-bienvenidos',
  templateUrl: './bienvenidos.component.html',
  styleUrls: ['./bienvenidos.component.css']
})
export class BienvenidosComponent {
  mostrarModal = 'mostrarModal' 
  CerrarModal(){
    this.mostrarModal = 'modal'
  }
  MostrarModal(){
    this.mostrarModal = 'mostrarModal'
  }
}
