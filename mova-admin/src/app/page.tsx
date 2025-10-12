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

export default function AdminUsersPage() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [users, setUsers] = useState<User[]>([]);
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

  // Fonction pour récupérer les utilisateurs (quand le backend sera prêt)
  const fetchUsers = async () => {
    setError('');
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
  };

  //if (!isAuthenticated) {
    //return <button onClick={() => loginWithRedirect()}>Se connecter (Admin)</button>;
  //}

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Services Admin</div>
        {!selectedService && (
          <>
            <button
              style={styles.button}
              onClick={() => { setSelectedService('list'); fetchUsers(); }}
            >
              Afficher les utilisateurs
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonPurple }}
              onClick={() => setSelectedService('create')}
            >
              Créer un utilisateur
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonPurple }}
              onClick={() => setSelectedService('createOffer')}
            >
              Créer une offre
            </button>
          </>
        )}

        {selectedService === 'list' && (
          <>
            <div style={styles.title}>Liste des utilisateurs</div>
            {error && <div style={styles.error}>{error}</div>}
            <ul style={styles.userList}>
              {users.map((user: User) => (
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

        {selectedService === 'createOffer' && (
          <>
            <div style={styles.title}>Créer une offre</div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
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
                  // Optionnel : afficher un message ou vider le formulaire
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
            <button style={styles.backButton} onClick={() => setSelectedService(null)}>
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