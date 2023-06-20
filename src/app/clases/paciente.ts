
import { HistoriaClinica } from "./historiaClinica";
import { Usuario } from "./usuario";

export class Paciente extends Usuario{
    obraSocial:string
    historiaClinica:any = {
        altura: '',
        peso: '',
        presion: '',
        temperatura: '',
        dinamicos: [
            {
                clave:'',
                valor:''
            },
            {
                clave:'',
                valor:''
            },
            {
                clave:'',
                valor:''
            }            
        ]
    }
    

    constructor(nombre:string,apellido:string,edad:number,dni:number,mail:string,imagen:any[], obraSocial:string){
       super(nombre,apellido,edad,dni,mail,imagen)
       this.obraSocial = obraSocial
       this.historiaClinica = new HistoriaClinica()
        
    }
}
