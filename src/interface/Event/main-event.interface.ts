import { Commentary } from "redux/Commentary/slices";
import { Customer } from "redux/Customer/slices";
import { User } from "redux/Login/slice";
import { Quote } from "redux/Quote/slices";
import { SubEvent } from "./subevent.interface";
import { EventStatus } from "redux/Events/slices";

export interface MainEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: EventStatus;
  title: string;
  subEvents: SubEvent[];
  user: User;
  customer: Partial<Customer>;
  quotes?: Quote[];
  commentaries?: Commentary[];
}
