'use client';

import React, { useState } from 'react';
import MovaLogo from '../../components/MovaLogo';

type User = {
  id: string;
  email: string;
  role: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  companyName?: string;
  jobSeeking?: string;
  experience?: string;
  experienceRequired?: string;
  contractType?: string;
  presentation?: string;
  siret?: string;
};

export default function UsersServices() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'candidat@mail.com',
      role: 'candidate',
      firstName: 'Lucas',
      lastName: 'Martin',
      location: 'Paris',
      contractType: 'CDI',
      experience: 'Débutant',
      presentation: 'Je suis motivé...',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      email: 'recruteur@mail.com',
      role: 'recruiter',
      firstName: 'Jean',           
      lastName: 'Dupont',        
      companyName: 'TechCorp',
      jobSeeking: 'Développeur',
      experienceRequired: 'Senior',
      contractType: 'CDI',
      location: 'Lyon',
      presentation: 'Nous recrutons...',
      avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      siret: '123 456 789 00012',
    },
  ]);
  const [error, setError] = useState('');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<User | null>(null);

  // States pour édition utilisateur
  const [editUserId, setEditUserId] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editJobSeeking, setEditJobSeeking] = useState('');
  const [editExperienceRequired, setEditExperienceRequired] = useState('');
  const [editContractType, setEditContractType] = useState('');
  const [editPresentation, setEditPresentation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  // Fonction pour dérouler/renrouler le service
  const toggleService = (service: string) => {
    setError('');
    setFoundUser(null);
    setEditUserId('');
    setEditEmail('');
    setEditAvatarUrl('');
    setEditFirstName('');
    setEditLastName('');
    setEditLocation('');
    setEditCompanyName('');
    setEditJobSeeking('');
    setEditExperienceRequired('');
    setEditContractType('');
    setEditPresentation('');
    setEmail('');
    setPassword('');
    setRole('');
    setSelectedService(selectedService === service ? null : service);
  };

  function getRoleLabel(role: string) {
    switch (role) {
      case 'candidate':
        return 'Candidat';
      case 'recruiter':
        return 'Recruteur';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  }

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px'
    }}>
      <div style={{
        background: 'var(--card-background)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(73, 48, 163, 0.12)',
        padding: '48px 32px',
        minWidth: 400,
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
        
        {/* AJOUT DU TITRE ET DU BOUTON */}
        <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--primary)', marginBottom: 24, textAlign: 'center' }}>
          Portail Admin
        </div>
        <button
          style={{ 
            marginTop: 0, 
            marginBottom: 32,
            background: 'var(--background)', 
            color: 'var(--primary)', 
            border: '2px solid var(--border)', 
            borderRadius: 12, 
            padding: '12px 28px', 
            fontWeight: 600, 
            cursor: 'pointer',
            fontSize: 15,
            transition: 'all 0.2s'
          }}
          onClick={() => window.location.href = '/homepage'}
        >
          ← Retour au menu principal
        </button>
        {/* FIN AJOUT */}

        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)', marginBottom: 32, textAlign: 'center' }}>
          👥 Services Utilisateurs
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
            onClick={() => toggleService('create')}
          >
            ➕ Créer un utilisateur
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
            onClick={() => toggleService('list')}
          >
            📋 Afficher les utilisateurs
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'findUser' ? 'var(--primary)' : 'transparent',
              color: selectedService === 'findUser' ? '#fff' : 'var(--primary)',
              border: '2px solid var(--primary)',
            }}
            onMouseOver={(e) => {
              if (selectedService !== 'findUser') {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseOut={(e) => {
              if (selectedService !== 'findUser') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary)';
              }
            }}
            onClick={() => toggleService('findUser')}
          >
            🔍 Identifier un utilisateur
          </button>
        </div>

        {/* Liste des utilisateurs */}
        {selectedService === 'list' && (
          <div style={styles.section}>
            <div style={styles.title}>Liste des utilisateurs</div>
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">Tous</option>
              <option value="admin">Admins</option>
              <option value="recruiter">Recruteurs</option>
              <option value="candidate">Candidats</option>
            </select>
            {error && <div style={styles.error}>{error}</div>}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
              <thead>
                <tr style={{ background: '#eaeaea' }}>
                  <th style={tableStyles.th}>ID</th>
                  <th style={tableStyles.th}>Email</th>
                  <th style={tableStyles.th}>Rôle</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user => userFilter === 'all' || user.role === userFilter)
                  .map((user: User) => (
                    <tr key={user.id} style={{ background: '#fff' }}>
                      <td style={tableStyles.td}>{user.id}</td>
                      <td style={tableStyles.td}>{user.email}</td>
                      <td style={{ ...tableStyles.td, color: '#222', fontWeight: 'normal' }}>
                        {getRoleLabel(user.role)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Création utilisateur */}
        {selectedService === 'create' && (
          <div style={styles.section}>
            <div style={styles.title}>Créer un utilisateur</div>
            <form
              onSubmit={e => {
                e.preventDefault();
                setError('');
                const formData = { email, password, role };
                setUsers(users => [
                  ...users,
                  { ...formData, id: Date.now().toString() }
                ]);
                setEmail('');
                setPassword('');
                setRole('');
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
              />
              <input
                name="password"
                type="password"
                placeholder="Mot de passe"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
              />
              <select
                name="role"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                style={styles.select}
              >
                <option value="">Rôle</option>
                <option value="candidate">Candidat</option>
                <option value="recruiter">Recruteur</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" style={styles.smallButton}>
                Créer
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
          </div>
        )}

        {/* Trouver un utilisateur */}
        {selectedService === 'findUser' && (
          <div style={styles.section}>
            <div style={styles.title}>Trouver un utilisateur par ID</div>
            <form
              onSubmit={e => {
                e.preventDefault();
                setError('');
                const id = e.currentTarget.userId.value;
                const user = users.find(u => u.id === id);
                if (user) {
                  setFoundUser(user);
                  setError('');
                } else {
                  setFoundUser(null);
                  setError("Utilisateur introuvable");
                }
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <input
                name="userId"
                type="text"
                placeholder="ID utilisateur"
                required
                style={styles.input}
              />
              <button type="submit" style={styles.smallButton}>
                Rechercher
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
            {foundUser && (
              <div style={{ marginTop: 24 }}>
                <strong>Email :</strong> {foundUser.email}<br />
                <strong>Rôle :</strong> {getRoleLabel(foundUser.role)}<br />
                {foundUser.role === 'candidate' && (
                  <>
                    <strong>Prénom :</strong> {foundUser.firstName}<br />
                    <strong>Nom :</strong> {foundUser.lastName}<br />
                  </>
                )}
                {foundUser.role === 'recruiter' && (
                  <>
                    <strong>Prénom :</strong> {foundUser.firstName}<br />
                    <strong>Nom :</strong> {foundUser.lastName}<br />
                    <strong>Entreprise :</strong> {foundUser.companyName}<br />
                    <strong>SIRET :</strong> {foundUser.siret}<br />
                  </>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                  <button
                    style={styles.smallButton}
                    onClick={() => {
                      if (foundUser.role === 'candidate') {
                        window.location.href = `/candidate-profile/${foundUser.id}`;
                      } else if (foundUser.role === 'recruiter') {
                        window.location.href = `/recruiter-profile/${foundUser.id}`;
                      }
                    }}
                  >
                    Voir le profil
                  </button>
                  <button
                    style={{ ...styles.smallButton, background: '#e53935' }}
                    onClick={() => {
                      setUsers(users.filter(u => u.id !== foundUser.id));
                      setFoundUser(null);
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

        {/* Modifier un utilisateur */}
        {selectedService === 'editUser' && (
          <div style={styles.section}>
            <div style={styles.title}>Modifier un utilisateur</div>
            {/* Étape 1 : Saisie de l'ID */}
            {!foundUser && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setError('');
                  const id = e.currentTarget.editUserId.value;
                  const user = users.find(u => u.id === id);
                  if (user) {
                    setFoundUser(user);
                    setEditEmail(user.email || '');
                    setEditAvatarUrl(user.avatarUrl || '');
                    setEditFirstName(user.firstName || '');
                    setEditLastName(user.lastName || '');
                    setEditLocation(user.location || '');
                    setEditCompanyName(user.companyName || '');
                    setEditJobSeeking(user.jobSeeking || '');
                    setEditExperienceRequired(user.experience || user.experienceRequired || '');
                    setEditContractType(user.contractType || '');
                    setEditPresentation(user.presentation || '');
                    setError('');
                  } else {
                    setError("Utilisateur introuvable");
                  }
                }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <input
                  name="editUserId"
                  type="text"
                  placeholder="ID utilisateur"
                  required
                  value={editUserId}
                  onChange={e => setEditUserId(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.smallButton}>
                  Charger le profil
                </button>
              </form>
            )}

            {/* Étape 2 : Affichage et édition du profil complet */}
            {foundUser && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setError('');
                  setUsers(users =>
                    users.map(u =>
                      u.id === foundUser.id
                        ? {
                            ...u,
                            email: editEmail,
                            avatarUrl: editAvatarUrl,
                            ...(foundUser.role === 'candidate' && {
                              firstName: editFirstName,
                              lastName: editLastName,
                              location: editLocation,
                              contractType: editContractType,
                              experience: editExperienceRequired,
                              presentation: editPresentation,
                            }),
                            ...(foundUser.role === 'recruiter' && {
                              companyName: editCompanyName,
                              jobSeeking: editJobSeeking,
                              experienceRequired: editExperienceRequired,
                              contractType: editContractType,
                              location: editLocation,
                              presentation: editPresentation,
                            }),
                          }
                        : u
                    )
                  );
                  setFoundUser(null);
                  setEditUserId('');
                  setEditEmail('');
                  setEditAvatarUrl('');
                  setEditFirstName('');
                  setEditLastName('');
                  setEditLocation('');
                  setEditCompanyName('');
                  setEditJobSeeking('');
                  setEditExperienceRequired('');
                  setEditContractType('');
                  setEditPresentation('');
                }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}
              >
                <div style={{ marginBottom: 12, fontWeight: 600 }}>
                  Rôle : <span style={{ color: '#6746a8' }}>{foundUser.role}</span>
                </div>
                {/* Photo */}
                <div style={{ marginBottom: 18 }}>
                  {editAvatarUrl && (
                    <div style={{ marginBottom: 8 }}>
                      <img src={editAvatarUrl} alt="Photo de profil" style={{ width: 80, height: 80, borderRadius: '50%' }} />
                      <button
                        type="button"
                        style={{ ...styles.button, background: '#e53935', marginLeft: 12 }}
                        onClick={() => setEditAvatarUrl('')}
                      >
                        Supprimer la photo
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="URL de la photo"
                    value={editAvatarUrl}
                    onChange={e => setEditAvatarUrl(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <input
                  name="editEmail"
                  type="email"
                  placeholder="Email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  style={styles.input}
                />
                {/* Champs spécifiques */}
                {foundUser.role === 'candidate' && (
                  <>
                    <input name="editFirstName" type="text" placeholder="Prénom" value={editFirstName} onChange={e => setEditFirstName(e.target.value)} style={styles.input} />
                    <input name="editLastName" type="text" placeholder="Nom" value={editLastName} onChange={e => setEditLastName(e.target.value)} style={styles.input} />
                    <input name="editLocation" type="text" placeholder="Localisation" value={editLocation} onChange={e => setEditLocation(e.target.value)} style={styles.input} />
                    <select
                      name="editContractType"
                      value={editContractType}
                      onChange={e => setEditContractType(e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Type de contrat</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Alternance">Alternance</option>
                    </select>
                    <select
                      name="editExperience"
                      value={editExperienceRequired}
                      onChange={e => setEditExperienceRequired(e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Expérience</option>
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Confirmé">Confirmé</option>
                    </select>
                    <textarea
                      name="editPresentation"
                      placeholder="Présentation"
                      value={editPresentation}
                      onChange={e => setEditPresentation(e.target.value)}
                      style={{ ...styles.input, height: 80, resize: 'vertical' }}
                    />
                  </>
                )}
                {foundUser.role === 'recruiter' && (
                  <>
                    <input name="editCompanyName" type="text" placeholder="Entreprise" value={editCompanyName} onChange={e => setEditCompanyName(e.target.value)} style={styles.input} />
                    <input name="editJobSeeking" type="text" placeholder="Poste recherché" value={editJobSeeking} onChange={e => setEditJobSeeking(e.target.value)} style={styles.input} />
                    <input name="editExperienceRequired" type="text" placeholder="Expérience requise" value={editExperienceRequired} onChange={e => setEditExperienceRequired(e.target.value)} style={styles.input} />
                    <input name="editContractType" type="text" placeholder="Type de contrat" value={editContractType} onChange={e => setEditContractType(e.target.value)} style={styles.input} />
                    <input name="editLocation" type="text" placeholder="Localisation" value={editLocation} onChange={e => setEditLocation(e.target.value)} style={styles.input} />
                    <input name="editPresentation" type="text" placeholder="Présentation" value={editPresentation} onChange={e => setEditPresentation(e.target.value)} style={styles.input} />
                  </>
                )}
                <button type="submit" style={styles.smallButton}>
                  Enregistrer
                </button>
                <button
                  type="button"
                  style={styles.backButton}
                  onClick={() => {
                    setFoundUser(null);
                    setEditUserId('');
                    setEditEmail('');
                    setEditAvatarUrl('');
                    setEditFirstName('');
                    setEditLastName('');
                    setEditLocation('');
                    setEditCompanyName('');
                    setEditJobSeeking('');
                    setEditExperienceRequired('');
                    setEditContractType('');
                    setEditPresentation('');
                    setError('');
                  }}
                >
                  Annuler
                </button>
              </form>
            )}
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
  select: {
    width: '100%',
    maxWidth: 300,
    padding: 14,
    borderRadius: 12,
    border: '2px solid var(--border)',
    marginBottom: 16,
    fontSize: 15,
    background: 'var(--card-background)',
    boxSizing: 'border-box' as const,
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
  userList: {
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    padding: 0,
    listStyle: 'none',
  },
  userItem: {
    background: 'var(--card-background)',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 10,
    fontSize: 15,
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(73, 48, 163, 0.06)',
    border: '1px solid var(--border)',
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