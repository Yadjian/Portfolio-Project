'use client';

import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:8081/api';

type User = {
  user_id?: string;
  id?: string;
  _id?: string;
  email: string;
  role: string;
};

type Offer = {
  id: string;
  title: string;
  description: string;
  contractType: string;
  hoursPerWeek: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
};

export default function AdminUsersPage() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [users, setUsers] = useState<User[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contractType, setContractType] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [foundOffer, setFoundOffer] = useState<Offer | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState<string>('all');
  // States pour édition utilisateur
  const [editUserId, setEditUserId] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    setError('');
    // Backend only
    /*
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE_URL}/v1/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur chargement utilisateurs');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
    */
    // Simulation locale : NE RIEN FAIRE, juste afficher le state actuel
  };

  //if (!isAuthenticated) {
    //return <button onClick={() => loginWithRedirect()}>Se connecter (Admin)</button>;
  //}

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Portail Admin</div>
        {selectedSection && (
          <button
            style={styles.backButton}
            onClick={() => {
              setSelectedSection(null);
              setSelectedService(null);
              setError('');
              setFoundUser(null);
              setFoundOffer(null);
            }}
          >
            Retour au menu principal
          </button>
        )}
        {/* Menu principal */}
        {!selectedSection && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button style={styles.button} onClick={() => setSelectedSection('users')}>Utilisateurs</button>
            <button style={styles.button} onClick={() => setSelectedSection('jobOffers')}>Offres</button>
            <button style={styles.button} onClick={() => setSelectedSection('cvs')}>CVs</button>
            <button style={styles.button} onClick={() => setSelectedSection('matches')}>Matchs</button>
            <button style={styles.button} onClick={() => setSelectedSection('swipes')}>Swipes</button>
          </div>
        )}

        {/* Section Utilisateurs */}
        {selectedSection === 'users' && (
          <>
            <div style={styles.title}>Services Utilisateurs</div>
            <button style={styles.button} onClick={() => { setSelectedService('list'); }}>Afficher tous les utilisateurs</button>
            <button style={styles.button} onClick={() => setSelectedService('create')}>Créer un utilisateur</button>
            <button style={styles.button} onClick={() => setSelectedService('findUser')}>Trouver un utilisateur par ID</button>
            <button style={styles.button} onClick={() => setSelectedService('editUser')}>Modifier un utilisateur</button>
          </>
        )}

        {/* Section Offres */}
        {selectedSection === 'jobOffers' && (
          <>
            <div style={styles.title}>Services Offres</div>
            <button style={styles.button} onClick={() => setSelectedService('createOffer')}>Créer une offre</button>
            <button style={styles.button} onClick={() => setSelectedService('findOffer')}>Trouver une offre par ID</button>
          </>
        )}

        {/* Ajoute ici les sections CVs, Matches, Swipes selon le même modèle */}

        {/* Affichage des services selon selectedService */}
        {selectedService === 'list' && (
          <>
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
                  <li key={user.user_id || user.id || user._id} style={styles.userItem}>
                    <span>{user.email}</span>
                    <span style={{ fontWeight: 600, color: '#6746a8' }}>{user.role}</span>
                  </li>
                ))}
            </ul>
            <button style={styles.backButton} onClick={() => setSelectedService(null)}>
              Retour
            </button>
          </>
        )}

        {selectedService === 'create' && (
          <>
            <div style={styles.title}>Créer un utilisateur</div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                const formData = { email, password, role };
                // Backend only
                /*
                try {
                  const token = await getAccessTokenSilently();
                  const res = await fetch(`${API_BASE_URL}/v1/users`, {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                  });
                  if (!res.ok) throw new Error('Erreur création utilisateur');
                  const newUser = await res.json();
                  setUsers(users => [...users, newUser]);
                  setEmail('');
                  setPassword('');
                  setRole('');
                } catch (err: any) {
                  setError(err.message);
                }
                */
                // Simulation locale
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
              <button type="submit" style={{ ...styles.button, width: '100%' }}>
                Créer
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
            <button style={styles.backButton} onClick={() => setSelectedService(null)}>
              Retour
            </button>
          </>
        )}

        {selectedService === 'editUser' && (
          <>
            <div style={styles.title}>Modifier un utilisateur</div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                // Backend only
                /*
                try {
                  const token = await getAccessTokenSilently();
                  const res = await fetch(`${API_BASE_URL}/v1/users/${editUserId}`, {
                    method: 'PUT',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: editEmail, role: editRole }),
                  });
                  if (!res.ok) throw new Error('Erreur modification utilisateur');
                  const updatedUser = await res.json();
                  setUsers(users => users.map(u => u.id === editUserId ? updatedUser : u));
                } catch (err: any) {
                  setError(err.message);
                }
                */
                // Simulation locale
                setUsers(users =>
                  users.map(u =>
                    u.id === editUserId
                      ? { ...u, email: editEmail, role: editRole }
                      : u
                  )
                );
                setEditUserId('');
                setEditEmail('');
                setEditRole('');
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
              <input
                name="editEmail"
                type="email"
                placeholder="Nouvel email"
                required
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                style={styles.input}
              />
              <select
                name="editRole"
                required
                value={editRole}
                onChange={e => setEditRole(e.target.value)}
                style={styles.select}
              >
                <option value="">Nouveau rôle</option>
                <option value="candidate">Candidat</option>
                <option value="recruiter">Recruteur</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" style={{ ...styles.button, width: '100%' }}>
                Modifier
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
            <button style={styles.backButton} onClick={() => setSelectedService(null)}>
              Retour
            </button>
          </>
        )}

        {selectedService === 'createOffer' && (
          <>
            <div style={styles.title}>Créer une offre</div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                // Backend only
                /*
                try {
                  const token = await getAccessTokenSilently();
                  const res = await fetch(`${API_BASE_URL}/v1/job_offers`, {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      title,
                      description,
                      contractType,
                      hoursPerWeek,
                      location,
                      salaryMin,
                      salaryMax,
                    }),
                  });
                  if (!res.ok) throw new Error('Erreur création offre');
                  setTitle('');
                  setDescription('');
                  setContractType('');
                  setHoursPerWeek('');
                  setLocation('');
                  setSalaryMin('');
                  setSalaryMax('');
                } catch (err: any) {
                  setError(err.message);
                }
                */
                // Simulation locale
                setOffers(offers => [
                  ...offers,
                  {
                    id: Date.now().toString(),
                    title,
                    description,
                    contractType,
                    hoursPerWeek,
                    location,
                    salaryMin,
                    salaryMax,
                  }
                ]);
                setTitle('');
                setDescription('');
                setContractType('');
                setHoursPerWeek('');
                setLocation('');
                setSalaryMin('');
                setSalaryMax('');
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <input
                name="title"
                type="text"
                placeholder="Titre de l'offre"
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
              <select
                name="contractType"
                required
                value={contractType}
                onChange={e => setContractType(e.target.value)}
                style={styles.select}
              >
                <option value="">Type de contrat</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="STAGE">Stage</option>
                <option value="ALTERNANCE">Alternance</option>
              </select>
              <input
                name="hoursPerWeek"
                type="number"
                placeholder="Heures/semaine"
                required
                value={hoursPerWeek}
                onChange={e => setHoursPerWeek(e.target.value)}
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
                required
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value)}
                style={styles.input}
              />
              <input
                name="salaryMax"
                type="number"
                placeholder="Salaire maximum (€)"
                required
                value={salaryMax}
                onChange={e => setSalaryMax(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={{ ...styles.button, width: '100%' }}>
                Créer l'offre
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
            {/* Affiche la liste des offres simulées */}
            <div style={{ marginTop: 32, width: '100%' }}>
              <div style={styles.title}>Offres simulées</div>
              <ul style={styles.userList}>
                {offers.map(offer => (
                  <li key={offer.id} style={styles.userItem}>
                    <span>
                      <strong>{offer.title}</strong> ({offer.contractType})<br />
                      {offer.location} - {offer.hoursPerWeek}h<br />
                      {offer.salaryMin}€ - {offer.salaryMax}€
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button style={styles.backButton} onClick={() => setSelectedService(null)}>
              Retour
            </button>
          </>
        )}

        {selectedService === 'findUser' && (
          <>
            <div style={styles.title}>Trouver un utilisateur par ID</div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                const id = e.currentTarget.userId.value;
                // Backend only
                /*
                try {
                  const token = await getAccessTokenSilently();
                  const res = await fetch(`${API_BASE_URL}/v1/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (!res.ok) throw new Error('Utilisateur introuvable');
                  const user = await res.json();
                  setFoundUser(user);
                } catch (err: any) {
                  setError(err.message);
                }
                */
                // Simulation locale
                const user = users.find(u => u.id === id || u.user_id === id || u._id === id);
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
              <button type="submit" style={{ ...styles.button, width: '100%' }}>
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
            <button style={styles.backButton} onClick={() => { setSelectedService(null); setFoundUser(null); setError(''); }}>
              Retour
            </button>
          </>
        )}

        {selectedService === 'findOffer' && (
          <>
            <div style={styles.title}>Trouver une offre par ID</div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                const id = e.currentTarget.offerId.value;
                // Backend only
                /*
                try {
                  const token = await getAccessTokenSilently();
                  const res = await fetch(`${API_BASE_URL}/v1/job_offers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (!res.ok) throw new Error('Offre introuvable');
                  const offer = await res.json();
                  setFoundOffer(offer);
                } catch (err: any) {
                  setError(err.message);
                }
                */
                // Simulation locale
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
                placeholder="ID de l'offre"
                required
                style={styles.input}
              />
              <button type="submit" style={{ ...styles.button, width: '100%' }}>
                Rechercher
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
            {foundOffer && (
              <div style={{ marginTop: 24 }}>
                <strong>Titre :</strong> {foundOffer.title}<br />
                <strong>Type :</strong> {foundOffer.contractType}<br />
                <strong>Lieu :</strong> {foundOffer.location}<br />
                <strong>Heures/semaine :</strong> {foundOffer.hoursPerWeek}<br />
                <strong>Salaire :</strong> {foundOffer.salaryMin}€ - {foundOffer.salaryMax}€
              </div>
            )}
            <button style={styles.backButton} onClick={() => { setSelectedService(null); setFoundOffer(null); setError(''); }}>
              Retour
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9ff',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    padding: '32px 24px',
    minWidth: 350,
    marginTop: 24,
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#6746a8',
    marginBottom: 32,
    textAlign: 'center' as const,
  },
  button: {
    width: 260,
    height: 48,
    borderRadius: 25,
    background: '#07b9ff',
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    border: 'none',
    marginBottom: 18,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    transition: 'background 0.2s',
  },
  buttonPurple: {
    background: '#6b25f9',
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
    width: 260,
    padding: '12px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    marginBottom: 18,
    fontSize: 16,
  },
  select: {
    width: 260,
    padding: '12px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    marginBottom: 18,
    fontSize: 16,
    background: '#fff',
  },
  error: {
    color: '#e53935',
    marginBottom: 18,
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
    background: '#f3f4fa',
    borderRadius: 12,
    padding: '10px 18px',
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};