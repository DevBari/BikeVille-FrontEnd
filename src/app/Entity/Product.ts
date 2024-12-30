export class Product {
    
    constructor(
        public productId :number|null,
        public name: string,
        public productNumber: string,
        public color: string,
        public standardCost: number,
        public listPrice: number,
        public size: string,
        public weight: number,
        public productCategoryId: number,
        public productModelId: number,
        public sellStartDate: Date,
        public sellEndDate: Date,){}
  }
