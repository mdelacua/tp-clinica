import { Component } from '@angular/core';
import { Paciente } from 'src/app/clases/paciente';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

import { onSnapshot } from '@firebase/firestore';
import { HistoriaClinica} from 'src/app/clases/historiaClinica';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exportar-usuarios',
  templateUrl: './exportar-usuarios.component.html',
  styleUrls: ['./exportar-usuarios.component.css']
})
export class ExportarUsuariosComponent {
  datosUsuario!:Paciente
  mostrarLoading:boolean = false
  pacientes:Array<Paciente> = []
  traerTurnosObs:any 


  constructor(private servicioUsuario:UsuariosService){
    
  }
  ngOnInit(): void {    
    this.datosUsuario = this.servicioUsuario.datosUsuarioConectado as Paciente    
    this.TraerPacientes()
  }

  async TraerPacientes(){

    var queryUsuarios = this.servicioUsuario.TraerUsuarios('tipo', '==', 'paciente' )    
    this.mostrarLoading = true

    this.traerTurnosObs = onSnapshot( await queryUsuarios, async (querySnapshot: any) => {           
      
      this.pacientes = []
      
      querySnapshot.forEach(async (doc: any) => { 
        
        var paciente:Paciente =doc.data() as Paciente    
        if(!paciente.historiaClinica){
          paciente.historiaClinica = new HistoriaClinica()
        }         
        this.pacientes.push( paciente )       
        
      });      
      
      console.log('TraerPacientes', this.pacientes)
      this.mostrarLoading = false
    });

  }
  title = 'angular-app';
    fileName= 'ExcelSheet.xlsx';
    exportexcel(): void
    {
      /* pass here the table id */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
   
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   
      /* save to file */  
      XLSX.writeFile(wb, this.fileName);
   
    }
    /** END EXCELLLLL */
}
