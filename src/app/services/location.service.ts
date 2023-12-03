import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GET_ADDRESS_FROM_COORDINATES,
  GET_CITY_NAMES_IN_STATE,
  GET_COUNTRY_LIST,
  GET_LOCATION_FROM_COORDINATES,
  GET_STATE_LIST,
} from '../shared/constants/urls';
import { AddressFromCoordinates } from '../shared/interfaces/users/response.interface';
import { LatLngLiteral } from 'leaflet';
import { Observable, tap } from 'rxjs';
import { countries } from '../shared/constants/country-names.data';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  latLngStore!: LatLngLiteral

  constructor(private http: HttpClient) {
  }

  getCountryList() {
    return this.http.get<{ name: string }[]>(GET_COUNTRY_LIST);
  }

  getCountryFromMyArray() {
    return countries.map((country) => country.name);
  }

  getStateList(country: string) {
    return this.http.get<
      { success: Boolean; data: { states: { name: string }[] }[] }
    >(`${GET_STATE_LIST}?country=${country}`);
  }

  getCityList(country: string, state: string) {
    return this.http.get< { success: Boolean; data: { states: { cities: {name:string}[] } }[] }>(
      `${GET_CITY_NAMES_IN_STATE}?country=${country}&state=${state}`
    );
  }

  getAddressFromCoordinates(lat: number, lng: number) {
    return this.http.get<AddressFromCoordinates>(`${GET_ADDRESS_FROM_COORDINATES}?lat=${lat}&lng=${lng}`)
  }

  getCoordinatesFromAddress(address: string) {
    return this.http.get<AddressFromCoordinates>(`${GET_LOCATION_FROM_COORDINATES}?address=${address}`)
  }

  getCurrentLocation(): Observable<LatLngLiteral> {
    return new Observable((observer) => {
      if (!navigator.geolocation) return;

      return navigator.geolocation.getCurrentPosition((pos) => {
        observer.next({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    });
  }
}
