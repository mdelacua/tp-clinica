import { ValidatorFn, AbstractControl } from "@angular/forms";

/**
 * Aplica al control. Valida campos que deben recibir valores numericos (input text/number).
 * @param minimo valor minimo aceptado.
 * @param maximo valor maximo aceptado.
 * @param mensajes (opcional) recibe un objeto con los mensajes: {campoVacio, textoInvalido, valorInvalido}.
 * @returns Los errores encontrados, o en su defecto null.
 */
export function validarCampoNumero(minimo: number, maximo: number, mensajes: any = null): ValidatorFn {
    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];

        //CARGO LOS DISTINTOS ERRORES QUE PUEDE TENER.
        if (campoAValidar?.value == '' || campoAValidar?.value == null || campoAValidar?.value == undefined)
            errors.campoVacio = { hayError: true, mensaje: mensajes != null && mensajes.campoVacio != null ? mensajes.campoVacio : 'Campo requerido.' };
        else if (isNaN(campoAValidar?.value))
            errors.textoInvalido = { hayError: true, mensaje: mensajes != null && mensajes.textoInvalido != null ? mensajes.textoInvalido : 'Solo se pueden ingresar caracteres numéricos.' };
        else if (campoAValidar?.value < minimo || campoAValidar?.value > maximo) {
            errors.valorInvalido = { hayError: true, mensaje: mensajes != null && mensajes.valorInvalido != null ? mensajes.valorInvalido : `Solo se admiten valores entre ${minimo} y ${maximo}.` };
        }

        //SI TIENE ERRORES, LOS SETEO AL CONTROL:
        if (Object.keys(errors).length) {
            campoAValidar?.setErrors(errors);
            return errors;
        }
        campoAValidar?.setErrors(null);
        return null;
    }
}


export function ValidarEmail(): ValidatorFn {
    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];


        if(!campoAValidar?.value){
            errors.errorGenerico = { msj: '*Campo requerido'}
            campoAValidar?.setErrors(errors);
            return errors;
        }
        else{

            var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            
            if(!regex.test( campoAValidar?.value )){
            
                errors.errorGenerico = { msj: '*Email Invalido'}
                campoAValidar?.setErrors(errors);  
                return errors;
            }
        }
       
        campoAValidar?.setErrors(null);
        return errors;
    }
}
export function ValidarDNI(): ValidatorFn {
    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];


        if(!campoAValidar?.value){
            errors.errorGenerico = { msj: '*Campo requerido'}
            campoAValidar?.setErrors(errors);
            return errors;
        }
        else{

            var regex = /^\d{1,3}\.?\d{3}\.?\d{3}$/g;
            
            if(!regex.test( campoAValidar?.value )){
            
                errors.errorGenerico = { msj: '*DNI invalido - formato aceptado 00.000.000 / 00000000'}
                campoAValidar?.setErrors(errors);  
                return errors;
            }
        }
       
        campoAValidar?.setErrors(null);
        return errors;
    }
}

export function ValidarCaracteresTexto(min:number, max:number, soloLetras:boolean): ValidatorFn {
    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];


        if(!campoAValidar?.value){
            errors.errorGenerico = { msj: '*Campo requerido'}
            campoAValidar?.setErrors(errors);
            return errors;
        }       

        if (soloLetras) {
            const patron = /^[a-zA-Z]+$/;
            if (!patron.test(campoAValidar.value)) {
                errors.errorGenerico = { msj: '*El campo solo acepta letras'}
                campoAValidar?.setErrors(errors);
                return errors;
            }
        }
        
        if(campoAValidar?.value.length < min || campoAValidar?.value.length > max){
            errors.errorGenerico = { msj: '*El texto debe tener entre ' + min + ' y ' + max + ' caracteres'}
            campoAValidar?.setErrors(errors);
            return errors;
        }
            
        
       
        campoAValidar?.setErrors(null);
        return errors;
    }
}
export function ValidarCaracteresNumero(min:number = 0, max:number = 0): ValidatorFn {
    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];
        var numero:number = campoAValidar?.value

        if(!campoAValidar?.value){
            errors.errorGenerico = { msj: '*Campo requerido'}
            campoAValidar?.setErrors(errors);
            return errors;
        }       

        if( isNaN(campoAValidar?.value) ){
            errors.errorGenerico = { msj: '*El campo solo acepta Numeros'}
            campoAValidar?.setErrors(errors);
            return errors;
        }   
        
       

        if(max > 0 && numero > max){
            errors.errorGenerico = { msj: '*El numero debe ser menor a ' + max}
            campoAValidar?.setErrors(errors);
            return errors;
        }            
        if(min > 0 && numero < min ){
            errors.errorGenerico = { msj: '*El numero debe ser mayor a ' + min}
            campoAValidar?.setErrors(errors);
            return errors;
        }

            
        
       
        campoAValidar?.setErrors(null);
        return errors;
    }
}



/**
 * Aplica al control. Valida campos que deben recibir solo texto (input text/textArea).
 * @param minimo minimo de caracteres.
 * @param maximo maximo de caracteres.
 * @param mensajes (opcional) recibe un objeto con los mensajes: {campoVacio, lenMinimo, lenMaximo, textoInvalido}.
 * @param soloLetras (opcional) True para aceptar solo letras, false para acepte todo texto/numeros.
 * @returns Los errores encontrados, o en su defecto null.
 */
export function validarCampoTexto(minimo: number, maximo: number, mensajes: any = null, soloLetras: boolean = false): ValidatorFn {
    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];

        //CARGO LOS DISTINTOS ERRORES QUE PUEDE TENER.
        if (campoAValidar?.value == '' || campoAValidar?.value == null || campoAValidar?.value == undefined)
            errors.campoVacio = { hayError: true, mensaje: mensajes != null && mensajes.campoVacio != null ? mensajes.campoVacio : 'Campo requerido.' };
        else if (campoAValidar?.value.length < minimo)
            errors.lenMinimo = { hayError: true, mensaje: mensajes != null && mensajes.lenMinimo != null ? mensajes.lenMinimo : `Solo se admite un mínimo de ${minimo} caracteres.` };
        else if (campoAValidar?.value.length > maximo) {
            errors.lenMaximo = { hayError: true, mensaje: mensajes != null && mensajes.lenMaximo != null ? mensajes.lenMaximo : `Solo se admite un máximo de ${maximo} caracteres.` };
        }

        if (soloLetras) {
            const patron = /^[a-zA-Z]+$/;
            if (campoAValidar?.value != '' && campoAValidar?.value != null &&
                campoAValidar?.value != undefined &&
                !patron.test(campoAValidar.value)) {
                errors.textoInvalido = { hayError: true, mensaje: mensajes != null && mensajes.textoInvalido != null ? mensajes.textoInvalido : `Solo se admiten letras a-z.` };
            }
        }

        //SI TIENE ERRORES, LOS SETEO AL CONTROL:
        if (Object.keys(errors).length) {
            campoAValidar?.setErrors(errors);
            return errors;
        }
        campoAValidar?.setErrors(null);
        return null;
    }
}


export function validarCUIL(mensajes:any = null){

    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];

        //CARGO LOS DISTINTOS ERRORES QUE PUEDE TENER.
        if (campoAValidar?.value == '' || campoAValidar?.value == null || campoAValidar?.value == undefined){
            errors.campoVacio = { hayError: true, mensaje: mensajes != null && mensajes.campoVacio != null ? mensajes.campoVacio : 'Campo requerido.' };
        }
        else if (isNaN(campoAValidar?.value)){
            errors.textoInvalido = { hayError: true, mensaje: mensajes != null && mensajes.textoInvalido != null ? mensajes.textoInvalido : 'Solo se pueden ingresar caracteres numéricos.' };
        }
        else if( campoAValidar?.value?.length != 11 ){
            errors.noTieneTodosLosNumeros = { hayError: true, mensaje: mensajes != null && mensajes.textoInvalido != null ? mensajes.textoInvalido : 'Un CUIL tiene 11 números' };
        }
        // console.log(campoAValidar);
        // console.log(campoAValidar?.value);
        // console.log(campoAValidar?.value?.length);
        if ( campoAValidar?.value?.length == 11 ) 
        {
        //   console.log("entro al if");
          const caracteres_1_2 = campoAValidar?.value.charAt(0)+campoAValidar?.value.charAt(1)
       
          if ( caracteres_1_2 == "20" || caracteres_1_2 == "23"|| caracteres_1_2 == "24" || caracteres_1_2 == "27" || caracteres_1_2 == "30" || caracteres_1_2 == "33" || caracteres_1_2 == "34"  )
          {
            const count = campoAValidar?.value.charAt(0)*5
                          +campoAValidar?.value.charAt(1)*4
                          +campoAValidar?.value.charAt(2)*3
                          +campoAValidar?.value.charAt(3)*2
                          +campoAValidar?.value.charAt(4)*7
                          +campoAValidar?.value.charAt(5)*6
                          +campoAValidar?.value.charAt(6)*5
                          +campoAValidar?.value.charAt(7)*4
                          +campoAValidar?.value.charAt(8)*3
                          +campoAValidar?.value.charAt(9)*2
                          +campoAValidar?.value.charAt(10)*1                             
            const division = count/11;
            if(division==Math.floor(division))
            {
            //   return true
                return null;
            }
          }
        }        

        // errors.formatoInvalido ={ hayError: true, mensaje: mensajes != null && mensajes.textoInvalido != null ? mensajes.textoInvalido : 'No es un CUIL valido, solo puede ingresar números' };
         
        // return false

        //SI TIENE ERRORES, LOS SETEO AL CONTROL:
        if (Object.keys(errors).length) {
            campoAValidar?.setErrors(errors);
            return errors;
        }
        campoAValidar?.setErrors(null);
        return null;
    }
}


export function validarNombrePersona(minimo: number, maximo: number, mensajes: any = null): ValidatorFn {
    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];
        const patron = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúÁÉÍÓÚüÜñÑ'-\s]+$/;

        //CARGO LOS DISTINTOS ERRORES QUE PUEDE TENER.
        if (campoAValidar?.value == '' || campoAValidar?.value == null || campoAValidar?.value == undefined){
            errors.campoVacio = { hayError: true, mensaje: mensajes != null && mensajes.campoVacio != null ? mensajes.campoVacio : 'Campo requerido.' };
        }   
        else if (campoAValidar?.value.length < minimo){
            errors.lenMinimo = { hayError: true, mensaje: mensajes != null && mensajes.lenMinimo != null ? mensajes.lenMinimo : `Solo se admite un mínimo de ${minimo} caracteres.` };
        }
        else if (campoAValidar?.value.length > maximo) {
            errors.lenMaximo = { hayError: true, mensaje: mensajes != null && mensajes.lenMaximo != null ? mensajes.lenMaximo : `Solo se admite un máximo de ${maximo} caracteres.` };
        }        
        if (
            campoAValidar?.value != '' 
            && campoAValidar?.value != null
            && campoAValidar?.value != undefined 
            && !patron.test(campoAValidar.value)) 
            {
                // console.log(patron.test(campoAValidar.value));
            errors.textoInvalido = { hayError: true, mensaje: mensajes != null && mensajes.textoInvalido != null ? mensajes.textoInvalido : `Solo se admiten letras a-z, con acentos.` };
        }
  

        //SI TIENE ERRORES, LOS SETEO AL CONTROL:
        if (Object.keys(errors).length) {
            campoAValidar?.setErrors(errors);
            return errors;
        }
        campoAValidar?.setErrors(null);
        return null;
    }
}


export function validarCorreoElectronico(minimo: number, maximo: number, mensajes: any = null): ValidatorFn {
    return (control: AbstractControl): [key: string, value: any] | null => {
        const campoAValidar = control;
        const errors: any = [];
        const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        //CARGO LOS DISTINTOS ERRORES QUE PUEDE TENER.
        if (campoAValidar?.value == '' || campoAValidar?.value == null || campoAValidar?.value == undefined){
            errors.campoVacio = { hayError: true, mensaje: mensajes != null && mensajes.campoVacio != null ? mensajes.campoVacio : 'Campo requerido.' };
        }   
        else if (campoAValidar?.value.length < minimo){
            errors.lenMinimo = { hayError: true, mensaje: mensajes != null && mensajes.lenMinimo != null ? mensajes.lenMinimo : `Solo se admite un mínimo de ${minimo} caracteres.` };
        }
        else if (campoAValidar?.value.length > maximo) {
            errors.lenMaximo = { hayError: true, mensaje: mensajes != null && mensajes.lenMaximo != null ? mensajes.lenMaximo : `Solo se admite un máximo de ${maximo} caracteres.` };
        }        
        if (
            campoAValidar?.value != '' 
            && campoAValidar?.value != null
            && campoAValidar?.value != undefined 
            && !patron.test(campoAValidar.value)) 
            {
                // console.log(patron.test(campoAValidar.value));
            errors.textoInvalido = { hayError: true, mensaje: mensajes != null && mensajes.textoInvalido != null ? mensajes.textoInvalido : `El correo electrónico no es valido` };
        }
  

        //SI TIENE ERRORES, LOS SETEO AL CONTROL:
        if (Object.keys(errors).length) {
            campoAValidar?.setErrors(errors);
            return errors;
        }
        campoAValidar?.setErrors(null);
        return null;
    }
}
