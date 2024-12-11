import { NgStyle, CommonModule } from '@angular/common';
import { FooterComponent } from '@components/footer/footer.component';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { HeaderComponent } from '@components/header/header.component';
import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    NgStyle,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/images/bici-overlay.jpg',
    'assets/images/accessori.jpg',
    'assets/images/abbigliamento.svg',
    'assets/images/ricambi.jpg',
  ];

  text_title: string[] = [
    'BICICLETTE',
    'ACCESSORI',
    'ABBIGLIAMENTO',
    'RICAMBI',
  ];

  text_subtitle: string[] = [
    'Scopri le bici perfette per le tue avventure! 🗺️',
    'Accessori per customizzare la tua bici, PIMP YOUR RIDE! 🪄',
    'Ad un gala o in montagna, vestiti comodo con BikeVille! 🤵🏽',
    'Ricambi perfetti per la tua bici unica, ⚠️ ma non modificare la targa!',
  ];  

  currentSlide: number = 0;
  intervalId: any;

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000); // Change image every 3 seconds
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  setCurrentSlide(index: number) {
    this.currentSlide = index;
  }
}
