import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { createDonationRepository } from "@/lib/data-access/donation-repository";
import { createOrganizationRepository } from "@/lib/data-access/organization-repository";
import { getTestDatabaseUrl } from "@/prisma/test-database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const hasTestDatabase = Boolean(process.env.DATABASE_TEST_URL);

describe.skipIf(!hasTestDatabase)("PostgreSQL integration", () => {
  let prisma: PrismaClient;
  let donorOrganizationId: string;
  let ngoOrganizationId: string;
  let pickupLocationId: string;
  let donationId: string;
  let donationMatchId: string;
  const suffix = `integration-${Date.now()}`;
  const donorSlug = `donor-${suffix}`;
  const ngoSlug = `ngo-${suffix}`;

  beforeAll(async () => {
    const connectionString = getTestDatabaseUrl();
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

    await prisma.$connect();

    const donor = await prisma.organization.create({
      data: { name: "Integration Donor", slug: donorSlug, type: "restaurant" },
    });
    donorOrganizationId = donor.id;

    const pickupLocation = await prisma.donorLocation.create({
      data: {
        organizationId: donor.id,
        label: "Integration pickup",
        addressLine1: "1 Test Lane",
        city: "Testville",
        countryCode: "IN",
      },
    });
    pickupLocationId = pickupLocation.id;

    const ngo = await prisma.organization.create({
      data: {
        name: "Integration NGO",
        slug: ngoSlug,
        type: "ngo",
        verification: { create: { status: "approved" } },
      },
    });
    ngoOrganizationId = ngo.id;

    const donation = await prisma.donation.create({
      data: {
        donorOrganizationId,
        pickupLocationId,
        title: "Integration meal",
        foodCategory: "prepared_meal",
        estimatedServings: 12,
        preparedAt: new Date(),
        pickupBy: new Date(Date.now() + 60 * 60 * 1000),
        status: "submitted",
      },
    });
    donationId = donation.id;

    const match = await prisma.donationMatch.create({
      data: { donationId, ngoId: ngoOrganizationId },
    });
    donationMatchId = match.id;
  });

  afterAll(async () => {
    if (!prisma) return;

    await prisma.donationMatch.deleteMany({ where: { id: donationMatchId } });
    await prisma.donation.deleteMany({ where: { id: donationId } });
    await prisma.donorLocation.deleteMany({ where: { id: pickupLocationId } });
    await prisma.verification.deleteMany({ where: { organizationId: ngoOrganizationId } });
    await prisma.organization.deleteMany({ where: { id: { in: [donorOrganizationId, ngoOrganizationId] } } });
    await prisma.$disconnect();
  });

  it("persists Prisma CRUD records and repository queries", async () => {
    const donationRepository = createDonationRepository(prisma);
    const organizationRepository = createOrganizationRepository(prisma);

    const donation = await donationRepository.findById(donationId);
    expect(donation).toMatchObject({ id: donationId, pickupLocation: { id: pickupLocationId } });
    expect(donation?.matches).toHaveLength(1);

    const verifiedNgos = await organizationRepository.findVerifiedNgos();
    expect(verifiedNgos.map((organization) => organization.id)).toContain(ngoOrganizationId);

    const updated = await prisma.donation.update({
      where: { id: donationId },
      data: { status: "matched" },
    });
    expect(updated.status).toBe("matched");
    await expect(prisma.donation.findUnique({ where: { id: donationId } })).resolves.toMatchObject({ status: "matched" });
  });

  it("enforces uniqueness and required foreign keys", async () => {
    await expect(
      prisma.organization.create({ data: { name: "Duplicate donor", slug: donorSlug, type: "restaurant" } }),
    ).rejects.toMatchObject({ code: "P2002" });

    await expect(
      prisma.donorLocation.create({
        data: {
          organizationId: "missing-organization",
          label: "Invalid location",
          addressLine1: "1 Test Lane",
          city: "Testville",
          countryCode: "IN",
        },
      }),
    ).rejects.toMatchObject({ code: "P2003" });
  });

  it("rolls back failed transactions without persisting records", async () => {
    const email = `${suffix}@example.test`;

    await expect(
      prisma.$transaction(async (transaction) => {
        await transaction.user.create({
          data: { email, displayName: "Rollback User", role: "volunteer" },
        });
        throw new Error("Force a rollback");
      }),
    ).rejects.toThrow("Force a rollback");

    await expect(prisma.user.findUnique({ where: { email } })).resolves.toBeNull();
  });

  it("prevents deletion of a donation while operational history exists", async () => {
    await expect(prisma.donation.delete({ where: { id: donationId } })).rejects.toMatchObject({ code: "P2003" });
  });
});
