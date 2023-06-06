import { Component } from '@angular/core';
import { getDocs, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user:any
  password:any
  mostraCrear:any = false
  btnFormulario:any = {"inciarSesion" : true,"registrarse": false }
  sesionUsuario:any
  
  constructor(private servicioUsuario:UsuariosService,  private route: ActivatedRoute,private router: Router,public readonly swalTargets: SwalPortalTargets ){

  }

  ngOnInit() {
   
  }

  ngOnDestroy(){
    console.log('ngOnDestroy')    
  }

  async VerificarUsuario(){
        
    if(!this.user ){     
      this.ErrorUsuario('Por favor, Completar Correo Electrónico...')
      return;
    }
    if(!this.password ){     
      
      this.ErrorUsuario('Por favor, Completar Contraseña...')
      return;
    }
    
   
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        
    if(!regex.test(this.user)){
      this.ErrorUsuario('Correo Electrónico inválido...')
      //this.presentToast("Correo Electrónico inválido");
      return;
    }
    
    //this.servicioUsuario.EnviarMailVerificacion(this.user)
    //return
    var usuarioValido = await this.servicioUsuario.Autentificar(this.user,this.password) 
    
    console.log(usuarioValido)
    
    if(usuarioValido){

      //this.servicioUsuario.EnviarMailVerificacion() //TODO PEDIR VERIFICACION DEL MAIL

      var verificarEspecialista = {tipo:'', habilitado: null}
      var querySnapshot = await this.servicioUsuario.VerificarUsuario(this.user)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        verificarEspecialista.tipo = doc.data()['tipo'];
        verificarEspecialista.habilitado = doc.data()['habilitado'];
      });
      
      

      if(verificarEspecialista && verificarEspecialista.tipo == 'especialista' && verificarEspecialista.habilitado == false ){
        this.servicioUsuario.CerrarSesionAuth();  
        this.ErrorUsuario("El usuario requiere una habilitacion...")
        return
      }
      console.log( verificarEspecialista)
      this.NotificaionInicioSesion('Usuario "'+this.user+'" valido!') 
      this.router.navigate(['/home']) 
      
    }else{      
      this.servicioUsuario.CerrarSesionAuth();  
      this.ErrorUsuario("Usuario inválido...")
     
    }
    
   
  }
  
  ErrorUsuario(msj:any){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: msj
    })
  }
  NotificaionInicioSesion(mensaje:string){
    Swal.fire(
      mensaje,
      'Presione Ok para continuar!',
      'success'
    )
  }

  

}