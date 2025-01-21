import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ScrollService {

  private scrollEvent = new Subject<void>();

  // Observable per l'ascolto
  scrollEvent$ = this.scrollEvent.asObservable();

  // Metodo per emettere l'evento
  triggerScroll() {
    this.scrollEvent.next();
  }

}
