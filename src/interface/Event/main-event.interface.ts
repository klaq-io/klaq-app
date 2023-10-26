import { Commentary } from "redux/Commentary/slices";
import { Customer } from "redux/Customer/slices";
import { User } from "redux/Login/slice";
import { Quote } from "redux/Quote/slices";
import { SubEvent } from "./subevent.interface";

export interface MainEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  title: string;
  subEvents: SubEvent[];
  user: User;
  customer: Partial<Customer>;
  quotes?: Quote[];
  commentaries?: Commentary[];
}
