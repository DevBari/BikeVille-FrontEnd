import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../service/product/products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../../service/cart/cart.service';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, NgIf],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css',
})

export class SearchProductsComponent implements OnInit {
  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  productsFiltered: any[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const search = params.get('search');
      if (search) {
        this.searchTerm = search;
        this.getProducts(search);
      }
    });
  }
  getProducts(search: string) {
    this.productService.getProducts(search).subscribe((data: any) => {
      console.log(data);
      this.productsFiltered = data.$values || [];
    });
  }

  addProductToCart(productId: number) {
    this.cartService.addToCart(productId);
    this.cartService.cartCount.next(this.cartService.cartCount.getValue() + 1);
  }
}
