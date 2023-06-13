import { Type } from "@angular/core"

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
    
    id!:string
    
    constructor(especialista:string,especialidad:string,diaTurno:string,horaTurno:string,mailUsuario:string,estado:estadoTurno,apellidoEspecialista:string){
        this.especialista = especialista
        this.especialidad = especialidad
        this.diaTurno = diaTurno
        this.horaTurno = horaTurno
        this.mailUsuario = mailUsuario
        this.estado = estado
        this.apellidoEspecialista = apellidoEspecialista
    }
}

export type estadoTurno = 'pendiente' | 'finalizado' | 'cancelado' | 'aceptado' ;
