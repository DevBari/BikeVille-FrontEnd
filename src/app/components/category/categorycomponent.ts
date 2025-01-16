import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../service/category/categories.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { Product } from '../../Entity/Product'; 
import { CartItem } from '../../Entity/CartItem';
import { CartService } from '../../service/cart/cart.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})

export class CategoryComponent implements OnInit {

  constructor(
    private categoryService: CategoriesService,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller, // Iniezione del servizio
    public cartService: CartService
  ) {}

  search: string = '';
  category!: any;
  products: any[] = [];
  filterProducts: any[] = [];
  showFilterProducts: boolean = false;
  price: number = 0;

  // Paginazione
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedProducts: any[] = [];

  // Accordion state
  isAccordionOpen: { [key: string]: boolean } = {
    subCategory: false,
    price: false,
  };

  // Stati dei filtri
  selectedSubCategoryId: number | null = null;
  selectedPriceRange: { min: number; max: number } | null = null;

  // Range di prezzo predefiniti
  priceRanges: { label: string; min: number; max: number }[] = [
    { label: 'Fino a €50', min: 0, max: 50 },
    { label: '€51 - €100', min: 51, max: 100 },
    { label: '€101 - €200', min: 101, max: 200 },
    { label: 'Oltre €200', min: 201, max: Infinity },
  ];

  private routeSub!: Subscription;

  ngOnInit(): void {
     // Sottoscrizione ai parametri della route per ottenere l'ID della categoria
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.getCategory(id); // Recupera la categoria con l'ID specificato
      }
    });
    this.shuffledImages = this.shuffleImages(); // Mescola le immagini all'inizio
  }

  ngOnDestroy(): void {
    // Annulla la sottoscrizione ai parametri della route quando il componente viene distrutto
    this.routeSub.unsubscribe();
  }

  /**
   * Recupera la categoria con l'ID specificato e i relativi prodotti.
   * @param id L'ID della categoria da recuperare.
   */
  getCategory(id: number) {
    return this.categoryService.getCategory(id).subscribe((data) => {
      this.category = data;
      this.products = []; // Resetta l'array dei prodotti
      this.category.inverseParentProductCategory.$values.forEach(
        (subCategory: any) => {
          subCategory.products.$values.forEach((product: any) => {
            this.products.push(product);
          });
        }
      );
      console.log(this.category);
      console.log(this.products);
      const categoryKey = this.category.name.toLowerCase();
      this.images = this.imageCategories[categoryKey] || []; // Se la categoria non esiste, usa un array vuoto
      this.applyFilters(); // Applica i filtri  dopo aver caricato i prodotti
      this.assignImagesToProducts();
    });
  }

  // Metodo per resettare solo il filtro del prezzo
  resetPriceFilter() {
    this.selectedPriceRange = null; // Resetta il range di prezzo selezionato
    this.applyFilters(); // Riapplica i filtri con il filtro prezzo resettato
  }

  // Aggiorna il filtro di prezzo basato sulla selezione predefinita
  setPriceRange(range: { min: number; max: number }) {
    this.selectedPriceRange = range;
    this.applyFilters();
  }

  setCategoryRadio(id: any) {
    this.selectedSubCategoryId = id;
    this.applyFilters();
  }

  /**
   * Applica i filtri selezionati (sottocategoria e range di prezzo) ai prodotti e aggiorna la visualizzazione.
   */
  applyFilters() {
    // Filtra l'array 'products' in base ai criteri selezionati
    this.filterProducts = this.products.filter((product: any) => {
      // Verifica se il prodotto appartiene alla sottocategoria selezionata
      // Se 'selectedSubCategoryId' è null o undefined, considera tutti i prodotti (matchesCategory = true)
      const matchesCategory = this.selectedSubCategoryId
        ? product.productCategoryId === this.selectedSubCategoryId
        : true;

      // Verifica se il prezzo del prodotto rientra nel range di prezzo selezionato
      // Se 'selectedPriceRange' è null o undefined, considera tutti i prezzi (matchesPrice = true)
      const matchesPrice = this.selectedPriceRange
        ? product.listPrice >= this.selectedPriceRange.min &&
          product.listPrice <= this.selectedPriceRange.max
        : true;

      // Restituisce 'true' solo se il prodotto soddisfa entrambi i criteri di filtraggio
      return matchesCategory && matchesPrice;
    });

    // Imposta la flag per mostrare i prodotti filtrati
    this.showFilterProducts = true;

    // Configura la paginazione basata sui prodotti filtrati
    this.setupPagination();
  }

  /**
   * Configura la paginazione basata sui prodotti filtrati.
   */
  setupPagination() {
    // Determina la fonte dei dati da paginare (filtrati o tutti i prodotti)
    const source = this.showFilterProducts
      ? this.filterProducts
      : this.products;

    // Calcola il numero totale di pagine
    this.totalPages = Math.ceil(source.length / this.itemsPerPage);

    // Resetta la pagina corrente a 1
    this.currentPage = 1;

    // Estrae i prodotti da mostrare nella pagina corrente
    this.paginate();
  }

  /**
   * Estrae e assegna i prodotti della pagina corrente alla proprietà 'paginatedProducts'.
   */
  paginate() {
    // Determina la fonte dei dati da paginare
    const source = this.showFilterProducts
      ? this.filterProducts
      : this.products;

    // Calcola gli indici di inizio e fine per lo slice dell'array
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    // Assegna i prodotti della pagina corrente a 'paginatedProducts'
    this.paginatedProducts = source.slice(start, end);
    this.scrollToElement(); // Scrolla in cima dopo la paginazione
  }

  // Naviga alla pagina precedente
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  // Naviga alla pagina successiva
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  // Vai a una pagina specifica
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  // Scrolla all'inizio della pagina
  scrollToElement(): void {
    const element = document.querySelector('#title');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Toggle accordion sections
  toggleAccordion(section: string) {
    this.isAccordionOpen[section] = !this.isAccordionOpen[section];
  }

  /**
   * Metodo per aggiungere un prodotto al carrello.
   * Mappa un oggetto Product a CartItem prima di aggiungerlo.
   * @param product Il prodotto da aggiungere al carrello.
   */
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

  images = [
    'https://cdn.shopify.com/s/files/1/0813/6091/2701/files/coll-c11-green.png?v=1709088899',
    'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-d3pro.png',
    'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-l3.png',
    'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-d11-s6.png?v=1721704941',
    'https://fiido.ie/wp-content/uploads/2023/05/coll-m25.png',
  ];

  imageCategories: { [key: string]: string[] } = {
    'bici': [
      'https://cdn.shopify.com/s/files/1/0813/6091/2701/files/coll-c11-green.png?v=1709088899',
      'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-d3pro.png',
      'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-l3.png',
      'https://cdn.shopify.com/s/files/1/0606/7539/1649/files/coll-d11-s6.png?v=1721704941',
      'https://fiido.ie/wp-content/uploads/2023/05/coll-m25.png',
    ],
    'accessori': [
        'https://example.com/image3.jpg',
        'https://example.com/image4.jpg',
    ],
    // Aggiungi altre categorie e le loro immagini qui
  };

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

}
