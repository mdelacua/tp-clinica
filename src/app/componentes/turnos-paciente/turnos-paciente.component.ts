import { Component } from '@angular/core';
import { Turno } from 'src/app/clases/turno';
import { TurnosService } from 'src/app/servicios/turnos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { onSnapshot } from '@firebase/firestore';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent {
  mostrarLoading:boolean = false
  misTurnos: Turno[] = []
  misTurnosAux: Turno[] = []
  filtroEsp:string = ''

  FiltrarEspecialista(){

    this.misTurnosAux = []
    this.misTurnosAux = this.misTurnos.slice();
    
    for (let i = 0; i < this.misTurnosAux.length; i++) {
      if(!this.misTurnosAux[i].apellidoEspecialista ) this.misTurnosAux[i].apellidoEspecialista = ''
      
      var auxMail = this.misTurnosAux[i].apellidoEspecialista.toLowerCase()
      var auxEspecialidad = this.misTurnosAux[i].especialidad.toLowerCase()
      var filtro = this.filtroEsp.toLowerCase()
      if( !auxMail.includes(filtro) && !auxEspecialidad.includes(filtro) ){
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

  async TraerTurnos(){

    
    var queryTraerPelis = this.servicioTurnos.TraerTurnos('mailUsuario', '==', this.usuarioService.emailUsuario )    
    this.mostrarLoading = true

    const unsubscribe = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {
      
      this.misTurnos = []
      this.misTurnosAux = []
      querySnapshot.forEach(async (doc: any) => {
      
        console.log(doc.data())
        var turno:Turno =doc.data() as Turno
        turno.turnoDiaConHoraEnSeg = this.CalcularHorarioDeTurnos(turno.diaTurno, turno.horaTurno)
        this.misTurnos.push( turno )
      }); 
      this.ordenarListaMayorAMenor()
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

  CancelarTurno(turno:Turno){
    console.log(turno)
    this.servicioTurnos.ActualizarTurno(turno.id, {estado: 'cancelado', motivoCancelamiento: turno.motivoCancelamiento})
  }
}
