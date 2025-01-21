import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestEmail } from '../../Entity/RequestEmail';
import { MailService } from '../../service/mail/mail.service';  
import { ToastrService } from 'ngx-toastr';  

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  
  mail:string="";
  emailRequest!: RequestEmail ;

  ngOnInit(): void {
    this.updateScreenSize();
  }

  constructor(private mailService: MailService, private notify: ToastrService)
   { }

  isTabletScreen: boolean = false;

  @HostListener('window:resize', [])

  onResize(): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    const screenWidth = document.documentElement.clientWidth;
    this.isTabletScreen = screenWidth < 1024;
  }


  requestAdmin() {
    if (
      this.mail.trim() === "" ||
      !this.mail.includes("@") ||
      (!this.mail.endsWith(".com") && !this.mail.endsWith(".it"))
    ) {
      this.mail="";
      this.notify.error("Inserisci un indirizzo email valido");
    } else{

      this.emailRequest ={
        toEmail: this.mail,
        subject: '',  
        message: `<!DOCTYPE html>
        <html lang="it">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Conferma Registrazione</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    .header {
                        background-color: #f57500;
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .content {
                        padding: 20px;
                        line-height: 1.6;
                        color: #333;
                    }
                    .button {
                        display: inline-block;
                        margin: 20px 0;
                        padding: 12px 20px;
                        background-color: #f57500; 
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    .footer {
                        background-color: #f1f1f1;
                        color: #777;
                        text-align: center;
                        padding: 10px 20px;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container mt-5">
                    <div class="header mt-5">
                        <h1>Richiesta di Diventare Admin</h1>
                    </div>
                    <div class="content">
                        <p>Ciao la richiesta di diventare admin e' stata effettuata da <strong>${this.mail}</strong>,</p>
                        <p>per confermare la richiesta clicca sul link qui sotto:</p>
                        <p><a href="http://localhost:4200/toBeAdmin/${this.mail}" class="button">Rendi Admin</a></p>
                        <p>Il Team BikeVille</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 BikeVille. Tutti i diritti riservati.</p>
                    </div>
                </div>
            </body>
        </html>
    `    };
  
  
      this.mailService.sendToBeAdminEmail(this.emailRequest).subscribe();
      this.mail="";
      this.notify.success("Richiesta inviata");
    }
  }
}
