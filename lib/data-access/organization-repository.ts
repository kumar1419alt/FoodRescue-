import "server-only";

import { prisma } from "@/lib/data-access/prisma";

export const organizationRepository = {
  findBySlug(slug: string) {
    return prisma.organization.findUnique({
      where: { slug },
      include: { verification: true },
    });
  },
  findVerifiedNgos() {
    return prisma.organization.findMany({
      where: { type: "ngo", verification: { is: { status: "approved" } } },
      orderBy: { name: "asc" },
    });
  },
};
