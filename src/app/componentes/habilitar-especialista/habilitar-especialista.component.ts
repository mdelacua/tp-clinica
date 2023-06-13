import { Component } from '@angular/core';
import { Unsubscribe } from '@angular/fire/firestore';
import { onSnapshot } from '@firebase/firestore';
import { Observable } from 'rxjs';
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

  unsubscribe!:Unsubscribe
  especialistas: Especialista[] =[]

  mostrarLoading:boolean = false

  async ngOnInit(): Promise<void> {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  var queryTraerPelis = this.servicioUsuario.TraerUsuarios('tipo', '==','especialista')
  this.mostrarLoading = true

    this.unsubscribe = onSnapshot( await queryTraerPelis, async (querySnapshot: any) => {
      
      this.especialistas = []
      querySnapshot.forEach(async (doc: any) => {
      
        console.log(doc.data())
        this.especialistas.push( doc.data() )
      }); 
      this.mostrarLoading = false

     
    });
}
ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.unsubscribe()
}
HabilitarEspecialista(habilitar:boolean, item:Especialista){
  console.log('HabilitarEspecialista',item )
  console.log('habilitar',habilitar )
  this.mostrarLoading = true
  //item.habilitado = habilitar
  var habilitarAux = {"habilitado": habilitar}
  this.servicioUsuario.ActualizarUsuario(item.id, habilitarAux).then(() =>{
    this.mostrarLoading = false
  })
  
}
}
