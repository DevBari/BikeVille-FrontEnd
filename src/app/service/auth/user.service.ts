import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }


  checkPassword(password: string, id:number) {
    return this.http.get('https://localhost:7167/Users/UserPass/'+password+'/'+id);
  }

  updatePassword(newPassword: string, id:number) {
    return this.http.put('https://localhost:7167/Users/UpdatePass',{id:id,password:newPassword});
  }

}