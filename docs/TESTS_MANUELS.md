# 📋 Tests Fonctionnels - Application Mova

**Version**: 0.8  
**Date**: 28 Octobre 2025  
**Testeur**: Lucas Boyadjian

---

## 🔐 1. PREMIER LANCEMENT & AUTHENTIFICATION

### Test 1.1 - Gestion Permission Géolocalisation au Lancement
**Scénario**: Lancer l'application avec/sans géolocalisation activée dans les paramètres  
**Attendu**: 
- Si géoloc désactivée → Popup système s'affiche
- Si géoloc déjà activée → Pas de popup, accès direct au HomeScreen
**Résultat**: ✅ **RÉUSSI** - Popup s'affiche bien si géoloc désactivée, accès direct au HomeScreen si déjà activée.

---

### Test 1.2 - Bouton "Créer mon compte" depuis HomeScreen
**Scénario**: Depuis l'écran d'accueil (HomeScreen), cliquer sur "Créer mon compte"  
**Attendu**: Redirection vers l'écran de choix du type de compte (Candidat/Recruteur)  
**Résultat**: ✅ **RÉUSSI** - Redirection vers l'écran ChooseRegisterType avec les deux types (candidat ou recruteur).
---

### Test 1.3 - Bouton "Connexion" depuis HomeScreen
**Scénario**: Depuis l'écran d'accueil (HomeScreen), cliquer sur "Connexion"  
**Attendu**: Redirection vers l'écran de login  
**Résultat**: ✅ **RÉUSSI** - Redirection vers LoginScreen

---

### Test 1.4 - Bouton "Créer un compte" depuis LoginScreen
**Scénario**: Depuis l'écran de login, cliquer sur "Créer un compte" (lien en bas)  
**Attendu**: Redirection vers l'écran de choix du type de compte (Candidat/Recruteur)  
**Résultat**: ✅ **RÉUSSI** - Redirection vers ChooseRegisterType

---

### Test 1.5 - Création de Compte Candidat
**Scénario**: Créer un nouveau compte avec le rôle "Candidat"  
**Attendu**: Compte créé avec email/password, redirection vers le formulaire de profil (EditProfileScreen)  
**Résultat**: ✅ **RÉUSSI** - Compte créé, redirection vers EditProfileScreen

---

### Test 1.6 - Création de Compte Recruteur
**Scénario**: Créer un nouveau compte avec le rôle "Recruteur"  
**Attendu**: Compte créé avec email/password, redirection vers le formulaire de profil (EditProfileScreen)  
**Résultat**: ✅ **RÉUSSI** - Compte recruteur créé (stephan.paton@gmail.com), redirection vers EditProfileScreen

---

### Test 1.7 - Bouton "Mot de passe oublié"
**Scénario**: Depuis l'écran de login, cliquer sur "Mot de passe oublié ?"  
**Attendu**: Redirection vers l'écran de réinitialisation de mot de passe (ou message si non implémenté)  
**Résultat**: ⚪ **N/A** - Fonctionnalité non implémentée (prochainement)

---

### Test 1.8 - Login Candidat
**Scénario**: Se connecter avec le compte candidat créé précédemment  
**Attendu**: Connexion réussie, redirection vers la page d'accueil candidat  
**Résultat**: ✅ **RÉUSSI** - Connexion avec lucas.boyadjian@gmail.com réussie, redirection vers l'écran d'accueil candidat avec les onglets (Profil, CV, Matchs, Découverte)

---

### Test 1.9 - Login Recruteur
**Scénario**: Se connecter avec le compte recruteur créé précédemment  
**Attendu**: Connexion réussie, redirection vers la page d'accueil recruteur  
**Résultat**: ✅ **RÉUSSI** - Connexion avec stephan.paton@gmail.com réussie, redirection vers l'écran d'accueil recruteur avec les onglets (Profil, Offres, Matchs, Découverte)

---

### Test 1.10 - Déconnexion
**Scénario**: Se déconnecter de l'application  
**Attendu**: Déconnexion réussie, redirection vers l'écran de login, token supprimé  
**Résultat**: ✅ **RÉUSSI** - Déconnexion avec lucas.boyadjian@gmail.com réussie, token d'authentification et push token supprimés de la BDD, redirection vers HomeScreen

---

## 👤 2. PROFIL CANDIDAT

### Test 2.1 - Modifier Profil Candidat
**Scénario**: Modifier prénom, nom et autres informations du profil candidat  
**Attendu**: Modifications enregistrées et persistées après rafraîchissement  
**Résultat**: ✅ **RÉUSSI** - Profil complet créé (Lucas Boyadjian, Fréjus, Vendeur, CONFIRME, CDI) et persisté en BDD

---

### Test 2.2 - Upload Photo (Candidat)
**Scénario**: Uploader une photo de profil depuis la galerie  
**Attendu**: Photo uploadée, visible dans le profil, URL enregistrée en BDD  
**Résultat**: ✅ **RÉUSSI** - Photo uploadée sur R2 Cloudflare, URL enregistrée en BDD, modification de photo testée (nouvelle URL générée)

---

### Test 2.3 - Upload CV
**Scénario**: Uploader un fichier PDF en tant que CV  
**Attendu**: CV uploadé, téléchargeable, URL enregistrée en BDD  
**Résultat**: ✅ **RÉUSSI** - CV uploadé sur R2, visualisation OK, suppression testée, URL persistée en BDD

---

### Test 2.4 - Modifier Poste Recherché
**Scénario**: Changer le poste recherché (ex: "Serveur" → "Barman")  
**Attendu**: Nouveau poste enregistré et affiché  
**Résultat**: ✅ **RÉUSSI** - Poste modifié (Vendeur → Chauffeur/Chauffeuse) et persisté en BDD

---

### Test 2.5 - Modifier Type de Contrat
**Scénario**: Changer le type de contrat souhaité (ex: CDI → CDD)  
**Attendu**: Nouveau type enregistré  
**Résultat**: ✅ **RÉUSSI** - Contrat modifié (CDI → STAGE) et persisté en BDD

---

### Test 2.6 - Modifier Niveau d'Expérience
**Scénario**: Changer le niveau d'expérience (ex: INTERMEDIAIRE → CONFIRME)  
**Attendu**: Nouveau niveau enregistré  
**Résultat**: ✅ **RÉUSSI** - Expérience modifiée (CONFIRME → DEBUTANT) et persistée en BDD

---

## 👔 3. PROFIL RECRUTEUR

### Test 3.1 - Modifier Profil Recruteur
**Scénario**: Modifier prénom, nom et autres informations du profil recruteur  
**Attendu**: Modifications enregistrées et persistées après rafraîchissement  
**Résultat**: ✅ **RÉUSSI** - Profil recruteur modifié (Stephane Paton, Fréjus) et persisté en BDD

---

### Test 3.2 - Upload Photo (Recruteur)
**Scénario**: Uploader une photo de profil depuis la galerie  
**Attendu**: Photo uploadée, visible dans le profil, URL enregistrée en BDD  
**Résultat**: ✅ **RÉUSSI** - Photo uploadée sur R2 Cloudflare, URL enregistrée en BDD

---

### Test 3.3 - Créer une Entreprise
**Scénario**: Créer une nouvelle entreprise avec nom et SIRET  
**Attendu**: Entreprise créée, visible dans le profil recruteur  
**Résultat**: ✅ **RÉUSSI** - Entreprise créée ("Stéphane Sécu", SIRET: 54048134313101) et persistée en BDD

---

### Test 3.4 - Créer une Offre d'Emploi
**Scénario**: Créer une nouvelle job offer avec titre, description, salaire, contrat  
**Attendu**: Offre créée, visible dans la liste des offres du recruteur  
**Résultat**: ✅ **RÉUSSI** - Job offer créée ("Agent de sécurité", CDI, 1500-1800€) et persistée en BDD

---

### Test 3.5 - Modifier une Offre d'Emploi
**Scénario**: Modifier une offre existante (titre, salaire)  
**Attendu**: Modifications enregistrées  
**Résultat**: ✅ **RÉUSSI** - Job offer modifiée et persistée en BDD

---

## 🧭 4. NAVIGATION (BOTTOM TAB BAR)

### Test 4.1 - Onglet Profil
**Scénario**: Cliquer sur l'onglet "Profil" et visualiser ses informations  
**Attendu**: Profil affiché avec toutes les informations correctes  
**Résultat**: ✅ **RÉUSSI** - Profil candidat affiché avec toutes les infos (nom, photo, poste, expérience, contrat, présentation)

---

### Test 4.2 - Onglet CV (Candidat)
**Scénario**: Cliquer sur l'onglet "CV" en tant que candidat  
**Attendu**: CV affiché ou bouton "Uploader mon CV" si pas de CV  
**Résultat**: ✅ **RÉUSSI** - CV affiché, visualisation et suppression fonctionnelles (déjà testé en 2.3)

---

### Test 4.3 - Onglet Offres (Recruteur)
**Scénario**: Cliquer sur l'onglet "Offres" en tant que recruteur  
**Attendu**: Liste des offres créées par le recruteur affichée  
**Résultat**: ✅ **RÉUSSI** - Liste des job offers affichée dans l'onglet Offres du recruteur

---

### Test 4.4 - Onglet Matchs
**Scénario**: Cliquer sur l'onglet "Matchs" (icône cœur)  
**Attendu**: Liste des matchs affichée avec badge si nouveaux matchs  
**Résultat**: 🟡 **PARTIEL** - Écran vide testé et fonctionnel ("Aucun match pour le moment"), reste à tester avec de vrais matchs et le badge

---

### Test 4.5 - Onglet Notifications (Découverte)
**Scénario**: Cliquer sur l'onglet "Notifications" (icône cloche)  
**Attendu**: Profils à swiper affichés avec badge si nouveaux profils  
**Résultat**: ✅ **RÉUSSI** - Les profils à swiper s'affichent, le badge indique le nombre de nouveaux profils à découvrir.

---

## 💝 5. SWIPE & MATCHING

### Test 5.1 - Swipe Gauche (Refus)
**Scénario**: Swiper un profil vers la gauche  
**Attendu**: Profil refusé, disparaît, ne réapparaît plus  
**Résultat**: ✅ **RÉUSSI** - Le profil refusé disparaît et ne réapparaît plus dans la liste à swiper.

---

### Test 5.2 - Swipe Droite (Like) - Sans Match
**Scénario**: Swiper un profil vers la droite (l'autre n'a pas encore liké)  
**Attendu**: Like enregistré, aucune popup de match  
**Résultat**: ✅ **RÉUSSI** - Le like est bien enregistré, aucune popup de match n'apparaît tant que l'autre utilisateur n'a pas liké en retour.

---

### Test 5.3 - Swipe Droite (Like) - Avec Match
**Scénario**: Swiper vers la droite un profil qui a déjà liké (match mutuel)  
**Attendu**: Popup "C'est un match !" affichée, match visible dans l'onglet Matchs  
**Résultat**: _[À remplir]_

---

### Test 5.4 - Badge Nouveaux Profils à swipe
**Scénario**: Observer le badge sur l'onglet Notifications  
**Attendu**: Badge affiche le nombre de nouveaux profils à swipe  
**Résultat**: _[À remplir]_

---

### Test 5.5 - Badge Nouveaux Matchs
**Scénario**: Observer le badge sur l'onglet Matchs après un nouveau match  
**Attendu**: Badge affiche le nombre de nouveaux matchs  
**Résultat**: _[À remplir]_

---

## 📜 6. HISTORIQUE DES MATCHS

### Test 6.1 - Candidat Visualise Job Offer du Recruteur
**Scénario**: En tant que candidat, ouvrir un match et visualiser la job offer du recruteur  
**Attendu**: Job offer complète affichée (titre, description, salaire, entreprise)  
**Résultat**: _[À remplir]_

---

### Test 6.2 - Recruteur Visualise CV du Candidat
**Scénario**: En tant que recruteur, ouvrir un match et visualiser le CV du candidat  
**Attendu**: Informations du candidat affichées, CV téléchargeable  
**Résultat**: _[À remplir]_

---

### Test 6.3 - Liste des Matchs
**Scénario**: Consulter la liste complète des matchs  
**Attendu**: Tous les matchs affichés, triés du plus récent au plus ancien  
**Résultat**: _[À remplir]_

---

## 📍 7. GÉOLOCALISATION

### Test 7.1 - Permission Géolocalisation Acceptée
**Scénario**: Accepter la demande de permission de géolocalisation  
**Attendu**: Profils à proximité affichés dans la découverte  
**Résultat**: ✅ **RÉUSSI** - Profils de recruteurs affichés dans la découverte (géolocalisation fonctionnelle)

---

### Test 7.2 - Permission Géolocalisation Refusée
**Scénario**: Refuser la demande de permission de géolocalisation  
**Attendu**: Message d'information affiché, bouton pour activer dans les paramètres  
**Résultat**: _[À remplir]_

---

### Test 7.4 - Affichage Distance
**Scénario**: Observer la distance affichée sur chaque profil  
**Attendu**: Distance en km affichée et cohérente  
**Résultat**: ⚪ **N/A** - Fonctionnalité non implémentée (affichage distance pas prévu dans le design)

---

### Test 7.5 - Changement de Localisation
**Scénario**: Modifier sa ville dans le profil (Fréjus → Saint-Raphaël)  
**Attendu**: Profils différents affichés basés sur la nouvelle localisation  
**Résultat**: ✅ **RÉUSSI** - Localisation modifiée (Fréjus → Bussy-Saint-Georges) et persistée en BDD avec coordonnées GPS correctes via Google Places API

---

## 🎨 8. TESTS UI & NAVIGATION

### Test 8.1 - Bouton Retour (Navigation)
**Scénario**: Cliquer sur le bouton retour depuis une page de profil/détails  
**Attendu**: Retour à l'écran précédent sans perte de données  
**Résultat**: ✅ **RÉUSSI** - Bouton retour fonctionnel, navigation correcte sans perte de données

---

### Test 8.2 - Bouton Modifier Profil
**Scénario**: Cliquer sur "Modifier le profil" depuis l'onglet Profil  
**Attendu**: Formulaire de modification affiché avec données actuelles pré-remplies  
**Résultat**: ✅ **RÉUSSI** - Bouton "Modifier le profil" fonctionnel, formulaire affiché avec données pré-remplies

---

### Test 8.3 - Bouton Retour sans Sauvegarder
**Scénario**: Modifier des champs dans le formulaire puis utiliser la flèche retour  
**Attendu**: Retour à l'écran précédent sans sauvegarder les modifications  
**Résultat**: ✅ **RÉUSSI** - La flèche back permet de revenir en arrière sans sauvegarder les modifications

---

### Test 8.4 - Bouton Enregistrer (Formulaire)
**Scénario**: Modifier des champs puis cliquer sur "Enregistrer"  
**Attendu**: Données sauvegardées, message de confirmation, retour à la page précédente  
**Résultat**: ✅ **RÉUSSI** - Bouton "Enregistrer" fonctionnel, données sauvegardées et persistées en BDD (testé lors des modifications de profil)

---

### Test 8.5 - Affichage Écran Vide (Pas de Matchs)
**Scénario**: Consulter l'onglet Matchs quand aucun match n'existe  
**Attendu**: Message "Aucun match pour le moment" ou équivalent affiché  
**Résultat**: ✅ **RÉUSSI** - Message "Aucun match pour le moment" correctement affiché (déjà testé en 4.4)

---

### Test 8.6 - Affichage Écran Vide (Pas de Profils à Swiper)
**Scénario**: Consulter la découverte quand aucun profil n'est disponible  
**Attendu**: Message "Aucun profil disponible" ou équivalent affiché  
**Résultat**: ✅ **RÉUSSI** - Message d'écran vide affiché quand aucun profil n'est disponible

---

### Test 8.7 - Bouton Home (Retour Accueil)
**Scénario**: Cliquer sur le bouton Home depuis n'importe quelle page  
**Attendu**: Retour à l'écran d'accueil principal  
**Résultat**: ✅ **RÉUSSI** - Bouton Home dans le header fonctionnel, redirige vers HomeScreen si déconnecté ou UserHomeScreen si connecté

---

### Test 8.8 - Bouton Retour sur Profil
**Scénario**: Depuis la page de profil, cliquer sur le bouton retour  
**Attendu**: Retour à l'écran précédent  
**Résultat**: ✅ **RÉUSSI** - Bouton retour fonctionnel, retour à l'écran précédent sans perte de données

---

### Test 8.9 - Indicateur de Chargement
**Scénario**: Observer l'indicateur lors du chargement des profils/matchs  
**Attendu**: Spinner ou skeleton screen affiché pendant le chargement  
**Résultat**: _[À remplir]_

---

### Test 8.10 - Message d'Erreur (Connexion Perdue)
**Scénario**: Couper la connexion internet puis tenter une action  
**Attendu**: Message d'erreur "Pas de connexion internet" affiché  
**Résultat**: _[À remplir]_

---

### Test 8.11 - Boutons Like/Dislike (Alternative au Swipe)
**Scénario**: Utiliser les boutons ✅ et ❌ au lieu de swiper  
**Attendu**: Même comportement que le swipe (like ou dislike enregistré)  
**Résultat**: _[À remplir]_

---

## 📊 RÉCAPITULATIF

**Total de tests**: 51  
**Tests réussis**: _[À remplir]_  
**Tests échoués**: _[À remplir]_  
**Taux de réussite**: _[À calculer]_%

---

## 🐛 BUGS IDENTIFIÉS

_[Lister ici les bugs rencontrés pendant les tests]_

1. [CRITIQUE - CORRIGÉ] Perte de données après inactivité (Fast Refresh Expo Go) :
   - **Problème** : Si l'utilisateur reste inactif sur l'application (Expo Go) pendant quelques minutes, ou si Expo Go déclenche un Fast Refresh automatique, toutes les informations (profil, photo, CV, etc.) disparaissent de l'interface.
   - **Cause** : Le Fast Refresh d'Expo Go réinitialise le state React sans re-déclencher le useEffect de vérification du token dans AuthContext.
   - **Solution appliquée** : Ajout d'un listener AppState qui détecte quand l'app redevient active et recharge automatiquement le user depuis SecureStore si le token existe.
   - **Impact avant correction** : Expérience utilisateur très dégradée, nécessitait de relancer l'application complètement.
   - **Statut** : Correction appliquée, à tester pour validation.
2. 
3. 

---

**Date de test**: _[À remplir]_  
**Durée totale**: _[À remplir]_
