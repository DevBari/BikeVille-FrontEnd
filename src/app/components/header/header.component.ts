import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { HomeComponent } from '@components/home/home.component';
import { ScrollService } from '../../service/scroll/scroll-to-down.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HomeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private scrollService: ScrollService) {}

  scrollToBottom() {
    this.scrollService.triggerScroll();
  }
}
