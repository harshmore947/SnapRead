import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "test@example.com";
  const password = "Password123!";
  const name = "Test User";

  console.log(`Seeding user: ${email}...`);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      emailVerified: new Date(),
      status: true,
    },
    create: {
      email,
      name,
      password: hashedPassword,
      emailVerified: new Date(),
      status: true,
    },
  });

  console.log("✅ User seeded successfully!");
  console.log(`ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
