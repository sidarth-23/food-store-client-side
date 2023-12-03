import { Address, User } from '../../models/User';

export interface IUserRes {
  success: boolean;
  data: IUserData;
}

export interface IGetUser {
  success: boolean;
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    addressId: number;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    Address: Address
  };
}

export class IUserData {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  address!: Address;
  isAdmin!: boolean;
  token!: string;
}

export interface IUserUpdatedPassword {
  success: boolean;
  data: {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    addressId: number;
    isAdmin: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface IUserFavourites {
  success: boolean;
  message: { id: number; userId: number; Food: IFoodObject; createdAt: string }[];
}

export interface IUserCart {
  success: boolean;
  data: {
    id: number;
    userId: number;
    foodId: number;
    quantity: number;
    Food: IFoodObject;
    createdAt: string;
  }[];
}

export interface IFoodObject {
  id: number;
  name: string;
  price: number;
  stars: number;
  imageUrl: string;
  cookTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderSummary {
  orderId: number;
  name: string;
  address: Address;
  createdAt: string;
  orderedItems: {
    foodName: string;
    price: number;
    quantity: number;
  }[];
  status: string;
  totalPrice: string;
}

export interface IUserOrders {
  success: boolean;
  data: {
    orderId: number;
    name: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    orderedItems: {
      foodName: string;
      price: number;
      quantity: number;
    };
    address: Address;
  }[];
}

export interface IUserCreateOrder {
  id: number;
  orderedItem: {
    id: number;
    orderId: number;
    foodName: string;
    price: number;
    quantity: number;
    createdAt: string;
  }[];
  totalPrice: number;
  address: Address;
  status: string;
  user: number;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorMessage {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export interface AddressFromCoordinates {
  success: true;
  data: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type: string;
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
    place_id: string;
    types: string[];
  };
}

export interface CityData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Geocoding {
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  results: Result[];
  status: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  bounds: {
    northeast: LatLng;
    southwest: LatLng;
  };
  location: LatLng;
  location_type: string;
  viewport: {
    northeast: LatLng;
    southwest: LatLng;
  };
}
