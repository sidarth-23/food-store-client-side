export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegisterOrUpdate {
  firstName: string;
  lastName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  lat: number;
  lng: number;
}

export interface IPassChange {
  password: string;
}

export interface ICreateOrder {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  lat: number;
  lng: number;
}
