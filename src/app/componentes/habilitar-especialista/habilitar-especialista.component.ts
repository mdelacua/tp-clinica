import { Component } from '@angular/core';
import { onSnapshot } from '@firebase/firestore';
import { Especialista } from 'src/app/clases/especialista';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-habilitar-especialista',
  templateUrl: './habilitar-especialista.component.html',
  styleUrls: ['./habilitar-especialista.component.css']
})
export class HabilitarEspecialistaComponent {

constructor(private servicioUsuario:UsuariosService){

}
  especialistas: Especialista[] =[]

  async ngOnInit(): Promise<void> {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  var queryTraerPelis = this.servicioUsuario.TraerUsuarios('tipo', '==','especialista')
  

    const unsubscribe = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {
      
      this.especialistas = []
      querySnapshot.forEach(async (doc: any) => {
      
        console.log(doc.data())
        this.especialistas.push( doc.data() )
      }); 

     
    });
}

HabilitarEspecialista(habilitar:boolean, item:Especialista){
  item.habilitado = habilitar
  this.servicioUsuario.ActualizarUsuario(item.id, {...item})
}
}
