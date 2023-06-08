import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-loading-comp',
  templateUrl: './loading-comp.component.html',
  styleUrls: ['./loading-comp.component.css']
})
export class LoadingCompComponent {
  mostrarModal:boolean = false 

  @Input() inputMostrarModal: any 
  ngOnChanges(changes: SimpleChanges) { //registra cuando hay un cambio en el input
    if (changes['inputMostrarModal']) {      
      this.mostrarModal = changes['inputMostrarModal'].currentValue     
    }
  }
  
  CerrarModal(){
    this.mostrarModal = false
  }
  MostrarModal(){
    this.mostrarModal = true
  }
} 
