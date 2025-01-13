import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../../service/product/products.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors} from '@angular/forms';
import { CategoriesService } from '../../../../service/category/categories.service';
import { Product } from '../../../../Entity/Product';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, NgIf, FormsModule,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  
  constructor(
    private productService: ProductsService, 
    private notify: ToastrService, 
    private formBuilder: FormBuilder,
    private categoryService: CategoriesService
  ){}

  products !: any
  showAddProducts : boolean = false
  addProductsForm!: FormGroup
  updateProductsForm!:FormGroup
  categories : any[]=[]
  models !:any[];
  addedProduct !: Product
  updatedProduct!: Product
  showUpdateProducts!: boolean

  ngOnInit(): void {
      this.productService.getProductsIndex().subscribe((data: any) => {
        this.products=data.$values
      })
  
  
      this.categoryService.getCategoryWithOutProducts().subscribe((data: any) => {
        data.$values.filter((cat : any) => cat.$ref == null).forEach((cat : any) => 
         cat.inverseParentProductCategory.$values.forEach((subCat : any) => this.categories.push(subCat)));
        
      })
  
      this.productService.getModels().subscribe((data: any) => {
        console.log(data);
        this.models=data.$values
      })
  
  
      this.addProductsForm=this.formBuilder.group(
      {
        name: new FormControl(null, [Validators.required,Validators.minLength(3),Validators.maxLength(50),]),
        productNumber: new FormControl(null, [Validators.required,Validators.minLength(4),Validators.maxLength(10),]),
        color: new FormControl("Red"),
        standardCost: new FormControl(null, [Validators.required,Validators.minLength(3),Validators.maxLength(10),]),
        listPrice: new FormControl(null, [Validators.required,Validators.minLength(3),Validators.maxLength(10),]),
        size: new FormControl(null, [Validators.minLength(1),Validators.maxLength(2),]),
        weight: new FormControl(null, [Validators.minLength(1),Validators.maxLength(10),]),
        productCategoryId: new FormControl(5, [Validators.required]),
        productModelId: new FormControl(1, [Validators.required]),
        sellStartDate: new FormControl(null, [Validators.required]),
        sellEndDate: new FormControl(null, ),
  
      })
  
     
  }
  
  deleteProduct(id : number) {
    this.productService.deleteProductById(id).subscribe((data: any) => {
      console.log(data);
      this.notify.success('Prodotto rimosso con successo'); 
      this.ngOnInit();
    
    });
  }
  addProductToDB(){
    if(this.addProductsForm.valid){
      this.addedProduct=this.addProductsForm.value
      console.log(this.addedProduct);
      
      this.productService.addProduct(this.addProductsForm.value).subscribe((data: any) => {
       this.notify.success('Prodotto aggiunto con successo');
      })
    }else{
      this.notify.error('Form non valido');
    }
  }
  
  loadProductsInfo(product:any){
  
    this.updateProductsForm=this.formBuilder.group(
      {
        productId:new FormControl(product.productId),
        name: new FormControl(product.name, [Validators.required,Validators.minLength(3),Validators.maxLength(50),]),
        productNumber: new FormControl(product.productNumber, [Validators.required,Validators.minLength(4),Validators.maxLength(10),]),
        color: new FormControl(product.color),
        standardCost: new FormControl(product.standardCost, [Validators.required,Validators.minLength(3),Validators.maxLength(10),]),
        listPrice: new FormControl(product.listPrice, [Validators.required,Validators.minLength(3),Validators.maxLength(10),]),
        size: new FormControl(product.size, [Validators.minLength(1),Validators.maxLength(2),]),
        weight: new FormControl(product.weight, [Validators.minLength(1),Validators.maxLength(10),]),
        productCategoryId: new FormControl(product.productCategoryId, [Validators.required]),
        productModelId: new FormControl(product.productModelId, [Validators.required]),
        sellStartDate: new FormControl(product.sellStartDate, [Validators.required]),
        sellEndDate: new FormControl(product.sellEndDate),
  
      })
    this.showUpdateProducts=true
    
    
  }
  runUpdateProduct(){
    this.updatedProduct=this.updateProductsForm.value
    this.productService.updateProduct(this.updatedProduct.productId!,this.updatedProduct).subscribe((data:any)=>{
      this.notify.success("Articolo aggiornato con successo")
      this.showUpdateProducts=false
      this.ngOnInit();
    })
  }
}
  

