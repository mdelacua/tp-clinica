import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, onSnapshot, setDoc,getFirestore, addDoc, collection, query, where, updateDoc, orderBy, limit, getDocs, arrayUnion, arrayRemove   } from "firebase/firestore";

import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";

import { getAuth } from 'firebase/auth';
import { UsuariosService } from './usuarios.service';
import { environment } from 'src/environments/environment';
import { uploadBytes } from '@firebase/storage';
@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

 constructor(){}
  

  async guardarArchivo(file: File, carpeta:string) {

    var nombreArchivo = carpeta + new Date() + file.name
    const app = initializeApp(environment.firebase); 
    // Create a root reference
    const storage = getStorage();
    const storageRef = ref(storage, nombreArchivo);
    var urlAux = ''

    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, file).then(async (snapshot) => {
      console.log('Uploaded a blob or file!');
      console.log(snapshot);
      urlAux = await this.TraerURL(nombreArchivo)
      return urlAux
    });
    console.log(urlAux)
    return await urlAux;
  }

  async TraerURL(name:string){
    const storage = getStorage();
    var urlAux = ''
    await getDownloadURL(ref(storage, name))
    .then((url) => {
      console.log(url)
      urlAux= url;
    })
    .catch((error) => {
      // Handle any errors
    });
    return urlAux;
  }
}
