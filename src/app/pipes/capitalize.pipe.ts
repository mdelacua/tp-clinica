import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): unknown {
    return value.charAt(0).toUpperCase() + value.slice(1);;
  }

}


@Pipe({
  name: 'formatoFecha'
})
export class formatoFechaPipe implements PipeTransform {

  transform(value: string, reemplazoDeCaracter:string): unknown {
    return value.replaceAll('/',reemplazoDeCaracter);
  }

}

