import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, NavigationStart, NavigationEnd } from '@angular/router';
import { ContactComponent } from '@components/contact/contact.component';
import { ProductComponent } from '@components/product/product.component';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../service/auth/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({

  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgStyle, FormsModule, ContactComponent, ProductComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'

})

export class NavbarComponent implements OnInit{


  isAuthenticated: boolean = false;
  authUser: any
  jwtDecode :any
  showDropdown: boolean = false;
  isHidden = false; // True per nascondere l'elemento
  isXlScreen = window.innerWidth >= 1280; // Condizione per schermi XL

  // Aggiungi un listener per aggiornare isXlScreen durante il ridimensionamento della finestra
  
  constructor(
    public router: Router, 
    private renderer: Renderer2, 
    private el: ElementRef, 
    private authService: AuthService
  ){
    window.addEventListener('resize', () => {
      this.isXlScreen = window.innerWidth >= 1280;
    });

    this.router.events.subscribe((event) => {
      
      if (event instanceof NavigationStart) {
        if (localStorage.getItem('token')) {
          if(localStorage.getItem('token') && !this.authService.checkValidToken(localStorage.getItem('token')||'') ){
            this.logout()
            this.isAuthenticated=false
            this.authUser=null
            window.location.replace('/');
          }
        }
      }
    });
    
  }

  @Output() routeChanged = new EventEmitter<string>();

  ngOnInit() {

    // Controlla se l'utente è autenticato
    this.checkAuthentication(); 
    this.isAuthenticated = localStorage.getItem('token') ? true : false
    
    if(this.isAuthenticated){
      this.jwtDecode=jwtDecode(localStorage.getItem('token')||'')
      this.authService.getAuthUser(this.jwtDecode.unique_name).subscribe((data: any) => {
        this.authUser=data
      });
    }

    
    
    // Sottoscrizione agli eventi del router
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const currentRoute = event.urlAfterRedirects.replace('/', ''); // Estrai il nome della route
        this.routeChanged.emit(currentRoute); // Emetti la route come stringa

      });

    // tema salvato nel localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkTheme = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

  }
  
  // Metodo per controllare l'autenticazione
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

  isDarkTheme = false;

  switchTheme(event: Event): void {

    const target = event.target as HTMLInputElement; // Explicitly cast the target to HTMLInputElement
    this.isDarkTheme = target.checked;

    if (target.checked) {

        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    
    } else {

        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    
    }
  
  }

}
