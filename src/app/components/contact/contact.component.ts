import { Component, NgModule } from '@angular/core';
import { FocusDirective } from '../../directives/focus.directive';

import 'aos/dist/aos.css';


import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha-2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FocusDirective, ReactiveFormsModule, RecaptchaModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})


export class ContactComponent {

  form: FormGroup;
  captchaVerified: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: [''],
      message: [''],
      recaptcha: [''], // Campo per il token reCAPTCHA
    });
  }

  // Metodo chiamato quando il reCAPTCHA viene verificato
  onCaptchaResolved(token: string | null): void {
    if (token) {
      this.captchaVerified = true; // CAPTCHA risolto
      this.form.patchValue({ recaptcha: token }); // Aggiorna il valore del form
    } else {
      this.captchaVerified = false; // CAPTCHA non risolto
      this.form.patchValue({ recaptcha: '' }); // Pulisci il valore del campo
    }
  }
  
  // Metodo per gestire l'invio del modulo
  onSubmit(): void {
    if (this.form.valid && this.captchaVerified) {
      console.log('Form inviato con successo:', this.form.value);
    } else {
      console.error('Errore: il modulo non è valido o il CAPTCHA non è stato verificato.');
    }
  }

}
