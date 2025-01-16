import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {  HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../../service/auth/auth.service';
import { Credentials } from '../../Entity/Credentials';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})

export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private notify: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}

  showLogin: boolean = true;
  showRegister: boolean = false;
  registerForm!: FormGroup;
  loginForm!: FormGroup
  jwtToken!: string
  credentials!: Credentials

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });

    this.registerForm = this.formBuilder.group(
      {
        firstName: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
        lastName: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phone: new FormControl(null, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8)
        ]),
        confirmedPassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passwordsMatch }
    );
  }

  // Mostra il form di Login
  showLoginForm() {
    this.showLogin = true;
    this.showRegister = false;
  }

  // Mostra il form di registrazione
  showRegisterForm() {
    this.showLogin = false;
    this.showRegister = true;
  }

  // Metodo per gestire il login
  runLogin() {
    if (this.loginForm.invalid) {
      this.notify.error('Compila correttamente i campi');
      return;
    }

    this.credentials = new Credentials(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.authService.loginPost(this.credentials).subscribe({
      next: (response: any) => {
        if (response.status === HttpStatusCode.Ok) {
          console.log('Login effettuato');
          this.jwtToken = response.body.token;
          this.authService.setAuthenticationStatus(true); // Aggiorna lo stato
          this.setTokenLocalStorage(response.body.token);
          this.setCartLocalStorage();
          this.notify.success('Login effettuato con successo');
          setTimeout(() => {
            window.location.replace('/');
          }, 1000);
        } else if (response.status === HttpStatusCode.NoContent) {
          this.notify.error('Credenziali assenti');
        }
      },
      error: (error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.notify.error('Credenziali errate');
        } else {
          this.notify.error('Errore nel processo di login, credenziali errate');
        }
      },
    });
    this.loginForm.reset();
  }
  
  // Metodo per settare il token nel local storage
  setTokenLocalStorage( token : string){
    localStorage.setItem('token',token); 
  }


  // Metodo per settare il carrello nel local storage
  setCartLocalStorage(){
    localStorage.setItem('cart',JSON.stringify([]));
  }

  // Metodo per gestire la Registrazione
  registerUser() {
    if (this.registerForm.invalid) {
      this.notify.error('Compila correttamente i campi');
      return;
    }

    const userData = {
      FirstName: this.registerForm.value.firstName,
      LastName: this.registerForm.value.lastName,
      EmailAddress: this.registerForm.value.email,
      Phone: this.authService.formattaNumero(
        this.registerForm.value.phone.toString()
      ),
      Password: this.registerForm.value.password,
      Role: 'USER',
    };

    this.authService.register(userData).subscribe({
      next: (data: any) => {
        this.notify.success('Registrazione effettuata con successo');
        this.sendSuccessRegisterEmail(userData.EmailAddress);
        setTimeout(() => {
          window.location.replace('/home');
        }, 1000);
      },
      error: (error) => {
        console.error('Errore durante la registrazione:', error);
        this.notify.error('Registrazione fallita');
      },
    });
  }

  sendSuccessRegisterEmail(email: string) {
    const emailRequest = {
      ToEmail: email,
      Subject: 'Registrazione avvenuta con successo',
      Message: '<p>Grazie per esserti registrato su BikeVille!</p>',
    };

    this.authService.sendSuccessRegisterEmail(emailRequest).subscribe({
      next: (response: any) => {
        console.log('Email di successo inviata');
      },
      error: (error) => {
        console.error('Errore durante l\'invio dell\'email di successo:', error);
      },
    });
  }


  passwordsMatch(controls: FormGroup): ValidationErrors | null {
    const password = controls.get('password')?.value;
    const confirmedPassword = controls.get('confirmedPassword')?.value;
    if (password !== confirmedPassword) {
      controls.get('confirmedPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  

    

}

