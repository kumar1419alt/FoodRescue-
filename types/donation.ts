export type FoodCategory =
  | "prepared_meal"
  | "produce"
  | "bakery"
  | "packaged_food"
  | "beverage"
  | "other";

export type DonationStatus =
  | "draft"
  | "submitted"
  | "matched"
  | "accepted"
  | "volunteer_assigned"
  | "safety_verified"
  | "picked_up"
  | "delivered"
  | "receipted"
  | "distributed"
  | "cancelled"
  | "expired"
  | "rejected";

export interface Donation {
  id: string;
  donorOrganizationId: string;
  ngoOrganizationId?: string;
  title: string;
  foodCategory: FoodCategory;
  estimatedServings: number;
  preparedAt: Date;
  pickupBy: Date;
  status: DonationStatus;
}
