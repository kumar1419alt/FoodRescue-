import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";

if (process.env.NODE_ENV === "production") {
  throw new Error("Seeding is disabled in production.");
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed a local development database.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  await prisma.organization.upsert({
    where: { slug: "harbor-community-kitchen" },
    update: { name: "Harbor Community Kitchen", type: "ngo" },
    create: {
      name: "Harbor Community Kitchen",
      slug: "harbor-community-kitchen",
      type: "ngo",
      verification: { create: { status: "pending", notes: "Fictional local-development record." } },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
