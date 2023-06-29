import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEstados]'
})
export class EstadosDirective {

  constructor(private el: ElementRef) {
    
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.asignarColor();
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
    
  }
  private asignarColor() {
    var color = 'yellow' 
    var valor = (this.el.nativeElement.innerText as string).toLowerCase()
    switch (valor) {
      case 'finalizado':
        color = 'green'
      break;
      case 'pendiente':
        color = 'yellow'
      break;
      case 'cancelado':
        color = 'red'
      break;    
    }
    
    this.el.nativeElement.style.backgroundColor = color;
    
  }
}
