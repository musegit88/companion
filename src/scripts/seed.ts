const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Famous People" },
        { name: "Scientists" },
        { name: "Athletes" },
        { name: "Anime" },
        { name: "Movie&Tv" },
        { name: "Movie&Tv" },
      ],
    });
  } catch (error) {
    console.log("Error sedding categories", error);
  } finally {
    await db.$disconnect();
  }
}

main();
