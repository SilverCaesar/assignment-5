import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

constructor() {
  console.log('🔥 AUTH SERVICE INSTANCE CREATED');

  onAuthStateChanged(auth, (user) => {
    console.log('🔥 GLOBAL AUTH STATE:', user);
    this.userSubject.next(user);
  });
}
  // 🔥 Register
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // 🔑 Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 🚪 Logout
  logout() {
    return signOut(auth);
  }

  // 👤 Sync getter (safe after init)
  getUser() {
    return this.userSubject.value;
  }

  // 🔐 Better guard support
  isLoggedIn() {
    return !!this.userSubject.value;
  }
}