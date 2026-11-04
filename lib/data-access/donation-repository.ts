import type { PrismaClient } from "@/generated/prisma/client";

export function createDonationRepository(prisma: PrismaClient) {
  return {
    findById(id: string) {
      return prisma.donation.findUnique({
        where: { id },
        include: { donorOrganization: true, pickupLocation: true, matches: true },
      });
    },
    findOpenForMatching() {
      return prisma.donation.findMany({
        where: { status: { in: ["submitted", "matched"] } },
        orderBy: { pickupBy: "asc" },
        include: { pickupLocation: true },
      });
    },
  };
}
