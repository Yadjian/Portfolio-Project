'use client';

import React, { useState, useEffect, useReducer } from 'react';

type JobOffer = {
  id: string;
  title: string;
  description?: string;
  contractType?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
};

type State = {
  offers: JobOffer[];
  error: string | null;
  selectedService: 'list' | 'create' | 'findOffer' | 'editOffer' | null;
  foundOffer: JobOffer | null;
  form: Omit<JobOffer, 'id'> & { id?: string };
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
    contractType: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
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
        const res = await fetch('/api/joboffers');
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
    fetch('/api/joboffers')
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
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 16, justifyContent: 'center', marginBottom: 12, overflowX: 'auto' }}>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'create' ? 'var(--primary)' : 'var(--secondary)',
              color: '#fff',
              boxShadow: selectedService === 'create' ? '0 4px 12px rgba(73, 48, 163, 0.3)' : '0 4px 12px rgba(7, 185, 255, 0.3)',
            }}
            onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'create' })}
          >
            ➕ Créer une offre
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'list' ? 'var(--primary)' : 'var(--secondary)',
              color: '#fff',
              boxShadow: selectedService === 'list' ? '0 4px 12px rgba(73, 48, 163, 0.3)' : '0 4px 12px rgba(7, 185, 255, 0.3)',
            }}
            onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'list' })}
          >
            📋 Afficher les offres
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'findOffer' ? 'var(--primary)' : 'var(--secondary)',
              color: '#fff',
              boxShadow: selectedService === 'findOffer' ? '0 4px 12px rgba(73, 48, 163, 0.3)' : '0 4px 12px rgba(7, 185, 255, 0.3)',
            }}
            onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'findOffer' })}
          >
            🔍 Trouver une offre
          </button>
        </div>

        {/* Liste des offres */}
        {selectedService === 'list' && (
          <div style={styles.section}>
            <div style={styles.title}>Liste des offres</div>
            {error && <div style={styles.error}>{error}</div>}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
              <thead>
                <tr style={{ background: '#eaeaea' }}>
                  <th style={tableStyles.th}>ID</th>
                  <th style={tableStyles.th}>Titre</th>
                  <th style={tableStyles.th}>Type</th>
                  <th style={tableStyles.th}>Lieu</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer: JobOffer) => (
                  <tr key={offer.id} style={{ background: '#fff' }}>
                    <td style={tableStyles.td}>{offer.id}</td>
                    <td style={tableStyles.td}>{offer.title}</td>
                    <td style={tableStyles.td}>{offer.contractType}</td>
                    <td style={tableStyles.td}>{offer.location}</td>
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
                  const res = await fetch('/api/joboffers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                placeholder="Titre"
                required
                value={form.title}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'title', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="description"
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'description', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="contractType"
                type="text"
                placeholder="Type de contrat"
                required
                value={form.contractType}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'contractType', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="location"
                type="text"
                placeholder="Localisation"
                required
                value={form.location}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'location', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="salaryMin"
                type="number"
                placeholder="Salaire minimum (€)"
                value={form.salaryMin}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMin', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="salaryMax"
                type="number"
                placeholder="Salaire maximum (€)"
                value={form.salaryMax}
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
              <div style={{ marginTop: 24 }}>
                <strong>Titre :</strong> {foundOffer.title}<br />
                <strong>Description :</strong> {foundOffer.description}<br />
                <strong>Type :</strong> {foundOffer.contractType}<br />
                <strong>Lieu :</strong> {foundOffer.location}<br />
                <strong>Salaire minimum :</strong> {foundOffer.salaryMin}€<br />
                <strong>Salaire maximum :</strong> {foundOffer.salaryMax}€<br />
                <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                  <button
                    style={styles.smallButton}
                    onClick={() => dispatch({ type: 'START_EDIT', payload: foundOffer })}
                  >
                    Modifier
                  </button>
                  <button
                    style={{ ...styles.smallButton, background: '#e53935' }}
                    onClick={async () => {
                      if (!foundOffer) return;
                      try {
                        const res = await fetch(`/api/joboffers/${foundOffer.id}`, {
                          method: 'DELETE',
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
                    Supprimer
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
              <input
                name="editDescription"
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'description', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="editContractType"
                type="text"
                placeholder="Type de contrat"
                required
                value={form.contractType}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'contractType', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="editLocation"
                type="text"
                placeholder="Localisation"
                required
                value={form.location}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'location', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="editSalaryMin"
                type="number"
                placeholder="Salaire minimum (€)"
                value={form.salaryMin}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'salaryMin', value: e.target.value } })}
                style={styles.input}
              />
              <input
                name="editSalaryMax"
                type="number"
                placeholder="Salaire maximum (€)"
                value={form.salaryMax}
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