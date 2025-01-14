import { Component, ElementRef, EventEmitter, OnInit, Output, Input, Renderer2, HostListener } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../service/auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CategoriesService } from '../../service/category/categories.service';
import { CartService } from '../../service/cart/cart.service';

@Component({

  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink,NgStyle,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',

})

export class NavbarComponent implements OnInit {
  @Input() cartCount: number = 0; // Aggiungi questa linea
  @Output() toggleCartEvent = new EventEmitter<void>();
  @Output() routeChanged = new EventEmitter<string>();

  categories: any[] = [];
  isAuthenticated: boolean = false;
  authUser: any;
  jwtDecode: any;
  showDropdown: boolean = false;
  isHidden = false; // True per nascondere l'elemento
  isXlScreen = window.innerWidth >= 1280; // Condizione per schermi XL
  searchQuery: string = ''; // Inizializza la stringa di ricerca

  isDropdownOpen: { [key: string]: boolean } = {
    home: false,
    category: false,
    contact: false,
  };

  constructor(
    public router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService,
    private categoryService: CategoriesService,
    public cartService: CartService
  ) {
    window.addEventListener('resize', () => {
      // Aggiungi un listener per aggiornare isXlScreen durante il ridimensionamento della finestra
      this.isXlScreen = window.innerWidth >= 1280;
    });

    this.router.events.subscribe((event) => {
      // Verifica se l'evento è di tipo NavigationStart (inizio navigazione)
      if (event instanceof NavigationStart) {
        // Controlla se esiste un token nel localStorage
        if (localStorage.getItem('token')) {
          // Se esiste un token, verifica se NON è valido usando il servizio authService
          // Nota: la doppia verifica del token serve come ulteriore sicurezza
          if (
            localStorage.getItem('token') &&
            !this.authService.checkValidToken(
              localStorage.getItem('token') || ''
            )
          ) {
            // Se il token non è valido:
            this.logout(); // Esegue il logout
            this.isAuthenticated = false; // Imposta lo stato di autenticazione a false
            this.authUser = null; // Rimuove i dati dell'utente
            window.location.replace('/'); // Reindirizza alla home page
          }
        }
      }
    });
  }


  ngOnInit() {
      // Recupera le categorie dal servizio
      this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data.$values.filter((item: any) => !item.$ref);   
    });

    // Controlla se l'utente è autenticato
    this.isAuthenticated = localStorage.getItem('token') ? true : false;

    if (this.isAuthenticated) {
      this.jwtDecode = jwtDecode(localStorage.getItem('token') || '');
      this.authService
        .getAuthUser(this.jwtDecode.unique_name)
        .subscribe((data: any) => {
          this.authUser = data;
        });
    }

    // Sottoscrizione agli eventi del router
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects.replace('/', ''); // Estrai il nome della route
        this.routeChanged.emit(currentRoute); // Emetti la route come stringa
      });

    // tema salvato nel localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkTheme = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

  }

  // Metodo per mostrare/nascondere il dropdown del profilo
  toggleProfileDropdown(event: MouseEvent) {
    event.stopPropagation(); // Ferma la propagazione dell'evento
    this.showDropdown = !this.showDropdown;
  }

  // Metodo per eseguire il logout
  logout() {
    this.authService.runLogout();
    this.isAuthenticated = false; // Aggiorna lo stato
  }

  // Metodo per aprire e chiudere i dropdown
  toggleDropdown(choice: string, event: MouseEvent) {
    event.stopPropagation();
    for (let key in this.isDropdownOpen) {
      if (key !== choice) {
        this.isDropdownOpen[key] = false;
      }
    }
    this.isDropdownOpen[choice] = !this.isDropdownOpen[choice];
  }

  isLockOpen = false;

  toggleLock(state: boolean) {
    this.isLockOpen = state;
  }

  isDrawerOpen: boolean = false;

  toggleSearchBar() {
    this.isDrawerOpen = !this.isDrawerOpen;
    if (this.isDrawerOpen) {
      // Focus sull'input di ricerca quando si apre
      setTimeout(() => {
        const searchInput =
          this.el.nativeElement.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 300); // Assicura che la transizione CSS sia completata
    } else {
      this.searchQuery = ''; // Pulisce la query quando chiude
    }
  }

  // Metodo per eseguire la ricerca
  performSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search', this.searchQuery]);
      this.isDrawerOpen = false;
      this.searchQuery = '';
    }
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

  // Decoratore che ascolta gli eventi del click sul documento
  @HostListener('document:click', ['$event'])

  // Metodo che gestisce il click sul documento, riceve l'evento del mouse
  onDocumentClick(event: MouseEvent) {
    // Converte l'elemento cliccato in un HTMLElement
    const targetElement = event.target as HTMLElement;
    // Seleziona l'elemento del menu profilo dal DOM
    const profileMenu = this.el.nativeElement.querySelector('.profile-menu');
    // Seleziona l'elemento del menu categoria dal DOM
    const categoryMenu = this.el.nativeElement.querySelector('.category-menu');
    // Verifica se:
    // 1. esiste il profileMenu E
    // 2. l'elemento cliccato NON è contenuto nel profileMenu
    if (profileMenu && !profileMenu.contains(targetElement)) {
      // Chiude il dropdown impostando showDropdown a false
      this.showDropdown = false;
    }

    if (categoryMenu && !categoryMenu.contains(targetElement)) {
      this.isDropdownOpen['category'] = false;
    }
    const searchInput = this.el.nativeElement.querySelector('.search-input');
    const searchButton = this.el.nativeElement.querySelector('.search-icon');
    const toggleButton = this.el.nativeElement.querySelector('.button-searchbar');
    // Chiudi la barra di ricerca se il click è fuori dall'input di ricerca e dal pulsante di ricerca
    if (
      searchInput &&
      !searchInput.contains(targetElement) &&
      searchButton &&
      !searchButton.contains(targetElement) &&
      toggleButton &&
      !toggleButton.contains(targetElement)
    ) {
      // Aggiungi controllo per l'elemento attivo
      if (this.isDrawerOpen && document.activeElement !== searchInput) {
        this.toggleSearchBar();
      }
    }
  }

  // Metodo per aprire/nascondere il carrello
  onCartButtonClick(): void {
    console.log('Cart button Clicked')
    this.toggleCartEvent.emit();
  }

}
