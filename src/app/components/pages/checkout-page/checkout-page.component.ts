import { countries } from '../../../shared/constants/country-names.data';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { LocationService } from '../../../services/location.service';
import { startWith } from 'rxjs/operators';
import { MapsComponent } from '../../partials/maps/maps.component';
import { LatLngLiteral } from 'leaflet';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    MapsComponent,
    NgClass
  ],
  templateUrl: './checkout-page.component.html',
  styles: ``,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CheckoutPageComponent implements OnInit {
  selectedCountry!: string;
  selectedState!: string;
  initiation: boolean = false;
  orderForm!: FormGroup;
  tempCountries!: string[];
  tempStates!: string[];
  tempCities!: string[];
  mapClick!: boolean;
  enableForm!: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private orderService: OrderService, private router: Router
  ) {}
  ngOnInit(): void {
    this.tempCities = [];
    this.tempStates = [];
    this.mapClick = false;
    this.initiation = true;

    this.orderForm = this.formBuilder.group({
      name: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z]*'),
        ],
      ],
      addressLine1: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      addressLine2: [{ value: '', disabled: true }, [Validators.minLength(3)]],
      country: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('[a-zA-Z ]*')],
      ],
      city: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('[a-zA-Z ]*')],
      ],
      state: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('[a-zA-Z ]*')],
      ],
      zipCode: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('[0-9]*')],
      ],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
    });

    this.locationService.getCountryList().subscribe((countries) => {
      this.tempCountries = countries.map((country) => country.name);
    });

    this.locationService
      .getStateList(this.fc['country'].value)
      .subscribe((states) => {
        this.tempStates = states.data[0].states.map((state) => state.name);
      });

    this.locationService
      .getCityList(this.fc['country'].value, this.fc['state'].value)
      .subscribe((cities) => {
        this.tempCities = cities.data[0].states.cities.map((city) => city.name);
      });

    this.fc['country'].valueChanges.subscribe((country) => {
      this.onCountryChange(country);
    });

    this.fc['state'].valueChanges.subscribe((state) => {
      this.onStateChange(state);
    });

    this.fc['lat'].valueChanges.subscribe((value) => {
      this.enableForm = !isNaN(parseInt(value)) && (value > -90 || value < 90);
      if (this.enableForm) {
        this.orderForm.enable({emitEvent: false})
      }
    });
  }

  get fc() {
    return this.orderForm.controls;
  }

  onCountryChange(country?: string) {
    if (!this.mapClick) {
      this.locationService
        .getStateList(country || this.fc['country'].value)
        .subscribe((states) => {
          this.tempStates = states.data[0].states.map((state) => state.name);
          this.fc['state'].setValue(this.tempStates[0]);
        });
    }
  }

  onStateChange(state?: string) {
    if (!this.mapClick) {
      this.locationService
        .getCityList(this.fc['country'].value, this.fc['state'].value || state)
        .subscribe((cities) => {
          this.tempCities = cities.data[0].states.cities.map(
            (city) => city.name
          );
        });
    }
  }

  onSubmit() {
    const body = {
      name: this.fc['name'].value,
      addressLine1: this.fc['addressLine1'].value,
      addressLine2: this.fc['addressLine2'].value || '',
      city: this.fc['city'].value,
      state: this.fc['state'].value,
      country: this.fc['country'].value,
      zipCode: this.fc['zipCode'].value,
      lat: this.fc['lat'].value,
      lng: this.fc['lng'].value,
    };

    this.orderService.createUserOrder(body).subscribe(() => {
      this.router.navigate(['/home'])
    });
    console.log(this.orderForm.valid)
  }

  onMapClick($event: LatLngLiteral) {
    this.orderForm.patchValue({
      lat: $event.lat,
      lng: $event.lng,
    });
    this.mapClick = true;
    this.locationService
      .getAddressFromCoordinates($event.lat, $event.lng)
      .subscribe((address) => {
        const subpremise = address.data.address_components.find((item) =>
          item.types.includes('subpremise')
        );
        const premise = address.data.address_components.find((item) =>
          item.types.includes('premise')
        );
        const neighborhood = address.data.address_components.find((item) =>
          item.types.includes('neighborhood')
        );

        const streetNumber = address.data.address_components.find((item) => {
          return item.types.includes('street_number');
        });
        const addressLine1 =
          // contat all the 4 components above it and exclude the null values
          [subpremise, premise, neighborhood, streetNumber]
            .map((item) => item?.long_name)
            .filter((item) => item)
            .join(', ');

        const intersection = address.data.address_components.find((item) =>
          item.types.includes('intersection')
        );
        const route = address.data.address_components.find((item) => {
          return item.types.includes('route');
        });
        const colloquialArea = address.data.address_components.find((item) =>
          item.types.includes('colloquial_area')
        );
        const addressLine2 = [intersection, route, colloquialArea]
          .map((item) => item?.long_name)
          .filter((item) => item)
          .join(', ');

        const zipCode = address.data.address_components.find((item) =>
          item.types.includes('postal_code')
        );
        const country = address.data.address_components.find((item) =>
          item.types.includes('country')
        );
        const state = address.data.address_components.find((item) =>
          item.types.includes('administrative_area_level_1')
        );
        let city = address.data.address_components.find((item) =>
          item.types.includes('administrative_area_level_3')
        );
        if (!city) {
          city = address.data.address_components.find((item) =>
            item.types.includes('locality')
          );
        }
        const len = address.data.address_components.length;
        const check = this.tempCountries.includes(country?.long_name as string);
        this.orderForm.patchValue({
          addressLine1: addressLine1 ? addressLine1 : '',
          addressLine2: addressLine2 ? addressLine2 : '',
          country: check ? country?.long_name : this.tempCountries[0],
          zipCode: zipCode ? zipCode.long_name : '',
        });
        this.locationService
          .getStateList(this.fc['country'].value)
          .subscribe((states) => {
            this.tempStates = states.data[0].states.map((state) => state.name);
            const check = this.tempStates.includes(state?.long_name as string);
            this.orderForm.patchValue({
              state: check ? state?.long_name : this.tempStates[0],
            });
          });
        this.locationService
          .getCityList(this.fc['country'].value, this.fc['state'].value)
          .subscribe((cities) => {
            this.tempCities = cities.data[0].states.cities.map(
              (city) => city.name
            );
            this.orderForm.patchValue({
              city: city?.long_name ? city?.long_name : this.tempCities[0],
            });
          });

        this.mapClick = false;
      });
  }
}
