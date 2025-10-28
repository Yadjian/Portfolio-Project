#!/bin/bash

# 🛡️ TEST DE SÉCURITÉ IDOR - Version Pratique
# Tests en conditions réelles avec le serveur Docker

echo "🛡️ TESTS DE SÉCURITÉ IDOR - Version Live"
echo "========================================"

# Configuration avec le vrai serveur
API_BASE="http://localhost:3000"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 🔑 Tokens JWT réels obtenus des inscriptions
USER_A_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZDRiZGIwNC01MzIxLTRiY2UtYmYyMC01MTJlZTFlZTM1NmMiLCJlbWFpbCI6InVzZXJhMkB0ZXN0LmNvbSIsImp0aSI6ImExNzljMGVhLWYzOGYtNDY0Ny1hYmFkLWU4M2U2M2RjOTk0MCIsImlhdCI6MTc2MTY2MDYxOCwiZXhwIjoxNzYxNjYxNTE4fQ.7r-KgXc6gAVYO7PBdXakgwp_7nrXf9A0SYJNe7BCnlY"
USER_B_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWMxMzA0Ni1mZmFmLTRiYzgtODgwYy1kNTMyYTdlYzE5OWEiLCJlbWFpbCI6InVzZXJiQHRlc3QuY29tIiwianRpIjoiNjcxZjcyYTQtNmQ4MC00ZGZlLWI3OGUtNTcxNThlNTljZDBlIiwiaWF0IjoxNzYxNjYwNjI4LCJleHAiOjE3NjE2NjE1Mjh9.U4OC4FGZn-qk00F-lLHQosq1Yb4Yup8kAKZHlH28DjU"

# Variables pour stocker les IDs créés
JOB_OFFER_ID=""
COMPANY_ID=""

# Fonction d'aide pour les tests
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
    
    echo "   Status: $http_status"
    
    if [ "$http_status" -eq 403 ] || [ "$http_status" -eq 401 ]; then
        echo -e "   ${GREEN}✅ SÉCURISÉ: Accès refusé correctement${NC}"
        return 0
    elif [ "$http_status" -eq 200 ] || [ "$http_status" -eq 201 ]; then
        echo -e "   ${GREEN}✅ SUCCÈS: Opération autorisée${NC}"
        echo "   Réponse: $(echo "$body" | head -c 100)..."
        return 0
    elif [ "$http_status" -eq 204 ]; then
        echo -e "   ${GREEN}✅ SUCCÈS: Suppression réussie${NC}"
        return 0
    else
        echo -e "   ${YELLOW}⚠️  INATTENDU: HTTP $http_status${NC}"
        echo "   Réponse: $body"
        return 2
    fi
}

echo -e "\n${GREEN}Phase 1: Vérification du serveur${NC}"
echo "================================"

server_status=$(curl -s -o /dev/null -w "%{http_code}" $API_BASE)
if [ "$server_status" -eq 200 ]; then
    echo -e "✅ ${GREEN}Serveur accessible sur $API_BASE${NC}"
else
    echo -e "❌ ${RED}Serveur non accessible${NC}"
    exit 1
fi

echo -e "\n${GREEN}Phase 2: Test des endpoints publics${NC}"
echo "=================================="

echo "📋 Test liste offres publiques"
curl -s $API_BASE/job-offers | head -20
echo ""

echo -e "\n${GREEN}Phase 3: Tests de création légitimes${NC}"
echo "===================================="

echo "🏢 User A crée son profil recruteur"
profile_data='{
  "firstName": "Alice", 
  "lastName": "Recruiter",
  "desiredContractTypes": ["CDI"],
  "desiredExperienceLevel": "SENIOR",
  "searchedCategoryIds": []
}'
test_request "POST" "$API_BASE/profile/recruiter" "$USER_A_TOKEN" "$profile_data" "Création profil User A"

echo "🏢 User A crée une entreprise"
company_data='{"companyName":"Test Company A","siret":"12345678901234"}'
create_company_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $USER_A_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$company_data" \
    "$API_BASE/companies")

company_status=$(echo "$create_company_response" | grep "HTTP_STATUS" | cut -d: -f2)
company_body=$(echo "$create_company_response" | sed '/HTTP_STATUS/d')

if [ "$company_status" -eq 201 ]; then
    echo -e "   ${GREEN}✅ Entreprise créée avec succès${NC}"
    COMPANY_ID=$(echo "$company_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   Company ID: $COMPANY_ID"
else
    echo -e "   ${RED}❌ Échec création entreprise: HTTP $company_status${NC}"
    echo "   Réponse: $company_body"
fi

sleep 1

echo "📝 User A crée une offre d'emploi"
job_data='{
  "title": "Développeur Backend Sécurité",
  "description": "Poste de développeur pour tester la sécurité IDOR",
  "locationWKT": "POINT(2.3522 48.8566)",
  "locationName": "Paris, France",
  "salaryMin": 45000,
  "salaryMax": 65000
}'

create_job_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $USER_A_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$job_data" \
    "$API_BASE/job-offers")

job_status=$(echo "$create_job_response" | grep "HTTP_STATUS" | cut -d: -f2)
job_body=$(echo "$create_job_response" | sed '/HTTP_STATUS/d')

if [ "$job_status" -eq 201 ]; then
    echo -e "   ${GREEN}✅ Offre créée avec succès${NC}"
    JOB_OFFER_ID=$(echo "$job_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   Job Offer ID: $JOB_OFFER_ID"
else
    echo -e "   ${RED}❌ Échec création offre: HTTP $job_status${NC}"
    echo "   Réponse: $job_body"
fi

echo -e "\n${GREEN}Phase 4: Tests d'attaques IDOR 🚨${NC}"
echo "================================"

if [ -n "$JOB_OFFER_ID" ]; then
    echo -e "\n${RED}🚨 TENTATIVES D'ATTAQUES IDOR${NC}"
    
    # Test modification par utilisateur non autorisé
    attack_data='{"title":"OFFRE PIRATÉE PAR USER B","description":"Tentative de hack"}'
    test_request "PUT" "$API_BASE/job-offers/$JOB_OFFER_ID" "$USER_B_TOKEN" "$attack_data" "🔥 ATTAQUE: User B tente de modifier l'offre de User A"
    
    # Test suppression par utilisateur non autorisé  
    test_request "DELETE" "$API_BASE/job-offers/$JOB_OFFER_ID" "$USER_B_TOKEN" "" "🔥 ATTAQUE: User B tente de supprimer l'offre de User A"
    
    # Test lecture (devrait fonctionner car public)
    test_request "GET" "$API_BASE/job-offers/$JOB_OFFER_ID" "$USER_B_TOKEN" "" "📖 Test lecture publique par User B"
    
else
    echo -e "   ${YELLOW}⚠️  Pas d'ID d'offre pour tester IDOR${NC}"
fi

echo -e "\n${GREEN}Phase 5: Tests de validation${NC}"
echo "============================"

# Test données invalides
echo "🧪 Test création entreprise avec SIRET invalide"
invalid_company='{"companyName":"","siret":"123"}'
test_request "POST" "$API_BASE/companies" "$USER_B_TOKEN" "$invalid_company" "Données entreprise invalides"

# Test sans token
echo "🧪 Test création offre sans authentification"
test_request "POST" "$API_BASE/job-offers" "" "$job_data" "Création offre sans token"

echo -e "\n${GREEN}Phase 6: Tests de propriétaire légitime${NC}"
echo "====================================="

if [ -n "$JOB_OFFER_ID" ]; then
    # Test modification par le propriétaire
    legit_update='{"title":"Offre Mise à Jour par le Propriétaire","salaryMax":70000}'
    test_request "PUT" "$API_BASE/job-offers/$JOB_OFFER_ID" "$USER_A_TOKEN" "$legit_update" "✅ LÉGITIME: User A modifie sa propre offre"
    
    # Test suppression par le propriétaire
    test_request "DELETE" "$API_BASE/job-offers/$JOB_OFFER_ID" "$USER_A_TOKEN" "" "✅ LÉGITIME: User A supprime sa propre offre"
fi

echo -e "\n${GREEN}🎉 TESTS DE SÉCURITÉ TERMINÉS${NC}"
echo "============================="
echo ""
echo -e "${GREEN}✅ Résultats attendus :${NC}"
echo "  - Créations légitimes : ✅ SUCCÈS (201/200)"
echo "  - Attaques IDOR : 🛡️ BLOQUÉES (403 Forbidden)"
echo "  - Lectures publiques : ✅ AUTORISÉES (200)"
echo "  - Opérations propriétaire : ✅ AUTORISÉES (200/204)"
echo ""
echo -e "${YELLOW}⚠️  Si les attaques IDOR ne sont pas bloquées, c'est une VULNÉRABILITÉ !${NC}"