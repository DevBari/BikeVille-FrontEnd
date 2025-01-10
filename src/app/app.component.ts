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

import { CartService } from './service/cart/cart.service';



@Component({
  
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadRedirect, HeaderComponent, FooterComponent, NavbarComponent, LoginComponent, HomeComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})

export class AppComponent implements OnInit {

  email: string | null = null;

  ngOnInit(): void {

    AOS.init();
    
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url; // Ottieni l'intera URL corrente
    });
  }

  title = 'BikeVille';

  currentRoute: string = '';
  
  // Metodo per aggiornare la route corrente
  onRouteChange(route: string) {

    console.log('Route cambiata:', route); // log per il debug
    this.currentRoute = route; // nome della route

  }

  loading = false; // flag per il caricamento

  ShowFooter(): boolean {
    return !(this.currentRoute === '/login' || this.currentRoute.startsWith('/profile/'));
  }

  constructor(private router: Router, private cartService: CartService, private route: ActivatedRoute) {

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

}