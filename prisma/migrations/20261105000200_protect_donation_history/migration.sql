-- Preserve operational donation history instead of cascading it away when a
-- donation deletion is attempted.
ALTER TABLE "DonationMatch" DROP CONSTRAINT "DonationMatch_donationId_fkey";
ALTER TABLE "VolunteerAssignment" DROP CONSTRAINT "VolunteerAssignment_donationId_fkey";
ALTER TABLE "FoodSafetyInspection" DROP CONSTRAINT "FoodSafetyInspection_donationId_fkey";
ALTER TABLE "Transport" DROP CONSTRAINT "Transport_donationId_fkey";

ALTER TABLE "DonationMatch"
  ADD CONSTRAINT "DonationMatch_donationId_fkey"
  FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "VolunteerAssignment"
  ADD CONSTRAINT "VolunteerAssignment_donationId_fkey"
  FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "FoodSafetyInspection"
  ADD CONSTRAINT "FoodSafetyInspection_donationId_fkey"
  FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Transport"
  ADD CONSTRAINT "Transport_donationId_fkey"
  FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
