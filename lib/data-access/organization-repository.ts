import type { PrismaClient } from "@/generated/prisma/client";

export function createOrganizationRepository(prisma: PrismaClient) {
  return {
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
}
