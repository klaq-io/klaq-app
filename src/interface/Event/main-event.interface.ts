import { Commentary } from "redux/Commentary/slices";
import { Customer } from "redux/Customer/slices";
import { User } from "redux/Login/slice";
import { SubEvent, SubEventCreator } from "./subevent.interface";
import { EventStatus } from "redux/Events/slices";
import { Invoice } from "interface/Invoice/invoice.interface";
import { Quote } from "interface/Quote/quote.interface";

export interface MainEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: EventStatus;
  budget?: number;
  note?: string;
  title: string;
  subEvents: SubEvent[];
  user: User;
  customer: Customer;
  quotes?: Quote[];
  commentaries?: Commentary[];
  invoices?: Invoice[];
}

export interface MainEventCreator {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: EventStatus;
  budget?: number;
  note?: string;
  title: string;
  subEvents: Partial<SubEventCreator>[];
  user: User;
  customer: Partial<Customer>;
  quotes?: Quote[];
  commentaries?: Commentary[];
}
