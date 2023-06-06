import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { Especialista } from 'src/app/clases/especialista';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ValidarCaracteresNumero, ValidarCaracteresTexto, ValidarDNI, ValidarEmail, validarCampoTexto } from 'src/app/validators/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
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


}

