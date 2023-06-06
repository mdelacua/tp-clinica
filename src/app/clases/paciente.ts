import { Usuario } from "./usuario";

export class Paciente extends Usuario{
    obraSocial:string

    constructor(nombre:string,apellido:string,edad:number,dni:number,mail:string,imagen:any[], obraSocial:string){
       super(nombre,apellido,edad,dni,mail,imagen)
       this.obraSocial = obraSocial
        
    }
}
