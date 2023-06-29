import { HtmlParser } from '@angular/compiler';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TurnosService } from 'src/app/servicios/turnos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { getDocs } from "firebase/firestore";
import { Turno } from 'src/app/clases/turno';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent {

  constructor(
    private servicioUsuario:UsuariosService,    
    private servicioTurnos:TurnosService
  ){}

  turnos:Array<Turno> = []

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //this.testCanvas()
    
    //this.testCanvas3()
    //this.testCanvas4()
    this.TraerTurnosDePacientes()
  }

  
  @ViewChild('htmlData') htmlData!: ElementRef;

  public openPDF(idElemto:string): void {
    let DATA: any = document.getElementById(idElemto);
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Graficos.pdf');
    });
  }

  
  CalcularHorarioDeTurnos(dia:string, hora:string){
    //TODO Formato que debo enviar el dia/hora
    //new Date('04-01-2015 13:20') mes-dia-anho hora:min
    //var dia = '19/06/2023' //dd/mm/yyyy
    var arrDiaAux = dia.split('/')
    //var hora = '11:20 AM'
    
    //var arrHoraAux = hora.split(':')    
    
    var diaYhoraStr = arrDiaAux[1] + '-' +  arrDiaAux[0] + '-' + arrDiaAux[2] /*+ ' ' + arrHoraAux[0] + ':' + arrHoraAux[1].split(' ')[0]*/
    return new Date( diaYhoraStr ).getTime()
  }

  public ordenarListaMayorAMenor() {   
    const sorter = (a:any, b:any) => {
      return  b.turnoDiaConHoraEnSeg - a.turnoDiaConHoraEnSeg; // mayor a menor      
    };        
    this.turnos = this.turnos.sort(sorter) ;
  }
  async TraerTurnosDePacientes(){
    

    this.turnos = []

    var q = await this.servicioTurnos.TraerDatosAsyncUnaQuery("mailUsuario", "!=",'')
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      
      console.log(doc.id, " => ", doc.data());
      var datosQuery = doc.data() as Turno
      if(datosQuery){
        datosQuery.turnoDiaConHoraEnSeg = this.CalcularHorarioDeTurnos(datosQuery.diaTurno, datosQuery.horaTurno)
        this.turnos.push( datosQuery ) 
      }
    });

    this.ordenarListaMayorAMenor()
    console.log("turnos", this.turnos)
    this.EspecialistasPorTurno()
    this.TurnoPorDia()
    this.TurnoPorMedico()
    this.TurnoPorMedicoFinalizado()
  }
  /** GRAFICO ESPECIALIDAD */
  
  arrEspecialidad:any = {
    especialidad: [] ,
    cantEspecialidad: [] 
  }
  EspecialistasPorTurno(){
    this.arrEspecialidad = []
        
        var valueArr = this.turnos.map(function(item){ return item.especialidad });
        var emailSinDuplicados = [...new Set(valueArr)]   
        this.arrEspecialidad.especialidad = emailSinDuplicados;
        console.log('this.arrEspecialidad',this.arrEspecialidad.especialidad) 
        this.CalcularCantDeTurnosPorEspecialista()
      }
  CalcularCantDeTurnosPorEspecialista(){
    this.arrEspecialidad.cantEspecialidad = []
    this.arrEspecialidad.especialidad.forEach((element:any, index:number) => {

      this.arrEspecialidad.cantEspecialidad.push(0) //creo el primer valir por cada especialidad

      this.turnos.forEach(turno => {
        
        if(turno.especialidad == element){         

          this.arrEspecialidad.cantEspecialidad[index] += 1
        }
      });
      console.log('this.arrEspecialidad.cantEspecialidad',this.arrEspecialidad.cantEspecialidad) 
    });
    this.testCanvas2()

  }
  testCanvas2(){  
    var myChart = new Chart("myChart2", {
      type: 'doughnut',
      data: {
        labels: this.arrEspecialidad.especialidad,
        datasets: [{
          label: 'Turnos',
          data: this.arrEspecialidad.cantEspecialidad,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }
  /** FIN GRAFICO ESPECIALIDAD */

  /*GRAFICO TURNOS POR DIA*/
  arrTurnoPorDia:any = {
    dias: [] ,
    cantDias: [] 
  }
  TurnoPorDia(){
    this.arrTurnoPorDia = []
        
    var valueArr = this.turnos.map(function(item){ return item.diaTurno });
    var emailSinDuplicados = [...new Set(valueArr)]   
    this.arrTurnoPorDia.dias = emailSinDuplicados;
    //this.arrTurnoPorDia.dias.sort();
    console.log('this.arrTurnoPorDia',this.arrTurnoPorDia.dias)
    this.CalcularCantDeTurnosPorDias()
  }
  CalcularCantDeTurnosPorDias(){
    this.arrTurnoPorDia.cantDias = []
    this.arrTurnoPorDia.dias.forEach((element:any, index:number) => {

      this.arrTurnoPorDia.cantDias.push(0) //creo el primer valir por cada especialidad

      this.turnos.forEach(turno => {
        
        if(turno.diaTurno == element){         

          this.arrTurnoPorDia.cantDias[index] += 1
        }
      });
      console.log('this.arrTurnoPorDia.cantDias',this.arrTurnoPorDia.cantDias) 
    });
    this.testCanvas()

  }
  testCanvas(){  
    var myChart = new Chart("myChart", {
      type: 'polarArea',
      data: {
        labels: this.arrTurnoPorDia.dias,
        datasets: [{
          label: 'Turnos',
          data: this.arrTurnoPorDia.cantDias,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)'
          ]
        }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
    /*var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: this.arrTurnoPorDia.dias,
          datasets: [{
              label: 'Turnos',
              data: this.arrTurnoPorDia.cantDias,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });*/
  }
  /*FIN GRAFICO TURNOS POR DIA*/

  /*GRAFICO TURNOS POR MEDICO pendiente y aceptado*/
  arrTurnoPorMedico:any = {
    medico: [] ,
    cantMedico: [] 
  }
  TurnoPorMedico(){
    this.arrTurnoPorMedico = []
        
    var valueArr = this.turnos.map(function(item){ return item.especialista });
    var emailSinDuplicados = [...new Set(valueArr)]   
    this.arrTurnoPorMedico.medico = emailSinDuplicados;
    //this.arrTurnoPorMedico.medico.sort();
    console.log('this.arrTurnoPorMedico',this.arrTurnoPorMedico.medico)
    this.CalcularCantDeTurnosPorMedico()
  }
  CalcularCantDeTurnosPorMedico(){
    
    var fechaActual = new Date()
    var fechaActualNum:number = new Date().getTime();
    var fechaFinalNum:number
    fechaFinalNum = fechaActual.setDate(fechaActual.getDate() - 10 );//TODO cantidad de dias '10' maximos a mostrar

    this.arrTurnoPorMedico.cantMedico = []
    this.arrTurnoPorMedico.medico.forEach((element:any, index:number) => {

      this.arrTurnoPorMedico.cantMedico.push(0) //creo el primer valir por cada especialidad

      this.turnos.forEach(turno => {
        
        if(turno.especialista == element && (turno.estado == 'pendiente' || turno.estado == 'aceptado') && (turno.turnoDiaConHoraEnSeg > fechaFinalNum && turno.turnoDiaConHoraEnSeg < fechaActualNum )){         

          this.arrTurnoPorMedico.cantMedico[index] += 1
        }
      });
      console.log('this.arrTurnoPorMedico.cantMedico',this.arrTurnoPorMedico.cantMedico) 
    });
    this.testCanvas4()

  }
  testCanvas4(){  

    var datasets:any = []
    this.arrTurnoPorMedico.medico.forEach((element:any, index:any) => {
      datasets.push({
            label: this.arrTurnoPorMedico.medico[index],
            data: [ this.arrTurnoPorMedico.cantMedico[index] ],
            borderWidth: 1
        }
      )
    });
    var myChart = new Chart("myChart4", {
      type: 'bar',
      data: {
          labels: ['Turnos "Pendientes/Aceptados" por medico (ultimos 10 dias)'],
          datasets: datasets
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }
  /*FIN GRAFICO TURNOS POR MEDICO*/

  /* GRAFICO TURNOS POR MEDICO FINALIZADO */

  arrTurnoPorMedicoFinalizado:any = {
    medico: [] ,
    cantMedico: [] 
  }
  TurnoPorMedicoFinalizado(){
    this.arrTurnoPorMedicoFinalizado = []
        
    var valueArr = this.turnos.map(function(item){ return item.especialista });
    var emailSinDuplicados = [...new Set(valueArr)]   
    this.arrTurnoPorMedicoFinalizado.medico = emailSinDuplicados;
    //this.arrTurnoPorMedicoFinalizado.medico.sort();
    console.log('this.arrTurnoPorMedicoFinalizado',this.arrTurnoPorMedicoFinalizado.medico)
    this.CalcularCantDeTurnosPorMedicoFinalizado()
  }
  CalcularCantDeTurnosPorMedicoFinalizado(){
    
    var fechaActual = new Date()
    var fechaActualNum:number = new Date().getTime();
    var fechaFinalNum:number
    fechaFinalNum = fechaActual.setDate(fechaActual.getDate() - 10 );//TODO cantidad de dias '10' maximos a mostrar

    this.arrTurnoPorMedicoFinalizado.cantMedico = []
    this.arrTurnoPorMedicoFinalizado.medico.forEach((element:any, index:number) => {

      this.arrTurnoPorMedicoFinalizado.cantMedico.push(0) //creo el primer valir por cada especialidad

      this.turnos.forEach(turno => {
        
        if(turno.especialista == element && turno.estado == 'finalizado'  && (turno.turnoDiaConHoraEnSeg > fechaFinalNum && turno.turnoDiaConHoraEnSeg < fechaActualNum )){         

          this.arrTurnoPorMedicoFinalizado.cantMedico[index] += 1
        }
      });
      console.log('this.arrTurnoPorMedicoFinalizado.cantMedico',this.arrTurnoPorMedicoFinalizado.cantMedico) 
    });
    this.testCanvas3()

  }
  testCanvas3(){  
    var datasets:any = []
    this.arrTurnoPorMedicoFinalizado.medico.forEach((element:any, index:any) => {
      datasets.push({
            label: this.arrTurnoPorMedicoFinalizado.medico[index],
            data: [ this.arrTurnoPorMedicoFinalizado.cantMedico[index] ],
            borderWidth: 1
        }
      )
    });
    var myChart = new Chart("myChart3", {
      type: 'bar',
      data: {
          labels: ['Turnos "Finalizados" por medicos (ultimos 10 dias)'],
          datasets: datasets
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
   
  }

  
}
