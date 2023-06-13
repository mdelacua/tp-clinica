import { Component } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent {

  btnForms:any = {
    "horariosDisponibles" : false,
    "datosPrincipales" : true,
  }
  datosUsuario!:Usuario

  constructor(private servicioUsuario:UsuariosService){
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.datosUsuario = this.servicioUsuario.datosUsuarioConectado
   
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
}
