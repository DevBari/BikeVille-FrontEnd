import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, NgIf, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  
    authUser: any | undefined;
    decodedToken: any;
    jwtDecode: any
    isClose: boolean = false; 
    constructor(private authService: AuthService, private route: ActivatedRoute) { }

    ngOnInit(): void {
      this.isClose = false;
      const token = localStorage.getItem('token');
      if (token) {
        try {
          this.decodedToken = jwtDecode(token);
          console.log('Decoded Token:', this.decodedToken);
          this.route.paramMap.subscribe((params: ParamMap) => {
            const routeEmail = params.get('email');
            if(this.decodedToken.unique_name !== routeEmail || this.decodedToken.role !== 'ADMIN'){
              console.log('Token invalid or role not ADMIN. Logging out.');
              this.authService.runLogout();
            } else {
              if(routeEmail){
                this.authService.getAuthUser(routeEmail).subscribe((data: any) => {
                  console.log('Authenticated User Data:', data);
                  this.authUser = data;
                }, error => {
                  console.error('Errore nel recupero dell\'utente autenticato:', error);
                  this.authService.runLogout();
                });
              } else {
                console.error('Email non fornita nei parametri della rotta.');
                this.authService.runLogout();
              }
            }
          });
        } catch (error) {
          console.error('Token non valido:', error);
          this.authService.runLogout();
        }
      } else {
        console.error('Token mancante. Logging out.');
        this.authService.runLogout();
      }
    }

    toggleNav(): void {
      this.isClose = !this.isClose;
  }
}