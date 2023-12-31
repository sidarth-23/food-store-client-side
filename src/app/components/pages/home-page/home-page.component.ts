import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { StarRatingComponent } from '../../partials/star-rating/star-rating.component';
import { FoodService } from '../../../services/food.service';
import { FoodItem } from '../../../shared/interfaces/food/requests.interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FilledButtonRedComponent } from '../../partials/buttons/filled-button-red/filled-button-red.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatMenuModule,
    MatSelectModule,
    StarRatingComponent,
    RouterModule,
    NgOptimizedImage,
    FilledButtonRedComponent,
  ],
  templateUrl: './home-page.component.html',
  styles: ``,
})
export class HomePageComponent implements OnInit {
  countryNames!: Observable<{ name: string; code: string }[]>;
  favourites: boolean = false;
  foodList!: FoodItem[];
  tagList!: string[];
  searchTerm!: string;
  favouriteFoods!: FoodItem[];
  favouriteFoodIds!: number[];
  currentUserToken!: string;

  constructor(
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const routePath = this.activatedRoute.snapshot.url.map((url) => url.path);
      if (routePath.includes('tag')) {
        const tagName = params['tagName'];
        this.foodService.getFoodByTagName(tagName).subscribe((res) => {
          this.foodList = res;
        });
      } else if (routePath.includes('search')) {
        const searchTerm = params['searchTerm'];
        this.foodService.getFoodBySearchTerm(searchTerm).subscribe((res) => {
          this.foodList = res;
        });
      } else if (routePath.includes('favourites')) {
        this.userService.getFavourites().subscribe((res) => {
          this.foodList = res.message.map((item) => item.Food as FoodItem);
        });
      } else {
        this.foodService.getAllFoods().subscribe((res) => {
          this.foodList = res;
        });
      }
    });

    this.foodService.getTagNames().subscribe((res) => {
      this.tagList = res.map((tag) => tag.name);
    });

    this.userService.getFavourites().subscribe((res) => {
      this.favouriteFoods = res.message.map((item) => item.Food as FoodItem);
      this.favouriteFoodIds = this.favouriteFoods.map((item) => item.id);
    });
  }

  onSearchTerm() {
    this.foodService.getFoodBySearchTerm(this.searchTerm).subscribe({
      next: () => {
        this.router.navigate([`/home/search/${this.searchTerm}`]);
      },
    });
  }

  onTagClick(tagName: string) {
    this.router.navigate([`/home/tag/${tagName}`]);
  }

  onAddToCart(foodId: number) {
    this.userService.updateUserCart(foodId, 1).subscribe();
  }

  toggleFavourites(foodId: number) {
    this.userService.toggleFavourite(foodId).subscribe((res) => {
      this.favouriteFoods = res.message.map((item) => item.Food as FoodItem);
      this.favouriteFoodIds = this.favouriteFoods.map((item) => item.id);
    });
  }
}
