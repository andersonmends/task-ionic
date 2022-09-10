import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auht: AngularFireAuth) { }

  public logged() {
    return this.auht.user; 
  }
  
  public loginWithGoogle() {
    this.auht.signInWithPopup(new firebase.auth.GoogleAuthProvider);
  }
  
  public logout(): Observable<any>{
    return from(this.auht.signOut());
  }

}
