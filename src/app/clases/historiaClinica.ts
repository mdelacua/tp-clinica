
import { Usuario } from "./usuario";

export class HistoriaClinica{
    
    altura!: string
    peso!: string
    presion!: string
    temperatura!: string
    dinamicos: Array<any> = [               
    ]
    

    constructor(){
        this.altura = ''
        this.peso = ''
        this.presion = ''
        this.temperatura = ''
        this.dinamicos = [
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
}
