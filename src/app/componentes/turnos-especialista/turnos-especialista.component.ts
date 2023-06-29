import { Component } from '@angular/core';
import { Turno } from 'src/app/clases/turno';
import { TurnosService } from 'src/app/servicios/turnos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { onSnapshot } from '@firebase/firestore';
import { Paciente } from 'src/app/clases/paciente';
import { HistoriaClinica} from 'src/app/clases/historiaClinica';

@Component({
  selector: 'app-turnos-especialista',
  templateUrl: './turnos-especialista.component.html',
  styleUrls: ['./turnos-especialista.component.css']
})
export class TurnosEspecialistaComponent {
  mostrarLoading:boolean = false
  misTurnos: Array<Turno> = []
  misTurnosAux: Turno[] = []
  filtroEsp:string = ''

  traerTurnosObs:any 
  traerHcObs:any 

  FiltrarEspecialista(){

    this.misTurnosAux = []
    this.misTurnosAux = this.misTurnos.slice();
    
    for (let i = 0; i < this.misTurnosAux.length; i++) {
      if(!this.misTurnosAux[i].mailUsuario ) this.misTurnosAux[i].mailUsuario = ''
      
      var auxMail = this.misTurnosAux[i].mailUsuario.toLowerCase()
      var auxEspecialidad = this.misTurnosAux[i].especialidad.toLowerCase()
      var auxAltura = this.misTurnosAux[i].historiaClinica.altura.toLowerCase()
      var auxPeso = this.misTurnosAux[i].historiaClinica.peso.toLowerCase()
      var auxTemp = this.misTurnosAux[i].historiaClinica.temperatura.toLowerCase()
      var auxPresion = this.misTurnosAux[i].historiaClinica.presion.toLowerCase()
      var auxDinUno = this.misTurnosAux[i].historiaClinica.dinamicos[0].valor.toLowerCase()
      var auxDinDos = this.misTurnosAux[i].historiaClinica.dinamicos[1].valor.toLowerCase()
      var auxDinTres = this.misTurnosAux[i].historiaClinica.dinamicos[2].valor.toLowerCase()
            
      var filtro = this.filtroEsp.toLowerCase()
      
      if( 
        !auxMail.includes(filtro) &&
        !auxAltura.includes(filtro) &&
        !auxPeso.includes(filtro) &&
        !auxTemp.includes(filtro) &&
        !auxPresion.includes(filtro) &&
        !auxDinUno.includes(filtro) &&
        !auxDinDos.includes(filtro) &&
        !auxDinTres.includes(filtro) &&
        !auxEspecialidad.includes(filtro)
        ){
        this.misTurnosAux.splice( i,1);
        i--;
      }      
    }  
    console.log('FiltrarEspecialista',this.misTurnosAux, this.misTurnos)
  }


  constructor(private servicioTurnos:TurnosService, private usuarioService:UsuariosService,private modalService: NgbModal){

  }
  motivoCancelar!:string
  closeResult = '';
  OpenModal(content:any, obj:Turno) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
        console.log('openmodal result', result)				
        if(this.getDismissReason(result) == 'guardo'){
          obj.motivoCancelamiento = this.motivoCancelar
          this.CancelarTurno(obj);
        }        
        this.motivoCancelar = ''
        
			},
			(reason) => {
        console.log('openmodal reason', reason)
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

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

  OpenModalEncuesta(content:any, obj:Turno) {

    this.historiaClinica = obj.historiaClinica
    this.ActualizarValoresHCModal()
    console.log('this.historiaClinica', this.historiaClinica)

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
        console.log('openmodal result', result)				
        if(this.getDismissReason(result) == 'guardo'){
          //obj.motivoCancelamiento = this.motivoCancelar
          //this.CancelarTurno(obj);
          this.ActualizarHistoriaClinica(obj.mailUsuario)
        }        
        this.motivoCancelar = ''
        
			},
			(reason) => {
        console.log('openmodal reason', reason)
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
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

    this.usuarioService.ActualizarUsuario(idPaciente, {...histClinicaJon} )
  }

  BuscarIdCliente(mailUsuario:string){
    var idPaciente = ''
    this.misTurnos.forEach((element:Turno) => {
      if(element.mailUsuario == mailUsuario) idPaciente = element.idPaciente
    });
    return idPaciente
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


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.TraerTurnos()
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    try { this.traerTurnosObs() } catch (error) { }
    try { this.traerHcObs() } catch (error) { }
  }

  async TraerTurnos(){

    
    var queryTraerPelis = this.servicioTurnos.TraerTurnos('especialista', '==', this.usuarioService.emailUsuario )    
    this.mostrarLoading = true

    this.traerTurnosObs = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {
      
      this.misTurnos = []
      this.misTurnosAux = []
      
      querySnapshot.forEach(async (doc: any) => {
      
        console.log(doc.data())

        var turno:Turno =doc.data() as Turno
        turno.turnoDiaConHoraEnSeg = this.CalcularHorarioDeTurnos(turno.diaTurno, turno.horaTurno)
        this.misTurnos.push( turno )

        
      });

      this.ordenarListaMayorAMenor()
      this.TraerPacientes()


      this.misTurnosAux = this.misTurnos.slice();
      this.mostrarLoading = false
      
     
    });
  }

  CalcularHorarioDeTurnos(dia:string, hora:string){
    
    var arrDiaAux = dia.split('/')    
    var arrHoraAux = hora.split(':')    
    
    var diaYhoraStr = arrDiaAux[1] + '-' +  arrDiaAux[0] + '-' + arrDiaAux[2] + ' ' + arrHoraAux[0] + ':' + arrHoraAux[1]
    return new Date( diaYhoraStr ).getTime()
  }
  public ordenarListaMayorAMenor() {   
    const sorter = (a:any, b:any) => {
      return  b.turnoDiaConHoraEnSeg - a.turnoDiaConHoraEnSeg; // mayor a menor      
    };        
    this.misTurnos = this.misTurnos.sort(sorter) ;
  }

  mailUsuarios:Array<string>= []
  pacientes:Array<Paciente> = []

  TraerPacientes(){    
    //this.mailUsuarios = this.mailUsuarios.filter(mail => mail != turno.mailUsuario);
    //console.log('TraerPacientes',this.mailUsuarios)
    this.mailUsuarios = []
    
    var valueArr = this.misTurnos.map(function(item){ return item.mailUsuario });
    var emailSinDuplicados = [...new Set(valueArr)]   
    this.mailUsuarios = emailSinDuplicados;
    console.log('this.mailUsuarios',this.mailUsuarios)
    this.TraerHistoriasClinicas()
  }
  async TraerHistoriasClinicas(){

    var queryUsuarios = this.usuarioService.TraerUsuarios('mail', 'in', this.mailUsuarios )    
    this.mostrarLoading = true

    this.traerTurnosObs = onSnapshot( await queryUsuarios, async (querySnapshot: any) => {           
      
      this.pacientes = []
      
      querySnapshot.forEach(async (doc: any) => { 
        
        var paciente:Paciente =doc.data() as Paciente
        //this.misTurnos.push( turno )
        this.pacientes.push( paciente )       
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
            }
        });
      }); 
     
      console.log('this.misTurnos', this.misTurnos)
      console.log('TraerHistoriasClinicas', this.pacientes)
      this.mostrarLoading = false
    });

  }

  CancelarTurno(turno:Turno){
    console.log(turno)
    //document.getElementById('myInput')!.trigger('focus')
    this.servicioTurnos.ActualizarTurno(turno.id, {estado: 'cancelado', motivoCancelamiento: turno.motivoCancelamiento})
  }
  FinalizarTurno(turno:Turno){
    console.log(turno)
    this.servicioTurnos.ActualizarTurno(turno.id, {estado: 'finalizado'})
  }
  AceptarTurno(turno:Turno){
    console.log(turno)
    this.servicioTurnos.ActualizarTurno(turno.id, {estado: 'aceptado'})
  }
}

