import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script de réinitialisation pour la démo
 * Supprime tous les swipes et matchs pour repartir de zéro
 */
async function main() {
  console.log('🔄 Début de la réinitialisation de la démo...\n');

  // Supprimer tous les swipes (qui contiennent l'information des matchs)
  const deletedSwipes = await prisma.swipe.deleteMany({});
  console.log(`✅ ${deletedSwipes.count} swipes supprimés`);

  console.log('\n✨ Réinitialisation terminée !');
  console.log('\n🎯 Vous pouvez maintenant:');
  console.log('   - Vous connecter avec sophie.martin@gmail.com / Test123!');
  console.log('   - Vous connecter avec marc.dubois@gmail.com / Test123!');
  console.log('   - Swiper et créer de nouveaux matchs');
  console.log('   - Tester le système de notifications');
  console.log('\n💡 Astuce: Les badges se réinitialiseront automatiquement après connexion\n');
}

main()
  .catch(e => {
    console.error('❌ Erreur lors de la réinitialisation:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
