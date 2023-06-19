import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Unsubscribe, onSnapshot } from 'firebase/firestore';
import { Usuario } from 'src/app/clases/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-perfil-especialista',
  templateUrl: './perfil-especialista.component.html',
  styleUrls: ['./perfil-especialista.component.css']
})
export class PerfilEspecialistaComponent {

  datosUsuario!:Usuario

  constructor(private servicioUsuario:UsuariosService){
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.datosUsuario = this.servicioUsuario.datosUsuarioConectado
    this.TraerHorariosDisponibles()
  }

  btnForms:any = {
    "horariosDisponibles" : false,
    "datosPrincipales" : true,
  }
 // horariosDiasDeSemana:string[] = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']
  horariosDiasDeSemana:string[] = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM']

  horaSeleccionado: string | null= null

  toppings = new FormControl('');
  horariosDeEspecialista!:Array<string> 

  horasConDiasEsp:any= [ 
    { 'Domingo' : []},
    { 'Lunes' : []},
    { 'Martes' : []},
    { 'Miercoles' : []},
    { 'Jueves' : []},
    { 'Viernes' : []},
    { 'Sabado' : []},
  ];

  unsubscribe!:Unsubscribe
  unsubscribeHorarios!:Unsubscribe


  onSelectedHora(value:string): void {
    console.log(value)
    this.horaSeleccionado = value
	}
      
  CambiarFormulario(keyJson:any){
    Object.keys(this.btnForms).forEach((key) =>{
      
      if(key == keyJson){
        this.btnForms[key] = true
      }
      else{
        this.btnForms[key] = false
      }
      
    });
  }

 
  /*GuardarHorarios(){
    console.log('toppings',this.toppings)
    var horariosDeAtencion = {horariosDeAtencion: this.toppings.value}
    this.servicioUsuario.ActualizarUsuario(this.datosUsuario.id, horariosDeAtencion)
  }*/
 

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    try {
      this.unsubscribe()      
    } catch (error) {      
    }
    try {
      this.unsubscribeHorarios()      
    } catch (error) {      
    }
    
  }

  async TraerHorariosDisponibles(){
    
    var queryTraerPelis = this.servicioUsuario.TraerUsuarios('id', '==', this.datosUsuario.id )  

    this.unsubscribeHorarios = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {
      this.horariosDeEspecialista = []
      this.horasConDiasEsp = []
      querySnapshot.forEach(async (doc: any) => {
      
        console.log(doc.data())
        this.horariosDeEspecialista = doc.data()['horariosDeAtencion']
        if(doc.data()['horasConDiasEsp']) this.horasConDiasEsp = doc.data()['horasConDiasEsp']
      });     

     
    });
  }

  /**HORARIOS Y DIAS DE TURNOS */
  
 diaSeleciconado!:number
 
  foods: any[] = [
    {value: 1 , viewValue: 'Lunes'},
    {value: 2 , viewValue: 'Martes'},
    {value: 3 , viewValue: 'Miercoles'},
    {value: 4 , viewValue: 'Jueves'},
    {value: 5 , viewValue: 'Viernes'},
    {value: 6 , viewValue: 'Sabado'},
    {value: 0 , viewValue: 'Domingo'},
  ];

  CambioDia(valor:number){
    console.log(valor)
    this.diaSeleciconado = valor;
    //this.toppings = new FormControl('');
  }
  GuardarHorarios(){
    console.log('toppings',this.toppings)
    console.log('this.horasConDiasEsp',this.horasConDiasEsp)

    //this.horasConDiasEsp = []; // TODO traer los dias con horairos actuales y actualizar lo que pone el usuario
    this.horasConDiasEsp[this.diaSeleciconado] = this.toppings.value
    var mapDeDias = {horasConDiasEsp: {...this.horasConDiasEsp}}

    this.servicioUsuario.ActualizarUsuario(this.datosUsuario.id, {...mapDeDias})
  }

  /**FIN HORARIOS Y DIAS DE TURNOS */

}
