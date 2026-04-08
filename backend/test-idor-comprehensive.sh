#!/bin/bash

# 🛡️ TEST DE SÉCURITÉ IDOR - Version Réaliste
# Tests avec les vrais endpoints de l'API

echo "🛡️ TESTS DE SÉCURITÉ IDOR - Version Réaliste"
echo "============================================"

API_BASE="http://localhost:3000"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 🔑 Tokens JWT des utilisateurs créés
USER_A_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZDRiZGIwNC01MzIxLTRiY2UtYmYyMC01MTJlZTFlZTM1NmMiLCJlbWFpbCI6InVzZXJhMkB0ZXN0LmNvbSIsImp0aSI6ImExNzljMGVhLWYzOGYtNDY0Ny1hYmFkLWU4M2U2M2RjOTk0MCIsImlhdCI6MTc2MTY2MDYxOCwiZXhwIjoxNzYxNjYxNTE4fQ.7r-KgXc6gAVYO7PBdXakgwp_7nrXf9A0SYJNe7BCnlY"
USER_B_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWMxMzA0Ni1mZmFmLTRiYzgtODgwYy1kNTMyYTdlYzE5OWEiLCJlbWFpbCI6InVzZXJiQHRlc3QuY29tIiwianRpIjoiNjcxZjcyYTQtNmQ4MC00ZGZlLWI3OGUtNTcxNThlNTljZDBlIiwiaWF0IjoxNzYxNjYwNjI4LCJleHAiOjE3NjE2NjE1Mjh9.U4OC4FGZn-qk00F-lLHQosq1Yb4Yup8kAKZHlH28DjU"

JOB_OFFER_ID=""

echo -e "\n${BLUE}🔍 Phase 1: Vérification initiale${NC}"
echo "================================"

# Test connectivité serveur
if curl -s -f $API_BASE > /dev/null; then
    echo -e "✅ ${GREEN}Serveur accessible${NC}"
else
    echo -e "❌ ${RED}Serveur inaccessible${NC}"
    exit 1
fi

# Test liste des offres publiques
echo "📋 Offres publiques actuelles:"
public_offers=$(curl -s $API_BASE/job-offers)
echo "$public_offers" | head -50

echo -e "\n${BLUE}🏗️  Phase 2: Configuration User A${NC}"
echo "================================"

echo "👤 Configuration profil User A..."
profile_update='{
  "firstName": "Alice",
  "lastName": "Recruiter", 
  "role": "RECRUITER",
  "desiredContractTypes": ["CDI"],
  "desiredExperienceLevel": "SENIOR"
}'

echo "📝 Mise à jour profil User A"
profile_response=$(curl -s -w "\nSTATUS:%{http_code}" \
    -X PUT \
    -H "Authorization: Bearer $USER_A_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$profile_update" \
    "$API_BASE/profile/me")

profile_status=$(echo "$profile_response" | grep "STATUS:" | cut -d: -f2)
if [ "$profile_status" -eq 200 ]; then
    echo -e "✅ ${GREEN}Profil User A configuré${NC}"
else
    echo -e "⚠️  ${YELLOW}Profil User A: HTTP $profile_status${NC}"
fi

echo "🏢 Création entreprise User A"
company_data='{"companyName":"SecureTest Corp","siret":"98765432109876"}'
company_response=$(curl -s -w "\nSTATUS:%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $USER_A_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$company_data" \
    "$API_BASE/companies/onboarding")

company_status=$(echo "$company_response" | grep "STATUS:" | cut -d: -f2)
company_body=$(echo "$company_response" | sed '/STATUS:/d')

if [ "$company_status" -eq 201 ]; then
    echo -e "✅ ${GREEN}Entreprise créée${NC}"
    echo "   Réponse: $(echo "$company_body" | head -c 100)..."
else
    echo -e "⚠️  ${YELLOW}Entreprise: HTTP $company_status${NC}"
    echo "   Réponse: $company_body"
fi

sleep 2

echo -e "\n${BLUE}📝 Phase 3: Création d'offre d'emploi${NC}"
echo "====================================="

job_data='{
  "title": "Dev Sécurité IDOR Test",
  "description": "Poste pour tester les vulnérabilités IDOR sur les offres d emploi. Cette offre servira à valider que seul le créateur ou les membres de l entreprise peuvent la modifier.",
  "locationWKT": "POINT(2.3522 48.8566)",
  "locationName": "Paris 8ème, France"
}'

echo "🚀 User A crée une offre d'emploi"
job_response=$(curl -s -w "\nSTATUS:%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $USER_A_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$job_data" \
    "$API_BASE/job-offers")

job_status=$(echo "$job_response" | grep "STATUS:" | cut -d: -f2)
job_body=$(echo "$job_response" | sed '/STATUS:/d')

if [ "$job_status" -eq 201 ]; then
    echo -e "✅ ${GREEN}Offre créée avec succès${NC}"
    JOB_OFFER_ID=$(echo "$job_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   🆔 Job Offer ID: $JOB_OFFER_ID"
    echo "   📄 Titre: $(echo "$job_body" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "❌ ${RED}Échec création offre: HTTP $job_status${NC}"
    echo "   Réponse: $job_body"
fi

echo -e "\n${RED}🚨 Phase 4: TESTS D'ATTAQUES IDOR${NC}"
echo "================================="

if [ -n "$JOB_OFFER_ID" ]; then
    echo -e "${RED}💀 TENTATIVE D'ATTAQUE IDOR PAR USER B${NC}"
    
    # Attaque 1: Modification non autorisée
    echo -e "\n🔥 Test 1: Modification par utilisateur non autorisé"
    attack_data='{"title":"🔴 OFFRE PIRATÉE 🔴","description":"Si vous voyez ce message, la sécurité IDOR a échoué!"}'
    
    attack_response=$(curl -s -w "\nSTATUS:%{http_code}" \
        -X PUT \
        -H "Authorization: Bearer $USER_B_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$attack_data" \
        "$API_BASE/job-offers/$JOB_OFFER_ID")
    
    attack_status=$(echo "$attack_response" | grep "STATUS:" | cut -d: -f2)
    attack_body=$(echo "$attack_response" | sed '/STATUS:/d')
    
    if [ "$attack_status" -eq 403 ]; then
        echo -e "   ✅ ${GREEN}SÉCURISÉ: Modification bloquée (HTTP 403)${NC}"
        echo -e "   🛡️  Protection IDOR fonctionnelle"
    elif [ "$attack_status" -eq 401 ]; then
        echo -e "   ✅ ${GREEN}SÉCURISÉ: Non authentifié (HTTP 401)${NC}"
    else
        echo -e "   ❌ ${RED}VULNÉRABILITÉ: Modification autorisée (HTTP $attack_status)${NC}"
        echo -e "   ⚠️  RISQUE DE SÉCURITÉ DÉTECTÉ!"
        echo "   Réponse: $attack_body"
    fi
    
    # Attaque 2: Suppression non autorisée
    echo -e "\n🔥 Test 2: Suppression par utilisateur non autorisé"
    delete_response=$(curl -s -w "\nSTATUS:%{http_code}" \
        -X DELETE \
        -H "Authorization: Bearer $USER_B_TOKEN" \
        "$API_BASE/job-offers/$JOB_OFFER_ID")
    
    delete_status=$(echo "$delete_response" | grep "STATUS:" | cut -d: -f2)
    delete_body=$(echo "$delete_response" | sed '/STATUS:/d')
    
    if [ "$delete_status" -eq 403 ]; then
        echo -e "   ✅ ${GREEN}SÉCURISÉ: Suppression bloquée (HTTP 403)${NC}"
        echo -e "   🛡️  Protection IDOR fonctionnelle"
    elif [ "$delete_status" -eq 401 ]; then
        echo -e "   ✅ ${GREEN}SÉCURISÉ: Non authentifié (HTTP 401)${NC}"
    else
        echo -e "   ❌ ${RED}VULNÉRABILITÉ: Suppression autorisée (HTTP $delete_status)${NC}"
        echo -e "   ⚠️  RISQUE DE SÉCURITÉ CRITIQUE!"
    fi
    
    # Test 3: Lecture (doit être autorisée car publique)
    echo -e "\n📖 Test 3: Lecture publique"
    read_response=$(curl -s -w "\nSTATUS:%{http_code}" \
        -X GET \
        -H "Authorization: Bearer $USER_B_TOKEN" \
        "$API_BASE/job-offers/$JOB_OFFER_ID")
    
    read_status=$(echo "$read_response" | grep "STATUS:" | cut -d: -f2)
    
    if [ "$read_status" -eq 200 ]; then
        echo -e "   ✅ ${GREEN}OK: Lecture autorisée (HTTP 200)${NC}"
        echo -e "   📚 Les offres publiques sont lisibles par tous"
    else
        echo -e "   ⚠️  ${YELLOW}Lecture: HTTP $read_status${NC}"
    fi
    
else
    echo -e "   ❌ ${RED}Pas d'ID d'offre disponible pour les tests IDOR${NC}"
fi

echo -e "\n${BLUE}✅ Phase 5: Tests légitimes du propriétaire${NC}"
echo "=========================================="

if [ -n "$JOB_OFFER_ID" ]; then
    # Test modification légitime
    echo -e "\n🏆 Test: Modification par le propriétaire légitime"
    legit_update='{"title":"Offre Mise à Jour (Légitime)","description":"Mise à jour par le propriétaire - normal."}'
    
    legit_response=$(curl -s -w "\nSTATUS:%{http_code}" \
        -X PUT \
        -H "Authorization: Bearer $USER_A_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$legit_update" \
        "$API_BASE/job-offers/$JOB_OFFER_ID")
    
    legit_status=$(echo "$legit_response" | grep "STATUS:" | cut -d: -f2)
    
    if [ "$legit_status" -eq 200 ]; then
        echo -e "   ✅ ${GREEN}SUCCÈS: Modification autorisée (HTTP 200)${NC}"
        echo -e "   👤 Le propriétaire peut modifier sa propre offre"
    else
        echo -e "   ❌ ${RED}ERREUR: Propriétaire ne peut pas modifier (HTTP $legit_status)${NC}"
    fi
    
    # Nettoyage: suppression par le propriétaire
    echo -e "\n🗑️  Nettoyage: Suppression par le propriétaire"
    cleanup_response=$(curl -s -w "\nSTATUS:%{http_code}" \
        -X DELETE \
        -H "Authorization: Bearer $USER_A_TOKEN" \
        "$API_BASE/job-offers/$JOB_OFFER_ID")
    
    cleanup_status=$(echo "$cleanup_response" | grep "STATUS:" | cut -d: -f2)
    
    if [ "$cleanup_status" -eq 204 ] || [ "$cleanup_status" -eq 200 ]; then
        echo -e "   ✅ ${GREEN}SUCCÈS: Suppression autorisée${NC}"
        echo -e "   🧹 Offre de test nettoyée"
    else
        echo -e "   ⚠️  ${YELLOW}Nettoyage: HTTP $cleanup_status${NC}"
    fi
fi

echo -e "\n${GREEN}🎯 RAPPORT FINAL DE SÉCURITÉ${NC}"
echo "============================"
echo ""
echo -e "${GREEN}✅ SÉCURITÉ VALIDÉE SI:${NC}"
echo "  🛡️  Attaques modification: HTTP 403 Forbidden"
echo "  🛡️  Attaques suppression: HTTP 403 Forbidden"  
echo "  ✅ Lectures publiques: HTTP 200 OK"
echo "  ✅ Opérations propriétaire: HTTP 200/204"
echo ""
echo -e "${RED}❌ VULNÉRABILITÉS SI:${NC}"
echo "  🚨 Attaques IDOR réussissent: HTTP 200/201/204"
echo "  🚨 User B peut modifier/supprimer offres de User A"
echo ""
echo -e "${BLUE}📊 Tests effectués avec:${NC}"
echo "  👤 User A (userA2@test.com) - Créateur légitime"
echo "  👤 User B (userB@test.com) - Attaquant potentiel"
echo "  🎯 Job Offer ID: $JOB_OFFER_ID"
echo ""
echo -e "${YELLOW}🔍 Vérifiez les logs backend pour plus de détails${NC}"