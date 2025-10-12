'use client';

import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8081/api';

export default function AdminUsersPage() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated) return;
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
    fetchUsers();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Se connecter (Admin)</button>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h2>Gestion des utilisateurs</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {users.map((user: any) => (
          <li key={user.user_id || user.id || user._id}>{user.email} ({user.role})</li>
        ))}
      </ul>

      <h3>Créer un utilisateur</h3>
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setError('');
          const form = e.currentTarget;
          const formData = {
            email: (form.email as HTMLInputElement).value,
            password: (form.password as HTMLInputElement).value,
            role: (form.role as HTMLSelectElement).value,
          };
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
          } catch (err: any) {
            setError(err.message);
          }
        }}
        style={{ marginTop: 24 }}
      >
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Mot de passe" required />
        <select name="role" required>
          <option value="">Rôle</option>
          <option value="candidate">Candidat</option>
          <option value="recruiter">Recruteur</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Créer</button>
      </form>
    </main>
  );
}