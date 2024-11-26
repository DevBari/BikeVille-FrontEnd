import { Component, NgModule } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({

  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgStyle, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'

})

export class NavbarComponent {

  isHidden = false; // True per nascondere l'elemento
  isXlScreen = window.innerWidth >= 1280; // Condizione per schermi XL

  // Aggiungi un listener per aggiornare isXlScreen durante il ridimensionamento della finestra
  
  constructor() {

    window.addEventListener('resize', () => {
      this.isXlScreen = window.innerWidth >= 1280;
    });
    
  }

}
