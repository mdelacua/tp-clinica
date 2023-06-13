import { Injectable } from '@angular/core';
import { WhereFilterOp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { signOut, getAuth,sendEmailVerification , createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc,getFirestore, addDoc, collection, query, where, updateDoc, orderBy, limit, getDocs, arrayUnion, arrayRemove   } from "firebase/firestore";

import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  tabla:string = 'turnos'

  constructor() { }
  CrearTurno(datos:any){
    //this.messages = [];
    console.log('CrearTurnoFirestore')
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);      
    
    //Crear datos en la tabla login
    try {            
      var docNuevo = doc(collection(db,this.tabla ))
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

  TraerTurnos(key:string, op:WhereFilterOp, value:any){
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app); 
    const q = query(collection(db,this.tabla), where(key, op, value));
    return q;
  }

  
  async ActualizarTurno(id:any, obj:any){
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app); 
    const actualizar = doc(db, this.tabla, id);
    const Collection = collection(db, this.tabla);
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
