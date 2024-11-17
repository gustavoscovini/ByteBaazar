import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'userName'; 
  private userNameSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    const storedUserName = localStorage.getItem(this.userKey);
    if (storedUserName) {
      this.userNameSubject.next(storedUserName);
    } else {
      this.userNameSubject.next(null);
    }
  }

  login(userName: string): void {
    localStorage.setItem(this.userKey, userName);
    this.userNameSubject.next(userName);
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    this.userNameSubject.next(null);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userKey);  
  }

  getUserNameObservable() {
    return this.userNameSubject.asObservable(); 
  }
}
