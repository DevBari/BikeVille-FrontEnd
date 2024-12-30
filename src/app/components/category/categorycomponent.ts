import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../service/category/categories.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NgFor,FormsModule,NgIf],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  constructor(private categoryService: CategoriesService, private route: ActivatedRoute) { }
  
  search : string=""
  category!: any
  products : any[]=[]
  filterProducts :any
  showFilterProducts : boolean=false
  price : number=0

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getCategory(Number(params.get('id')));
    });  
  }

  getCategory(id: number) {
    return this.categoryService.getCategory(id).subscribe(data => {
      
      this.category = data;
      this.category.inverseParentProductCategory.$values.forEach((subCategory: any) => {
        subCategory.products.$values.forEach((product: any) => {
          this.products.push(product);
        })
      })
      console.log(this.category);
      console.log(this.products);
      
      
    });

  }
  getProductsByPrice(){
    this.showFilterProducts=true
    this.filterProducts= this.products.filter((product: any) => product.
    listPrice
     <= this.price)
    console.log(this.filterProducts);
  }
 
  setCategoryRadio(id: any){
    if(id==null){
     this.showFilterProducts=false
    }else{
      this.filterProducts=this.products.filter((product: any) => product.productCategoryId == id)
      console.log(this.filterProducts);
     this.showFilterProducts=true
    }
    
  }

}