import { Injectable } from '@angular/core';
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

  currentUser: User | null = null;

  constructor() {
    // Track auth state globally
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
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

  // 👤 Get current user
  getUser() {
    return this.currentUser;
  }
}
