'use client';

import React, { useState } from 'react';

type JobOffer = {
  id: string;
  title: string;
  description?: string;
  contractType?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
};

export default function JobOffersServices() {
  const [offers, setOffers] = useState<JobOffer[]>([
    {
      id: '1',
      title: 'Développeur React',
      description: 'CDI - Paris',
      contractType: 'CDI',
      location: 'Paris',
      salaryMin: '2500',
      salaryMax: '3500',
    },
    {
      id: '2',
      title: 'Designer UX',
      description: 'Freelance - Lyon',
      contractType: 'Freelance',
      location: 'Lyon',
      salaryMin: '2000',
      salaryMax: '3000',
    },
  ]);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [foundOffer, setFoundOffer] = useState<JobOffer | null>(null);

  // States pour création/modification
  const [editOfferId, setEditOfferId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editContractType, setEditContractType] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSalaryMin, setEditSalaryMin] = useState('');
  const [editSalaryMax, setEditSalaryMax] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contractType, setContractType] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  // Fonction pour dérouler/renrouler le service
  const toggleService = (service: string) => {
    setError('');
    setFoundOffer(null);
    setEditOfferId('');
    setEditTitle('');
    setEditDescription('');
    setEditContractType('');
    setEditLocation('');
    setEditSalaryMin('');
    setEditSalaryMax('');
    setTitle('');
    setDescription('');
    setContractType('');
    setLocation('');
    setSalaryMin('');
    setSalaryMax('');
    setSelectedService(selectedService === service ? null : service);
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#f8f9ff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        padding: '32px 24px',
        minWidth: 350,
        marginTop: 24,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Titre et bouton menu principal */}
        <div style={{ fontSize: 32, fontWeight: 700, color: '#6746a8', marginBottom: 32, textAlign: 'center' }}>
          Portail Admin
        </div>
        <button
          style={{ marginTop: 0, background: '#eaeaea', color: '#6746a8', border: 'none', borderRadius: 18, padding: '10px 32px', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => window.location.href = '/homepage'}
        >
          Retour au menu principal
        </button>

        <div style={{ fontSize: 28, fontWeight: 700, color: '#6746a8', marginBottom: 32, textAlign: 'center' }}>
          Services Offres
        </div>
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 16, justifyContent: 'center', marginBottom: 12, overflowX: 'auto' }}>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'create' ? '#6746a8' : '#07b9ff',
              color: '#fff',
              boxShadow: selectedService === 'create' ? '0 2px 8px rgba(103,70,168,0.15)' : styles.button.boxShadow,
            }}
            onClick={() => toggleService('create')}
          >
            Créer une offre
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'list' ? '#6746a8' : '#07b9ff',
              color: '#fff',
              boxShadow: selectedService === 'list' ? '0 2px 8px rgba(103,70,168,0.15)' : styles.button.boxShadow,
            }}
            onClick={() => toggleService('list')}
          >
            Afficher les offres
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'findOffer' ? '#6746a8' : '#07b9ff',
              color: '#fff',
              boxShadow: selectedService === 'findOffer' ? '0 2px 8px rgba(103,70,168,0.15)' : styles.button.boxShadow,
            }}
            onClick={() => toggleService('findOffer')}
          >
            Trouver une offre
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
              onSubmit={e => {
                e.preventDefault();
                setError('');
                const newOffer = {
                  id: Date.now().toString(),
                  title,
                  description,
                  contractType,
                  location,
                  salaryMin,
                  salaryMax,
                };
                setOffers(offers => [...offers, newOffer]);
                setTitle('');
                setDescription('');
                setContractType('');
                setLocation('');
                setSalaryMin('');
                setSalaryMax('');
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <input
                name="title"
                type="text"
                placeholder="Titre"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={styles.input}
              />
              <input
                name="description"
                type="text"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={styles.input}
              />
              <input
                name="contractType"
                type="text"
                placeholder="Type de contrat"
                required
                value={contractType}
                onChange={e => setContractType(e.target.value)}
                style={styles.input}
              />
              <input
                name="location"
                type="text"
                placeholder="Localisation"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={styles.input}
              />
              <input
                name="salaryMin"
                type="number"
                placeholder="Salaire minimum (€)"
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value)}
                style={styles.input}
              />
              <input
                name="salaryMax"
                type="number"
                placeholder="Salaire maximum (€)"
                value={salaryMax}
                onChange={e => setSalaryMax(e.target.value)}
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
                setError('');
                const id = e.currentTarget.offerId.value;
                const offer = offers.find(o => o.id === id);
                if (offer) {
                  setFoundOffer(offer);
                  setError('');
                } else {
                  setFoundOffer(null);
                  setError("Offre introuvable");
                }
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
                    onClick={() => {
                      setEditOfferId(foundOffer.id);
                      setEditTitle(foundOffer.title || '');
                      setEditDescription(foundOffer.description || '');
                      setEditContractType(foundOffer.contractType || '');
                      setEditLocation(foundOffer.location || '');
                      setEditSalaryMin(foundOffer.salaryMin || '');
                      setEditSalaryMax(foundOffer.salaryMax || '');
                      setSelectedService('editOffer');
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    style={{ ...styles.smallButton, background: '#e53935' }}
                    onClick={() => {
                      setOffers(offers.filter(o => o.id !== foundOffer.id));
                      setFoundOffer(null);
                      setError('');
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
              onSubmit={e => {
                e.preventDefault();
                setError('');
                setOffers(offers =>
                  offers.map(o =>
                    o.id === editOfferId
                      ? {
                          ...o,
                          title: editTitle,
                          description: editDescription,
                          contractType: editContractType,
                          location: editLocation,
                          salaryMin: editSalaryMin,
                          salaryMax: editSalaryMax,
                        }
                      : o
                  )
                );
                setEditOfferId('');
                setEditTitle('');
                setEditDescription('');
                setEditContractType('');
                setEditLocation('');
                setEditSalaryMin('');
                setEditSalaryMax('');
                setSelectedService(null);
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <input
                name="editTitle"
                type="text"
                placeholder="Titre"
                required
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                style={styles.input}
              />
              <input
                name="editDescription"
                type="text"
                placeholder="Description"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                style={styles.input}
              />
              <input
                name="editContractType"
                type="text"
                placeholder="Type de contrat"
                required
                value={editContractType}
                onChange={e => setEditContractType(e.target.value)}
                style={styles.input}
              />
              <input
                name="editLocation"
                type="text"
                placeholder="Localisation"
                required
                value={editLocation}
                onChange={e => setEditLocation(e.target.value)}
                style={styles.input}
              />
              <input
                name="editSalaryMin"
                type="number"
                placeholder="Salaire minimum (€)"
                value={editSalaryMin}
                onChange={e => setEditSalaryMin(e.target.value)}
                style={styles.input}
              />
              <input
                name="editSalaryMax"
                type="number"
                placeholder="Salaire maximum (€)"
                value={editSalaryMax}
                onChange={e => setEditSalaryMax(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.smallButton}>
                Enregistrer
              </button>
              <button
                type="button"
                style={styles.backButton}
                onClick={() => {
                  setEditOfferId('');
                  setEditTitle('');
                  setEditDescription('');
                  setEditContractType('');
                  setEditLocation('');
                  setEditSalaryMin('');
                  setEditSalaryMax('');
                  setSelectedService(null);
                }}
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
    background: '#f3f4fa',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  button: {
    width: 220,
    height: 44,
    borderRadius: 18,
    background: '#07b9ff',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    border: 'none',
    marginBottom: 0,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    transition: 'background 0.2s',
  },
  smallButton: {
    width: 120,
    height: 36,
    borderRadius: 12,
    background: '#6746a8',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    border: 'none',
    marginBottom: 0,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(103,70,168,0.10)',
    transition: 'background 0.2s',
  },
  backButton: {
    marginTop: 24,
    background: '#eaeaea',
    color: '#6746a8',
    border: 'none',
    borderRadius: 18,
    padding: '10px 32px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  input: {
    width: 220,
    padding: '10px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    marginBottom: 14,
    fontSize: 15,
  },
  error: {
    color: '#e53935',
    marginBottom: 14,
    fontWeight: 600,
    textAlign: 'center' as const,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#6746a8',
    marginBottom: 18,
    textAlign: 'center' as const,
  },
};

const tableStyles = {
  th: {
    padding: '10px 8px',
    textAlign: 'left' as const,
    fontWeight: 700,
    color: '#6746a8',
    fontSize: 16,
    borderBottom: '2px solid #d1d5db',
  },
  td: {
    padding: '8px 8px',
    fontSize: 15,
    borderBottom: '1px solid #f3f4fa',
  },
};