import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, NgModule, Renderer2 } from '@angular/core';

import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent {

  ngOnInit() {

    this.updateScreenSize();

  }

  ngOnUpdate(): void { this.updateScreenSize(); }

  isTabletScreen: boolean = false;

  @HostListener('window:resize', [])

  onResize(): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    const screenWidth = document.documentElement.clientWidth;
    this.isTabletScreen = screenWidth < 768;
  }

  constructor( private renderer: Renderer2, private el: ElementRef) {
    console.log('Screen size:', window.innerWidth, 'isTablet:', this.isTabletScreen)
  }

  products = Array(5).fill(null);

}
