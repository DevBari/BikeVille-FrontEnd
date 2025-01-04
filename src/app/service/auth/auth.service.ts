import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Credentials } from '../../Entity/Credentials';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http :HttpClient) {
  }

  isAuth!:Boolean

  // Metodo per controllare se un token è valido
  checkValidToken(token: string) {

      const exp=jwtDecode(token).exp||0;

      console.log(exp);
      console.log(Math.floor(Date.now() / 1000));

        if(exp < Math.floor(Date.now() / 1000)){

          return false

        }else{

          return true

        }

  }
  
    // Metodo per effettuare il login
  loginPost(credentials: Credentials): Observable<any> {
    return this.http.post('https://localhost:7167/LoginJwt/Login', credentials, {
      observe: 'response',
    });
  }
  
  // Metodo per effettuare il logout
  runLogout(){
    localStorage.removeItem("token")
    localStorage.removeItem("cart")
    this.isAuthenticatedSubject.next(false); // Aggiorna lo stato
    window.location.replace('/');
  }
  
  // Metodo per ottenere i dati di un utente autenticato
  getAuthUser( email : string)  {
    return this.http.get('https://localhost:7167/Users/AuthUser/'+email);
  }

  // Metodo per aggiornare lo stato di autenticazione
  setAuthenticationStatus(status: boolean) {
    this.isAuthenticatedSubject.next(status);
  }

  // Metodo per registrare un nuovo utente
  register(data:any){
    console.log(data);
    return this.http.post('https://localhost:7167/Users/Add',data);
  }

  formattaNumero(numero: string ): string {
    
    const numeroStr = numero.toString();
    
    if (numeroStr.length !== 10 || !/^\d{10}$/.test(numeroStr)) {
        return "Errore: il numero deve avere 10 cifre.";
    }
    const formato = `${numeroStr.slice(0, 3)}-${numeroStr.slice(3, 6)}-${numeroStr.slice(6)}`;
    return formato;
  }

}
