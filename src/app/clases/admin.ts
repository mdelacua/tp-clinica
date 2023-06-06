import { Usuario } from "./usuario";

export class Admin extends Usuario{
    constructor(nombre:string,apellido:string,edad:number,dni:number,mail:string,imagen:any[]){
        super(nombre,apellido,edad,dni,mail,imagen)       
         
    }
}
