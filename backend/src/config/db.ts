import colors from "colors";
import { prisma } from "./prisma";

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(colors.magenta.bold("PostgreSQL connected via Prisma"));
  } catch (error) {
    console.error(colors.bgRed("Error: No se pudo conectar a PostgreSQL"));
    console.error(colors.red(error));
    process.exit(1);
  }
};
