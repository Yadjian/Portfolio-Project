#!/bin/bash

# 🔒 Script de test de sécurité IDOR - Job Offers & Companies
# Tests les vulnérabilités d'accès direct aux objets

echo "🛡️ DÉMARRAGE DES TESTS DE SÉCURITÉ IDOR"
echo "========================================"

# Configuration
API_BASE="http://localhost:3000"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction d'aide pour les requêtes
test_request() {
    local method=$1
    local url=$2
    local token=$3
    local data=$4
    local description=$5
    
    echo -e "\n${YELLOW}🧪 TEST: $description${NC}"
    echo "   $method $url"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
            -X $method \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url")
    else
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
            -X $method \
            -H "Authorization: Bearer $token" \
            "$url")
    fi
    
    http_status=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_STATUS/d')
    
    if [ "$http_status" -eq 403 ] || [ "$http_status" -eq 401 ]; then
        echo -e "   ${GREEN}✅ SÉCURISÉ: HTTP $http_status - Accès refusé${NC}"
        return 0
    elif [ "$http_status" -eq 200 ] || [ "$http_status" -eq 201 ]; then
        echo -e "   ${RED}❌ VULNÉRABLE: HTTP $http_status - Accès autorisé${NC}"
        return 1
    else
        echo -e "   ${YELLOW}⚠️  RÉSULTAT INATTENDU: HTTP $http_status${NC}"
        return 2
    fi
}

echo -e "\n${GREEN}Phase 1: Authentification des utilisateurs de test${NC}"
echo "=================================================="

# Création d'utilisateurs de test (simulé - remplacez par vos vraies données)
echo "🔑 Connexion Utilisateur A (User A)"
USER_A_TOKEN="your-test-token-a"  # Remplacez par un vrai token

echo "🔑 Connexion Utilisateur B (User B)" 
USER_B_TOKEN="your-test-token-b"  # Remplacez par un vrai token

# Variables pour stocker les IDs créés
JOB_OFFER_ID=""
COMPANY_ID=""

echo -e "\n${GREEN}Phase 2: Tests de création légitimes${NC}"
echo "====================================="

echo "📝 User A crée une entreprise"
company_data='{"companyName":"Test Company A","siret":"12345678901234"}'
create_company_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $USER_A_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$company_data" \
    "$API_BASE/companies")

company_status=$(echo "$create_company_response" | grep "HTTP_STATUS" | cut -d: -f2)
if [ "$company_status" -eq 201 ]; then
    echo -e "   ${GREEN}✅ Entreprise créée avec succès${NC}"
    COMPANY_ID=$(echo "$create_company_response" | sed '/HTTP_STATUS/d' | grep -o '"id":"[^"]*"' | cut -d'"' -f4 | head -1)
else
    echo -e "   ${RED}❌ Échec création entreprise: HTTP $company_status${NC}"
fi

echo "📝 User A crée une offre d'emploi"
job_data='{"title":"Développeur Test","description":"Description test","locationWKT":"POINT(2.3522 48.8566)","locationName":"Paris"}'
create_job_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $USER_A_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$job_data" \
    "$API_BASE/job-offer")

job_status=$(echo "$create_job_response" | grep "HTTP_STATUS" | cut -d: -f2)
if [ "$job_status" -eq 201 ]; then
    echo -e "   ${GREEN}✅ Offre d'emploi créée avec succès${NC}"
    JOB_OFFER_ID=$(echo "$create_job_response" | sed '/HTTP_STATUS/d' | grep -o '"id":"[^"]*"' | cut -d'"' -f4 | head -1)
else
    echo -e "   ${RED}❌ Échec création offre: HTTP $job_status${NC}"
fi

echo -e "\n${GREEN}Phase 3: Tests d'attaques IDOR${NC}"
echo "=============================="

if [ -n "$JOB_OFFER_ID" ]; then
    # Test modification offre par utilisateur non autorisé
    update_data='{"title":"Offre Modifiée par Attaquant","description":"Tentative de modification"}'
    test_request "PUT" "$API_BASE/job-offer/$JOB_OFFER_ID" "$USER_B_TOKEN" "$update_data" "User B tente de modifier l'offre de User A"
    
    # Test suppression offre par utilisateur non autorisé
    test_request "DELETE" "$API_BASE/job-offer/$JOB_OFFER_ID" "$USER_B_TOKEN" "" "User B tente de supprimer l'offre de User A"
    
    # Test lecture offre (devrait être autorisée car publique)
    test_request "GET" "$API_BASE/job-offer/$JOB_OFFER_ID" "$USER_B_TOKEN" "" "User B tente de lire l'offre de User A (lecture publique)"
    
else
    echo -e "   ${YELLOW}⚠️  Pas d'ID d'offre disponible pour les tests IDOR${NC}"
fi

echo -e "\n${GREEN}Phase 4: Tests de validation d'entrée${NC}"
echo "====================================="

# Test données invalides
echo "🧪 Test création entreprise avec données invalides"
invalid_data='{"companyName":"","siret":"123"}'
test_request "POST" "$API_BASE/companies" "$USER_B_TOKEN" "$invalid_data" "Création entreprise avec SIRET invalide"

# Test données manquantes
echo "🧪 Test création offre avec données manquantes"
invalid_job='{"title":"","description":""}'
test_request "POST" "$API_BASE/job-offer" "$USER_B_TOKEN" "$invalid_job" "Création offre avec données manquantes"

echo -e "\n${GREEN}Phase 5: Nettoyage${NC}"
echo "=================="

if [ -n "$JOB_OFFER_ID" ]; then
    echo "🧹 Suppression de l'offre de test par le propriétaire"
    test_request "DELETE" "$API_BASE/job-offer/$JOB_OFFER_ID" "$USER_A_TOKEN" "" "User A supprime sa propre offre"
fi

echo -e "\n${GREEN}🎉 TESTS DE SÉCURITÉ TERMINÉS${NC}"
echo "============================="
echo "✅ Vérifiez que tous les tests IDOR ont été BLOQUÉS (HTTP 403/401)"
echo "✅ Les opérations légitimes doivent avoir réussi (HTTP 200/201)"
echo "⚠️  Remplacez 'your-test-token-a' et 'your-test-token-b' par de vrais tokens JWT"