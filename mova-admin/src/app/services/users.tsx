'use client';

import React, { useState } from 'react';

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
      companyName: 'TechCorp',
      jobSeeking: 'Développeur',
      experienceRequired: 'Senior',
      contractType: 'CDI',
      location: 'Lyon',
      presentation: 'Nous recrutons...',
      avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
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
        maxWidth: 800,
        width: '100%',
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        padding: '32px 24px',
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#6746a8', marginBottom: 32, textAlign: 'center' }}>
          Services Utilisateurs
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 12 }}>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'list' ? '#6746a8' : '#07b9ff',
              color: '#fff',
              boxShadow: selectedService === 'list' ? '0 2px 8px rgba(103,70,168,0.15)' : styles.button.boxShadow,
            }}
            onClick={() => toggleService('list')}
          >
            Afficher tous les utilisateurs
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'create' ? '#6746a8' : '#07b9ff',
              color: '#fff',
              boxShadow: selectedService === 'create' ? '0 2px 8px rgba(103,70,168,0.15)' : styles.button.boxShadow,
            }}
            onClick={() => toggleService('create')}
          >
            Créer un utilisateur
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'findUser' ? '#6746a8' : '#07b9ff',
              color: '#fff',
              boxShadow: selectedService === 'findUser' ? '0 2px 8px rgba(103,70,168,0.15)' : styles.button.boxShadow,
            }}
            onClick={() => toggleService('findUser')}
          >
            Trouver un utilisateur par ID
          </button>
          <button
            style={{
              ...styles.button,
              background: selectedService === 'editUser' ? '#6746a8' : '#07b9ff',
              color: '#fff',
              boxShadow: selectedService === 'editUser' ? '0 2px 8px rgba(103,70,168,0.15)' : styles.button.boxShadow,
            }}
            onClick={() => toggleService('editUser')}
          >
            Modifier un utilisateur
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
            <ul style={styles.userList}>
              {users
                .filter(user => userFilter === 'all' || user.role === userFilter)
                .map((user: User) => (
                  <li key={user.id} style={styles.userItem}>
                    <span>{user.email}</span>
                    <span style={{ fontWeight: 600, color: '#6746a8' }}>{user.role}</span>
                  </li>
                ))}
            </ul>
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
                <strong>Rôle :</strong> {foundUser.role}
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
                    <input name="editPresentation" type="text" placeholder="Présentation" value={editPresentation} onChange={e => setEditPresentation(e.target.value)} style={styles.input} />
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
  select: {
    width: 220,
    padding: '10px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    marginBottom: 14,
    fontSize: 15,
    background: '#fff',
  },
  error: {
    color: '#e53935',
    marginBottom: 14,
    fontWeight: 600,
    textAlign: 'center' as const,
  },
  userList: {
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    padding: 0,
    listStyle: 'none',
  },
  userItem: {
    background: '#fff',
    borderRadius: 10,
    padding: '8px 14px',
    marginBottom: 8,
    fontSize: 15,
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#6746a8',
    marginBottom: 18,
    textAlign: 'center' as const,
  },
};