import { PrismaClient, ContractType, ExperienceLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Début du script de seeding...`);

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

  const dataToInsert = jobCategoriesToCreate.map(name => ({ name }));

  const result = await prisma.jobCategory.createMany({
    data: dataToInsert,
    skipDuplicates: true,
  });

  console.log(`Seeding terminé. ${result.count} nouvelles catégories ont été ajoutées.`);

  console.log('Création des entreprises...');

  const companies = [
    { name: 'Kévin Moov\'', siret: '12345678901234' },
    { name: 'Boutique Marc Jean', siret: '23456789012345' },
    { name: 'Monaco Palace Hotel', siret: '34567890123456' },
    { name: 'Restaurant Le Gourmet', siret: '45678901234567' },
    { name: 'Hôtel Riviera', siret: '56789012345678' },
    { name: 'Boutique Chic Cannes', siret: '67890123456789' },
    { name: 'Le Grand Hôtel', siret: '78901234567890' },
  ];

  const createdCompanies = [];
  for (const companyData of companies) {
    const existingCompany = await prisma.company.findUnique({ where: { siret: companyData.siret } });
    if (!existingCompany) {
      const company = await prisma.company.create({
        data: companyData,
      });
      createdCompanies.push(company);
      console.log(`Entreprise créée: ${company.name}`);
    } else {
      createdCompanies.push(existingCompany);
      console.log(`Entreprise existante: ${existingCompany.name}`);
    }
  }

  console.log('Création des entreprises terminée !');

  console.log('Création des profils de test...');
  
  const bcrypt = require('bcrypt');
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
    console.log('Compte admin créé: admin@mova.com (mot de passe: Test123!)');
  } else {
    console.log('Compte admin existe déjà: admin@mova.com');
  }

  const testRecruiters = [
    {
      email: 'kevin.sport@gmail.com',
      password: testPassword,
      firstName: 'Kévin',
      lastName: 'Patou',
      location: { lat: 43.4332, lon: 6.7378, name: 'Fréjus, France' },
      searchDescription: 'Chauffeur / Chauffeuse\n\nKévin Moov\' recherche des chauffeurs VTC motivés ! Rejoignez notre équipe dynamique et bénéficiez d\'une grande flexibilité horaire. Nous offrons des conditions attractives : véhicules récents, secteurs touristiques privilégiés et accompagnement personnalisé. Permis B requis.',
      companyName: 'Kévin Moov\'',
      desiredContractTypes: [ContractType.CDD],
      desiredExperienceLevel: 'DEBUTANT' as ExperienceLevel,
    },
    {
      email: 'marc.jean@gmail.com',
      password: testPassword,
      firstName: 'Marc',
      lastName: 'Jean',
      location: { lat: 43.4255, lon: 6.7321, name: 'Saint-Raphaël, France' },
      searchDescription: 'Vendeur / Vendeuse\n\nBoutique de prêt-à-porter recherche vendeurs passionnés ! Vous évoluerez dans un cadre prestigieux sur le port de Saint-Raphaël. Nous recherchons des profils dynamiques avec un excellent sens du contact client et une sensibilité pour la mode haut de gamme.',
      companyName: 'Boutique Marc Jean',
      desiredContractTypes: [ContractType.CDI],
      desiredExperienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'fred.petit@gmail.com',
      password: testPassword,
      firstName: 'Fred',
      lastName: 'Petit',
      location: { lat: 43.4520, lon: 6.6180, name: 'Puget-sur-Argens, France' },
      searchDescription: 'Serveur / Serveuse\n\nLe restaurant La Table du Puget recherche des serveurs dynamiques ! Vous travaillerez dans un cadre convivial avec une vue sur l\'Argens. Nous valorisons le professionnalisme, la bonne humeur et le service de qualité. Formation interne assurée.',
      companyName: 'Monaco Palace Hotel',
      desiredContractTypes: [ContractType.ALTERNANCE],
      desiredExperienceLevel: 'INTERMEDIAIRE' as ExperienceLevel,
    },
    {
      email: 'recruteur.sophia@mova.com',
      password: testPassword,
      firstName: 'Sophie',
      lastName: 'Moreau',
      location: { lat: 43.4447, lon: 6.6375, name: 'Roquebrune-sur-Argens, France' },
      searchDescription: 'Cuisinier / Cuisinière\n\nRestaurant gastronomique Le Gourmet recherche un cuisinier talentueux ! Rejoignez notre brigade dans un cadre exceptionnel à Roquebrune. Nous valorisons la créativité, les produits frais locaux et l\'esprit d\'équipe. Évoluez dans un environnement stimulant.',
      companyName: 'Restaurant Le Gourmet',
      desiredContractTypes: [ContractType.CDI],
      desiredExperienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'recruteur.monaco@mova.com',
      password: testPassword,
      firstName: 'Alexandre',
      lastName: 'Dubois',
      location: { lat: 43.3078, lon: 6.7731, name: 'Sainte-Maxime, France' },
      searchDescription: 'Réceptionniste\n\nHôtel 4 étoiles recherche réceptionniste bilingue ! Situé en plein cœur de Sainte-Maxime, notre établissement accueille une clientèle internationale exigeante. Vous serez le premier contact avec nos clients et incarnerez l\'image de notre hôtel en évoluant dans un cadre prestigieux.',
      companyName: 'Hôtel Riviera',
      desiredContractTypes: [ContractType.CDD],
      desiredExperienceLevel: 'DEBUTANT' as ExperienceLevel,
    },
    {
      email: 'recruteur.cannes@mova.com',
      password: testPassword,
      firstName: 'Marie',
      lastName: 'Petit',
      location: { lat: 43.4475, lon: 6.5689, name: 'Le Muy, France' },
      searchDescription: 'Vendeur / Vendeuse\n\nBoutique de luxe recherche vendeurs passionnés avec un excellent sens du service client ! Rejoignez notre boutique au cœur du Muy. Nous vous offrons un environnement stimulant, des produits d\'exception et une clientèle internationale exigeante.',
      companyName: 'Boutique Chic Cannes',
      desiredContractTypes: [ContractType.CDI],
      desiredExperienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'recruteur.test@mova.com',
      password: testPassword,
      firstName: 'Lucas',
      lastName: 'Dubois',
      location: { lat: 43.4125, lon: 6.7458, name: 'Fréjus, France' },
      searchDescription: 'Réceptionniste\n\nLe Grand Hôtel de Fréjus recherche un réceptionniste expérimenté pour accueillir notre clientèle internationale. Vous serez le visage de notre établissement 4 étoiles. Maîtrise du français et de l\'anglais indispensable, une troisième langue serait un plus.',
      companyName: 'Le Grand Hôtel',
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

      const categoryName = recruiterData.searchDescription.split('\n\n')[0].trim();
      console.log(`Recherche de la catégorie: "${categoryName}" pour ${recruiterData.firstName}`);
      const category = await prisma.jobCategory.findFirst({
        where: { name: categoryName }
      });

      if (category) {
        console.log(`Catégorie trouvée: ${category.name} (ID: ${category.id})`);
        await prisma.recruiterProfile.update({
          where: { id: recruiterProfile.id },
          data: {
            searchedCategories: {
              connect: { id: category.id }
            }
          }
        });
      } else {
        console.log(`Catégorie "${categoryName}" NON TROUVÉE pour ${recruiterData.firstName}`);
      }

      const company = createdCompanies.find(c => c.name === recruiterData.companyName);
      if (company) {
        await prisma.recruiterMembership.create({
          data: {
            recruiterId: recruiterProfile.id,
            companyId: company.id,
            internalRole: 'Recruteur',
          },
        });
        console.log(`Recruteur créé: ${recruiterData.firstName} ${recruiterData.lastName} (${company.name})`);
      }
    } else {
      console.log(`ℹRecruteur existe déjà: ${recruiterData.email}`);
    }
  }

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
      coverLetterText: 'Dynamique et motivé, je recherche un poste de serveur pour mettre mes compétences au service de votre établissement. Fort de plusieurs expériences en restauration, je sais gérer le stress et offrir un service impeccable. Souriant et professionnel, je souhaite rejoindre une équipe.',
      desiredContractTypes: [ContractType.CDI],
      experienceLevel: 'DEBUTANT' as ExperienceLevel,
    },
    {
      email: 'candidat.emma@mova.com',
      password: testPassword,
      firstName: 'Emma',
      lastName: 'Rousseau',
      location: { lat: 43.4255, lon: 6.7321, name: 'Saint-Raphaël, France' },
      desiredJobTitle: 'Vendeur / Vendeuse',
      resumeUrl: 'https://example.com/cv-emma.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      coverLetterText: 'Passionnée par la mode et le contact client, je souhaite rejoindre une boutique dynamique. Mon expérience en vente de luxe m\'a permis de développer un excellent sens du conseil et de la relation client. Je suis polyglotte et très motivée pour contribuer à votre réussite.',
      desiredContractTypes: [ContractType.CDD],
      experienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'candidat.julie@mova.com',
      password: testPassword,
      firstName: 'Julie',
      lastName: 'Lambert',
      location: { lat: 43.4520, lon: 6.6180, name: 'Puget-sur-Argens, France' },
      desiredJobTitle: 'Réceptionniste',
      resumeUrl: 'https://example.com/cv-julie.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      coverLetterText: 'Souriante et organisée, je souhaite mettre mes compétences au service de votre établissement hôtelier. Ma maîtrise de trois langues et mon expérience en accueil me permettent de gérer efficacement les demandes de clients internationaux. Disponible immédiatement.',
      desiredContractTypes: [ContractType.ALTERNANCE],
      experienceLevel: 'INTERMEDIAIRE' as ExperienceLevel,
    },
    {
      email: 'candidat.pierre@mova.com',
      password: testPassword,
      firstName: 'Pierre',
      lastName: 'Dupont',
      location: { lat: 43.4447, lon: 6.6375, name: 'Roquebrune-sur-Argens, France' },
      desiredJobTitle: 'Cuisinier / Cuisinière',
      resumeUrl: 'https://example.com/cv-pierre.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
      coverLetterText: 'Passionné de gastronomie depuis toujours, je recherche un poste de cuisinier pour exprimer ma créativité. Formé dans plusieurs établissements étoilés, je maîtrise les techniques modernes et traditionnelles. Rigoureux et inventif, je suis prêt à rejoindre une brigade ambitieuse.',
      desiredContractTypes: [ContractType.CDI],
      experienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'candidat.sarah@mova.com',
      password: testPassword,
      firstName: 'Sarah',
      lastName: 'Martin',
      location: { lat: 43.3078, lon: 6.7731, name: 'Sainte-Maxime, France' },
      desiredJobTitle: 'Barman / Barmaid',
      resumeUrl: 'https://example.com/cv-sarah.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      coverLetterText: 'Créative et souriante, je cherche à rejoindre un bar dynamique où je pourrai mettre en valeur mes talents de mixologie. Mon expérience dans plusieurs établissements prestigieux m\'a permis de développer un répertoire unique de cocktails. Passionnée par l\'art du service.',
      desiredContractTypes: [ContractType.CDD],
      experienceLevel: 'INTERMEDIAIRE' as ExperienceLevel,
    },
    {
      email: 'candidat.maxime@mova.com',
      password: testPassword,
      firstName: 'Maxime',
      lastName: 'Leclerc',
      location: { lat: 43.4475, lon: 6.5689, name: 'Le Muy, France' },
      desiredJobTitle: 'Concierge',
      resumeUrl: 'https://example.com/cv-maxime.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
      coverLetterText: 'Discret et efficace, je souhaite mettre mon expertise au service d\'un établissement de luxe. Mon réseau étendu et ma connaissance approfondie de la région me permettent de répondre à toutes les demandes des clients. Polyglotte et disponible, je vise l\'excellence dans chaque mission.',
      desiredContractTypes: [ContractType.CDI],
      experienceLevel: 'CONFIRME' as ExperienceLevel,
    },
    {
      email: 'candidat.lea@mova.com',
      password: testPassword,
      firstName: 'Léa',
      lastName: 'Moreau',
      location: { lat: 43.4389, lon: 6.7389, name: 'Fréjus, France' },
      desiredJobTitle: 'Valet / Femme de chambre',
      resumeUrl: 'https://example.com/cv-lea.pdf',
      photoUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
      coverLetterText: 'Minutieuse et consciencieuse, je recherche un poste dans l\'hôtellerie de luxe pour mettre mon souci du détail au service de votre établissement. Mon expérience dans plusieurs palaces m\'a appris l\'importance de l\'excellence. Discrète et rapide, je garantis un service irréprochable.',
      desiredContractTypes: [ContractType.CDD],
      experienceLevel: 'CONFIRME' as ExperienceLevel,
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
      
      const candidateProfile = await prisma.candidateProfile.create({
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

      const category = await prisma.jobCategory.findFirst({
        where: { name: candidateData.desiredJobTitle }
      });

      if (category) {
        await prisma.candidateProfile.update({
          where: { id: candidateProfile.id },
          data: {
            interestedInCategories: {
              connect: { id: category.id }
            }
          }
        });
      }

      console.log(`Candidat créé: ${candidateData.firstName} ${candidateData.lastName} (${candidateData.desiredJobTitle})`);
    } else {
      console.log(`Candidat existe déjà: ${candidateData.email}`);
    }
  }

  console.log('🎉 Tous les profils de test ont été créés !');

  console.log('\n💼 Création des offres d\'emploi...');

  const jobOffers = [
    {
      recruiterEmail: 'kevin.sport@gmail.com',
      title: 'Chauffeur / Chauffeuse',
      description: 'Kévin Moov\' recherche des chauffeurs VTC motivés ! Rejoignez notre équipe dynamique et bénéficiez d\'une grande flexibilité horaire. Nous offrons des conditions attractives : véhicules récents, secteurs touristiques privilégiés et accompagnement personnalisé. Permis B requis.',
      contractType: ContractType.CDD,
      experienceLevel: 'DEBUTANT' as ExperienceLevel,
      workHours: '35',
      salaryMin: 1800,
      salaryMax: 2200,
      location: { lat: 43.4332, lon: 6.7378, name: 'Fréjus, France' },
    },
    {
      recruiterEmail: 'marc.jean@gmail.com',
      title: 'Vendeur / Vendeuse',
      description: 'Boutique de prêt-à-porter recherche vendeurs passionnés ! Vous évoluerez dans un cadre prestigieux sur le port de Saint-Raphaël. Nous recherchons des profils dynamiques avec un excellent sens du contact client et une sensibilité pour la mode haut de gamme.',
      contractType: ContractType.CDI,
      experienceLevel: 'CONFIRME' as ExperienceLevel,
      workHours: '35',
      salaryMin: 2000,
      salaryMax: 2500,
      location: { lat: 43.4255, lon: 6.7321, name: 'Saint-Raphaël, France' },
    },
    {
      recruiterEmail: 'fred.petit@gmail.com',
      title: 'Serveur / Serveuse',
      description: 'Le restaurant La Table du Puget recherche des serveurs dynamiques ! Vous travaillerez dans un cadre convivial avec une vue sur l\'Argens. Nous valorisons le professionnalisme, la bonne humeur et le service de qualité. Formation interne assurée.',
      contractType: ContractType.ALTERNANCE,
      experienceLevel: 'INTERMEDIAIRE' as ExperienceLevel,
      workHours: '35',
      salaryMin: 1600,
      salaryMax: 1800,
      location: { lat: 43.4520, lon: 6.6180, name: 'Puget-sur-Argens, France' },
    },
    {
      recruiterEmail: 'recruteur.sophia@mova.com',
      title: 'Cuisinier / Cuisinière',
      description: 'Restaurant gastronomique Le Gourmet recherche un cuisinier talentueux ! Rejoignez notre brigade dans un cadre exceptionnel à Roquebrune. Nous valorisons la créativité, les produits frais locaux et l\'esprit d\'équipe. Évoluez dans un environnement stimulant.',
      contractType: ContractType.CDI,
      experienceLevel: 'CONFIRME' as ExperienceLevel,
      workHours: '39',
      salaryMin: 2200,
      salaryMax: 2800,
      location: { lat: 43.4447, lon: 6.6375, name: 'Roquebrune-sur-Argens, France' },
    },
    {
      recruiterEmail: 'recruteur.monaco@mova.com',
      title: 'Réceptionniste',
      description: 'Hôtel 4 étoiles recherche réceptionniste bilingue ! Situé en plein cœur de Sainte-Maxime, notre établissement accueille une clientèle internationale exigeante. Vous serez le premier contact avec nos clients et incarnerez l\'image de notre hôtel.',
      contractType: ContractType.CDD,
      experienceLevel: 'DEBUTANT' as ExperienceLevel,
      workHours: '35',
      salaryMin: 1900,
      salaryMax: 2100,
      location: { lat: 43.3078, lon: 6.7731, name: 'Sainte-Maxime, France' },
    },
    {
      recruiterEmail: 'recruteur.cannes@mova.com',
      title: 'Vendeur / Vendeuse',
      description: 'Boutique de luxe recherche vendeurs passionnés avec un excellent sens du service client ! Rejoignez notre boutique au cœur du Muy. Nous vous offrons un environnement stimulant, des produits d\'exception et une clientèle internationale exigeante.',
      contractType: ContractType.CDI,
      experienceLevel: 'CONFIRME' as ExperienceLevel,
      workHours: '35',
      salaryMin: 2100,
      salaryMax: 2600,
      location: { lat: 43.4475, lon: 6.5689, name: 'Le Muy, France' },
    },
    {
      recruiterEmail: 'recruteur.test@mova.com',
      title: 'Réceptionniste',
      description: 'Le Grand Hôtel de Fréjus recherche un réceptionniste expérimenté pour accueillir notre clientèle internationale. Vous serez le visage de notre établissement 4 étoiles. Maîtrise du français et de l\'anglais indispensable.',
      contractType: ContractType.CDI,
      experienceLevel: 'CONFIRME' as ExperienceLevel,
      workHours: '35',
      salaryMin: 2000,
      salaryMax: 2400,
      location: { lat: 43.4125, lon: 6.7458, name: 'Fréjus, France' },
    },
  ];

  for (const offerData of jobOffers) {
    const user = await prisma.user.findUnique({ where: { email: offerData.recruiterEmail } });
    if (!user) {
      console.log(`Utilisateur non trouvé: ${offerData.recruiterEmail}`);
      continue;
    }

    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: user.id },
      include: { memberships: { include: { company: true } } }
    });
    
    if (!recruiterProfile) {
      console.log(`Profil recruteur non trouvé pour: ${offerData.recruiterEmail}`);
      continue;
    }

    const companyId = recruiterProfile.memberships[0]?.companyId;
    if (!companyId) {
      console.log(`Pas d'entreprise pour le recruteur: ${offerData.recruiterEmail}`);
      continue;
    }

    const category = await prisma.jobCategory.findFirst({
      where: { name: offerData.title },
    });

    if (!category) {
      console.log(`Catégorie non trouvée pour l'offre: ${offerData.title}`);
      continue;
    }

    const existingOffer = await prisma.jobOffer.findFirst({
      where: {
        createdById: recruiterProfile.id,
        title: offerData.title,
      },
    });

    if (existingOffer) {
      console.log(` Offre existante: ${offerData.title} (${offerData.recruiterEmail})`);
      continue;
    }

    const locationWKT = `POINT(${offerData.location.lon} ${offerData.location.lat})`;

    await prisma.jobOffer.create({
      data: {
        createdById: recruiterProfile.id,
        companyId: companyId,
        categoryId: category.id,
        title: offerData.title,
        description: offerData.description,
        contractType: offerData.contractType,
        experienceLevel: offerData.experienceLevel,
        workHours: offerData.workHours,
        locationWKT: locationWKT,
        locationName: offerData.location.name,
        salaryMin: offerData.salaryMin,
        salaryMax: offerData.salaryMax,
      },
    });

    console.log(` Offre créée: ${offerData.title} par ${offerData.recruiterEmail}`);
  }

  console.log(' Création des offres d\'emploi terminée !');
}

main()
  .catch(e => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });