import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$transaction(async (tx) => {
    const john = await tx.user.create({
      data: {
        email: 'john.doe@mail.com',
        firstname: 'John',
        fatherLastname: 'Doe',
        motherLastname: 'Doe',
        role: 'USER',
        celphone: '73036461',
        identityCard: '123456789',
      },
    });

    const jane = await tx.user.create({
      data: {
        email: 'jane.doe@mail.com',
        firstname: 'Jane',
        fatherLastname: 'Doe',
        motherLastname: 'Doe',
        role: 'USER',
        celphone: '73036462',
        identityCard: '987654321',
      },
    });

    const organization = await tx.organization.create({
      data: {
        name: 'Organization',
        memberships: {
          create: [
            { userId: john.id },
            { userId: jane.id },
          ],
        },
      },
    });

    return { john, jane, organization };
  });

  console.log(result.john, result.jane, result.organization);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
