import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductsService} from '../services/products.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  productName = 'A book';
  isDisabled = true;
  products = [];
  private productsSubscription: Subscription;

  constructor(private productsService: ProductsService) {
    setTimeout(()=> {
      this.productName = 'A Tree';
      this.isDisabled = false;
    }, 3000);
  }

  onAddProduct(form) {
    //this.products.push(this.productName);
    console.log(form);
    if (form.valid) {
      //this.products.push(form.value.productName);
      this.productsService.addProduct(form.value.productName);
    }
  }

  onRemoveProduct(productName: string) {
    this.products = this.products.filter(p => p !== productName);
  }

  ngOnInit() {
    this.productsSubscription = this.productsService.productsUpdate.subscribe(() => {
      this.products = this.productsService.getProducts();
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }


}
