import { Component, ElementRef, ViewChild } from '@angular/core';
import { HistoriaClinica } from 'src/app/clases/historiaClinica';
import { Paciente } from 'src/app/clases/paciente';
import { Usuario } from 'src/app/clases/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TurnosService } from 'src/app/servicios/turnos.service';

import { getDocs } from "firebase/firestore";
import { Turno } from 'src/app/clases/turno';

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
  mailEspecialidad:Array<string>= []
  especialistaSeleccionado:string = ''

  constructor(private servicioTurnos:TurnosService, private servicioUsuario:UsuariosService){
    
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
    this.TraerTurnosDePaciente()
   
  }
  async TraerTurnosDePaciente(){
    

      this.datosUsuario.turnos = []

      var q = await this.servicioTurnos.TraerDatosAsync("mailUsuario", "==",this.datosUsuario.mail, 'estado', '==', 'finalizado')
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        
        console.log(doc.id, " => ", doc.data());
        var datosQuery = doc.data() as Turno
        if(datosQuery){
          
          this.datosUsuario.turnos.push( datosQuery ) 
        }
      });

      this.TraerEspecialistas()
    
      console.log("pacientes con turnos", this.datosUsuario)
  }

  TraerEspecialistas(){    
    this.mailEspecialidad = []
    
    var valueArr = this.datosUsuario.turnos.map(function(item){ return item.especialidad });
    var emailSinDuplicados = [...new Set(valueArr)]   
    this.mailEspecialidad = emailSinDuplicados;
    console.log('this.mailEspecialidad',this.mailEspecialidad)
  }

  onSelectedDiaSelect(value:string): void {
    console.log(value)   
    this.especialistaSeleccionado = value
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
      PDF.save('datos_de_paciente.pdf');
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
