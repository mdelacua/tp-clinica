import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  btnHeader:any = {
    "habilitarEspecialista" : false,
    "registrarUsuarios" : false,
    "crearUsuarios" : false,
  }
  usuario:any = null
  tipoUsuario:string = ''

  constructor(private router: Router,private servicioUsuario:UsuariosService){
  }

  ngOnInit(): void {
   
    this.usuario = this.servicioUsuario.emailUsuario
    this.tipoUsuario = this.servicioUsuario.tipo
    console.log(this.tipoUsuario)
    console.log(this.usuario)
  }
  CerrarSesion(){
 
    this.servicioUsuario.CerrarSesionAuth();  
    
  }

  BtnNavsetClicked(keyJson:string, redireccion:string){

    Object.keys(this.btnHeader).forEach((key) =>{
    
      if(key == keyJson){
        this.btnHeader[key] = true
      }
      else{
        this.btnHeader[key] = false
      }
      
    });
  
    //this.router.navigate(['/'+ redireccion]);
  
  }
  

/*FORMULARIOS DE CREACION */
btnFormulario:any = {"inciarSesion" : true,"registrarse": false }
btnForms:any = {
  "admin" : false,
  "paciente" : true,
  "especialista" : false,
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
/*FIN FORMULARIOS DE CREACION */

}
