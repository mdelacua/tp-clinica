export class Usuario {
    nombre:string
    apellido:string
    edad:number
    dni:number
    mail:string
    imagen:any[]
    tipo!:string
    id!:string
    
    constructor(nombre:string,apellido:string,edad:number,dni:number,mail:string,imagen:any[]){
        this.nombre = nombre
        this.apellido = apellido
        this.edad = edad
        this.dni = dni
        this.mail = mail
        this.imagen = imagen
        
    }
}
