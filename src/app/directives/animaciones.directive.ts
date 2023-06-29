import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAnimaciones]'
})
export class AnimacionesDirective {

 
  constructor(private el: ElementRef) {
    
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.ponerAnimacion();
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.sacarAnimacion('');
  }
  private sacarAnimacion(color: string) {    
    this.el.nativeElement.classList.remove('animate__animated')
    this.el.nativeElement.classList.remove('animate__heartBeat');
    
  }
  private ponerAnimacion() {
    
    this.el.nativeElement.classList.add('animate__animated');
    this.el.nativeElement.classList.add('animate__heartBeat');
  }
}
