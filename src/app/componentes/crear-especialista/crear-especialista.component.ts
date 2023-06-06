import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { Especialista } from 'src/app/clases/especialista';
import { ArchivoService } from 'src/app/servicios/archivo.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ValidarCaracteresNumero, ValidarCaracteresTexto, ValidarDNI, ValidarEmail } from 'src/app/validators/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-especialista',
  templateUrl: './crear-especialista.component.html',
  styleUrls: ['./crear-especialista.component.css']
})
export class CrearEspecialistaComponent {

  form!: FormGroup;
  formNuevaEsp!: FormGroup;

  archivos: any[] = [];
  selectedFiles:  any[] = [];

  user:any
  repitePass:any
  mostraCrear:any = false
  btnFormulario:any = {"inciarSesion" : true,"registrarse": false }
  sesionUsuario: any;

  get nombre() { return this.form?.get('nombre'); }
  set nombre(value: any) { this.form?.get('nombre')?.patchValue(value);;  }

  get apellido() { return this.form?.get('apellido'); }
  set apellido(value: any) { this.form?.get('apellido')?.patchValue(value);;  }

  get edad() { return this.form?.get('edad'); }
  set edad(value: any) { this.form?.get('edad')?.patchValue(value);;  }

  get dni() { return this.form?.get('dni'); }
  set dni(value: any) { this.form?.get('dni')?.patchValue(value);;  }

  get password() { return this.form?.get('password'); }
  set password(value: any) { this.form?.get('password')?.patchValue(value);;  }

  get mail() { return this.form?.get('mail'); }
  set mail(value: any) { this.form?.get('mail')?.patchValue(value);;  }

  get especialidad() { return this.form?.get('especialidad'); }
  set especialidad(value: any) { this.form?.get('especialidad')?.patchValue(value);;  }

  get nuevaEspecialidad() { return this.form?.get('nuevaEspecialidad'); }
  set nuevaEspecialidad(value: any) { this.form?.get('nuevaEspecialidad')?.patchValue(value);;  }
  
  constructor(private archivoService: ArchivoService,private servicioUsuario:UsuariosService,private router: Router,public readonly swalTargets: SwalPortalTargets){

  }

  onFileSelected(event: any) {
    this.selectedFiles.push(event.target.files);
    //this.uploadFiles()
    console.log(this.selectedFiles)
  }

  uploadFiles() {
    // Ejemplo: cargar los archivos en un servidor
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file: File = this.selectedFiles[i];
        // Aquí puedes implementar la lógica para cargar el archivo en un servidor
        console.log('Archivo seleccionado:', file);
      }
    }
  }
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  ngOnInit() {
    //this.sesionUsuario = this.servicioUsuario.VerificarSesionUsuario('home',null)
    this.validar();
  }

  ngOnDestroy(){
    console.log('ngOnDestroy')
    //this.sesionUsuario.Unsubscribe()
  }
  
  NuenvaEspecialidad(){
    var selector = document.getElementById("especialidad") as HTMLInputElement;
    var newoption = document.createElement("option");
    newoption.text = this.nuevaEspecialidad.value;
    newoption.value = this.nuevaEspecialidad.value;
    newoption.selected = true;
    selector.appendChild(newoption) ;
    this.especialidad = this.nuevaEspecialidad.value
  }

  async CrearUsuario(){
            
    var fotos:any = []

    for (let i = 0; i < this.selectedFiles.length; i++) {    
      fotos.push(await this.archivoService.guardarArchivo(this.selectedFiles[i][0], 'usuarios/'))    
    }

    var especialista = new Especialista(this.nombre.value ,this.apellido.value ,this.edad.value ,this.dni.value ,this.mail.value ,fotos ,this.especialidad.value)
    especialista.habilitado = false
    especialista.tipo = 'especialista'
    
    
    var usuarioCreado =  this.servicioUsuario.CrearUsuarioAuth(this.mail.value, this.password.value)
    usuarioCreado.then(async (userCredential) => { 

      this.servicioUsuario.EnviarMailVerificacion()
      
      console.log(userCredential)  
      console.log(especialista)  
      this.servicioUsuario.CrearUsuario({...especialista}, 'usuario')
      this.servicioUsuario.CerrarSesionAuth()
      this.NotificaionInicioSesion('Usuario Creado')
      
    })
    .catch((error) => {
      this.ErrorUsuario('Error al crear usuario...')
      console.log('error creacion auth')
      console.log(error)
      
     
      // ..
    });
    /******************** */    
    
    
   
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
      'Por favor, inicie nuevamente sesion...Presione Ok para continuar!',
      'success'
    )
  }

  validar(): void {
    this.form = new FormGroup(
        {
          //nombre: new FormControl(this.nombre,  [validarCampoTexto(1, 20)]  ) ,
          nombre: new FormControl(this.nombre,  [  ValidarCaracteresTexto(1,20, true)] ) ,
          edad: new FormControl(this.edad,  [ ValidarCaracteresNumero(16, 80)] ) ,
          apellido: new FormControl(this.apellido,  [ ValidarCaracteresTexto(1,20, true) ] ) ,
          dni: new FormControl(this.dni,  [ValidarDNI()] ) ,
          mail: new FormControl(this.mail,  [ ValidarEmail()] ) ,
          password: new FormControl(this.password,  [ ValidarCaracteresTexto(6,30, false)] ) ,
          especialidad: new FormControl(this.especialidad,  [ ValidarCaracteresTexto(1,30, false)] ) ,      
          nuevaEspecialidad: new FormControl(this.nuevaEspecialidad,  [] ) , //verificar como agregar validacion sin bloquear el formulario
         
        },
      );
  }
 

  async CrearCuenta(){

   var fotos:any = []

   for (let i = 0; i < this.selectedFiles.length; i++) {    
    fotos.push(await this.archivoService.guardarArchivo(this.selectedFiles[i][0], 'usuarios/'))    
   }
   

    console.log(fotos)
  }


}
