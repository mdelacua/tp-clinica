import { Injectable } from '@angular/core';
import { WhereFilterOp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { signOut, getAuth,sendEmailVerification , createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc,getFirestore, addDoc, collection, query, where, updateDoc, orderBy, limit, getDocs, arrayUnion, arrayRemove   } from "firebase/firestore";

import { environment } from 'src/environments/environment.development';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  emailUsuario!: any;
  tipo!:string
  auth1: any
  datosUsuarioConectado!:Usuario

  constructor(private router: Router) { 
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);
  }
  
  ngOnInit() {
   
  }
  
  CerrarSesionAuth(){
    this.auth1 = getAuth();
    this.auth1.signOut();

  }
  
  VerificarSesionUsuario(logeado:any, deslogeado:any){
    
    
    this.auth1 = getAuth();
    return onAuthStateChanged(this.auth1, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log('logeado')
        console.log('onAuthStateChanged:')
        console.log(user)
        this.emailUsuario = user.email;
        const uid = user.uid;
       if(logeado) this.router.navigate(['/'+logeado])
        // ...
      } else {
        console.log('no logeado')
        if(deslogeado) this.router.navigate(['/'+deslogeado])
        //this.router.navigate(['/login'])
        // User is signed out
        // ...
      }
    });   
  }

  async VerificarSesionUsuarioGuardLogin(logeado:any){
    
    return new Promise<boolean>((resolve, reject) => {

      this.auth1 = getAuth();
      var obs = onAuthStateChanged(this.auth1, async (user) => {
        if (user) {        
          
          console.log('logeado') 
          console.log(user) 
          this.emailUsuario = user.email;  
          //this.tipo = user.tipo;  
          if(user.email) await this.traerAtributosUsuario(user.email)

          this.router.navigate(['/'+logeado])  
          //obs()
          resolve(false);

        } else {
          console.log('no logeado') 
          this.emailUsuario = null  
          //obs()       
          resolve(true);      
        }
      });   
      
      console.log('finalizo')
      
    });
    
  }

  async VerificarSesionUsuarioGuardPaginaLogeada(logeado:any){
    
    return new Promise<boolean>((resolve, reject) => {

      this.auth1 = getAuth();
      var retorno = false
      onAuthStateChanged(this.auth1, async (user) => {
        if (user) {        
          
          console.log('logeado') 
          console.log(user) 
          this.emailUsuario = user.email;
          if(user.email){            
            resolve( await this.traerAtributosUsuario(user.email))
          }
          
        } else {
          console.log('no logeado') 
          this.emailUsuario = null
          this.router.navigate(['/'+logeado])          
          resolve(false);
        }
      });   
      
      
      
    });

  }

  async traerAtributosUsuario(email:string){
    var verificarEspecialista = {tipo:'', habilitado: null}
    var querySnapshot = await this.VerificarUsuario(email);
      ( querySnapshot).forEach((doc:any) => {
        console.log(doc.id, " => ", doc.data());
        verificarEspecialista.tipo = doc.data()['tipo'];
        this.tipo = doc.data()['tipo'];
        verificarEspecialista.habilitado = doc.data()['habilitado'];
        this.datosUsuarioConectado = doc.data()
      });     
      
      if(verificarEspecialista && verificarEspecialista.tipo == 'especialista' && verificarEspecialista.habilitado == false ){
        return (false);
        
      }

      return (true);      
  }
 
  async VerificarUsuarioConectado( password: any){
    this.auth1 = getAuth();
    console.log(this.emailUsuario + password)
    return signInWithEmailAndPassword(this.auth1, this.emailUsuario, password)
  }

  EnviarMailVerificacion(){
    this.auth1 = getAuth();
    sendEmailVerification(this.auth1.currentUser)

    //TODO verificar si hacer logout cuando el admin cree una cuenta
  }
 
  async Autentificar(email: any, password: any){

    this.auth1 = getAuth();    

    return signInWithEmailAndPassword(this.auth1, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('entro auth')
        console.log(user)
        
        /*
        var querySnapshot = await this.VerificarUsuario(email)
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          
          
        });*/

       if(user.emailVerified == true){
         return user;
       }       
       else{
        return false
       }

        // ...
      })
      .catch((error) => {
        console.log(error)
        const errorCode = error.code;
        const errorMessage = error.message;
        return false;
      });     
    }
CrearUsuarioAuth(email:any, password:any) {
  this.auth1 = getAuth();
  return createUserWithEmailAndPassword(this.auth1, email, password)
  
}

  
  
  async CrearPublicacion( user:any,publicacion:any) {
    //this.messages = [];
    console.log('test servicio')

    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);       

    //Crear datos en la tabla login
    try {
      var fecha =  new Date()
      var id = String( fecha.getTime()  )
      const docRef = await addDoc(collection(db, publicacion ), {
        user:user,
        id: id,
        fecha: fecha
      });
      
      console.log("Document written with ID: ", docRef.id);      
      const usuarioCreado = doc(db, publicacion, docRef.id);
      await updateDoc(usuarioCreado, {
        id: docRef.id
      });

      return true;
      
    } catch (e) {
      console.error("Error adding document: ", e);
      return false;
    }

  }


  CrearUsuario(datos:any, tabla:string){
    //this.messages = [];
    console.log('CrearFirestore')
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);       
    
    //Crear datos en la tabla login
    try {            
      var docNuevo = doc(collection(db,tabla ))
      datos.id = docNuevo.id;
      datos.fecha = new Date()    
      console.log('id ' + docNuevo.id)
      return setDoc(docNuevo, datos);     
      
    } 
    catch (e){
      console.error("Error adding document: ", e);
      return false;
    }
  
  
  }

  async VerificarUsuario(mail:string){
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app); 
    var data
    const q = query(collection(db, "usuario"),where("mail", "==", mail));   
    const querySnapshot = await getDocs(q);
     
    return querySnapshot;
  }

  async TraerUsuarios(key:string, op:WhereFilterOp, value:any){
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app); 
    const q = query(collection(db, "usuario"), where(key, op, value));
    return q;
  }

  async ActualizarUsuario(id:any, obj:any){
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app); 
    const actualizar = doc(db, "usuario", id);
    const Collection = collection(db, "usuario");
   // const q = query(collection(db, "actores"));
    const q = query(Collection,where("id", "==", id));
      
    const querySnapshot =  getDocs(q);
    (await querySnapshot).forEach((doc) => {// TODO es necesaria esta query?
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      updateDoc(actualizar, obj);
      
      
    });
  }

 
}


