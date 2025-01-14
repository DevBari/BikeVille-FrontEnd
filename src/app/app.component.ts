import { Component, Directive, EventEmitter, HostListener, OnInit, Output, Renderer2 } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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



@Component({
  
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadRedirect, HeaderComponent, FooterComponent, NavbarComponent, LoginComponent, HomeComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})

export class AppComponent implements OnInit {

  title = 'BikeVille'; // Titolo dell'applicazione
  currentRoute: string = ''; // Route corrente
  loading = false; // flag per il caricamento

  // Stato del carrello
  isCartOpen: boolean = false;
  cartItems: CartItem[] = [];
  cartCount: number = 0;
  totalAmount: number = 0;
  email: string | null = null;

  constructor(
    private router: Router, 
    private cartService: CartService, 
  ) {

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
  }
  
  // Metodo per aggiornare la route corrente
  onRouteChange(route: string) {

    console.log('Route cambiata:', route); // log per il debug
    this.currentRoute = route; // nome della route

  }

  ShowFooter(): boolean {
    return !(this.currentRoute === '/login' || this.currentRoute.startsWith('/profile/'));
  }

  toggleCart(): void {
    console.log('Toggle cart called. Current state:', this.isCartOpen); // Debug
    this.isCartOpen = !this.isCartOpen;
  }

  openCart(): void {
    this.isCartOpen = true;
    document.body.classList.add('cart-open'); // Blocca lo scroll della pagina principale
    this.trackMousePosition(); // Avvia il tracking del mouse
  }

  /**
   * Metodo per chiudere il carrello
   */
  closeCart(): void {
    this.isCartOpen = false;
    document.body.classList.remove('cart-open'); // Ripristina lo scroll della pagina principale
    this.stopMouseTracking(); // Ferma il tracking del mouse
  }

  private trackMousePosition(): void {
    const overlay = document.querySelector('.overlay-background') as HTMLElement;

    const updateMousePosition = (event: MouseEvent) => {
      const x = event.clientX; // Coordinate X del mouse
      const y = event.clientY; // Coordinate Y del mouse

      // Aggiorna le variabili CSS per la posizione del mouse
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    };

    // Aggiunge l'evento "mousemove" sull'overlay
    overlay?.addEventListener('mousemove', updateMousePosition);

    // Salva la funzione nel nodo DOM per rimuoverla in futuro
    (overlay as any)._updateMousePosition = updateMousePosition;
  }

  private stopMouseTracking(): void {
    const overlay = document.querySelector('.overlay-background') as HTMLElement;

    if (overlay && (overlay as any)._updateMousePosition) {
      // Rimuove l'evento "mousemove" sull'overlay
      overlay.removeEventListener('mousemove', (overlay as any)._updateMousePosition);
      (overlay as any)._updateMousePosition = null;
    }
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

}