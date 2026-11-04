import type { DonationStatus, FoodCategory } from "@/types/donation";

export const FOOD_CATEGORIES = [
  "prepared_meal",
  "produce",
  "bakery",
  "packaged_food",
  "beverage",
  "other",
] as const satisfies readonly FoodCategory[];

export const DONATION_STATUS_LABELS: Record<DonationStatus, string> = {
  draft: "Draft",
  submitted: "Awaiting NGO match",
  matched: "Matched",
  accepted: "Accepted by NGO",
  volunteer_assigned: "Volunteer assigned",
  safety_verified: "Safety verified",
  picked_up: "Picked up",
  delivered: "Delivered to NGO",
  receipted: "Receipt recorded",
  distributed: "Beneficiaries served",
  cancelled: "Cancelled",
  expired: "Expired",
  rejected: "Rejected",
};

export const DONATION_TRANSITIONS: Record<DonationStatus, readonly DonationStatus[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["matched", "cancelled", "expired"],
  matched: ["accepted", "rejected", "cancelled", "expired"],
  accepted: ["volunteer_assigned", "cancelled"],
  volunteer_assigned: ["safety_verified", "cancelled"],
  safety_verified: ["picked_up", "cancelled"],
  picked_up: ["delivered"],
  delivered: ["receipted"],
  receipted: ["distributed"],
  distributed: [],
  cancelled: [],
  expired: [],
  rejected: [],
};
