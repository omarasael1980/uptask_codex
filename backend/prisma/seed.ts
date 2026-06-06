import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/utils/Auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await hashPassword("501680");
  const email = "asaelmontieldev@gmail.com";

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "OMAR ASAEL HERNANDEZ MONTIEL",
      password,
      confirmed: true,
    },
    create: {
      name: "OMAR ASAEL HERNANDEZ MONTIEL",
      email,
      password,
      confirmed: true,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "seed-uptask-project" },
    update: {
      managerId: user.id,
    },
    create: {
      id: "seed-uptask-project",
      projectName: "UPTASK INTERNO",
      clientName: "EQUIPO INTERNO",
      projectDescription: "PROYECTO BASE PARA OPERACION Y PRUEBAS",
      managerId: user.id,
      tasks: {
        create: [
          {
            name: "DEFINIR MODELO DE COSTOS",
            description: "PREPARAR CAMPOS DE COSTOS PARA TAREAS FACTURABLES",
          },
          {
            name: "CREAR FLUJO DE INVOICES",
            description: "SELECCIONAR TAREAS Y GENERAR INVOICE INTERNO",
          },
        ],
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      email: "omar@asaelmontieldev.com",
      managedProjects: { none: {} },
      memberships: { none: {} },
      notes: { none: {} },
      completedTasks: { none: {} },
    },
  });

  console.log(`Seed listo: ${user.email} / proyecto ${project.projectName}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
