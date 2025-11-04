import { PrismaClient, ContractType, ExperienceLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // List of job categories to seed
  const jobCategoriesToCreate = [
    'Serveur / Serveuse',
    'Cuisinier / Cuisinière',
    'Barman / Barmaid',
    'Commis de cuisine',
    'Plongeur / Plongeuse',
    'Employé polyvalent en restauration',
    'Réceptionniste',
    'Valet / Femme de chambre',
    'Vendeur / Vendeuse',
    'Animateur / Animatrice',
    'Moniteur de sports',
    'Plagiste',
    'Guide touristique',
    'Ouvrier agricole',
    'Croupier / Croupière',
    'Agent de sécurité',
    "Hôte / Hôtesse d'accueil",
    'Concierge',
    'Chauffeur / Chauffeuse',
  ];

  // Transform the list of names into objects for createMany
  const dataToInsert = jobCategoriesToCreate.map(name => ({ name }));

  // Insert all new categories, skipping duplicates
  await prisma.jobCategory.createMany({
    data: dataToInsert,
    skipDuplicates: true, // Prevents errors if a category already exists
  });

  // Create an admin account (without candidate or recruiter profile)
  const testPassword = await bcrypt.hash('Test123!', 10);
  const adminEmail = 'admin@mova.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: testPassword,
      },
    });
    // Admin account created
  }
  // If the admin already exists, do nothing
}

main()
  .catch(e => {
    // Log any error and exit with failure
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());