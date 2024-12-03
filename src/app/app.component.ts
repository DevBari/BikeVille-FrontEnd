import { Component, Directive } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';

import { HeaderComponent } from "@components/header/header.component";
import { FooterComponent } from "@components/footer/footer.component";
import { NavbarComponent } from "@components/navbar/navbar.component";
import { LoadRedirectComponent as LoadRedirect} from '@components/load-redirect/load-redirect.component';
import { HomeComponent } from '@components/home/home.component';


@Component({
  
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadRedirect, HeaderComponent, FooterComponent, NavbarComponent, HomeComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})

export class AppComponent {

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

  ngOnInit(): void {

    // tema salvato nel localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkTheme = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

  }

}