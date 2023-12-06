import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { PasswordStrengthValidator } from '../../../shared/validators/password-strenght.validator';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { LocationService } from '../../../services/location.service';
import { MapsComponent } from '../../partials/maps/maps.component';
import { LatLngLiteral } from 'leaflet';
import { UserService } from '../../../services/user.service';
import { PasswordsMatchValidator } from '../../../shared/validators/password-match.validator';
import { FormHeaderComponent } from '../../partials/form-header/form-header.component';
import { MapsService } from '../../../services/maps.service';
import { TextInputBoxComponent } from '../../partials/text-input-box/text-input-box.component';
import { SelectInputBoxComponent } from '../../partials/select-input-box/select-input-box.component';
import { FilledButtonRedComponent } from '../../partials/buttons/filled-button-red/filled-button-red.component';

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
    NgClass,
    FormHeaderComponent,
    TextInputBoxComponent,
    SelectInputBoxComponent,
    FilledButtonRedComponent
  ],
  templateUrl: './register-page.component.html',
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
export class RegisterPageComponent implements OnInit {
  initiation: boolean = false;
  registrationForm!: FormGroup;
  tempCountries!: string[];
  tempStates!: string[];
  tempCities!: string[];
  enableForm!: boolean;

  nameErrorArray = ['required', 'minlength'];
  emailErrorArray = ['required', 'email'];
  passwordErrorArray = [
    'required', 'minlength', 'capsCheck', 'numCheck', 'specialCharCheck', 'smallLetterCheck'
  ];
  addressErrorArray = ['required', 'minlength'];

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private userService: UserService,
    private router: Router,
    private mapsService: MapsService
  ) {}
  ngOnInit(): void {
    this.tempCities = [];
    this.tempStates = [];
    this.initiation = true;
    this.registrationForm = this.formBuilder.group(
      {
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
          [Validators.pattern('[a-zA-Z ]*')],
        ],
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email],
        ],
        password: [
          { value: '', disabled: true },
          [
            Validators.required,
            Validators.minLength(8),
            PasswordStrengthValidator(),
          ],
        ],
        confirmPassword: [{ value: '', disabled: true }, Validators.required],
        addressLine1: [
          { value: '', disabled: true },
          [Validators.required, Validators.minLength(3)],
        ],
        addressLine2: [
          { value: '', disabled: true },
          [Validators.minLength(3)],
        ],
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
      },
      { validators: PasswordsMatchValidator }
    );

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
        this.registrationForm.enable({ emitEvent: false });
      }
    });
  }

  get fc() {
    return this.registrationForm.controls;
  }

  formControl(value: string) {
    return this.registrationForm.get(value) as FormControl;
  }

  onCountryChange(country?: string) {
    this.locationService
      .getStateList(country || this.fc['country'].value)
      .subscribe((states) => {
        this.tempStates = states.data[0].states.map((state) => state.name);
      });
  }

  onStateChange(state?: string) {
    this.locationService
      .getCityList(this.fc['country'].value, this.fc['state'].value || state)
      .subscribe((cities) => {
        this.tempCities = cities.data[0].states.cities.map((city) => city.name);
      });
  }

  onSubmit() {
    const body = {
      firstName: this.fc['firstName'].value,
      lastName: this.fc['lastName'].value || '',
      email: this.fc['email'].value,
      password: this.fc['password'].value,
      addressLine1: this.fc['addressLine1'].value,
      addressLine2: this.fc['addressLine2'].value || '',
      city: this.fc['city'].value,
      state: this.fc['state'].value,
      country: this.fc['country'].value,
      zipCode: this.fc['zipCode'].value,
      lat: this.fc['lat'].value,
      lng: this.fc['lng'].value,
    };
    console.log('body',body)
    this.userService.register(body).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
    });
  }

  onMapClick($event: LatLngLiteral) {
    this.mapsService
      .mapClickEvent(this.registrationForm, true, $event)
      ?.subscribe((res) => {
        this.tempCountries = res.tempCountries;
        this.tempStates = res.tempStates;
        this.tempCities = res.tempCities;
      });
  }

  get ifCityCondition() {
    return !this.tempCities || (this.tempCities.length === 0 && this.tempStates.length !== 0);
  }

  get ifStateCondition() {
    return !this.tempStates || this.tempStates.length === 0;
  }
}
