import { Component, Directive, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
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



@Component({
  
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadRedirect, HeaderComponent, FooterComponent, NavbarComponent, LoginComponent, HomeComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})

export class AppComponent implements OnInit {

  ngOnInit(): void {

    AOS.init();
    
  }

  title = 'BikeVille';

  currentRoute: string = '';
  
  // Metodo per aggiornare la route corrente
  onRouteChange(route: string) {

    console.log('Route cambiata:', route); // log per il debug
    this.currentRoute = route; // nome della route

  }

  loading = false; // flag per il caricamento

  constructor(private router: Router) {

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