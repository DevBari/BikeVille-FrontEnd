import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
   
    // controllo se il form di login è valido
    if (this.loginForm.invalid){
      this.notify.error('compila correttamente i campi');
      return;
    }
  
    this.credentials = new Credentials(this.loginForm.value.email, this.loginForm.value.password);
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
        //Gestione degli errori
        if (error.status === HttpStatusCode.Unauthorized){
          this.notify.error('Credenziali errate')
        } else {
          this.notify.error('Errore nel processo di login,credenziali errate');
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

  // Metodo per gestire la registrazione
  runRegister() {
    console.log('runRegister called');
    if (this.registerForm.invalid) {
      this.notify.error('Compila correttamente i campi!');
      return;
    }

    // Implementa la logica di registrazione qui
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

  addUser() {
    if (this.registerForm.valid) {
      this.authService
        .register({
          FirstName: this.registerForm.value.firstName,
          LastName: this.registerForm.value.lastName,     
          EmailAddress: this.registerForm.value.email,
          Password: this.registerForm.value.password,
          Role: 'USER',
        })
        .subscribe((data: any) => {
          console.log(data);
          this.notify.success('Registrazione effettuata con successo');
        });
      } else {
        this.notify.error('Registrazione fallita');
      }
      setTimeout(() => {
        window.location.replace('/login');
      }, 1000);  
    }


    

}

