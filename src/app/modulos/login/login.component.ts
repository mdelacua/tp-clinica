import { Component } from '@angular/core';
import { onSnapshot } from '@firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { Usuario } from 'src/app/clases/usuario';
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
  mostrarLoading:boolean = false
  usuariosRapidos:Usuario[] = []

  constructor(private servicioUsuario:UsuariosService,  private route: ActivatedRoute,private router: Router,public readonly swalTargets: SwalPortalTargets ){

  }

  ngOnInit() {
   this.TraerUsuariosRapidos()
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
    this.mostrarLoading = true

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
        this.mostrarLoading = false
        return
      }
      console.log( verificarEspecialista)
      this.NotificaionInicioSesion('Usuario "'+this.user+'" valido!') 
      this.router.navigate(['/home']) 
      
    }else{      
      this.servicioUsuario.CerrarSesionAuth();  
      this.ErrorUsuario("Usuario inválido...")
     
    }

    this.mostrarLoading = false
    
   
  }

  async TraerUsuariosRapidos(){
    var queryTraerPelis = this.servicioUsuario.TraerUsuarios('mail', 'in',['mobaxoj782@onlcool.com', 'xawiro8204@pyadu.com', 'satan97450@peogi.com', 'royol22540@rockdian.com', 'raxobol454@soremap.com'])
    this.mostrarLoading = true

    const unsubscribe = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {
      
      this.usuariosRapidos = []
      querySnapshot.forEach(async (doc: any) => {
      
        console.log(doc.data())
        this.usuariosRapidos.push( doc.data() )
      }); 
      //console.log(this.usuariosRapidos)
      this.mostrarLoading = false

     
    });
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
