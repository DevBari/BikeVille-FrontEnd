import { Component, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  ngOnInit(): void {
    this.updateScreenSize();
  }

  constructor() {
    
  }

  isTabletScreen: boolean = false;

  @HostListener('window:resize', [])

  onResize(): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    const screenWidth = document.documentElement.clientWidth;
    this.isTabletScreen = screenWidth < 1024;
  }

}
