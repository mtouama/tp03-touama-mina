import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../models/product';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit, OnDestroy {
  products : Product[] = [];
  filteredProducts : Product[] = [];

  @Input() searchObservable : Observable<{ property: string, value: string }> | undefined;

  private searchSubscription : Subscription | undefined;
  private productsSubscription : Subscription | undefined;

  constructor(private apiService : ApiService) { }

  ngOnDestroy(): void {
    if(this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if(this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    //products
    this.productsSubscription = this.apiService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products; // Initialiser les produits filtrés avec tous les produits
    });

    // Souscrire pour écouter les changements de recherche
    if (this.searchObservable) {
      this.searchSubscription = this.searchObservable.subscribe((search) => {
        this.filteredProducts = this.products.filter((item: Product) => {
          const value = item[search.property as keyof Product];
          return value.toString().toLowerCase().includes(search.value.toLowerCase());
      
      });
      });
    }

}

}
