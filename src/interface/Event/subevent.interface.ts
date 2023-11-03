export interface SubEvent {
  id: string;
  type: string;
  date: Date | string;
  arrivalTime?: string;
  startTime?: string;
  endTime?: string;
  guests?: number;
  publicEvent: boolean | string;
  address: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
}

export interface SubEventCreator {
  type: string;
  date: Date | string;
  arrivalTime?: string;
  startTime?: string;
  endTime?: string;
  guests?: number;
  publicEvent: boolean | string;
  address: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
}
