import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  headersAuth = new HttpHeaders({
    'Content-Type': 'application/json',
    responseType: 'text',
  });
  toBeAdmin(email: string) {
    this.headersAuth = this.headersAuth.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    this.http
      .get('https://localhost:7167/Admin/toBeAdmin' + '/' + email, {
        headers: this.headersAuth,
      })
      .subscribe();

    this.headersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'text',
    });
  }

  getCustomers() {
    return this.http.get('https://localhost:7167/Customers/Index');
  }

  getCustomerById(id: number) {
    return this.http.get('https://localhost:7167/Customers/Details/' + id );
  }
  
  deleteCustomerById(id: number) {
    return this.http.delete('https://localhost:7167/Customers/Delete/' + id);
  }
}
