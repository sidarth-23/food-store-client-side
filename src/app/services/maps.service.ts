import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LatLngLiteral } from 'leaflet';
import { LocationService } from './location.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  tempCountries!: string[];
  tempStates!: string[];
  tempCities!: string[];
  mapClick!: boolean;

  constructor(private locationService: LocationService) {
    this.locationService.getCountryList().subscribe((countries) => {
      this.tempCountries = countries.map((country) => country.name);
    })
  }

  getAddress(latLng: LatLngLiteral) {
    return this.locationService
      .getAddressFromCoordinates(latLng.lat, latLng.lng)
      .pipe(
        map((address) => {
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
          return { addressLine1, addressLine2, zipCode, country, state, city };
        })
      );
  }

  mapClickEvent(
    formName: FormGroup,
    editCheck: boolean,
    latLng: LatLngLiteral
  ) {
    console.log('latlng service',latLng)
    formName.patchValue({
      lat: latLng.lat,
      lng: latLng.lng,
    });
    if (editCheck) {
      this.mapClick = true;
      return this.getAddress(latLng).pipe(
        map((address) => {
          const {addressLine1, addressLine2, zipCode, country, state, city} = address
          console.log('getting here')
          const check = this.tempCountries.includes(
            country?.long_name as string
          );
          formName.patchValue({
            addressLine1: addressLine1 ? addressLine1 : '',
            addressLine2: addressLine2 ? addressLine2 : '',
            country: check ? country?.long_name : this.tempCountries[0],
            zipCode: zipCode ? zipCode.long_name : '',
          });
          this.locationService
            .getStateList(formName.controls.country.value)
            .subscribe((states) => {
              this.tempStates = states.data[0].states.map(
                (state) => state.name
              );
              const check = this.tempStates.includes(
                state?.long_name as string
              );
              formName.patchValue({
                state: check ? state?.long_name : this.tempStates[0],
              });
            });
          this.locationService
            .getCityList(
              formName.controls.country.value,
              formName.controls.state.value
            )
            .subscribe((cities) => {
              this.tempCities = cities.data[0].states.cities.map(
                (city) => city.name
              );
              formName.patchValue({
                city: city?.long_name
                  ? city?.long_name
                  : this.tempCities[0],
              }, {emitEvent: false} );
            });
          this.mapClick = false;
          return { tempCountries: this.tempCountries, tempStates: this.tempStates, tempCities: this.tempCities }
        })
      );
      // this.locationService
      //   .getAddressFromCoordinates(latLng.lat, latLng.lng)
      //   .subscribe((address) => {
      //     const subpremise = data.address_components.find((item) =>
      //       item.types.includes('subpremise')
      //     );
      //     const premise = address.data.address_components.find((item) =>
      //       item.types.includes('premise')
      //     );
      //     const neighborhood = address.data.address_components.find((item) =>
      //       item.types.includes('neighborhood')
      //     );

      //     const streetNumber = address.data.address_components.find((item) => {
      //       return item.types.includes('street_number');
      //     });
      //     const addressLine1 =
      //       // contat all the 4 components above it and exclude the null values
      //       [subpremise, premise, neighborhood, streetNumber]
      //         .map((item) => item?.long_name)
      //         .filter((item) => item)
      //         .join(', ');

      //     const intersection = address.data.address_components.find((item) =>
      //       item.types.includes('intersection')
      //     );
      //     const route = address.data.address_components.find((item) => {
      //       return item.types.includes('route');
      //     });
      //     const colloquialArea = address.data.address_components.find((item) =>
      //       item.types.includes('colloquial_area')
      //     );
      //     const addressLine2 = [intersection, route, colloquialArea]
      //       .map((item) => item?.long_name)
      //       .filter((item) => item)
      //       .join(', ');

      //     const zipCode = address.data.address_components.find((item) =>
      //       item.types.includes('postal_code')
      //     );
      //     const country = address.data.address_components.find((item) =>
      //       item.types.includes('country')
      //     );
      //     const state = address.data.address_components.find((item) =>
      //       item.types.includes('administrative_area_level_1')
      //     );
      //     let city = address.data.address_components.find((item) =>
      //       item.types.includes('administrative_area_level_3')
      //     );
      //     if (!city) {
      //       city = address.data.address_components.find((item) =>
      //         item.types.includes('locality')
      //       );
      //     }
      //     const check = this.tempCountries.includes(
      //       country?.long_name as string
      //     );
      //     formName.patchValue({
      //       addressLine1: addressLine1 ? addressLine1 : '',
      //       addressLine2: addressLine2 ? addressLine2 : '',
      //       country: check ? country?.long_name : this.tempCountries[0],
      //       zipCode: zipCode ? zipCode.long_name : '',
      //     });
      //     this.locationService
      //       .getStateList(formName.controls.country.value)
      //       .subscribe((states) => {
      //         this.tempStates = states.data[0].states.map(
      //           (state) => state.name
      //         );
      //         const check = this.tempStates.includes(
      //           state?.long_name as string
      //         );
      //         formName.patchValue({
      //           state: check ? state?.long_name : this.tempStates[0],
      //         });
      //       });
      //     this.locationService
      //       .getCityList(
      //         formName.controls.country.value,
      //         formName.controls.state.value
      //       )
      //       .subscribe((cities) => {
      //         this.tempCities = cities.data[0].states.cities.map(
      //           (city) => city.name
      //         );
      //         formName.patchValue({
      //           city: city?.long_name ? city?.long_name : this.tempCities[0],
      //         });
      //       });
      //     this.mapClick = false;
      //   });
    }
    return;
  }
}
