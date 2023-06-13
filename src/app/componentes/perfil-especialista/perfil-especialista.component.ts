import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  horariosDiasDeSemana:string[] = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']
  horaSeleccionado: string | null= null

  toppings = new FormControl('');
  horariosDeEspecialista!:Array<string> 

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

 
  GuardarHorarios(){
    console.log('toppings',this.toppings)
    var horariosDeAtencion = {horariosDeAtencion: this.toppings.value}
    this.servicioUsuario.ActualizarUsuario(this.datosUsuario.id, horariosDeAtencion)
  }

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
      querySnapshot.forEach(async (doc: any) => {
      
        console.log(doc.data())
        this.horariosDeEspecialista = doc.data()['horariosDeAtencion']
      });     

     
    });
  }
}
