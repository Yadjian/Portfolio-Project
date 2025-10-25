'use client';

import React, { useEffect, useReducer, useState } from 'react';
import MovaLogo from '../../components/MovaLogo';

interface JobCategory {
  id: string;
  name: string;
}

interface JobOffer {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  contractType: string;
  locationWKT?: string;
  locationName?: string;
  salaryMin?: number;
  salaryMax?: number;
  workHours?: string;
  experienceLevel?: string;
  recruiter?: {
    firstName: string;
    lastName: string;
    company?: {
      name: string;
    };
  };
}

type State = {
  offers: JobOffer[];
  error: string | null;
  selectedService: 'list' | 'create' | 'findOffer' | 'editOffer' | null;
  foundOffer: JobOffer | null;
  form: {
    id?: string;
    title: string;
    description: string;
    contractType: string;
    experienceLevel: string;
    workHours: string;
    locationName: string;
    locationWKT: string;
    salaryMin: number | null;
    salaryMax: number | null;
  };
};

type Action =
  | { type: 'SET_OFFERS'; payload: JobOffer[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_SERVICE'; payload: State['selectedService'] }
  | { type: 'SET_FOUND_OFFER'; payload: JobOffer | null }
  | { type: 'START_EDIT'; payload: JobOffer }
  | { type: 'UPDATE_FORM'; payload: { field: keyof State['form']; value: string } }
  | { type: 'RESET' };

const initialState: State = {
  offers: [],
  error: null,
  selectedService: null,
  foundOffer: null,
  form: {
    title: '',
    description: '',
    contractType: 'CDI',
    experienceLevel: 'DEBUTANT',
    workHours: '',
    locationName: '',
    locationWKT: '',
    salaryMin: null,
    salaryMax: null,
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_OFFERS':
      return { ...state, offers: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_SERVICE':
      const newService = state.selectedService === action.payload ? null : action.payload;
      return { ...initialState, offers: state.offers, selectedService: newService };
    case 'SET_FOUND_OFFER':
      return { ...state, foundOffer: action.payload, error: action.payload ? null : 'Offre introuvable' };
    case 'START_EDIT':
      return {
        ...state,
        selectedService: 'editOffer',
        foundOffer: null,
        form: {
          id: action.payload.id,
          title: action.payload.title,
          description: action.payload.description,
          contractType: action.payload.contractType,
          experienceLevel: action.payload.experienceLevel || 'DEBUTANT',
          workHours: action.payload.workHours || '',
          locationName: action.payload.locationName || '',
          locationWKT: action.payload.locationWKT || '',
          salaryMin: action.payload.salaryMin ?? null,
          salaryMax: action.payload.salaryMax ?? null,
        },
      };
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, [action.payload.field]: action.payload.value } };
    case 'RESET':
      return { ...initialState, offers: state.offers, selectedService: 'list' };
    default:
      return state;
  }
}

export default function JobOffersServices() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { offers, error, selectedService, foundOffer, form } = state;
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);

  // Charger les catégories d'emploi
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/meta/job-categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Catégories chargées:', data);
          setJobCategories(data);
        } else {
          console.error('Erreur HTTP:', res.status, res.statusText);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/joboffers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        
        // Mapper createdBy vers recruiter pour correspondre à l'interface
        const mappedData = data.map((offer: any) => ({
          ...offer,
          recruiter: offer.createdBy ? {
            firstName: offer.createdBy.firstName,
            lastName: offer.createdBy.lastName,
            company: offer.createdBy.memberships?.[0]?.company,
          } : undefined,
        }));
        
        dispatch({ type: 'SET_OFFERS', payload: mappedData });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur de chargement' });
      }
    };
    fetchOffers();
  }, []);

    const refetchOffers = () => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/joboffers', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_OFFERS', payload: data }));
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(73, 48, 163, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          padding: '32px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid #4930a3'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <MovaLogo size={60} />
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#4930a3', marginBottom: 4 }}>
                Gestion des Offres d&apos;Emploi
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>
                Portail Administrateur Mova
              </div>
            </div>
          </div>
          <button
            style={{ 
              background: '#4930a3', 
              color: '#fff',
              border: 'none', 
              borderRadius: 8, 
              padding: '10px 24px', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onClick={() => window.location.href = '/homepage'}
          >
            ← Retour au menu
          </button>
        </div>

        {/* Navigation des services */}
        <div style={{ 
          padding: '32px 48px',
          borderBottom: '1px solid #e8e9ff'
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#666', marginBottom: 20 }}>
            Services disponibles
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              style={{
                ...styles.navButton,
                background: selectedService === 'create' ? 'var(--primary)' : '#f8f9ff',
                color: selectedService === 'create' ? '#fff' : 'var(--primary)',
                border: selectedService === 'create' ? '2px solid var(--primary)' : '2px solid #e0e0ff',
              }}
              onMouseOver={(e) => {
                if (selectedService !== 'create') {
                  e.currentTarget.style.background = '#e8e9ff';
                }
              }}
              onMouseOut={(e) => {
                if (selectedService !== 'create') {
                  e.currentTarget.style.background = '#f8f9ff';
                }
              }}
              onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'create' })}
            >
              ➕ Créer une offre
            </button>
            <button
              style={{
                ...styles.navButton,
                background: selectedService === 'list' ? 'var(--primary)' : '#f8f9ff',
                color: selectedService === 'list' ? '#fff' : 'var(--primary)',
                border: selectedService === 'list' ? '2px solid var(--primary)' : '2px solid #e0e0ff',
              }}
              onMouseOver={(e) => {
                if (selectedService !== 'list') {
                  e.currentTarget.style.background = '#e8e9ff';
                }
              }}
              onMouseOut={(e) => {
                if (selectedService !== 'list') {
                  e.currentTarget.style.background = '#f8f9ff';
                }
              }}
              onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'list' })}
            >
              📋 Lister les offres
            </button>
            <button
              style={{
                ...styles.navButton,
                background: selectedService === 'findOffer' ? 'var(--primary)' : '#f8f9ff',
                color: selectedService === 'findOffer' ? '#fff' : 'var(--primary)',
                border: selectedService === 'findOffer' ? '2px solid var(--primary)' : '2px solid #e0e0ff',
              }}
              onMouseOver={(e) => {
                if (selectedService !== 'findOffer') {
                  e.currentTarget.style.background = '#e8e9ff';
                }
              }}
              onMouseOut={(e) => {
                if (selectedService !== 'findOffer') {
                  e.currentTarget.style.background = '#f8f9ff';
                }
              }}
              onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'findOffer' })}
            >
              🔍 Rechercher une offre
            </button>
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: '48px' }}>

        {/* Liste des offres */}
        {selectedService === 'list' && (
          <div style={styles.section}>
            <div style={styles.title}>Lister les offres</div>
            {error && <div style={styles.error}>{error}</div>}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
              <thead>
                <tr style={{ background: '#eaeaea' }}>
                  <th style={tableStyles.th}>ID</th>
                  <th style={tableStyles.th}>Recruteur</th>
                  <th style={tableStyles.th}>Titre (Poste)</th>
                  <th style={tableStyles.th}>Lieu</th>
                  <th style={tableStyles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer: JobOffer) => (
                  <tr key={offer.id} style={{ background: '#fff' }}>
                    <td style={{...tableStyles.td, fontFamily: 'monospace', fontSize: 11, maxWidth: 100, wordBreak: 'break-all' as const}}>
                      {offer.id}
                    </td>
                    <td style={tableStyles.td}>{offer.recruiter ? `${offer.recruiter.firstName} ${offer.recruiter.lastName}` : 'N/A'}</td>
                    <td style={tableStyles.td}>{offer.title}</td>
                    <td style={tableStyles.td}>{offer.locationName || 'Non spécifié'}</td>
                    <td style={tableStyles.td}>
                      <button
                        style={{
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(offer.id);
                          alert('ID copié !');
                        }}
                      >
                        📋 Copier ID
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Création offre */}
        {selectedService === 'create' && (
          <div style={styles.section}>
            <div style={styles.title}>Créer une offre</div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                dispatch({ type: 'SET_ERROR', payload: null });
                try {
                  const token = localStorage.getItem('accessToken');
                  const res = await fetch('/api/joboffers', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                  });
                  if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Erreur lors de la création');
                  }
                  refetchOffers();
                  dispatch({ type: 'RESET' });
                } catch (err) {
                  dispatch({
                    type: 'SET_ERROR',
                    payload: err instanceof Error ? err.message : 'Erreur inconnue',
                  });
                }
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <select
                name="title"
                required
                value={form.title}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'title', value: e.target.value } })}
                style={styles.input}
              >
                <option value="">Sélectionner un poste</option>
                {jobCategories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                name="contractType"
                required
                value={form.contractType}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'contractType', value: e.target.value } })}
                style={styles.input}
              >
                <option value="">Type de contrat</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="INTERIM">Intérim</option>
                <option value="ALTERNANCE">Alternance</option>
                <option value="STAGE">Stage</option>
              </select>

              <select
                name="experienceLevel"
                required
                value={form.experienceLevel}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'experienceLevel', value: e.target.value } })}
                style={styles.input}
              >
                <option value="">Expérience requise</option>
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="CONFIRME">Confirmé</option>
              </select>

              <input
                name="workHours"
                type="text"
                placeholder="Heures / semaine (ex: 35)"
                value={form.workHours}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'workHours', value: e.target.value } })}
                style={styles.input}
              />

              <input
                name="locationName"
                type="text"
                placeholder="Lieu (ex: Paris, Lyon)"
                required
                value={form.locationName}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'locationName', value: e.target.value } })}
                style={styles.input}
              />

              <input
                name="salaryMin"
                type="number"
                placeholder="Salaire minimum (€ brut mensuel)"
                value={form.salaryMin || ''}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMin', value: e.target.value } })}
                style={styles.input}
              />
              
              <input
                name="salaryMax"
                type="number"
                placeholder="Salaire maximum (€ brut mensuel)"
                value={form.salaryMax || ''}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMax', value: e.target.value } })}
                style={styles.input}
              />

              <textarea
                name="description"
                placeholder="Description du poste"
                required
                value={form.description}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'description', value: e.target.value } })}
                style={{...styles.input, height: 120, resize: 'vertical' as const}}
              />
              
              <button type="submit" style={styles.smallButton}>
                Créer
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
          </div>
        )}

        {/* Trouver une offre */}
        {selectedService === 'findOffer' && (
          <div style={styles.section}>
            <div style={styles.title}>Trouver une offre par ID</div>
            <form
              onSubmit={e => {
                e.preventDefault();
                const id = e.currentTarget.offerId.value;
                const found = offers.find(o => o.id === id);
                dispatch({ type: 'SET_FOUND_OFFER', payload: found || null });
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <input
                name="offerId"
                type="text"
                placeholder="ID offre"
                required
                style={styles.input}
              />
              <button type="submit" style={styles.smallButton}>
                Rechercher
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
            {foundOffer && (
              <div style={{ 
                marginTop: 32,
                background: '#fff',
                borderRadius: 12,
                padding: 0,
                boxShadow: '0 2px 16px rgba(73, 48, 163, 0.1)',
                border: '1px solid #e0e0ff',
                overflow: 'hidden',
              }}>
                {/* En-tête avec gradient */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #4930a3 0%, #6746a8 100%)',
                  padding: 24,
                  color: '#fff'
                }}>
                  <div style={{ 
                    fontSize: 26, 
                    fontWeight: 700,
                    marginBottom: 8 
                  }}>
                    {foundOffer.title}
                  </div>
                  <div style={{ 
                    fontSize: 12,
                    opacity: 0.9,
                    fontFamily: 'monospace'
                  }}>
                    ID: {foundOffer.id}
                  </div>
                </div>

                <div style={{ padding: 32 }}>
                  {/* Grille d'informations */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 24,
                    marginBottom: 32
                  }}>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>👤 Recruteur</span>
                      <span style={detailStyles.value}>
                        {foundOffer.recruiter ? `${foundOffer.recruiter.firstName} ${foundOffer.recruiter.lastName}` : 'Non spécifié'}
                      </span>
                    </div>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>🏢 Entreprise</span>
                      <span style={detailStyles.value}>{foundOffer.recruiter?.company?.name || 'Non spécifiée'}</span>
                    </div>
                  </div>

                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>📝 Description</span>
                    <span style={detailStyles.value}>{foundOffer.description}</span>
                  </div>

                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 20,
                    marginTop: 32,
                    marginBottom: 24
                  }}>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>📋 Type de contrat</span>
                      <span style={detailStyles.value}>{foundOffer.contractType}</span>
                    </div>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>📊 Expérience</span>
                      <span style={detailStyles.value}>{foundOffer.experienceLevel || 'Non spécifié'}</span>
                    </div>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>⏰ Heures / sem</span>
                      <span style={detailStyles.value}>{foundOffer.workHours ? `${foundOffer.workHours}h` : 'Non spécifiées'}</span>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 20,
                    marginBottom: 24
                  }}>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>📍 Lieu</span>
                      <span style={detailStyles.value}>{foundOffer.locationName || 'Non spécifié'}</span>
                    </div>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>💰 Salaire min</span>
                      <span style={detailStyles.value}>
                        {foundOffer.salaryMin ? `${foundOffer.salaryMin.toLocaleString()} €` : 'Non spécifié'}
                      </span>
                    </div>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>💰 Salaire max</span>
                      <span style={detailStyles.value}>
                        {foundOffer.salaryMax ? `${foundOffer.salaryMax.toLocaleString()} €` : 'Non spécifié'}
                      </span>
                    </div>
                  </div>

                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>📅 Date de création</span>
                    <span style={detailStyles.value}>
                      {foundOffer.createdAt ? new Date(foundOffer.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </span>
                  </div>

                  {/* Boutons d'action */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid #e0e0ff' }}>
                    <button
                      style={styles.smallButton}
                      onClick={() => dispatch({ type: 'START_EDIT', payload: foundOffer })}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      style={{ ...styles.smallButton, background: '#e53935' }}
                      onClick={async () => {
                        if (!foundOffer) return;
                        if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
                        try {
                          const token = localStorage.getItem('accessToken');
                          const res = await fetch(`/api/joboffers/${foundOffer.id}`, {
                            method: 'DELETE',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                            },
                          });
                          if (!res.ok) throw new Error('Erreur lors de la suppression');
                          refetchOffers();
                          dispatch({ type: 'TOGGLE_SERVICE', payload: null });
                        } catch (err) {
                          const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
                          dispatch({ type: 'SET_ERROR', payload: message });
                        }
                      }}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modifier une offre */}
        {selectedService === 'editOffer' && (
          <div style={styles.section}>
            <div style={styles.title}>Modifier une offre</div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                dispatch({ type: 'SET_ERROR', payload: null });
                try {
                  const res = await fetch(`/api/joboffers/${form.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                  });
                  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
                  refetchOffers();
                  dispatch({ type: 'RESET' });
                } catch (err) {
                  const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
                  dispatch({ type: 'SET_ERROR', payload: message });
                }
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <select
                name="editTitle"
                required
                value={form.title}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'title', value: e.target.value } })}
                style={styles.input}
              >
                <option value="">Sélectionner un poste</option>
                {jobCategories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                name="editContractType"
                required
                value={form.contractType}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'contractType', value: e.target.value } })}
                style={styles.input}
              >
                <option value="">Type de contrat</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="INTERIM">Intérim</option>
                <option value="ALTERNANCE">Alternance</option>
                <option value="STAGE">Stage</option>
              </select>

              <select
                name="editExperienceLevel"
                required
                value={form.experienceLevel}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'experienceLevel', value: e.target.value } })}
                style={styles.input}
              >
                <option value="">Expérience requise</option>
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="CONFIRME">Confirmé</option>
              </select>

              <input
                name="editWorkHours"
                type="text"
                placeholder="Heures / semaine"
                value={form.workHours}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'workHours', value: e.target.value } })}
                style={styles.input}
              />

              <input
                name="editLocationName"
                type="text"
                placeholder="Lieu"
                required
                value={form.locationName}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'locationName', value: e.target.value } })}
                style={styles.input}
              />

              <input
                name="editSalaryMin"
                type="number"
                placeholder="Salaire minimum (€ brut mensuel)"
                value={form.salaryMin || ''}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMin', value: e.target.value } })}
                style={styles.input}
              />
              
              <input
                name="editSalaryMax"
                type="number"
                placeholder="Salaire maximum (€ brut mensuel)"
                value={form.salaryMax || ''}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMax', value: e.target.value } })}
                style={styles.input}
              />

              <textarea
                name="editDescription"
                placeholder="Description"
                required
                value={form.description}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'description', value: e.target.value } })}
                style={{...styles.input, height: 120, resize: 'vertical' as const}}
              />
              
              <button type="submit" style={styles.smallButton}>
                Enregistrer
              </button>
              <button
                type="button"
                style={styles.backButton}
                onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: null })}
              >
                Annuler
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  section: {
    width: '100%',
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    marginBottom: 24,
  },
  navButton: {
    padding: '12px 24px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  },
  button: {
    width: 240,
    height: 52,
    borderRadius: 12,
    background: 'var(--secondary)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  smallButton: {
    padding: '10px 20px',
    borderRadius: 8,
    background: 'var(--primary)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(73, 48, 163, 0.2)',
    transition: 'all 0.2s',
  },
  backButton: {
    marginTop: 16,
    padding: '10px 20px',
    background: '#f8f9ff',
    color: 'var(--primary)',
    border: '2px solid #e0e0ff',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.2s',
  },
  input: {
    width: '100%',
    maxWidth: 500,
    padding: 12,
    borderRadius: 8,
    border: '2px solid #e0e0ff',
    marginBottom: 16,
    fontSize: 14,
    boxSizing: 'border-box' as const,
    background: '#fff',
  },
  error: {
    color: '#e53935',
    marginTop: 16,
    fontWeight: 600,
    textAlign: 'center' as const,
    padding: 12,
    background: 'rgba(229, 57, 53, 0.1)',
    borderRadius: 8,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: 24,
  },
};

const tableStyles = {
  th: {
    padding: '16px 20px',
    textAlign: 'left' as const,
    fontWeight: 700,
    color: '#4930a3',
    fontSize: 13,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: '3px solid #4930a3',
    background: '#f8f9ff',
  },
  td: {
    padding: '16px 20px',
    fontSize: 14,
    borderBottom: '1px solid #f0f0f0',
    color: '#333',
    verticalAlign: 'middle' as const,
  },
};

const detailStyles = {
  row: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  value: {
    fontSize: 15,
    fontWeight: 500,
    color: '#333',
    lineHeight: 1.6,
  },
};