import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { onSnapshot } from '@firebase/firestore';
import { Especialista } from 'src/app/clases/especialista';
import { Turno } from 'src/app/clases/turno';
import { Usuario } from 'src/app/clases/usuario';
import { TurnosService } from 'src/app/servicios/turnos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ValidarEmail } from 'src/app/validators/validaciones';

@Component({
  selector: 'app-sacar-turno',
  templateUrl: './sacar-turno.component.html',
  styleUrls: ['./sacar-turno.component.css']
})
export class SacarTurnoComponent {


  mostrarLoading:boolean = false
  totalEspecialistas:Especialista[] = []
  especialidades:string[] = []

  especialidadSeleccionada!:string ;
  especialistasPorEspecialidad:Especialista[] = []
  
  especialistaSeleccionado: string | null = null
  apellidoEspecialistaSeleccionado: string | null = null

  nombreUsuario!:string

  constructor(private servicioUsuario:UsuariosService ,private formBuilder: FormBuilder, private turnoService: TurnosService){
  }

  form!: FormGroup;
  //mostrarMail:string = 'display:none'
  @Input() mostrarMail:string = 'display:none'  

  get mail() { return this.form?.get('mail'); }
  set mail(value: any) { this.form?.get('mail')?.patchValue(value);;  }
  validar(): void {
    this.form = new FormGroup(
        {          
          mail: new FormControl(this.mail,  [ ValidarEmail()] ) 
        },
      );
      if(this.mostrarMail == 'display:none' ){
        this.mail = this.servicioUsuario.emailUsuario
      }
  }
  

  ngOnInit(): void {
    this.TraerEspecialistas()
    this.iniciarValidacion()
    this.definirFechasMinMax()
    this.validar()
  }

  /*FECHA */

  //fechaActual:Date = new Date()
  fechaActual!:string 
  fechaMax!:string 

  diaSeleccionado: string | null = null
  horaSeleccionado: string | null= null

  loginForm!: FormGroup;

  horariosDiasDeSemana:string[] = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']
  horariosSabados:string[] = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00']
 
  async CrearTurno(){
    this.mostrarLoading = true
    var turno:Turno = new Turno(this.especialistaSeleccionado!, this.especialidadSeleccionada, this.diaSeleccionado!, this.horaSeleccionado!,this.mail.value, 'pendiente', this.apellidoEspecialistaSeleccionado!)
    await this.turnoService.CrearTurno({...turno})

    this.mostrarLoading = false
    this.ReiniciarDatos()

  }

  definirFechasMinMax(){
    this.fechaActual = this.formatDate(new Date())    
    
    const addDays = (date: Date, days: number): Date => {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };
    this.fechaMax = this.formatDate( addDays(new Date(), 15))
  }

  
  iniciarValidacion() {
    this.loginForm = this.formBuilder.group({
      requestdate: ['']
    })
    this.loginForm.get('requestdate')!.patchValue(this.formatDate(new Date()));    
    this.diaSeleccionado = this.loginForm.get('requestdate')?.value
  }

  private formatDate(date:Date) {
    console.log(this.loginForm.get('requestdate'))
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  


	onSelectedHora(value:string): void {
    console.log(value)
    this.horaSeleccionado = value
	}
	onSelectedDia(value:any): void {
    console.log(value)
    console.log(this.loginForm.get('requestdate')?.value)
    this.diaSeleccionado = this.loginForm.get('requestdate')?.value
	}
  /*FIN FECHA */

  onSelectedEspecialista(value:string, mails:any): void {
    console.log(mails)
    console.log(value)
    var e = document.getElementById("selectEspecialista") as HTMLSelectElement; // trae el ID de la opcion
    this.especialistaSeleccionado = e?.options[e.selectedIndex].id;
    this.apellidoEspecialistaSeleccionado = value;
	}

  ReiniciarDatos(){
    var selectEsp = ( document.getElementById("selectEspecialista") ) as HTMLSelectElement
    if(selectEsp) selectEsp!.selectedIndex = 0;
    this.especialistaSeleccionado = null
    this.apellidoEspecialistaSeleccionado = null
    this.horaSeleccionado = null
  }
  onSelected(value:string): void {
    /**des seleccionar especialista */
    this.ReiniciarDatos()
    /**des seleccionar especialista */
    
		this.especialidadSeleccionada = value;
    console.log(this.especialidadSeleccionada)
    this.traerEspecialistasPorEspecialidad()
	}
	

  async TraerEspecialistas(){
    var queryTraerPelis = this.servicioUsuario.TraerUsuarios('tipo', '==','especialista')
    this.mostrarLoading = true

    const unsubscribe = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {
      
      this.totalEspecialistas = []
      querySnapshot.forEach(async (doc: any) => {      
       
        this.totalEspecialistas.push( doc.data() )
      }); 
      console.log(this.totalEspecialistas)
      this.mostrarLoading = false
      this.traerEspecialidades()
     
    });
  }

  traerEspecialidades(){
    this.totalEspecialistas.forEach(element => {      
      this.especialidades.push( element.especialidad)
    });
    console.log(this.especialidades)
    this.especialidades = this.especialidades.filter((item,index) => this.especialidades.indexOf(item) === index);
    console.log(this.especialidades)
  }

  traerEspecialistasPorEspecialidad(){
    
    this.especialistasPorEspecialidad = []
    this.totalEspecialistas.forEach(element => {      
      if(element.especialidad == this.especialidadSeleccionada){
        this.especialistasPorEspecialidad.push(element)
      }
    });
  }
}
