import { Coordinates } from './coordinates.interface';

export interface RetrieveAddress {
  coordinates: Coordinates;
  address: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  full_address: string;
}
