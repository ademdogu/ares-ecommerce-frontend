import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/common/product';
import { CartItem } from 'src/app/common/cart-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;
  keyword: string;

  // pagination props
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 100;

  previousKeyword: string = null;
 
  constructor(private productService: ProductService,
              private cartService: CartService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();  
    }
    
  }

  handleSearchProducts() {

    this.keyword = this.route.snapshot.paramMap.get('keyword');

    // if we have different keyword than previous set thePageNumber to 1
    if (this.previousKeyword != this.keyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = this.keyword;
    console.log(`keyword=${this.keyword}, thePageNumber=${this.thePageNumber}`);

    // search for the products using keyword
    this.productService.getSearchProductsPaginate(this.thePageNumber - 1,
                                                  this.thePageSize,
                                                  this.keyword)
                                                  .subscribe(this.processResult());

  }

  handleListProducts() {

    // check if "id" param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //read id and convert to a number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    }
    else {
      // default to 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    // if we have a different category id than previous reset thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageSize}`);

    // get products for given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }
  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);

  }

}
