import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  constructor(private notify: ToastrService,private http: HttpClient) { }
  public cartCount =  new BehaviorSubject<number>(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')||'').length : 0);

  addToCart(productId : number){
    if(localStorage.getItem('cart')){
      let cart = JSON.parse(localStorage.getItem('cart')!);
      if(cart == null){
        cart = [];
      }
      
      cart.push(productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.notify.success('Prodotto aggiunto al carrello')
      
    }else{
      window.location.replace('/login');
    }
  }

  getCartProducts(id: number){
    
  return this.http.get('https://localhost:7167/Products/addCart/'+id)
  }
  
}
