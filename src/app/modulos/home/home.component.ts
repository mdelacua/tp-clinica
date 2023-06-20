import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { onSnapshot } from '@firebase/firestore';
import { Usuario } from 'src/app/clases/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  handleExpire() {
    this.validoCaptcha = false
    console.log('handleExpire')  
  }

  handleSuccess($event: string) {
    this.validoCaptcha = true
    console.log('handleSuccess',$event)  
  }
  validoCaptcha:boolean = false

  btnHeader:any = {
    "habilitarEspecialista" : false,
    "registrarUsuarios" : false,
    "crearUsuarios" : false,
    "sacarTurno" : false,
    "turnosAdmin":false,
    "sacarTurnoAdmin":false,
    "perfilEsp": false,
    "perfilPaciente": false,
    "perfilAdm": false,
    "exportarUsuarios": false,
    "misTurnos" : false, //TODO colocar en false al terminar
  }
  usuario:any = null
  tipoUsuario:string = ''
  infoUsuario!:Usuario

  protected aFormGroup!: FormGroup; /**captcha form */
  protected aFormGroup2!: FormGroup; /**captcha form */

  constructor(private router: Router,private servicioUsuario:UsuariosService, private formBuilder: FormBuilder){
  }

  ngOnInit(): void {
   
    this.usuario = this.servicioUsuario.emailUsuario
    this.tipoUsuario = this.servicioUsuario.tipo
    console.log(this.tipoUsuario)
    console.log(this.usuario)
    this.TraerInfoUsuario();

    /**CAPTCHA */
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
    this.aFormGroup2 = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
    /**CAPTCHA */
  }

  async TraerInfoUsuario(){
    var queryTraerPelis = this.servicioUsuario.TraerUsuarios('mail', '==', this.servicioUsuario.emailUsuario)    

    const unsubscribe = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {      
      
      querySnapshot.forEach(async (doc: any) => {      
        this.infoUsuario = ( doc.data() )
      }); 
      
    })
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
