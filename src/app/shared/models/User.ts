export class User {
  id!: string;
  email!: string;
  firstName!: string;
  lastName? : string;
  addressId!: number;
  token!: string;
  isAdmin!: boolean;
  favorites!: number[];
}

export enum AddressTypeEnum {
  USER = 'USER',
  ORDER = 'ORDER',
}

export class Address {
  type!: AddressTypeEnum;
  addressLine1!: string;
  addressLine2?: string | null;
  city!: string;
  state!: string;
  zipCode!: number;
  country!: string;
  lat!: number;
  lng!: number;
  createdAt?: string;
  updatedAt?: string;
}

