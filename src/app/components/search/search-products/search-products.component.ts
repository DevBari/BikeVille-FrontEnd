import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../service/product/products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../../service/cart/cart.service';
import { Subscription } from 'rxjs'
import { ViewportScroller } from '@angular/common';
import { Product } from '../../../Entity/Product';
import { CartItem } from '../../../Entity/CartItem';

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
    private cartService: CartService,
    private viewportScroller: ViewportScroller // Iniezione del servizio
  ) {}

  productsFiltered: any[] = [];
  paginatedProducts: any[] = [];
  searchTerm: string = '';

  // Paginazione
  currentPage: number = 1;
  itemsPerPage: number = 16;
  totalPages: number = 0;

  private routeSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const search = params.get('search');
      if (search) {
        this.searchTerm = search;
        this.getProducts(search);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }


  getProducts(search: string) {
    this.productService.getProducts(search).subscribe((data: any) => {
      console.log(data);
      this.productsFiltered = data.$values || [];
      this.setupPagination()
    });
  }
  
  setupPagination() {
    this.totalPages = Math.ceil(this.productsFiltered.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginate();
  }

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.productsFiltered.slice(start, end);
    this.scrollToTop(); // Scrolla in cima dopo la paginazione
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  addProductToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }
}
