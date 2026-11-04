import "server-only";

import { prisma } from "@/lib/data-access/prisma";

export const donationRepository = {
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
