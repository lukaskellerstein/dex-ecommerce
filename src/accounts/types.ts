export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  postcode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  wishlist: string[];
}
