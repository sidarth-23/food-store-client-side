import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styles: ``
})
export class StarRatingComponent {
  @Input()
  stars!: number;

  @Input()
  maxSize: number = 5;

  @Input()
  size: number = 1;

  get styles() {
    return {
      'width.rem': this.size,
      'height.rem': this.size,
      'marginRight.rem': this.size / 6,
    };
  }

  getStarImage(current: number): string {
    const previousHalf = current - 0.5;
    const imageName =
      this.stars >= current
        ? 'star-full'
        : this.stars >= previousHalf
        ? 'star-half'
        : 'star-empty';

    return `/assets/stars/${imageName}.svg`;
  }
}
