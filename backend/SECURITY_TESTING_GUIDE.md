# 🔒 Guide d'Execution des Tests de Securite

## 🚀 Scope de test actuel

Les scripts shell IDOR ont ete retires du repository pour garder un scope centre sur les tests automatises unitaires et e2e.

## 🧪 Tests Automatises (Jest)

### 1. Démarrer le serveur backend
```bash
cd /home/oniji/Portfolio-Project
docker-compose up -d backend db redis
# Ou
cd backend && npm run start:dev
```

### 1. Installer les dependances de test
```bash
cd backend
npm install --save-dev @nestjs/testing supertest
```

### 2. Lancer les tests unitaires
```bash
npm test
```

### 3. Lancer les tests e2e
```bash
npm run test:e2e
```

### 4. Coverage
```bash
npm run test:cov
```

## 📊 Logs d'Audit à Surveiller

### Attaques Bloquées (dans les logs serveur):
```
🚨 IDOR ATTACK BLOCKED: User user_B tried to update job offer offer_A without permission
🚨 IDOR DELETION ATTACK BLOCKED: User user_B tried to delete job offer offer_A without permission
```

### Accès Légitimes:
```
✅ Job offer update authorized: offer_A by user user_A (creator: true, member: true)
✅ Job offer deletion authorized: offer_A by user user_A (creator: true, admin: false, member: true)
```

## 🛡️ Cas de Test Couverts

### ❌ **Attaques qui DOIVENT être bloquées:**
1. Modification d'une offre par un recruteur d'une autre entreprise
2. Suppression d'une offre par un utilisateur non autorisé
3. Accès avec token invalide/expiré
4. Manipulation d'IDs inexistants

### ✅ **Accès qui DOIVENT être autorisés:**
1. Modification par le créateur de l'offre
2. Modification par un admin de la même entreprise
3. Modification par un membre actif de la même entreprise
4. Suppression par les utilisateurs autorisés

## 🔍 Debug et Troubleshooting

### Si les tests échouent:
1. **Vérifier que le serveur est démarré:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Vérifier les logs du backend:**
   ```bash
   docker-compose logs backend
   ```

3. **Nettoyer la base de données de test:**
   ```bash
   cd backend && npx prisma db push --force-reset
   ```

### Si les attaques ne sont PAS bloquées:
⚠️ **ALERTE SÉCURITE** - Vérifiez immédiatement:
- La logique d'autorisation dans `job-offer.service.ts`
- Les includes Prisma pour `company.memberships`
- La validation des tokens JWT

## 📈 Métriques de Sécurité

**Objectifs:**
- **100%** des attaques IDOR bloquées
- **0%** de faux positifs (accès légitimes bloqués)
- **100%** des tentatives d'attaque loggées
- **<100ms** de overhead pour les vérifications de sécurité

## 🚨 Alertes de Sécurité

Si vous voyez ces messages dans les logs:
- `IDOR ATTACK BLOCKED` → **Normal** - Attaque détectée et bloquée
- `Offre compromise` → **🚨 CRITIQUE** - Faille de sécurité détectée
- `Status 200` sur attaque → **🚨 CRITIQUE** - Protection IDOR défaillante

---

## 📞 Support

En cas de problème avec les tests de sécurité:
1. Vérifiez que toutes les dépendances sont installées
2. Redémarrez le serveur backend
3. Exécutez d'abord le test manuel pour diagnostiquer
4. Consultez les logs détaillés