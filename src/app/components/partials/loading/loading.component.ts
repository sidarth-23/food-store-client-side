import { Component } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styles: `.no-scroll {
    overflow: hidden;
  }`,
})
export class LoadingComponent {
  isLoading!: boolean;
  constructor(
    loadingService: LoadingService
  ) {
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
