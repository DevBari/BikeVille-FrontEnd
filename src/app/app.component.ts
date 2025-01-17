import { Component, Directive, EventEmitter, HostListener, OnInit, Output, Renderer2 } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterModule } from '@angular/router';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { HeaderComponent } from "@components/header/header.component";
import { FooterComponent } from "@components/footer/footer.component";
import { NavbarComponent } from "@components/navbar/navbar.component";
import { LoadRedirectComponent as LoadRedirect} from '@components/load-redirect/load-redirect.component';
import { HomeComponent } from '@components/home/home.component';
import { LoginComponent } from '@components/login/login.component';

import { CartItem } from './Entity/CartItem';
import { CartService } from './service/cart/cart.service';

import { CategoriesService } from './service/category/categories.service';

import { filter } from 'rxjs/operators';
import { AuthService } from './service/auth/auth.service';
import { jwtDecode } from 'jwt-decode';



@Component({
  
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadRedirect, HeaderComponent, FooterComponent, NavbarComponent, LoginComponent, HomeComponent, FormsModule, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})

export class AppComponent implements OnInit {

  @Output() routeChanged = new EventEmitter<string>();

  title = 'BikeVille'; // Titolo dell'applicazione
  currentRoute: string = ''; // Route corrente
  loading = false; // flag per il caricamento

  // Stato del carrello
  isCartOpen: boolean = false;
  isHamburgerOpen: boolean = false;

  cartItems: CartItem[] = [];
  cartCount: number = 0;
  totalAmount: number = 0;
  email: string | null = null;
  categories: any[] = [];

  isAuthenticated: boolean = false;
  authUser: any;
  jwtDecode: any;

  isXlScreen = window.innerWidth >= 1280; // Condizione per schermi XL
  isTabletScreen = window.innerWidth <= 799; 
  isMobileScreen = window.innerWidth < 425;

  constructor(
    private router: Router, 
    private cartService: CartService, 
    private categoryService: CategoriesService,
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService
  )
    {
      window.addEventListener('resize', () => {
        // Aggiungi un listener per aggiornare isXlScreen durante il ridimensionamento della finestra
        this.isXlScreen = window.innerWidth >= 1280;
        this.isTabletScreen = window.innerWidth <= 799;
        this.isMobileScreen = window.innerWidth < 425;
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

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          // Mostra il componente di caricamento
          this.loading = true;
        }
        if (event instanceof NavigationEnd || event instanceof NavigationError) {
          // Nascondi il componente di caricamento
          setTimeout(() => {       
            this.loading = false;
          }, 1000); // Imposta il ritardo per nascondere l'animazione dopo 1 secondo
        }
      });
    }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateScreenSize();
  }

  updateScreenSize(): void {
    const width = window.innerWidth;
    this.isXlScreen = width >= 1280;
    this.isTabletScreen = width <= 799;
    this.isMobileScreen = width < 425;
  }
    
  logout() {
    this.authService.runLogout();
    this.isAuthenticated = false; // Aggiorna lo stato
  }

  ngOnInit(): void {
    // Inizializza AOS
    AOS.init();

    // Sottoscrizione agli aggiornamenti della route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
      }
    });

    // Sottoscrizione agli aggiornamenti del carrello
    this.cartService.getCartItemsObservable().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.cartCount = this.cartService.cartCount.value;
      this.calculateTotal();
    });

    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data.$values.filter((item: any) => !item.$ref);   
    });   

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

    this.updateScreenSize();

  }
  
  // Metodo per aggiornare la route corrente
  onRouteChange(route: string) {

    console.log('Route cambiata:', route); // log per il debug
    this.currentRoute = route; // nome della route

  }

  ShowFooter(): boolean {
    return !(this.currentRoute === 'login' || this.currentRoute.startsWith('profile/'));
  }

  toggleHamburger(): void {
    this.isHamburgerOpen = !this.isHamburgerOpen;
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  // Metodo per rimuovere un articolo dal carrello
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  // Metodo per aggiornare la quantità di un articolo nel carrello
  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  // Metodo per svuotare il carrello
  clearCart(): void {
    this.cartService.clearCart();
  }

  // Calcola il totale del carrello
  calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.product.listPrice * item.quantity), 0);
  }

  showDropdown: boolean = false;
  isHidden = false; // True per nascondere l'elemento

  isDropdownOpen: { [key: string]: boolean } = {
    category: false,
    profile: false, // Aggiungi altre chiavi se necessario
  };

  toggleDropdown(choice: string, event: MouseEvent): void {
    event.stopPropagation();
    for (let key in this.isDropdownOpen) {
      if (key !== choice) {
        this.isDropdownOpen[key] = false;
      }
    }
    this.isDropdownOpen[choice] = !this.isDropdownOpen[choice];
  }
  
  @HostListener('document:click', ['$event'])

  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const profileMenu = this.el.nativeElement.querySelector('.profile-menu');
    const categoryMenu = this.el.nativeElement.querySelector('.category-menu');
  
    // Chiudi il menu profilo se il click è fuori
    if (profileMenu && !profileMenu.contains(targetElement)) {
      this.isDropdownOpen['profile'] = false;
    }
  
    // Chiudi il menu categoria se il click è fuori
    if (categoryMenu && !categoryMenu.contains(targetElement)) {
      this.isDropdownOpen['category'] = false;
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

}