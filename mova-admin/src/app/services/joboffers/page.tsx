'use client';

import React, { useEffect, useReducer } from 'react';
import MovaLogo from '../../components/MovaLogo';

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
  currency?: string;
  isActive?: boolean;
  expiresAt?: string;
  experienceLevel?: string;
  company?: {
    name: string;
  };
  categories?: Array<{ name: string }>;
}

type State = {
  offers: JobOffer[];
  error: string | null;
  selectedService: 'list' | 'create' | 'findOffer' | 'editOffer' | null;
  foundOffer: JobOffer | null;
  form: Omit<JobOffer, 'id' | 'company' | 'categories' | 'contractType' | 'experienceLevel' | 'isActive' | 'createdAt' | 'updatedAt'> & { id?: string };
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
    locationWKT: '',
    locationName: '',
    workHours: '',
    currency: 'EUR',
    salaryMin: undefined,
    salaryMax: undefined,
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
        form: { ...action.payload },
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
        dispatch({ type: 'SET_OFFERS', payload: data });
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
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <div style={{
        background: 'var(--card-background)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(73, 48, 163, 0.12)',
        padding: '48px 32px',
        minWidth: 350,
        maxWidth: 900,
        marginTop: 24,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid var(--border)'
      }}>
        {/* Logo Mova */}
        <div style={{ marginBottom: 24 }}>
          <MovaLogo size={80} />
        </div>
        
        {/* Titre et bouton menu principal */}
        <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--primary)', marginBottom: 32, textAlign: 'center' }}>
          Portail Admin
        </div>
        <button
          style={{ 
            marginTop: 0, 
            background: 'var(--background)', 
            color: 'var(--primary)', 
            border: '2px solid var(--border)', 
            borderRadius: 12, 
            padding: '12px 32px', 
            fontWeight: 600, 
            cursor: 'pointer',
            fontSize: 15,
            transition: 'all 0.2s'
          }}
          onClick={() => window.location.href = '/homepage'}
        >
          Retour au menu principal
        </button>

        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--primary)', marginTop: 32, marginBottom: 32, textAlign: 'center' }}>
          💼 Services Offres d&apos;emploi
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 32 }}>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'create' ? 'var(--primary)' : 'transparent',
              color: selectedService === 'create' ? '#fff' : 'var(--primary)',
              border: '2px solid var(--primary)',
            }}
            onMouseOver={(e) => {
              if (selectedService !== 'create') {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseOut={(e) => {
              if (selectedService !== 'create') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary)';
              }
            }}
            onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'create' })}
          >
            ➕ Créer une offre
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'list' ? 'var(--primary)' : 'transparent',
              color: selectedService === 'list' ? '#fff' : 'var(--primary)',
              border: '2px solid var(--primary)',
            }}
            onMouseOver={(e) => {
              if (selectedService !== 'list') {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseOut={(e) => {
              if (selectedService !== 'list') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary)';
              }
            }}
            onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'list' })}
          >
            📋 Lister les offres
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'findOffer' ? 'var(--primary)' : 'transparent',
              color: selectedService === 'findOffer' ? '#fff' : 'var(--primary)',
              border: '2px solid var(--primary)',
            }}
            onMouseOver={(e) => {
              if (selectedService !== 'findOffer') {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseOut={(e) => {
              if (selectedService !== 'findOffer') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary)';
              }
            }}
            onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'findOffer' })}
          >
            🔍 Rechercher une offre
          </button>
        </div>

        {/* Liste des offres */}
        {selectedService === 'list' && (
          <div style={styles.section}>
            <div style={styles.title}>Lister les offres</div>
            {error && <div style={styles.error}>{error}</div>}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
              <thead>
                <tr style={{ background: '#eaeaea' }}>
                  <th style={tableStyles.th}>ID</th>
                  <th style={tableStyles.th}>Entreprise</th>
                  <th style={tableStyles.th}>Titre</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer: JobOffer) => (
                  <tr key={offer.id} style={{ background: '#fff' }}>
                    <td style={tableStyles.td}>{offer.id}</td>
                    <td style={tableStyles.td}>{offer.company?.name || 'N/A'}</td>
                    <td style={tableStyles.td}>{offer.title}</td>
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
              <input
                name="title"
                type="text"
                placeholder="Titre de l'offre"
                required
                value={form.title}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'title', value: e.target.value } })}
                style={styles.input}
              />
              <textarea
                name="description"
                placeholder="Description complète de l'offre"
                required
                value={form.description}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'description', value: e.target.value } })}
                style={{...styles.input, height: 100, resize: 'vertical' as const}}
              />
              <input
                name="locationName"
                type="text"
                placeholder="Ville (ex: Paris, Lyon)"
                required
                value={form.locationName}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'locationName', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="locationWKT"
                type="text"
                placeholder="Coordonnées GPS (ex: POINT(2.3522 48.8566))"
                required
                value={form.locationWKT}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'locationWKT', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="workHours"
                type="text"
                placeholder="Horaires (ex: 35h/semaine, 9h-17h)"
                value={form.workHours}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'workHours', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="salaryMin"
                type="number"
                placeholder="Salaire minimum (€/an)"
                value={form.salaryMin || ''}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMin', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="salaryMax"
                type="number"
                placeholder="Salaire maximum (€/an)"
                value={form.salaryMax || ''}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMax', value: e.target.value } })}
                style={styles.input}
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
                marginTop: 24, 
                width: '100%', 
                maxWidth: 600,
                background: 'var(--card-background)',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 4px 16px rgba(73, 48, 163, 0.08)',
                border: '1px solid var(--border)',
              }}>
                {/* En-tête avec titre et statut */}
                <div style={{ 
                  marginBottom: 20, 
                  paddingBottom: 16, 
                  borderBottom: '2px solid var(--border)' 
                }}>
                  <div style={{ 
                    fontSize: 22, 
                    fontWeight: 700, 
                    color: 'var(--primary)',
                    marginBottom: 8 
                  }}>
                    {foundOffer.title}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    fontSize: 14 
                  }}>
                    <span style={{ 
                      background: foundOffer.isActive ? '#10b981' : '#ef4444',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 13
                    }}>
                      {foundOffer.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                    <span style={{ color: '#666', fontSize: 13 }}>
                      ID: {foundOffer.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>

                {/* Informations principales */}
                <div style={{ marginBottom: 20 }}>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>🏢 Entreprise</span>
                    <span style={detailStyles.value}>{foundOffer.company?.name || 'Non spécifiée'}</span>
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>📝 Description</span>
                    <span style={detailStyles.value}>{foundOffer.description}</span>
                  </div>
                </div>

                {/* Détails du contrat */}
                <div style={{ 
                  background: 'var(--background)', 
                  borderRadius: 12, 
                  padding: 16,
                  marginBottom: 20 
                }}>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 700, 
                    color: 'var(--primary)',
                    marginBottom: 12 
                  }}>
                    📋 Détails du contrat
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>Type de contrat</span>
                    <span style={detailStyles.value}>{foundOffer.contractType}</span>
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>Niveau d&apos;expérience</span>
                    <span style={detailStyles.value}>{foundOffer.experienceLevel || 'Non spécifié'}</span>
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>⏰ Horaires</span>
                    <span style={detailStyles.value}>{foundOffer.workHours || 'Non spécifiés'}</span>
                  </div>
                </div>

                {/* Localisation */}
                <div style={{ 
                  background: 'var(--background)', 
                  borderRadius: 12, 
                  padding: 16,
                  marginBottom: 20 
                }}>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 700, 
                    color: 'var(--primary)',
                    marginBottom: 12 
                  }}>
                    📍 Localisation
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>Lieu</span>
                    <span style={detailStyles.value}>{foundOffer.locationName || 'Non spécifié'}</span>
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>Coordonnées GPS</span>
                    <span style={{ ...detailStyles.value, fontSize: 12, fontFamily: 'monospace' }}>
                      {foundOffer.locationWKT || 'Non spécifiées'}
                    </span>
                  </div>
                </div>

                {/* Rémunération */}
                <div style={{ 
                  background: 'var(--background)', 
                  borderRadius: 12, 
                  padding: 16,
                  marginBottom: 20 
                }}>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 700, 
                    color: 'var(--primary)',
                    marginBottom: 12 
                  }}>
                    💰 Rémunération
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>Salaire minimum</span>
                    <span style={detailStyles.value}>
                      {foundOffer.salaryMin ? `${foundOffer.salaryMin.toLocaleString()} ${foundOffer.currency || '€'}` : 'Non spécifié'}
                    </span>
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>Salaire maximum</span>
                    <span style={detailStyles.value}>
                      {foundOffer.salaryMax ? `${foundOffer.salaryMax.toLocaleString()} ${foundOffer.currency || '€'}` : 'Non spécifié'}
                    </span>
                  </div>
                </div>

                {/* Informations complémentaires */}
                <div style={{ 
                  background: 'var(--background)', 
                  borderRadius: 12, 
                  padding: 16,
                  marginBottom: 20 
                }}>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 700, 
                    color: 'var(--primary)',
                    marginBottom: 12 
                  }}>
                    ℹ️ Informations complémentaires
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>🏷️ Catégories</span>
                    <span style={detailStyles.value}>
                      {foundOffer.categories?.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {foundOffer.categories.map((c, i) => (
                            <span key={i} style={{
                              background: 'var(--primary)',
                              color: '#fff',
                              padding: '3px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600
                            }}>
                              {c.name}
                            </span>
                          ))}
                        </div>
                      ) : 'Aucune'}
                    </span>
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>📅 Date de création</span>
                    <span style={detailStyles.value}>
                      {foundOffer.createdAt ? new Date(foundOffer.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </span>
                  </div>
                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>⏳ Date d&apos;expiration</span>
                    <span style={detailStyles.value}>
                      {foundOffer.expiresAt ? new Date(foundOffer.expiresAt).toLocaleDateString('fr-FR') : 'Pas de date d\'expiration'}
                    </span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
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
              <input
                name="editTitle"
                type="text"
                placeholder="Titre"
                required
                value={form.title}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'title', value: e.target.value } })}
                style={styles.input}
              />
              <textarea
                name="editDescription"
                placeholder="Description"
                required
                value={form.description}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'description', value: e.target.value } })}
                style={{...styles.input, height: 100, resize: 'vertical' as const}}
              />
              <input
                name="editLocationName"
                type="text"
                placeholder="Ville"
                required
                value={form.locationName}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'locationName', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="editLocationWKT"
                type="text"
                placeholder="Coordonnées GPS"
                required
                value={form.locationWKT}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'locationWKT', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="editWorkHours"
                type="text"
                placeholder="Horaires"
                value={form.workHours}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'workHours', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="editSalaryMin"
                type="number"
                placeholder="Salaire minimum (€)"
                value={form.salaryMin || ''}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMin', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="editSalaryMax"
                type="number"
                placeholder="Salaire maximum (€)"
                value={form.salaryMax || ''}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMax', value: e.target.value } })}
                style={styles.input}
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
  );
}

const styles = {
  section: {
    width: '100%',
    background: 'var(--background)',
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    boxShadow: '0 4px 16px rgba(73, 48, 163, 0.08)',
    border: '1px solid var(--border)',
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
    width: 140,
    height: 44,
    borderRadius: 12,
    background: 'var(--primary)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(73, 48, 163, 0.3)',
    transition: 'all 0.2s',
  },
  backButton: {
    marginTop: 24,
    background: 'var(--background)',
    color: 'var(--primary)',
    border: '2px solid var(--border)',
    borderRadius: 12,
    padding: '12px 32px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 15,
    transition: 'all 0.2s',
  },
  input: {
    width: '100%',
    maxWidth: 300,
    padding: 14,
    borderRadius: 12,
    border: '2px solid var(--border)',
    marginBottom: 16,
    fontSize: 15,
    boxSizing: 'border-box' as const,
    background: 'var(--card-background)',
  },
  error: {
    color: 'var(--error)',
    marginBottom: 16,
    fontWeight: 600,
    textAlign: 'center' as const,
    padding: 12,
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: 24,
    textAlign: 'center' as const,
  },
};

const tableStyles = {
  th: {
    padding: '14px 18px',
    textAlign: 'left' as const,
    fontWeight: 700,
    color: 'var(--primary)',
    fontSize: 15,
    borderBottom: '2px solid var(--border)',
    background: 'var(--background)',
  },
  td: {
    padding: '14px 18px',
    fontSize: 15,
    borderBottom: '1px solid var(--background)',
    color: '#333',
  },
};

const detailStyles = {
  row: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#666',
  },
  value: {
    fontSize: 15,
    fontWeight: 500,
    color: '#333',
  },
};