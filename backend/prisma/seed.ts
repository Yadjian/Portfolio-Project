import { PrismaClient, ContractType, ExperienceLevel } from '@prisma/client';

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

  // Création des entreprises
  console.log('\n🏢 Création des entreprises...');

  const companies = [
    { name: 'Kévin Moov\'', siret: '12345678901234' },
    { name: 'Boutique Marc Jean', siret: '23456789012345' },
    { name: 'Monaco Palace Hotel', siret: '34567890123456' },
    { name: 'Restaurant Le Gourmet', siret: '45678901234567' },
    { name: 'Hôtel Riviera', siret: '56789012345678' },
    { name: 'Boutique Chic Cannes', siret: '67890123456789' },
  ];

  const createdCompanies = [];
  for (const companyData of companies) {
    const existingCompany = await prisma.company.findUnique({ where: { siret: companyData.siret } });
    if (!existingCompany) {
      const company = await prisma.company.create({
        data: companyData,
      });
      createdCompanies.push(company);
      console.log(`✅ Entreprise créée: ${company.name}`);
    } else {
      createdCompanies.push(existingCompany);
      console.log(`ℹ️  Entreprise existante: ${existingCompany.name}`);
    }
  }

  console.log('✨ Création des entreprises terminée !');

  // Créer des profils de test complets
  console.log('\n� Création des profils de test...');
  
  const bcrypt = require('bcrypt');
  const testPassword = await bcrypt.hash('Test123!', 10);

  // Créer 6 recruteurs complets (MVP: 1 seul ContractType par profil)
  const testRecruiters = [
    {
      email: 'kevin.sport@gmail.com',
      password: testPassword,
      firstName: 'Kévin',
      lastName: 'Patou',
      location: { lat: 43.5528, lon: 7.0174, name: 'Cannes, France' },
      searchDescription: 'Moniteur de sports\n\nRejoignez l\'équipe de Kévin moov\' pour démarrer une nouvelle carrière et partager votre passion du sport !',
      companyName: 'Kévin Moov\'',
      desiredContractTypes: [ContractType.CDD],
      desiredExperienceLevel: 'DEBUTANT' as ExperienceLevel,
    },
    {
      email: 'marc.jean@gmail.com',
      password: testPassword,
      firstName: 'Marc',
      lastName: 'Jean',
      location: { lat: 43.5808, lon: 7.1239, name: 'Antibes, France' },
      searchDescription: 'Vendeur / Vendeuse\n\nRejoignez une équipe dynamique et boostez votre carrière dans la vente !',
      companyName: 'Boutique Marc Jean',
      desiredContractTypes: [ContractType.CDI],
      desiredExperienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'fred.petit@gmail.com',
      password: testPassword,
      firstName: 'Fred',
      lastName: 'Petit',
      location: { lat: 43.7384, lon: 7.4246, name: 'Monaco' },
      searchDescription: 'Agent de sécurité\n\nGarantissez la sécurité de demain, rejoignez notre équipe d\'agents de sécurité !',
      companyName: 'Monaco Palace Hotel',
      desiredContractTypes: [ContractType.ALTERNANCE],
      desiredExperienceLevel: 'INTERMEDIAIRE' as ExperienceLevel,
    },
    {
      email: 'recruteur.sophia@mova.com',
      password: testPassword,
      firstName: 'Sophie',
      lastName: 'Moreau',
      location: { lat: 43.4832, lon: 6.9385, name: 'Grasse, France' },
      searchDescription: 'Cuisinier / Cuisinière\n\nNous recherchons des talents pour notre restaurant gastronomique. Rejoignez une équipe passionnée !',
      companyName: 'Restaurant Le Gourmet',
      desiredContractTypes: [ContractType.CDI],
      desiredExperienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'recruteur.monaco@mova.com',
      password: testPassword,
      firstName: 'Alexandre',
      lastName: 'Dubois',
      location: { lat: 43.5752, lon: 6.7352, name: 'Fréjus, France' },
      searchDescription: 'Réceptionniste\n\nHôtel de luxe cherche personnel qualifié pour offrir une expérience exceptionnelle à nos clients.',
      companyName: 'Hôtel Riviera',
      desiredContractTypes: [ContractType.CDD],
      desiredExperienceLevel: 'DEBUTANT' as ExperienceLevel,
    },
    {
      email: 'recruteur.cannes@mova.com',
      password: testPassword,
      firstName: 'Marie',
      lastName: 'Petit',
      location: { lat: 43.7102, lon: 7.2620, name: 'Nice, France' },
      searchDescription: 'Vendeur / Vendeuse\n\nBoutique de luxe recherche vendeurs passionnés avec un excellent sens du service client.',
      companyName: 'Boutique Chic Cannes',
      desiredContractTypes: [ContractType.CDI],
      desiredExperienceLevel: 'CONFIRME' as ExperienceLevel,
    },
  ];

  for (const recruiterData of testRecruiters) {
    const existingUser = await prisma.user.findUnique({ where: { email: recruiterData.email } });
    
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: recruiterData.email,
          password: recruiterData.password,
        },
      });

      const locationWKT = `POINT(${recruiterData.location.lon} ${recruiterData.location.lat})`;
      
      const recruiterProfile = await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          firstName: recruiterData.firstName,
          lastName: recruiterData.lastName,
          locationWKT: locationWKT,
          locationName: recruiterData.location.name,
          searchDescription: recruiterData.searchDescription,
          desiredContractTypes: recruiterData.desiredContractTypes,
          desiredExperienceLevel: recruiterData.desiredExperienceLevel,
        },
      });

      // Associer à l'entreprise
      const company = createdCompanies.find(c => c.name === recruiterData.companyName);
      if (company) {
        await prisma.recruiterMembership.create({
          data: {
            recruiterId: recruiterProfile.id,
            companyId: company.id,
            internalRole: 'Recruteur',
          },
        });
        console.log(`✅ Recruteur créé: ${recruiterData.firstName} ${recruiterData.lastName} (${company.name})`);
      }
    } else {
      console.log(`ℹ️  Recruteur existe déjà: ${recruiterData.email}`);
    }
  }

  // Créer 3 candidats de test avec profils complets (MVP: 1 seul ContractType par profil)
  const testCandidates = [
    {
      email: 'candidat.thomas@mova.com',
      password: testPassword,
      firstName: 'Thomas',
      lastName: 'Bernard',
      location: { lat: 43.5752, lon: 6.7352, name: 'Fréjus, France' },
      desiredJobTitle: 'Serveur / Serveuse',
      resumeUrl: 'https://example.com/cv-thomas.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      coverLetterText: 'Dynamique et motivé, je recherche un poste de serveur pour mettre mes compétences au service de votre établissement.',
      desiredContractTypes: [ContractType.CDI],
      experienceLevel: 'DEBUTANT' as ExperienceLevel,
    },
    {
      email: 'candidat.emma@mova.com',
      password: testPassword,
      firstName: 'Emma',
      lastName: 'Rousseau',
      location: { lat: 43.4832, lon: 6.9385, name: 'Grasse, France' },
      desiredJobTitle: 'Vendeur / Vendeuse',
      resumeUrl: 'https://example.com/cv-emma.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      coverLetterText: 'Passionnée par la mode et le contact client, je souhaite rejoindre une boutique dynamique.',
      desiredContractTypes: [ContractType.CDD],
      experienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'candidat.julie@mova.com',
      password: testPassword,
      firstName: 'Julie',
      lastName: 'Lambert',
      location: { lat: 43.7102, lon: 7.2620, name: 'Nice, France' },
      desiredJobTitle: 'Réceptionniste',
      resumeUrl: 'https://example.com/cv-julie.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      coverLetterText: 'Souriante et organisée, je souhaite mettre mes compétences au service de votre établissement hôtelier.',
      desiredContractTypes: [ContractType.ALTERNANCE],
      experienceLevel: 'INTERMEDIAIRE' as ExperienceLevel,
    },
  ];

  for (const candidateData of testCandidates) {
    const existingUser = await prisma.user.findUnique({ where: { email: candidateData.email } });
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: candidateData.email,
          password: candidateData.password,
        },
      });

      const locationWKT = `POINT(${candidateData.location.lon} ${candidateData.location.lat})`;
      
      await prisma.candidateProfile.create({
        data: {
          userId: user.id,
          firstName: candidateData.firstName,
          lastName: candidateData.lastName,
          locationWKT: locationWKT,
          locationName: candidateData.location.name,
          searchRadiusKm: 50,
          desiredJobTitle: candidateData.desiredJobTitle,
          resumeUrl: candidateData.resumeUrl,
          photoUrl: candidateData.photoUrl,
          coverLetterText: candidateData.coverLetterText,
          desiredContractTypes: candidateData.desiredContractTypes,
          experienceLevel: candidateData.experienceLevel,
        },
      });

      console.log(`✅ Candidat créé: ${candidateData.firstName} ${candidateData.lastName} (${candidateData.desiredJobTitle})`);
    } else {
      console.log(`ℹ️  Candidat existe déjà: ${candidateData.email}`);
    }
  }

  console.log('🎉 Tous les profils de test ont été créés !');
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