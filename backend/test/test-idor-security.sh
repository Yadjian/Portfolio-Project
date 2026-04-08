#!/bin/bash

# 🔒 Script de Test Anti-IDOR pour Job Offers
# Ce script teste manuellement la protection contre les attaques IDOR

API_URL="http://localhost:3000"
echo "=== 🛡️  TEST ANTI-IDOR JOB OFFERS ==="
echo "API: $API_URL"
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test de connectivité
echo_info "Test de connectivité API..."
if curl -s "$API_URL/health" > /dev/null; then
    echo_success "API accessible"
else
    echo_error "API non accessible - Démarrez le serveur backend"
    exit 1
fi

echo ""
echo "=== 🏗️  SETUP DES DONNÉES DE TEST ==="

# 1. Créer Recruteur A
echo_info "Création Recruteur A..."
RECRUITER_A_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "recruiter-a@idor-test.com",
        "password": "SecurePass123!",
        "role": "RECRUITER"
    }')

TOKEN_A=$(echo "$RECRUITER_A_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
if [ -n "$TOKEN_A" ]; then
    echo_success "Recruteur A créé - Token: ${TOKEN_A:0:30}..."
else
    echo_error "Échec création Recruteur A"
    echo "$RECRUITER_A_RESPONSE"
    exit 1
fi

# 2. Créer Recruteur B (l'attaquant)
echo_info "Création Recruteur B (attaquant)..."
RECRUITER_B_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "recruiter-b@idor-test.com",
        "password": "SecurePass123!",
        "role": "RECRUITER"
    }')

TOKEN_B=$(echo "$RECRUITER_B_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
if [ -n "$TOKEN_B" ]; then
    echo_success "Recruteur B créé - Token: ${TOKEN_B:0:30}..."
else
    echo_error "Échec création Recruteur B"
    exit 1
fi

# 3. Créer entreprise A
echo_info "Création entreprise A..."
COMPANY_A_RESPONSE=$(curl -s -X POST "$API_URL/companies/onboarding" \
    -H "Authorization: Bearer $TOKEN_A" \
    -H "Content-Type: application/json" \
    -d '{
        "companyName": "Tech Corp A",
        "siret": "12345678901234"
    }')

echo_success "Entreprise A créée"

# 4. Créer entreprise B
echo_info "Création entreprise B..."
COMPANY_B_RESPONSE=$(curl -s -X POST "$API_URL/companies/onboarding" \
    -H "Authorization: Bearer $TOKEN_B" \
    -H "Content-Type: application/json" \
    -d '{
        "companyName": "Tech Corp B",
        "siret": "98765432109876"
    }')

echo_success "Entreprise B créée"

# 5. Compléter le profil A
echo_info "Finalisation profil A..."
curl -s -X PUT "$API_URL/profile/me" \
    -H "Authorization: Bearer $TOKEN_A" \
    -H "Content-Type: application/json" \
    -d '{
        "firstName": "John",
        "lastName": "RecruteurA",
        "desiredContractTypes": ["CDI"],
        "desiredExperienceLevel": "SENIOR"
    }' > /dev/null

# 6. Compléter le profil B
echo_info "Finalisation profil B..."
curl -s -X PUT "$API_URL/profile/me" \
    -H "Authorization: Bearer $TOKEN_B" \
    -H "Content-Type: application/json" \
    -d '{
        "firstName": "Evil",
        "lastName": "RecruteurB",
        "desiredContractTypes": ["CDI"],
        "desiredExperienceLevel": "SENIOR"
    }' > /dev/null

# 7. Créer offre d'emploi A
echo_info "Création job offer A..."
JOB_OFFER_A_RESPONSE=$(curl -s -X POST "$API_URL/job-offers" \
    -H "Authorization: Bearer $TOKEN_A" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Développeur Senior - Entreprise A",
        "description": "Offre légitime de l'\''entreprise A",
        "locationWKT": "POINT(2.3522 48.8566)",
        "locationName": "Paris",
        "salaryMin": 50000,
        "salaryMax": 70000
    }')

JOB_OFFER_A_ID=$(echo "$JOB_OFFER_A_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
if [ -n "$JOB_OFFER_A_ID" ]; then
    echo_success "Job Offer A créée - ID: $JOB_OFFER_A_ID"
else
    echo_error "Échec création Job Offer A"
    echo "$JOB_OFFER_A_RESPONSE"
    exit 1
fi

echo ""
echo "=== 🚨 TESTS D'ATTAQUE IDOR ==="

# Test 1: Tentative de modification par B de l'offre de A
echo_info "Test 1: Recruteur B tente de modifier l'offre de A (ATTAQUE IDOR)"
ATTACK_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$API_URL/job-offers/$JOB_OFFER_A_ID" \
    -H "Authorization: Bearer $TOKEN_B" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "🚨 OFFRE PIRATÉE PAR B !",
        "description": "Cette offre a été hackée par le Recruteur B !"
    }')

HTTP_STATUS=$(echo "$ATTACK_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
if [ "$HTTP_STATUS" = "403" ]; then
    echo_success "ATTAQUE BLOQUÉE - Status 403 (Forbidden) ✅"
else
    echo_error "FAILLE DÉTECTÉE - Status $HTTP_STATUS ❌"
    echo "$ATTACK_RESPONSE"
fi

# Test 2: Tentative de suppression par B de l'offre de A
echo_info "Test 2: Recruteur B tente de supprimer l'offre de A (ATTAQUE IDOR)"
DELETE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X DELETE "$API_URL/job-offers/$JOB_OFFER_A_ID" \
    -H "Authorization: Bearer $TOKEN_B")

HTTP_STATUS=$(echo "$DELETE_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
if [ "$HTTP_STATUS" = "403" ]; then
    echo_success "ATTAQUE DE SUPPRESSION BLOQUÉE - Status 403 (Forbidden) ✅"
else
    echo_error "FAILLE DE SUPPRESSION DÉTECTÉE - Status $HTTP_STATUS ❌"
fi

echo ""
echo "=== ✅ TESTS D'ACCÈS LÉGITIME ==="

# Test 3: A peut modifier sa propre offre
echo_info "Test 3: Recruteur A modifie sa propre offre (LÉGITIME)"
LEGIT_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$API_URL/job-offers/$JOB_OFFER_A_ID" \
    -H "Authorization: Bearer $TOKEN_A" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Développeur Senior - Offre mise à jour",
        "description": "Offre mise à jour légitimement par le propriétaire"
    }')

HTTP_STATUS=$(echo "$LEGIT_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
if [ "$HTTP_STATUS" = "200" ]; then
    echo_success "MODIFICATION LÉGITIME AUTORISÉE - Status 200 (OK) ✅"
else
    echo_error "PROBLÈME MODIFICATION LÉGITIME - Status $HTTP_STATUS ❌"
fi

# Test 4: Vérifier que l'offre n'a pas été piratée
echo_info "Test 4: Vérification que l'offre n'a pas été piratée"
CURRENT_OFFER=$(curl -s "$API_URL/job-offers/$JOB_OFFER_A_ID")
CURRENT_TITLE=$(echo "$CURRENT_OFFER" | grep -o '"title":"[^"]*' | cut -d'"' -f4)

if [[ "$CURRENT_TITLE" == *"PIRATÉE"* ]]; then
    echo_error "OFFRE COMPROMISE ! Titre actuel: $CURRENT_TITLE ❌"
else
    echo_success "OFFRE PROTÉGÉE ! Titre actuel: $CURRENT_TITLE ✅"
fi

echo ""
echo "=== 📊 RÉSUMÉ DES TESTS ==="
echo_info "Tests d'attaque IDOR:"
echo "  - Modification non autorisée: $([ "$HTTP_STATUS" = "403" ] && echo "BLOQUÉE ✅" || echo "VULNÉRABLE ❌")"
echo "  - Suppression non autorisée: $([ "$HTTP_STATUS" = "403" ] && echo "BLOQUÉE ✅" || echo "VULNÉRABLE ❌")"
echo ""
echo_info "Tests d'accès légitime:"
echo "  - Modification par propriétaire: $([ "$HTTP_STATUS" = "200" ] && echo "AUTORISÉE ✅" || echo "BLOQUÉE ❌")"
echo "  - Intégrité des données: $([ "$CURRENT_TITLE" != *"PIRATÉE"* ] && echo "PRÉSERVÉE ✅" || echo "COMPROMISE ❌")"

echo ""
echo_info "🧹 Nettoyage des données de test..."
# Supprimer l'offre de test
curl -s -X DELETE "$API_URL/job-offers/$JOB_OFFER_A_ID" \
    -H "Authorization: Bearer $TOKEN_A" > /dev/null

echo_success "Test Anti-IDOR terminé !"