import { prisma } from "./index.js";

async function main() {
  // No models yet — the first feature that adds one also adds its seed fixtures here.
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
