import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../Entity/CartItem';
import { Product } from '../../Entity/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  public cartCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);

  constructor(private notify: ToastrService, private http: HttpClient) {
    this.loadCartFromLocalStorage();
  }

  /**
   * Carica il carrello da localStorage all'avvio del servizio.
   */
  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.updateCartState();
    }
  }

  /**
   * Salva il carrello corrente su localStorage.
   */
  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  /**
   * Aggiorna gli stati reattivi del carrello.
   */
  private updateCartState(): void {
    this.cartCount.next(this.cartItems.reduce((acc, item) => acc + item.quantity, 0));
    this.cartItemsSubject.next(this.cartItems);
  }

  /**
   * Aggiunge un prodotto al carrello. Se esiste già, incrementa la quantità.
   * @param item Il prodotto da aggiungere.
   */
  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product.productId === product.productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        product,
        quantity,
      });
    }
    this.saveCartToLocalStorage();
    this.updateCartState();
    this.notify.success('Prodotto aggiunto al carrello');
  }

  /**
   * Rimuove un prodotto dal carrello.
   * @param productId L'ID del prodotto da rimuovere.
   */
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.productId !== productId);
    this.saveCartToLocalStorage();
    this.updateCartState();
    this.notify.error('Prodotto rimosso dal carrello');
  }

  /**
   * Aggiorna la quantità di un prodotto nel carrello.
   * @param productId L'ID del prodotto.
   * @param quantity La nuova quantità.
   */
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(ci => ci.product.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCartToLocalStorage();
      this.updateCartState();
      this.notify.success('Quantità aggiornata');
    }
  }

  /**
   * Ripulisce completamente il carrello.
   */
  clearCart(): void {
    this.cartItems = [];
    this.saveCartToLocalStorage();
    this.updateCartState();
    this.notify.error('Carrello svuotato');
  }

  /**
   * Ottiene tutti gli articoli nel carrello.
   * @returns Gli articoli del carrello.
   */
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  /**
   * Ottiene gli articoli del carrello come Observable.
   * @returns Observable degli articoli del carrello.
   */
  getCartItemsObservable(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  /**
   * Ottiene i dettagli dei prodotti nel carrello (presumendo un backend REST).
   * @returns Observable dei prodotti.
   */
 
  getCartProducts(id: number){
    return this.http.get('https://localhost:7167/Products/addCart/'+id)
    }
}