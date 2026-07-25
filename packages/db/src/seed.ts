import { ROLE_NAMES, DEFAULT_TENANT_NAME } from "@brightpath/types";
import { prisma } from "./index.js";

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { name: DEFAULT_TENANT_NAME },
    update: {},
    create: { name: DEFAULT_TENANT_NAME, type: "direct" },
  });

  for (const name of ROLE_NAMES) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`Seeded tenant "${tenant.name}" and ${ROLE_NAMES.length} roles.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
