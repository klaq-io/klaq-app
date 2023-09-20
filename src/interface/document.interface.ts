import { User } from "./user.interface";

export interface Document {
  id: string;
  key: string;
  filename: string;
  tag: DocumentTag;
  size: string;
  owner: User;
}

export enum DocumentTag {
  INVOICE = "INVOICE",
  QUOTE = "QUOTE",
  LOGO = "LOGO",
  MOODBOARD = "MOODBOARD",
  BROCHURE = "brochure",
  OTHER = "other",
}
