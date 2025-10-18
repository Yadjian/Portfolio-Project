import { PrismaClient } from '@prisma/client';

// Initialiser le client Prisma
const prisma = new PrismaClient();

async function main() {
  console.log(`Début du script de seeding...`);

  // La liste des catégories de postes que vous voulez ajouter
  const jobCategoriesToCreate = [
    // Postes saisonniers d'été
    'Serveur / Serveuse',
    'Plagiste',
    'Animateur / Animatrice',
    'Moniteur de sports nautiques',
    'Vendeur / Vendeuse',
    'Glacier / Vendeur de glaces',
    'Employé polyvalent en hôtellerie',
    'Guide touristique',
    'Ouvrier agricole / Cueilleur',
    "Hôte d'accueil en événementiel",
    'Barman / Barmaid',

    // Postes saisonniers d'hiver
    'Moniteur de ski / snowboard',
    'Employé de remontées mécaniques',
    'Vendeur / Loueur de matériel de ski',
    "Cuisinier / Commis de cuisine en station",

    // Autres catégories générales
    'Développement Web',
    'Marketing Digital',
    'Design UX/UI',
    'Data Science',
    'Gestion de projet',
  ];

  // On transforme la liste de noms en objets pour createMany
  const dataToInsert = jobCategoriesToCreate.map(name => ({ name }));

  // On utilise createMany avec skipDuplicates pour ne pas créer de doublons
  const result = await prisma.jobCategory.createMany({
    data: dataToInsert,
    skipDuplicates: true, // Très important ! Évite les erreurs si une catégorie existe déjà.
  });

  console.log(`Seeding terminé. ${result.count} nouvelles catégories ont été ajoutées.`);
}

main()
  .catch(e => {
    console.error(e);
    // Renvoyer l'erreur pour que le processus se termine avec un code d'échec
    throw e;
  })
  .finally(async () => {
    // Fermer la connexion à la base de données
    await prisma.$disconnect();
  });