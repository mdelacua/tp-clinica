import { Type } from "@angular/core"
import { HistoriaClinica } from "./historiaClinica"

export class Turno {
    especialista:string
    apellidoEspecialista:string
    especialidad:string
    diaTurno:string
    horaTurno:string
    turnoFecha!:Date
    mailUsuario:string 
    estado:estadoTurno
    motivoCancelamiento!:string
    idPaciente!:string
    id!:string
    imagenPaciente!:string

    turnoDiaConHoraEnSeg!:number

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
    
    constructor(especialista:string,especialidad:string,diaTurno:string,horaTurno:string,mailUsuario:string,estado:estadoTurno,apellidoEspecialista:string){
        this.especialista = especialista
        this.especialidad = especialidad
        this.diaTurno = diaTurno
        this.horaTurno = horaTurno
        this.mailUsuario = mailUsuario
        this.estado = estado
        this.apellidoEspecialista = apellidoEspecialista
        //this.historiaClinica = new HistoriaClinica()
    }
}

export type estadoTurno = 'pendiente' | 'finalizado' | 'cancelado' | 'aceptado' ;

