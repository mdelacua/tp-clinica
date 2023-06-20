import { Component, ElementRef, ViewChild } from '@angular/core';
import { HistoriaClinica } from 'src/app/clases/historiaClinica';
import { Paciente } from 'src/app/clases/paciente';
import { Usuario } from 'src/app/clases/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent {

  btnForms:any = {
    "horariosDisponibles" : false,
    "datosPrincipales" : true,
    "historiaClinica": false
  }
  datosUsuario!:Paciente
  fechaActual!:string

  constructor(private servicioUsuario:UsuariosService){
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.datosUsuario = this.servicioUsuario.datosUsuarioConectado as Paciente
    console.log(this.datosUsuario)
    if(!this.datosUsuario.historiaClinica){
      //this.datosUsuario.historiaClinica = new HistoriaClinica()      
    }
   
    this.fechaActual = this.FechaActual()
   
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

  /**PDF */

  @ViewChild('htmlData') htmlData!: ElementRef;

  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }

 

  FechaActual(){
    var d = new Date
    return [
      d.getDate(),
      d.getMonth()+1,
      d.getFullYear()].join('/')+' '+ [
          d.getHours(),
          d.getMinutes(),
          d.getSeconds()
      ].join(':');
     
  }
  /** ENDPDF */
}
