import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { LatLngLiteral } from 'leaflet';
import { MapsComponent } from '../../partials/maps/maps.component';
import { UserService } from '../../../services/user.service';
import { IGetUser } from '../../../shared/interfaces/users/response.interface';
import { Address } from '../../../shared/models/User';
import { PasswordStrengthValidator } from '../../../shared/validators/password-strenght.validator';
import { PasswordsMatchValidator } from '../../../shared/validators/password-match.validator';
import { FormHeaderComponent } from '../../partials/form-header/form-header.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
    MapsComponent,
    NgClass,
    FormHeaderComponent
  ],
  templateUrl: './profile-page.component.html',
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
export class ProfilePageComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}
  updateSection!: string;
  initiation: boolean = false;
  selectedCountry!: string;
  selectedState!: string;
  updateUserForm!: FormGroup;
  updatePasswordForm!: FormGroup;
  tempStates!: string[];
  tempCities!: string[];
  tempCountries!: string[];
  mapClick!: boolean;
  enableForm!: boolean;
  userData!: IGetUser;
  addressToSend!: Address;
  checkAddressEdit!: boolean;

  ngOnInit(): void {
    this.checkAddressEdit = false;
    this.tempCities = [];
    this.tempStates = [];
    this.mapClick = false;
    this.initiation = true;

    this.updatePasswordForm = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            PasswordStrengthValidator(),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            PasswordStrengthValidator(),
          ],
        ],
      },
      { validators: PasswordsMatchValidator }
    );

    this.activatedRoute.params.subscribe((params) => {
      this.updateSection = params['update'];
      this.initiation = true;
    });

    this.updateUserForm = this.formBuilder.group({
      firstName: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z]*'),
        ],
      ],
      lastName: [
        { value: '', disabled: true },
        [Validators.pattern('[a-zA-Z]*')],
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
      lat: [{ value: '', disabled: true }, [Validators.required]],
      lng: [{ value: '', disabled: true }, [Validators.required]],
    });

    this.locationService.getCountryList().subscribe((countries) => {
      this.tempCountries = countries.map((country) => country.name);
    });

    this.userService.getUser().subscribe((res) => {
      this.userData = res;
      this.addressToSend = this.userData.data.Address;
      this.updateUserForm.patchValue({
        firstName: this.userData.data.firstName,
        lastName: this.userData.data.lastName,
        addressLine1: this.userData.data.Address.addressLine1,
        addressLine2: this.userData.data.Address.addressLine2,
        country: this.userData.data.Address.country,
        state: this.userData.data.Address.state,
        city: this.userData.data.Address.city,
        zipCode: this.userData.data.Address.zipCode,
      });
      this.locationService
        .getStateList(this.fc['country'].value)
        .subscribe((states) => {
          this.tempStates = states.data[0].states.map((state) => state.name);
          this.locationService
            .getCityList(this.fc['country'].value, this.fc['state'].value)
            .subscribe((cities) => {
              this.tempCities = cities.data[0].states.cities.map(
                (city) => city.name
              );
            });
        });
      this.fc['country'].valueChanges.subscribe((country) => {
        this.onCountryChange(country);
      });
      this.fc['state'].valueChanges.subscribe((state) => {
        this.onStateChange(state);
      });
    });
  }

  get fc() {
    return this.updateUserForm.controls;
  }

  get passFc() {
    return this.updatePasswordForm.controls;
  }

  enableFormClick() {
    this.enableForm = !this.enableForm;
    if (this.enableForm) {
      this.updateUserForm.enable({ emitEvent: false });
    } else {
      this.updateUserForm.disable({ emitEvent: false });
    }
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
      firstName: this.fc['firstName'].value,
      lastName: this.fc['lastName'].value,
      addressLine1: this.fc['addressLine1'].value,
      addressLine2: this.fc['addressLine2'].value || '',
      city: this.fc['city'].value,
      state: this.fc['state'].value,
      country: this.fc['country'].value,
      zipCode: this.fc['zipCode'].value,
      lat: this.fc['lat'].value,
      lng: this.fc['lng'].value,
    };

    this.userService.updateUser(body).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  onPasswordSubmit() {
    const dataToPass = { password: this.passFc['password'].value };
    this.userService.updatePass(dataToPass).subscribe(() => {
      console.log('successful');
      this.router.navigate(['/home']);
    });
  }

  onMapClick($event: LatLngLiteral) {
    this.updateUserForm.patchValue({
      lat: $event.lat,
      lng: $event.lng,
    });
    if (this.checkAddressEdit) {
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
          const check = this.tempCountries.includes(
            country?.long_name as string
          );
          this.updateUserForm.patchValue({
            addressLine1: addressLine1 ? addressLine1 : '',
            addressLine2: addressLine2 ? addressLine2 : '',
            country: check ? country?.long_name : this.tempCountries[0],
            zipCode: zipCode ? zipCode.long_name : '',
          });
          this.locationService
            .getStateList(this.fc['country'].value)
            .subscribe((states) => {
              this.tempStates = states.data[0].states.map(
                (state) => state.name
              );
              const check = this.tempStates.includes(
                state?.long_name as string
              );
              this.updateUserForm.patchValue({
                state: check ? state?.long_name : this.tempStates[0],
              });
            });
          this.locationService
            .getCityList(this.fc['country'].value, this.fc['state'].value)
            .subscribe((cities) => {
              this.tempCities = cities.data[0].states.cities.map(
                (city) => city.name
              );
              this.updateUserForm.patchValue({
                city: city?.long_name ? city?.long_name : this.tempCities[0],
              });
            });

          this.mapClick = false;
        });
    }
  }

  buttonDisableCondition() {
    return this.passFc['password'].touched;
  }
}
