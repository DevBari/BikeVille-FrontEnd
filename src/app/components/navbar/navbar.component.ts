import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { ContactComponent } from '@components/contact/contact.component';
import { ProductComponent } from '@components/product/product.component';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../service/auth/auth.service';

@Component({

  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgStyle, FormsModule, ContactComponent, ProductComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'

})

export class NavbarComponent {

  isAuthenticated: boolean = false;
  showDropdown: boolean = false;
  isHidden = false; // True per nascondere l'elemento
  isXlScreen = window.innerWidth >= 1280; // Condizione per schermi XL

  // Aggiungi un listener per aggiornare isXlScreen durante il ridimensionamento della finestra
  
  constructor(public router: Router, private renderer: Renderer2, private el: ElementRef, private authService: AuthService) {

    window.addEventListener('resize', () => {

      this.isXlScreen = window.innerWidth >= 1280;

    });
    
  }

  @Output() routeChanged = new EventEmitter<string>();

  ngOnInit() {

    this.checkAuthentication(); // Controlla se l'utente è autenticato
    // Sottoscrizione agli eventi del router
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const currentRoute = event.urlAfterRedirects.replace('/', ''); // Estrai il nome della route
        this.routeChanged.emit(currentRoute); // Emetti la route come stringa

      });

  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token; // Verifica se il token esiste
  }

  toggleProfileDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authService.runLogout();
    this.isAuthenticated = false; // Aggiorna lo stato
  }

  isDropdownOpen: { [key: string]: boolean } = {

    home: false,
    product: false,
    contact: false

  };

  toggleDropdown(choice: string) {

    this.isDropdownOpen[choice] = !this.isDropdownOpen[choice];

  }
  
  isLockOpen = false;

  toggleLock(state: boolean) {

    this.isLockOpen = state; 
    
  }

  isDrawerOpen=false;

  toggleSearchBar() {

    this.isDrawerOpen = !this.isDrawerOpen;
  
  }

}
