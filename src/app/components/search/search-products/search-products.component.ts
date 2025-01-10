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
  itemsPerPage: number = 12;
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
    this.shuffledImages = this.shuffleImages(); // Mescola le immagini all'inizio
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  images = [
    'https://cdn.shopify.com/s/files/1/0813/6091/2701/files/coll-c11-green.png?v=1709088899',
    'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-d3pro.png',
    'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-l3.png',
    'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-d11-s6.png?v=1721704941',
    'https://fiido.ie/wp-content/uploads/2023/05/coll-m25.png',
  ];

  shuffledImages: string[] = [];

  shuffleImages(): string[] {
    const shuffledImages = [...this.images]; // Crea una copia dell'array di immagini
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]]; // Scambia le immagini
    }
    return shuffledImages;
  }

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.shuffledImages.length);
    return this.shuffledImages[randomIndex];
  }

  // Funzione per assegnare immagini ai prodotti
  assignImagesToProducts(): void {
      const productElements = document.querySelectorAll('.product-top');
      productElements.forEach((element, index) => {
        const imageUrl = this.shuffledImages[index % this.shuffledImages.length]; // Usa l'indice per assegnare l'immagine
        (element as HTMLElement).style.backgroundImage = `url(${imageUrl})`;
    });
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

  recognizedColors: string[] = ['silver', 'red', 'black', 'blue', 'green', 'yellow', 'purple', 'white', 'gray'];

  isRecognizedColor(color: string | undefined): boolean {
      if (!color) {
          return false;
      }
      return this.recognizedColors.includes(color.toLowerCase());
  }

}
