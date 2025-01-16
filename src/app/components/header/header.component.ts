import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { HomeComponent } from '@components/home/home.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HomeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
