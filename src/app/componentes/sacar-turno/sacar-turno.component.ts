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

  fechasDisponibles!:Array<string> //FECHAS PARA MOSTRAR EN SELECT

  constructor(private servicioUsuario:UsuariosService ,private formBuilder: FormBuilder, private turnoService: TurnosService,){
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

   // this.traerFechas()//TODO BORRAR
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    try {this.traerTurnosAgendadosObs();} catch (error) {}
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

  traerTurnosAgendadosObs!:any;
 
  async CrearTurno(){
    this.mostrarLoading = true
    var turno:Turno = new Turno(this.especialistaSeleccionado!, this.especialidadSeleccionada, this.diaSeleccionado!, this.horaSeleccionada!,this.mail.value, 'pendiente', this.apellidoEspecialistaSeleccionado!)
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
	onSelectedDiaSelect(value:string): void {
    console.log(value)
    this.diaSeleccionado = value
    this.buscarHorariosDisponiblesDelDiaSeleccionado(value)
    /**cambiar estilo de btn hora seleccionado */
    if(this.btnHoraSeleccionada){
      this.btnHoraSeleccionada.srcElement.className = 'btn btn-outline-primary'     
      this.horaSeleccionada = ''; 
    }
	}
	onSelectedDia(value:any): void {
    console.log(value)
    console.log(this.loginForm.get('requestdate')?.value)
    this.diaSeleccionado = this.loginForm.get('requestdate')?.value
	}
  /*FIN FECHA */

  onSelectedEspecialista(value:string, mails:any): void {
    /**varia fecha */
    this.diaSeleccionado = null
    /**varia fecha */
    console.log(mails)
    console.log(value)
    var e = document.getElementById("selectEspecialista") as HTMLSelectElement; // trae el ID de la opcion
    this.especialistaSeleccionado = e?.options[e.selectedIndex].id;
    this.apellidoEspecialistaSeleccionado = value;
    this.BuscarHoraPorEspecialista(this.especialistaSeleccionado)
    /**nueva funcionalidad fechas */
    this.TraerDiasDisponiblesEsp()
    this.traerFechas()
	}

  BuscarHoraPorEspecialista(mail:string){
    this.totalEspecialistas.forEach((element: Especialista) => {
      if(element.mail == mail && element.horariosDeAtencion){
        this.horariosDiasDeSemana = element.horariosDeAtencion
      }
    });
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



  traerFechas(){
    // Obtén la fecha actual
      const fechaActual = new Date();

      // Crea un array para almacenar las fechas
      const fechas: string[] = [];

      // Itera desde el día actual hasta quince días después
      for (let i = 0; i < 16; i++) {
        // Calcula la fecha actual más el número de días de la iteración
        const fecha = new Date(fechaActual.getTime() + i * 24 * 60 * 60 * 1000);  
              
        this.arrayDiasDisponiblesEspecialista.forEach(diaDisponible => {
          if(fecha.getDay() == diaDisponible){
              // Obtiene los componentes de la fecha (día, mes, año)
              const dia = fecha.getDate().toString().padStart(2, '0');
              const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Enero es 0
              const anio = fecha.getFullYear();

              // Crea la cadena de fecha en el formato "dd-mm-yyyy"
              const fechaStr = `${dia}/${mes}/${anio}`;
              // Agrega la fecha al array
              fechas.push(fechaStr);
          }
        });
        
      }

      this.fechasDisponibles = fechas
      // Imprime el array de fechas
      console.log('traer fechas test',fechas);
  }

  arrayDiasDisponiblesEspecialista: Array<number> = []
  arrayHoraPorDiaSeleccionado: Array<string> = []
  especialistaSeleccionadoObj!: Especialista
  TraerDiasDisponiblesEsp(){
    this.totalEspecialistas.forEach(element => {
      if(element.mail == this.especialistaSeleccionado){
        this.buscarDiasDisponibles(element)
        this.especialistaSeleccionadoObj = element
        console.log('Array dias disponibles', this.arrayDiasDisponiblesEspecialista)
      } 
      
    });
  }

  buscarDiasDisponibles(especilista:Especialista){
    this.arrayDiasDisponiblesEspecialista = []
    if(especilista.horasConDiasEsp.Domingo) this.arrayDiasDisponiblesEspecialista.push(0)
    if(especilista.horasConDiasEsp.Lunes) this.arrayDiasDisponiblesEspecialista.push(1)
    if(especilista.horasConDiasEsp.Martes) this.arrayDiasDisponiblesEspecialista.push(2)
    if(especilista.horasConDiasEsp.Miercoles) this.arrayDiasDisponiblesEspecialista.push(3)
    if(especilista.horasConDiasEsp.Jueves) this.arrayDiasDisponiblesEspecialista.push(4)
    if(especilista.horasConDiasEsp.Viernes) this.arrayDiasDisponiblesEspecialista.push(5)
    if(especilista.horasConDiasEsp.Sabado) this.arrayDiasDisponiblesEspecialista.push(6)
  }

  buscarHorariosDisponiblesDelDiaSeleccionado(diaSeleccionado:string){
    var horasConDiasEsp:any= [ 
       'Domingo',
       'Lunes',
       'Martes',
       'Miercoles',
       'Jueves',
       'Viernes',
       'Sabado',
    ];

    var dateParts:any = diaSeleccionado.split("/");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
    var numeroDia = new Date(dateObject).getDay()

    this.arrayHoraPorDiaSeleccionado = this.especialistaSeleccionadoObj.horasConDiasEsp[ horasConDiasEsp[numeroDia] ]
    console.log('this.arrayHoraPorDiaSeleccionado',this.arrayHoraPorDiaSeleccionado )
    console.log("FormatoHorarioAMPM",this.FormatoHorarioAMPM(this.arrayHoraPorDiaSeleccionado[0]))

  }


  FormatoHorarioAMPM(time:string){
    
    // Check correct time format and split into components
    var time2:any = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time2.length > 1) { // If time2 format correct
      time2 = time2.slice (1);  // Remove full string match value
      time2[5] = +time2[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time2[0] = +time2[0] % 12 || 12; // Adjust hours
    }
    return time2.join (''); // return adjusted time or original string
  
    
  }

  horaSeleccionada!:string 
  
  btnHoraSeleccionada:any = null
  btnFechaSeleccionada:any = null
  btnEspecialidadSeleccionado:any = null
  btnEspecialistaSeleccionado:any = null

  SeleccionHorario(element:any,item:any){
    console.log('SeleccionHorario',element,item)
    
    if(this.btnHoraSeleccionada){
      this.btnHoraSeleccionada.srcElement.className = 'btn btn-outline-primary'
      this.btnHoraSeleccionada = element;
      this.btnHoraSeleccionada.srcElement.className = 'btn btn-info'
    }
    else{
      this.btnHoraSeleccionada = element;
      this.btnHoraSeleccionada.srcElement.className = 'btn btn-info'
    }
    this.horaSeleccionada = item;
  }

  onSelectedDiaSelectv2(element:any, value:string): void {

    console.log(value)

    /**ESTILO DE LOS BOTONES SELECCIONADOS */
    if(this.btnFechaSeleccionada){
      this.btnFechaSeleccionada.srcElement.className = 'btn btn-outline-primary'
      this.btnFechaSeleccionada = element;
      this.btnFechaSeleccionada.srcElement.className = 'btn btn-info'
    }
    else{
      this.btnFechaSeleccionada = element;
      this.btnFechaSeleccionada.srcElement.className = 'btn btn-info'
    }
    /** FIN ESTILO DE LOS BOTONES SELECCIONADOS */

    this.diaSeleccionado = value
    this.buscarHorariosDisponiblesDelDiaSeleccionado(value)

    /**cambiar estilo de btn hora seleccionado */
    if(this.btnHoraSeleccionada){
      this.btnHoraSeleccionada.srcElement.className = 'btn btn-outline-primary'     
      this.horaSeleccionada = ''; 
    }
    /**FIN cambiar estilo de btn hora seleccionado */

    /** VALIDAR TURNOS DISPONIBLES */
    this.ValidarTurnosDisponibleDelDiaSeleccionado()
    /** FIN VALIDAR TURNOS DISPONIBLES */
    /** */
	}
  onSelectedV2(element:any, value:string): void {
    /**des seleccionar especialista */
    this.ReiniciarDatos()
    /**des seleccionar especialista */
    /**ESTILO DE LOS BOTONES SELECCIONADOS */
    if(this.btnEspecialidadSeleccionado){
      this.btnEspecialidadSeleccionado.srcElement.className = 'btn btn-outline-primary btsEspecialidad'
      this.btnEspecialidadSeleccionado = element;
      this.btnEspecialidadSeleccionado.srcElement.className = 'btn btn-info btsEspecialidad'
    }
    else{
      this.btnEspecialidadSeleccionado = element;
      this.btnEspecialidadSeleccionado.srcElement.className = 'btn btn-info btsEspecialidad'
    }
    /** FIN ESTILO DE LOS BOTONES SELECCIONADOS */
    
		this.especialidadSeleccionada = value;
    console.log(this.especialidadSeleccionada)
    this.traerEspecialistasPorEspecialidad()
	}

  onSelectedEspecialistaV2(element:any,value:string, mails:string): void {
    /**varia fecha */
    this.diaSeleccionado = null
    /**varia fecha */
    console.log(mails)
    console.log(value)
    var elementById = document.getElementById("esp_"+mails) as HTMLSelectElement; // trae el ID de la opcion
    this.especialistaSeleccionado = mails;
    this.apellidoEspecialistaSeleccionado = value;
    this.BuscarHoraPorEspecialista(this.especialistaSeleccionado)
    /**nueva funcionalidad fechas */
    this.TraerDiasDisponiblesEsp()
    this.traerFechas()

    /**ESTILO DE LOS BOTONES SELECCIONADOS */
    if(this.btnEspecialistaSeleccionado){
      this.btnEspecialistaSeleccionado.className = 'btn btn-outline-primary btsEspecialidad'
      this.btnEspecialistaSeleccionado = elementById;
      this.btnEspecialistaSeleccionado.className = 'btn btn-info btsEspecialidad'
    }
    else{
      this.btnEspecialistaSeleccionado = elementById;
      this.btnEspecialistaSeleccionado.className = 'btn btn-info btsEspecialidad'
    }
    /** FIN ESTILO DE LOS BOTONES SELECCIONADOS */
	}

  async ValidarTurnosDisponibleDelDiaSeleccionado(){

      //TOMO EL EMAIL DEL ESPECIALSITA SELECCIONADO
      //BUSCO LOS TURNOS DIFERENTES DE 'CANCELADO' Y 'FINALIZADO' en la tabla de 'turnos'
      //comparo la fecha y hora de esos turnos con los horarios del array 'this.arrayHoraPorDiaSeleccionado' que contiene los dias y horarios disponibles del especialista
      console.log('ValidarTurnosDisponibleDelDiaSeleccionado',this.especialistaSeleccionadoObj.mail)
      
      var turnosOcupados:Array<Turno> = []
      
      var queryTraerEsp = this.turnoService.TraerTurnos('especialista', '==', this.especialistaSeleccionadoObj.mail )    
      this.mostrarLoading = true
      
      this.traerTurnosAgendadosObs = onSnapshot( await queryTraerEsp, async (querySnapshot: any) => {
        
        turnosOcupados = []
        
        querySnapshot.forEach(async (doc: any) => {
          
          var turnoQuery = doc.data() as Turno 
          console.log(turnoQuery)
          //TODO traigo todos los turnos (en cualquier estado) que ese especialista tiene en ese dia
          if(turnoQuery.diaTurno == this.diaSeleccionado && turnoQuery.estado != 'cancelado'/*&& (turnoQuery.estado != 'cancelado' && turnoQuery.estado != 'finalizado' )*/){
            turnosOcupados.push(turnoQuery )
          }
        }); 
        
        console.log('turnos ocupados',turnosOcupados)        
        
        this.RemoverHorariosSeleccionablesOcupados(turnosOcupados)
        
        this.mostrarLoading = false
        //TODO verificar si es necesario detener el observable
        this.traerTurnosAgendadosObs();
      });
      
  }

  RemoverHorariosSeleccionablesOcupados(arrayTurnosOcupados: Array<Turno>){
  
   var borrarHorariosOcupados:Array<string> = []
   //verifico si existen horarios ocupados para ese dia
    arrayTurnosOcupados.forEach((element:Turno) => {
      this.arrayHoraPorDiaSeleccionado.forEach((horaDisponibleEspecialista, index) => {
        
        if(element.horaTurno == horaDisponibleEspecialista){
          borrarHorariosOcupados.push(element.horaTurno)          
        }
      });
    });
   
    //borro los horarios ocupados
    var horariosActualizados = this.arrayHoraPorDiaSeleccionado.filter(function(el) {
      return !borrarHorariosOcupados.includes(el);
    });
    this.arrayHoraPorDiaSeleccionado = horariosActualizados
    console.log('this.horariosActualizados',this.arrayHoraPorDiaSeleccionado)

  }

}
