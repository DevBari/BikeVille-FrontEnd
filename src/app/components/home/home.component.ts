import { NgStyle, CommonModule } from '@angular/common';
import { FooterComponent } from '@components/footer/footer.component';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { HeaderComponent } from '@components/header/header.component';
import { Router, RouterLink, NavigationStart, NavigationEnd } from '@angular/router';

import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
  HostListener,
} from '@angular/core';

import AOS from 'aos';
import { ScrollService } from '../../service/scroll/scroll-to-down.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    NgStyle,
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit, OnDestroy {

  images: string[] = [
    'assets/images/bici-overlay.jpg',
    'assets/images/accessori.jpg',
    'assets/images/abbigliamento.svg',
    'assets/images/ricambi.slider.jpg',
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
    'Ad un gala o in montagna, vestiti al massimo della comodità con BikeVille! 🤵🏽',
    'Guasti o imprevisti? scopri la gamma di ricambi e componenti BikeVille per goderti le tue pedalate sempre in sicurezza! 🛠️',
  ];  

  currentSlide: number = 0;
  intervalId: any;

  ngOnInit() {
    AOS.init();
    this.startCarousel();
    this.startRev();

    this.scrollService.scrollEvent$.subscribe(() => {
      this.scrollToBottom();
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    clearInterval(this.viewId);
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
    
    // Clear the existing interval
    clearInterval(this.intervalId);

    // Set the current slide
    this.currentSlide = index;

    // Restart the carousel
    this.startCarousel();

  }

  // Review slider

  imagesR: string[] = [
    'assets/images/review(1).svg',
    'assets/images/review(5).svg',
    'assets/images/review(3).svg',
    'assets/images/review(4).svg',
    'assets/images/review(2).svg',
  ];

  text_titleR: string[] = [
    'Alessandra M. – ⭐⭐⭐⭐⭐ 5',
    'Luca R. – ⭐⭐⭐⭐⭐ 5',
    'Chiara T. – ⭐⭐⭐⭐⭐ 5',
    'Matteo P. – ⭐⭐⭐⭐ 4',
    'Serena L. – ⭐⭐⭐⭐⭐ 5'
  ];

  text_subtitleR: string[] = [
    'Finalmente un e-commerce che sa come coccolare i suoi clienti! L’esperienza è stata fantastica: dal momento in cui ho navigato sul sito fino alla consegna, tutto è stato fluido e professionale. Ho apprezzato tantissimo la trasparenza nelle informazioni sui prodotti e le spedizioni rapide. Grazie al supporto clienti, sempre disponibile e cortese, ho trovato il regalo perfetto per mio marito. Consigliatissimo!',
    'Avevo bisogno di un prodotto specifico e qui l’ho trovato in pochi click. Non solo: i consigli e le descrizioni erano super dettagliati, cosa che non trovo spesso online. Quando ho avuto una domanda, l’assistenza è stata rapidissima a rispondermi, con una cortesia che ti fa sentire davvero valorizzato come cliente. Sito dinamico, ben organizzato e super affidabile. Tornerò sicuramente per i miei prossimi acquisti!',
    'Adoro fare acquisti online, ma non sempre tutto fila liscio. Con questo e-commerce è tutta un’altra storia: tempi di consegna rispettati al secondo e prodotti che rispecchiano esattamente ciò che viene mostrato sul sito. Mi sono sentita seguita passo dopo passo, e devo dire che la loro professionalità fa davvero la differenza. Ho già consigliato il sito a tutti i miei amici!',
    'Devo dire che sono rimasto colpito. Ho trovato ciò che cercavo a un prezzo competitivo e la qualità è stata all’altezza delle aspettative. Il sito è chiaro e intuitivo, anche per uno come me che non è molto pratico con gli acquisti online. Unico motivo per cui non do 5 stelle: una leggera attesa con il corriere, ma il servizio clienti è stato impeccabile nel tenermi aggiornato. Complimenti!',
    'Finalmente un e-commerce che trasmette fiducia! Ho ordinato per la prima volta qualche settimana fa e ora è diventato il mio negozio online di riferimento. Trasparenza nei prezzi, assistenza sempre pronta e un processo d’acquisto così semplice che è impossibile non tornarci. Un mix perfetto di dinamismo e professionalità. Continuate così, siete il top!'
  ]; 

  currentRev: number = 0;
  viewId: any;

  startRev() {
      this.viewId = setInterval(() => {
          this.nextReview();
      }, 10000);
  }

  // Metodo per andare alla recensione successiva
  nextReview(): void {
    this.currentRev = (this.currentRev + 1) % this.imagesR.length;
  }

  // Metodo per andare alla recensione precedente
  prevReview(): void {
    this.currentRev =
    (this.currentRev - 1 + this.imagesR.length) % this.imagesR.length;
  }

  setCurrentRev(index: number) {
      // Clear intervallo
      clearInterval(this.viewId);

      // Set slide corrente
      this.currentRev = index;

      // Restart carosello
      this.startRev();
  }

  imagesSp: string[] = [
    'assets/images/messi.png',
    'assets/images/lebron.png',
    'assets/images/bolt.png',
  ];

  ngOnUpdate(): void { this.updateScreenSize(); }
  
  isLargeScreen: boolean = false;
  isTabletScreen: boolean = false;
  isMobileScreen: boolean = false;

  @HostListener('window:resize', [])

  onResize(): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    const screenWidth = document.documentElement.clientWidth;
    this.isLargeScreen = screenWidth < 1440;
    this.isTabletScreen = screenWidth <= 1024;
    this.isMobileScreen = screenWidth < 425;
  }

  @ViewChild('Home') bottomElement!: ElementRef;

  constructor(private scrollService: ScrollService) {}

  scrollToBottom(): void {
    this.bottomElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
