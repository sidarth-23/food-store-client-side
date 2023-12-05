import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  FormBuilder,
  FormControl,
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
import { PasswordStrengthValidator } from '../../../shared/validators/password-strenght.validator';
import { PasswordsMatchValidator } from '../../../shared/validators/password-match.validator';
import { FormHeaderComponent } from '../../partials/form-header/form-header.component';
import { MapsService } from '../../../services/maps.service';
import { TextInputBoxComponent } from '../../partials/text-input-box/text-input-box.component';
import { EmptyButtonRedComponent } from '../../partials/buttons/empty-button-red/empty-button-red.component';
import { CheckboxComponent } from '../../partials/checkbox/checkbox.component';
import { FilledButtonRedComponent } from '../../partials/buttons/filled-button-red/filled-button-red.component';
import { SelectInputBoxComponent } from '../../partials/select-input-box/select-input-box.component';

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
    FormHeaderComponent,
    TextInputBoxComponent,
    EmptyButtonRedComponent,
    CheckboxComponent,
    FilledButtonRedComponent,
    SelectInputBoxComponent
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
    private router: Router,
    private mapsService: MapsService
  ) {}
  updateSection!: string;
  initiation: boolean = false;
  updateUserForm!: FormGroup;
  updatePasswordForm!: FormGroup;
  tempStates!: string[];
  tempCities!: string[];
  tempCountries!: string[];
  enableForm!: boolean;
  userData!: IGetUser;
  checkAddressEdit!: boolean;

  nameErrorArray = ['required', 'minlength'];
  emailErrorArray = ['required', 'email'];
  passwordErrorArray = ['required', 'minlength', 'capsCheck', 'numberCheck', 'specialCharCheck'];
  addressErrorArray = ['required', 'minlength'];

  ngOnInit(): void {
    this.checkAddressEdit = false;
    this.tempCities = [];
    this.tempStates = [];
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

  formControlUser(value: string) {
    return this.updateUserForm.get(value) as FormControl;
  }

  formControlPass(value: string) {
    return this.updatePasswordForm.get(value) as FormControl;
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
      this.locationService
        .getStateList(country || this.fc['country'].value)
        .subscribe((states) => {
          this.tempStates = states.data[0].states.map((state) => state.name);
          this.fc['state'].setValue(this.tempStates[0]);
        });
  }

  onStateChange(state?: string) {
      this.locationService
        .getCityList(this.fc['country'].value, this.fc['state'].value || state)
        .subscribe((cities) => {
          this.tempCities = cities.data[0].states.cities.map(
            (city) => city.name
          );
          console.log(this.tempCities)
        });
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
    this.mapsService.mapClickEvent(this.updateUserForm, this.checkAddressEdit, $event)?.subscribe((res) => {
      this.tempCountries = res.tempCountries;
      this.tempStates = res.tempStates;
      this.tempCities = res.tempCities;
    })
  }

  buttonDisableCondition() {
    return this.passFc['password'].touched;
  }

  editAddressWithMap() {
    this.checkAddressEdit = !this.checkAddressEdit
  }

  get ifCityCondition() {
    return !this.tempCities || (this.tempCities.length === 0 && this.tempStates.length !== 0);
  }

  get ifStateCondition() {
    return !this.tempStates || this.tempStates.length === 0;
  }
}
