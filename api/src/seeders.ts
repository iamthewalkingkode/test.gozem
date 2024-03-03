import { PrismaClient, UserType } from "@prisma/client";
import { helpers } from "@/utils";

const prisma = new PrismaClient();

const run = async () => {
  console.log("--->>>>>>> seeding: default admin user");
  try {
    await prisma.users.create({
      data: {
        id: helpers.customUuid("anchoratechs@gmail.com"),
        type: UserType.ADMIN,
        name: "TriPadi Admin",
        email: "anchoratechs@gmail.com",
        msisdn: "+233208125139",
        password: helpers.encryptPassword("&PvRd2EaX1o5"),
      },
    });
  } catch (e) {}
};

run();
