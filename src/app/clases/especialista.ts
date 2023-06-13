import { Usuario } from "./usuario"

export class Especialista extends Usuario{
    especialidad:string
    habilitado!:boolean
    horarioAtencionInicio!:Date
    horarioAtencionFin!:Date

    constructor(nombre:string,apellido:string,edad:number,dni:number,mail:string,imagen:any[], especialidad:string){
       super(nombre,apellido,edad,dni,mail,imagen)
       this.especialidad = especialidad
        
    }
    
}
