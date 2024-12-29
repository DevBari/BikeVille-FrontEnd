import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { RequestEmail } from '../../Entity/RequestEmail';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  constructor(private http: HttpClient) { }

  sendToBeAdminEmail(email: RequestEmail) {
    return this.http.post('https://localhost:7167/Email/toBeAdmin', email);
  }

  sendSuccessRegisterEmail(email: RequestEmail) {
    return this.http.post('https://localhost:7167/Email/successRegister', email);
  }

  sendRecoverPasswordEmail(email: RequestEmail) {
    return this.http.post('https://localhost:7167/Email/recoverPassword', email);
  }
}