import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFocus]',
  standalone: true,
})

export class FocusDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // Aggiunge la classe "focus" quando l'input riceve il focus
  @HostListener('focus') onFocus(): void {
    const parent = this.el.nativeElement.parentElement;
    if (parent) {
      this.renderer.addClass(parent, 'focus');
    }
  }

  // Rimuove la classe "focus" quando l'input perde il focus, se è vuoto
  @HostListener('blur') onBlur(): void {
    const parent = this.el.nativeElement.parentElement;
    if (parent && this.el.nativeElement.value.trim() === '') {
      this.renderer.removeClass(parent, 'focus');
    }
  }

}
