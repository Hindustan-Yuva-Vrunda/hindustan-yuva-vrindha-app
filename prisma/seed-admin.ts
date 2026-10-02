import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@hyv.com";
  const password = "admin@hyv123";

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name: "admin",
      email,
      phone: "9999999999",
      password: hashedPassword,
      role: "ADMIN",
      status: "APPROVED",
    },
  });

  console.log("================================");
  console.log("ADMIN CREATED SUCCESSFULLY");
  console.log("================================");
  console.log("Name:", admin.name);
  console.log("Email:", admin.email);
  console.log("Role:", admin.role);
  console.log("Status:", admin.status);
}

main()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });