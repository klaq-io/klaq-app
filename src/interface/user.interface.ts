export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  stageName: string;
  birthDate: Date;
  isMailVerified: boolean;
  isPhoneNumberConfirmed: boolean;
  publicPhone: string;
  publicEmail: string;
  category: PerformingCategory;
  onboardingStatus: OnboardingStatus;
  logoUrl?: string;
  settings: Settings;
}

export enum PerformingCategory {
  DJ = "DJ",
  SINGER = "SINGER",
  MUSICIAN = "MUSICIAN",
  MUSIC_BAND = "MUSIC_BAND",
  DANCER = "DANCER",
  COMEDIAN = "COMEDIAN",
  MAGICIAN = "MAGICIAN",
  CLOWN = "CLOWN",
  EVENT_AGENCY = "EVENT_AGENCY",
  JUGGLER = "JUGGLER",
  FLORIST = "FLORIST",
  CARTOONIST = "CARTOONIST",
  SPEAKER = "SPEAKER",
  PHOTOGRAPHER = "PHOTOGRAPHER",
  VIDEOGRAPHER = "VIDEOGRAPHER",
  MAKEUP_ARTIST = "MAKEUP_ARTIST",
  HAIR_STYLIST = "HAIR_STYLIST",
  CATERER = "CATERER",
  BARTENDER = "BARTENDER",
  WAITER = "WAITER",
  CAR_RENTAL = "CAR_RENTAL",
  PHOTO_BOOTH = "PHOTO_BOOTH",
  PARTY_RENTAL = "PARTY_RENTAL",
  DRAG_QUEEN = "DRAG_QUEEN",
  WOOD_TOY = "WOOD_TOY",
  BALLOON_ARTIST = "BALLOON_ARTIST",
  FIREWORKS = "FIREWORKS",
  FIRE_EATER = "FIRE_EATER",
  ACROBAT = "ACROBAT",
  OTHER = "OTHER",
}

export enum OnboardingStatus {
  NOT_STARTED = "NOT_STARTED",
  COMPANY = "COMPANY",
  PERFORMER = "PERFORMER",
  OFFICE = "OFFICE",
  DONE = "DONE",
}

export interface Settings {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isChangelogNotificationEnabled: boolean;
  isNewDealNotificationEnabled: boolean;
  isMarketingNotificationEnabled: boolean;
  pricePerKm: number;
}
