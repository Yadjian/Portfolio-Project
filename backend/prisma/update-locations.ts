import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient();

/**
 * Script pour ajouter des coordonnées GPS aux profils existants
 * Coordonnées autour de Nice/Cannes pour les tests
 */
async function main() {
  console.log('🔄 Mise à jour des coordonnées GPS...');

  // Coordonnées de test autour de Nice/Cannes
  const locations = [
    { lat: 43.7102, lon: 7.2620, name: 'Nice, France' },      // Nice
    { lat: 43.5528, lon: 7.0174, name: 'Cannes, France' },    // Cannes
    { lat: 43.6177, lon: 7.0554, name: 'Antibes, France' },   // Antibes
    { lat: 43.7384, lon: 7.4246, name: 'Monaco' },            // Monaco
    { lat: 43.4832, lon: 6.9385, name: 'Grasse, France' },    // Grasse
    { lat: 43.5752, lon: 6.7352, name: 'Fréjus, France' },    // Fréjus
  ];

  // Mettre à jour les profils candidats
  const candidates = await prisma.candidateProfile.findMany();
  console.log(`📋 Trouvé ${candidates.length} profils candidats`);

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const location = locations[i % locations.length];
    
    // Format WKT (Well-Known Text) pour PostGIS : POINT(longitude latitude)
    const locationWKT = `POINT(${location.lon} ${location.lat})`;
    
    await prisma.candidateProfile.update({
      where: { id: candidate.id },
      data: {
        locationWKT: locationWKT,
        locationName: location.name,
        searchRadiusKm: 50, // Rayon de recherche de 50km
      },
    });
    
    console.log(`✅ Candidat ${candidate.firstName} ${candidate.lastName} : ${location.name}`);
  }

  // Mettre à jour les profils recruteurs
  const recruiters = await prisma.recruiterProfile.findMany();
  console.log(`📋 Trouvé ${recruiters.length} profils recruteurs`);

  for (let i = 0; i < recruiters.length; i++) {
    const recruiter = recruiters[i];
    const location = locations[(i + 1) % locations.length]; // Décaler pour varier
    
    const locationWKT = `POINT(${location.lon} ${location.lat})`;
    
    await prisma.recruiterProfile.update({
      where: { id: recruiter.id },
      data: {
        locationWKT: locationWKT,
        locationName: location.name,
      },
    });
    
    console.log(`✅ Recruteur ${recruiter.firstName} ${recruiter.lastName} : ${location.name}`);
  }

  console.log('✨ Mise à jour terminée !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
