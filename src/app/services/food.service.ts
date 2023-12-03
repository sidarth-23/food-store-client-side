import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GET_ALL_FOODS,
  GET_FOOD_BY_ID,
  GET_FOOD_BY_SEARCH_TERM,
  GET_AND_SEARCH_FOOD_BY_TAG_NAME,
} from '../shared/constants/urls';
import {
  FoodItem,
  TagNameRes,
} from '../shared/interfaces/food/requests.interface';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessage } from '../shared/interfaces/users/response.interface';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getAllFoods() {
    return this.http.get<FoodItem[]>(GET_ALL_FOODS);
  }

  getFoodBySearchTerm(searchTerm: string) {
    return this.http
      .get<FoodItem[]>(`${GET_FOOD_BY_SEARCH_TERM}/${searchTerm}`)
      .pipe(
        tap({
          next: (res) => {},
          error: (err) => {
            err.error.errMessage.forEach((item: ErrorMessage) => {
              this.toastrService.info(`${item.msg}`, 'Could not proceed');
            });
          },
        })
      );
  }

  getTagNames() {
    return this.http.get<TagNameRes[]>(GET_AND_SEARCH_FOOD_BY_TAG_NAME);
  }

  getFoodByTagName(tagName?: string) {
    return this.http
      .get<FoodItem[]>(`${GET_AND_SEARCH_FOOD_BY_TAG_NAME}/${tagName}`)
      .pipe(
        tap({
          next: (res) => {},
          error: (err) => {
            err.error.errMessage.forEach((item: ErrorMessage) => {
              this.toastrService.error(`${item.msg}`, 'Could not proceed');
            });
          },
        })
      );
  }

  getFoodById(foodId: number) {
    return this.http.get<FoodItem[]>(`${GET_FOOD_BY_ID}?foodId=${foodId}`);
  }
}
