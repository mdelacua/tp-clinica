import { Component } from '@angular/core';
import { Paciente } from 'src/app/clases/paciente';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

import { onSnapshot } from '@firebase/firestore';
import { HistoriaClinica} from 'src/app/clases/historiaClinica';

import * as XLSX from 'xlsx';
import { TurnosService } from 'src/app/servicios/turnos.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstadoTurno } from 'src/app/clases/EstadoTurno.type';
import { Turno } from 'src/app/clases/turno';
import { Usuario } from 'src/app/clases/usuario';

import { collection, query, where, getDocs } from "firebase/firestore";

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


  constructor(private servicioUsuario:UsuariosService,    
        private servicioTurnos:TurnosService,     
        private modalService: NgbModal)
  {    
  }
  ngOnInit(): void {    
    this.datosUsuario = this.servicioUsuario.datosUsuarioConectado as Paciente    
    this.TraerPacientes()
    /*this.TraerPacientes2()
    this.usuario = this.servicioUsuario.emailUsuario
    this.tipoUsuario = this.servicioUsuario.tipo
    this.TraerTurnos()*/
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
      this.TraerTurnosDePacientes()
    });

  }

  async TraerTurnosDePacientes(){
    this.pacientes.forEach(async (paciente,index) => {

      this.pacientes[index].turnos = []

      var q = await this.servicioTurnos.TraerDatosAsync("mailUsuario", "==",paciente.mail, 'estado', '==', 'finalizado')
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        
        console.log(doc.id, " => ", doc.data());
        var datosQuery = doc.data() as Turno
        if(datosQuery){
          
          this.pacientes[index].turnos.push( datosQuery ) 
        }
      });

    });
    console.log("pacientes con turnos", this.pacientes)
  }

  title = 'usuarios_admin';
  fileName= 'ExcelSheet.xlsx';
    exportexcel(idTabla:string): void
    {
      /* pass here the table id */
      let element = document.getElementById(idTabla);
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
   
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   
      /* save to file */  
      XLSX.writeFile(wb, this.fileName);
   
    }
    /** END EXCELLLLL */

    
    usuario:any = null
    tipoUsuario:string = ''
    infoUsuario!:Usuario
  
    misTurnos: Array<Turno> = []
    misTurnosAux: Turno[] = []
    filtroEsp:string = ''
  
    pacientesConFoto:Array<any> =[  ]
  
    traerTurnosObs2:any 
    traerHcObs:any 
    
    mailUsuarios:Array<string>= []
    pacientes2:Array<Paciente> = []
  
    historiaClinica!: any
    peso!:string
    altura!:string
    presion!:string
    temperatura!:string
    campoValorUno:string = ''
    campoValorDos:string = ''
    campoValorTres:string = ''
    campoClaveUno:string = ''
    campoClaveDos:string = ''
    campoClaveTres:string = ''
  
    closeResult = '';
    
      estadoTurno:Array<EstadoTurno> = [
        'pendiente' , 'finalizado' , 'cancelado' , 'aceptado'
      ]
    
      cantTurnos = 0
         
    
     
      
      async TraerTurnos(){
    
       
        var queryTraerPelis = this.servicioTurnos.TraerTurnosDosQuerys('especialista', '==', this.servicioUsuario.emailUsuario,'estado', '==', 'finalizado' )    
        this.mostrarLoading = true
    
        this.traerTurnosObs2 = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {
          
          this.misTurnos = []
          this.misTurnosAux = []
          
          querySnapshot.forEach(async (doc: any) => {
          
            console.log(doc.data())
    
            var turno:Turno = doc.data() as Turno
            turno.turnoDiaConHoraEnSeg = this.CalcularHorarioDeTurnos(turno.diaTurno, turno.horaTurno)
            this.misTurnos.push( turno )
    
            
          });
    
          await this.TraerPacientes2()
    
          this.ordenarListaMayorAMenor( ) 
          
    
          this.misTurnosAux = this.misTurnos.slice();    
          console.log('misTurnosAux2',this.misTurnosAux  ) 
          this.mostrarLoading = false
          
         
        });
      }
      public ordenarListaMayorAMenor() {   
        const sorter = (a:any, b:any) => {
          return  b.turnoDiaConHoraEnSeg - a.turnoDiaConHoraEnSeg; // mayor a menor      
        };    
        console.log( 'this.misTurnos A', this.misTurnos)
        this.misTurnos = this.misTurnos.sort(sorter) ;   
        console.log( 'this.misTurnos B', this.misTurnos)    
        
      }
    
      MaxTresTurnosPorPaciente(){
        
        var turnosAux:any = this.misTurnos;
        var indicesParaBorrar: any[] = []
        this.pacientes2.forEach(paciente => {
          var auxTurnos = 0
          this.misTurnos.forEach((turno, indexTurno) => {
            if(turno.idPaciente == paciente.id){
              auxTurnos ++
            }
            if(auxTurnos > 3){
              indicesParaBorrar.push(indexTurno)
            }
          });
    
          console.log("paciente y turnos",paciente.mail, auxTurnos )
          //borrar
          for (let i = indicesParaBorrar.length - 1; i >= 0; i--) {
            turnosAux.splice(indicesParaBorrar[i], 1 );        
          }
          this.misTurnos = turnosAux
          console.log("paciente y turnos2",paciente.mail,  this.misTurnos )
        });
        this.misTurnosAux = this.misTurnos.slice(); 
      }
    
      
     
    
      async TraerPacientes2(){    
        //this.mailUsuarios = this.mailUsuarios.filter(mail => mail != turno.mailUsuario);
        //console.log('TraerPacientes',this.mailUsuarios)
        this.mailUsuarios = []
        
        var valueArr = this.misTurnos.map(function(item){ return item.mailUsuario });
        var emailSinDuplicados = [...new Set(valueArr)]   
        this.mailUsuarios = emailSinDuplicados;
        console.log('this.mailUsuarios',this.mailUsuarios)
        //await this.TraerHistoriasClinicas()
      }
      async TraerHistoriasClinicas(){
    
        var queryUsuarios = this.servicioUsuario.TraerUsuarios('mail', 'in', this.mailUsuarios )    
        this.mostrarLoading = true
    
        this.traerTurnosObs2 = await onSnapshot( await queryUsuarios, async (querySnapshot: any) => {           
          
          this.pacientes2 = []
          
          querySnapshot.forEach(async (doc: any) => { 
            
            var paciente:Paciente =doc.data() as Paciente
            //this.misTurnos.push( turno )
            if(this.pacientes2.length == 0 ){
              this.pacientes2.push( paciente )  
            }
            else if (this.pacientes2.filter(e => e.mail === paciente.mail).length == 0) {         
              this.pacientes2.push( paciente )   
            }
           
                
            /**asingar historia clinica a cada turno */
            this.misTurnos.forEach((element, index) => {
                if(element.mailUsuario == paciente.mail){
                  if(paciente.historiaClinica){
    
                    this.misTurnos[index].historiaClinica = paciente.historiaClinica
                  }
                  else{
                    this.misTurnos[index].historiaClinica = new HistoriaClinica()
                  }
                  this.misTurnos[index].idPaciente = paciente.id
                  this.misTurnos[index].imagenPaciente = paciente.imagen[0]
                }
            });
          }); 
         
          console.log('this.misTurnos', this.misTurnos)
          console.log('TraerHistoriasClinicas', this.pacientes2)
          this.MaxTresTurnosPorPaciente()
          this.mostrarLoading = false
        });
    
      }
      OpenModalEncuesta(content:any, historiaClinica:any) {
    
        this.historiaClinica = historiaClinica
        this.ActualizarValoresHCModal()
        console.log('this.historiaClinica', this.historiaClinica)
    
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result) => {
            console.log('openmodal result', result)				
            if(this.getDismissReason(result) == 'guardo'){
              //obj.motivoCancelamiento = this.motivoCancelar
              //this.CancelarTurno(obj);
              //this.ActualizarHistoriaClinica(obj.mailUsuario)
            }        
            
            
          },
          (reason) => {
            console.log('openmodal reason', reason)
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          },
        );
      }
      CalcularHorarioDeTurnos(dia:string, hora:string){
        //TODO Formato que debo enviar el dia/hora
        //new Date('04-01-2015 13:20') mes-dia-anho hora:min
        //var dia = '19/06/2023' //dd/mm/yyyy
        var arrDiaAux = dia.split('/')
        //var hora = '11:20 AM'
        var arrHoraAux = hora.split(':')    
        
        var diaYhoraStr = arrDiaAux[1] + '-' +  arrDiaAux[0] + '-' + arrDiaAux[2] + ' ' + arrHoraAux[0] + ':' + arrHoraAux[1].split(' ')[0]
        return new Date( diaYhoraStr ).getTime()
      }
      ActualizarValoresHCModal(){
        if(this.historiaClinica){
    
          this.peso =this.historiaClinica.peso
          this.altura =this.historiaClinica.altura
          this.temperatura =this.historiaClinica.temperatura
          this.presion =this.historiaClinica.presion
          this.campoClaveUno = this.historiaClinica.dinamicos[0].clave
          this.campoValorUno = this.historiaClinica.dinamicos[0].valor
          this.campoClaveDos = this.historiaClinica.dinamicos[1].clave
          this.campoValorDos = this.historiaClinica.dinamicos[1].valor
          this.campoClaveTres = this.historiaClinica.dinamicos[2].clave
          this.campoValorTres = this.historiaClinica.dinamicos[2].valor
        }
        else{
          this.peso = ''
          this.altura = ''
          this.temperatura = ''
          this.presion = ''
          this.campoClaveUno = ''
          this.campoValorUno = ''
          this.campoClaveDos = ''
          this.campoValorDos = ''
          this.campoClaveTres = ''
          this.campoValorTres = ''
        }
       
      }
      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return 'guardo';
        }
      }
    
      ActualizarHistoriaClinica(mailUsuario:string){
        let historiaClinica = new HistoriaClinica()
        historiaClinica.peso = this.peso
        historiaClinica.altura = this.altura
        historiaClinica.temperatura = this.temperatura
        historiaClinica.presion = this.presion
    
        historiaClinica.dinamicos[0].clave = this.campoClaveUno
        historiaClinica.dinamicos[0].valor =  this.campoValorUno
        historiaClinica.dinamicos[1].clave = this.campoClaveDos
        historiaClinica.dinamicos[1].valor =  this.campoValorDos
        historiaClinica.dinamicos[2].clave = this.campoClaveTres
        historiaClinica.dinamicos[2].valor =  this.campoValorTres
        //historiaClinica.dinamicos = []
        console.log('ActualizarHistoriaClinica',historiaClinica)
        console.log('mailUsuario',mailUsuario)
        var histClinicaJon = {historiaClinica: {...historiaClinica}}
    
        var idPaciente = this.BuscarIdCliente(mailUsuario)
    
        this.servicioUsuario.ActualizarUsuario(idPaciente, {...histClinicaJon} )
      }
      BuscarIdCliente(mailUsuario:string){
        var idPaciente = ''
        this.misTurnos.forEach((element:Turno) => {
          if(element.mailUsuario == mailUsuario) idPaciente = element.idPaciente
        });
        return idPaciente
      }
    
    
    
}
