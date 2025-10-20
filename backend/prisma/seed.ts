import { PrismaClient } from '@prisma/client';

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