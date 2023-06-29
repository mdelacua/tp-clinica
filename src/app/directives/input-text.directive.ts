import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputText]'
})
export class InputTextDirective {

  colors= [ 'blue' , 'blueviolet', 'brown', 'red']
  constructor(private el: ElementRef) {
    
  }
  @HostListener('keyup') onMouseEnter() {
    this.ponerAnimacion();
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.sacarAnimacion('');
  }
  private sacarAnimacion(color: string) {    

    
  }
  private ponerAnimacion() {
    console.log('asd')

    var colorIndex = Math.floor(Math.random() * this.colors.length);
    this.el.nativeElement.style.color = this.colors[colorIndex];
  }

}
