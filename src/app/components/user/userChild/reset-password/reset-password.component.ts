import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UserService } from '../../../../service/auth/user.service';
import { ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgClass,NgIf],
  templateUrl:  './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  id!: number
  showPassword: boolean = false 
  resetPassForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: ToastrService,
  ) {}

    ngOnInit(): void {
       this.id = this.route.snapshot.params['id'];
       console.log(this.id);
       
       this.resetPassForm = this.formBuilder.group(
         {
           oldPassword: new FormControl(null, [Validators.required]) ,
           newPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
           confermedPassword: new FormControl(null, [Validators.required]),
         },
         { validators:this.passwordsMatch}
       );
     }
  
     // Valida che le nuove password corrispondano
     passwordsMatch(controls: FormGroup): ValidationErrors | null {
      const password = controls.get('newPassword')?.value;
      const confermedPassword = controls.get('confermedPassword')?.value;
      if (password !== confermedPassword) {
        controls.get('confermedPassword')?.setErrors({ mismatch: true });
        return { mismatch: true };
      }
      return null;
    }
    
    // Metodo per inviare il form
    onSubmit() {
      if(this.resetPassForm.valid){
        this.oldPasswordMatch(this.resetPassForm);
      }
    }

    // Verifica che la password attuale sia corretta
    oldPasswordMatch(controls: FormGroup) {
      const password = controls.get('oldPassword')?.value;
   
      this.userService.checkPassword(password,this.id).subscribe((data: any) => {
        if (data) {
          this.changePassword();
        }else{
         this.notify.error('Password attuale errata') 
  
        }
      });
    }
  
    // Aggiorna la password dell'utente
    changePassword() {
       this.userService.updatePassword(this.resetPassForm.value.newPassword,this.id).subscribe((data: any) => {
        console.log(data);
        this.notify.success('Password cambiata con successo')
        setTimeout(() => {
          window.location.replace("/");
        },1000);
       })
    };

    // Mostra/nasconde la password
    toggleShowPassword() {
     this.showPassword = !this.showPassword;
    }
    
    closeForm() {
      this.resetPassForm.reset();
      const email = this.route.parent?.snapshot.params['email'];
      this.router.navigate(['/profile', email]);
    }
    
  }
