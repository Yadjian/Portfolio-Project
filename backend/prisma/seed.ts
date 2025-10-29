import { PrismaClient, ContractType, ExperienceLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Initialiser le client Prisma
const prisma = new PrismaClient();

async function main() {
  console.log(`Début du script de seeding...`);

  // La liste des catégories de postes que vous voulez ajouter
  const jobCategoriesToCreate = [
    // Hôtellerie, Restauration, Tourisme, Vente
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

  // On transforme la liste de noms en objets pour createMany
  const dataToInsert = jobCategoriesToCreate.map(name => ({ name }));

  // On utilise createMany avec skipDuplicates pour ne pas créer de doublons
  // On utilise createMany pour insérer toutes les nouvelles catégories
  const result = await prisma.jobCategory.createMany({
    data: dataToInsert,
    skipDuplicates: true, // Très important ! Évite les erreurs si une catégorie existe déjà.
  });

  console.log(`Seeding terminé. ${result.count} nouvelles catégories ont été ajoutées.`);


  // Création d'un compte admin (sans profil candidat ni recruteur)
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
    console.log('✅ Compte admin créé: admin@mova.com (mot de passe: Test123!)');
  } else {
    console.log('ℹ️  Compte admin existe déjà: admin@mova.com');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());