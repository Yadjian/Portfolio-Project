'use client';

import React, { useEffect, useReducer } from 'react';
import MovaLogo from '../../components/MovaLogo';

// User interface matching backend response structure
interface User {
  id: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  createdAt: string;
  updatedAt: string;
  candidateProfile?: {
    firstName: string;
    lastName: string;
    locationName?: string;
    photoUrl?: string;
    resumeUrl?: string;
    coverLetterText?: string;
    desiredJobTitle?: string;
    experienceLevel?: 'DEBUTANT' | 'INTERMEDIAIRE' | 'CONFIRME';
    desiredContractTypes?: string[];
    searchRadiusKm?: number;
  };
  recruiterProfile?: {
    firstName: string;
    lastName: string;
    locationName?: string;
    photoUrl?: string;
    searchDescription?: string;
    desiredExperienceLevel?: 'DEBUTANT' | 'INTERMEDIAIRE' | 'CONFIRME';
    desiredContractTypes?: string[];
    memberships?: Array<{
      company: {
        name: string;
        siret?: string;
      };
    }>;
  };
}

// Component state managed by reducer
type State = {
  users: User[];
  error: string | null;
  selectedService: 'list' | 'create' | 'findUser' | 'editUser' | null;
  foundUser: User | null;
  roleFilter: 'all' | 'candidate' | 'recruiter' | 'admin';
  roles: Array<{ value: string; label: string }>;
  contractTypes: Array<{ value: string; label: string }>;
  experienceLevels: Array<{ value: string; label: string }>;
  jobCategories: Array<{ id: string; name: string }>;
  form: {
    id?: string;
    email: string;
    password: string;
    role: string;
    // Candidate fields
    firstName?: string;
    lastName?: string;
    locationName?: string;
    desiredJobTitle?: string;
    experienceLevel?: string;
    desiredContractTypes?: string[];
    coverLetterText?: string;
    searchRadiusKm?: number;
    // Recruiter fields
    searchDescription?: string;
    desiredExperienceLevel?: string;
  };
};

// Reducer action types
type Action =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_SERVICE'; payload: State['selectedService'] }
  | { type: 'SET_FOUND_USER'; payload: User | null }
  | { type: 'START_EDIT'; payload: User }
  | { type: 'UPDATE_FORM'; payload: { field: keyof State['form']; value: string } }
  | { type: 'SET_ROLE_FILTER'; payload: State['roleFilter'] }
  | { type: 'SET_META_DATA'; payload: { 
      roles?: Array<{ value: string; label: string }>; 
      contractTypes?: Array<{ value: string; label: string }>; 
      experienceLevels?: Array<{ value: string; label: string }>; 
      jobCategories?: Array<{ id: string; name: string }> 
    } }
  | { type: 'RESET' };

// Initial state for the reducer
const initialState: State = {
  users: [],
  error: null,
  selectedService: null,
  foundUser: null,
  roleFilter: 'all',
  roles: [],
  contractTypes: [],
  experienceLevels: [],
  jobCategories: [],
  form: {
    email: '',
    password: '',
    role: 'candidate',
  },
};

// State reducer function handling all state transitions
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_SERVICE':
      const newService = state.selectedService === action.payload ? null : action.payload;
      return { ...initialState, users: state.users, selectedService: newService };
    case 'SET_FOUND_USER':
      return { ...state, foundUser: action.payload, error: action.payload ? null : 'Utilisateur introuvable' };
    case 'START_EDIT':
      return {
        ...state,
        selectedService: 'editUser',
        foundUser: null,
        form: {
          id: action.payload.id,
          email: action.payload.email,
          password: '',
          role: action.payload.role,
        },
      };
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, [action.payload.field]: action.payload.value } };
    case 'SET_ROLE_FILTER':
      return { ...state, roleFilter: action.payload };
    case 'SET_META_DATA':
      return { 
        ...state, 
        ...(action.payload.roles && { roles: action.payload.roles }),
        ...(action.payload.contractTypes && { contractTypes: action.payload.contractTypes }),
        ...(action.payload.experienceLevels && { experienceLevels: action.payload.experienceLevels }),
        ...(action.payload.jobCategories && { jobCategories: action.payload.jobCategories }),
      };
    case 'RESET':
      return { ...initialState, users: state.users, selectedService: 'list' };
    default:
      return state;
  }
}

// Main users management component
export default function UsersServices() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { users, error, selectedService, foundUser, form, roleFilter, roles, contractTypes, experienceLevels, jobCategories } = state;

  // Filter users by role
  const filteredUsers = roleFilter === 'all' 
    ? users 
    : users.filter(user => user.role === roleFilter);

  // Helper functions to get labels from meta data
  const getRoleLabel = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  const getContractTypeLabel = (contractValue: string) => {
    const contract = contractTypes.find(c => c.value === contractValue);
    return contract ? contract.label : contractValue;
  };

  const getExperienceLevelLabel = (experienceValue: string) => {
    const experience = experienceLevels.find(e => e.value === experienceValue);
    return experience ? experience.label : experienceValue;
  };

  // Fetch users from API on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('🔍 Fetching users with token:', token ? 'Token présent' : 'Pas de token');
        
        const res = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        console.log('📡 Response status:', res.status, res.statusText);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Error response:', errorText);
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText || 'Erreur de chargement' };
          }
          throw new Error(errorData.error || errorData.message || 'Erreur de chargement');
        }
        
        const data = await res.json();
        console.log('✅ Users loaded:', data.length, 'users');
        dispatch({ type: 'SET_USERS', payload: data });
      } catch (err) {
        console.error('💥 Fetch error:', err);
        dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Erreur de chargement' });
      }
    };
    fetchUsers();
  }, []);

  // Fetch meta data (roles, contract types, experience levels, job categories)
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const [rolesRes, contractTypesRes, experienceLevelsRes, jobCategoriesRes] = await Promise.all([
          fetch('/api/meta/roles'),
          fetch('/api/meta/contract-types'),
          fetch('/api/meta/experience-levels'),
          fetch('/api/meta/job-categories'),
        ]);

        const roles = await rolesRes.json();
        const contractTypes = await contractTypesRes.json();
        const experienceLevels = await experienceLevelsRes.json();
        const jobCategories = await jobCategoriesRes.json();

        dispatch({
          type: 'SET_META_DATA',
          payload: { roles, contractTypes, experienceLevels, jobCategories },
        });
      } catch (err) {
        console.error('Erreur lors du chargement des méta-données:', err);
      }
    };
    fetchMetaData();
  }, []);

  // Helper function to refresh users list after mutations
  const refetchUsers = () => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_USERS', payload: data }));
  };

  // Helper function to get user display name
  function getUserName(user: User): string {
    if (user.candidateProfile) {
      return `${user.candidateProfile.firstName} ${user.candidateProfile.lastName}`;
    }
    if (user.recruiterProfile) {
      return `${user.recruiterProfile.firstName} ${user.recruiterProfile.lastName}`;
    }
    return user.email;
  }

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
        {/* Page header with logo and navigation */}
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
                Gestion des Utilisateurs
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

        {/* Service navigation buttons */}
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
              ➕ Créer un utilisateur
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
              📋 Lister les utilisateurs
            </button>
            <button
              style={{
                ...styles.navButton,
                background: selectedService === 'findUser' ? 'var(--primary)' : '#f8f9ff',
                color: selectedService === 'findUser' ? '#fff' : 'var(--primary)',
                border: selectedService === 'findUser' ? '2px solid var(--primary)' : '2px solid #e0e0ff',
              }}
              onMouseOver={(e) => {
                if (selectedService !== 'findUser') {
                  e.currentTarget.style.background = '#e8e9ff';
                }
              }}
              onMouseOut={(e) => {
                if (selectedService !== 'findUser') {
                  e.currentTarget.style.background = '#f8f9ff';
                }
              }}
              onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: 'findUser' })}
            >
              🔍 Rechercher un utilisateur
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div style={{ padding: '48px' }}>

        {/* List view: display all users in a table */}
        {selectedService === 'list' && (
          <div style={styles.section}>
            <div style={styles.title}>Lister les utilisateurs</div>
            {error && <div style={styles.error}>{error}</div>}
            
            {/* Role filter */}
            <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#666', fontSize: 14 }}>Filtrer par rôle :</span>
              <select
                value={roleFilter}
                onChange={(e) => dispatch({ type: 'SET_ROLE_FILTER', payload: e.target.value as State['roleFilter'] })}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '2px solid #e0e0ff',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--primary)',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <option value="all">Tous les rôles ({users.length})</option>
                <option value="candidate">Candidats ({users.filter(u => u.role === 'candidate').length})</option>
                <option value="recruiter">Recruteurs ({users.filter(u => u.role === 'recruiter').length})</option>
                <option value="admin">Admins ({users.filter(u => u.role === 'admin').length})</option>
              </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
              <thead>
                <tr style={{ background: '#eaeaea' }}>
                  <th style={tableStyles.th}>ID</th>
                  <th style={tableStyles.th}>Nom</th>
                  <th style={tableStyles.th}>Email</th>
                  <th style={tableStyles.th}>Rôle</th>
                  <th style={tableStyles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...tableStyles.td, textAlign: 'center', padding: 40, color: '#999' }}>
                      Aucun utilisateur trouvé pour ce filtre
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user: User) => (
                  <tr key={user.id} style={{ background: '#fff' }}>
                    <td style={{...tableStyles.td, fontFamily: 'monospace', fontSize: 11, maxWidth: 100, wordBreak: 'break-all' as const}}>
                      {user.id}
                    </td>
                    <td style={tableStyles.td}>{getUserName(user)}</td>
                    <td style={tableStyles.td}>{user.email}</td>
                    <td style={tableStyles.td}>{getRoleLabel(user.role)}</td>
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
                          navigator.clipboard.writeText(user.id);
                          alert('ID copié !');
                        }}
                      >
                        📋 Copier ID
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create view: form to create a new user */}
        {selectedService === 'create' && (
          <div style={styles.section}>
            <div style={styles.title}>Créer un utilisateur</div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                dispatch({ type: 'SET_ERROR', payload: null });
                try {
                  const token = localStorage.getItem('accessToken');
                  const res = await fetch('/api/users', {
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
                  refetchUsers();
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
                name="email"
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'email', value: e.target.value } })}
                style={styles.input}
              />
              
              <input
                name="password"
                type="password"
                placeholder="Mot de passe"
                required
                value={form.password}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'password', value: e.target.value } })}
                style={styles.input}
              />

              <select
                name="role"
                required
                value={form.role}
                onChange={e => dispatch({ type: 'UPDATE_FORM', payload: { field: 'role', value: e.target.value } })}
                style={styles.input}
              >
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

        {/* Find view: search for a user by ID */}
        {selectedService === 'findUser' && (
          <div style={styles.section}>
            <div style={styles.title}>Trouver un utilisateur par ID</div>
            <form
              onSubmit={e => {
                e.preventDefault();
                const id = e.currentTarget.userId.value;
                const found = users.find(u => u.id === id);
                console.log('📸 Photo URLs:', {
                  candidatePhoto: found?.candidateProfile?.photoUrl,
                  recruiterPhoto: found?.recruiterProfile?.photoUrl
                });
                dispatch({ type: 'SET_FOUND_USER', payload: found || null });
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
              <div style={{ 
                marginTop: 32,
                background: '#fff',
                borderRadius: 12,
                padding: 0,
                boxShadow: '0 2px 16px rgba(73, 48, 163, 0.1)',
                border: '1px solid #e0e0ff',
                overflow: 'hidden',
              }}>
                {/* Header with gradient background and photo */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #4930a3 0%, #6746a8 100%)',
                  padding: 24,
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ 
                      fontSize: 26, 
                      fontWeight: 700,
                      marginBottom: 8 
                    }}>
                      {getUserName(foundUser)}
                    </div>
                    <div style={{ 
                      fontSize: 12,
                      opacity: 0.9,
                      fontFamily: 'monospace'
                    }}>
                      ID: {foundUser.id}
                    </div>
                  </div>
                  
                  {/* Photo in header */}
                  <div>
                    {(foundUser.candidateProfile?.photoUrl || foundUser.recruiterProfile?.photoUrl) ? (
                      <img 
                        src={foundUser.candidateProfile?.photoUrl || foundUser.recruiterProfile?.photoUrl} 
                        alt="Photo" 
                        style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff' }}
                      />
                    ) : (
                      <div style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 36,
                        border: '3px solid #fff'
                      }}>
                        👤
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: 32 }}>
                  {/* Basic Information */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 24,
                    marginBottom: 32
                  }}>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>📧 Email</span>
                      <span style={detailStyles.value}>{foundUser.email}</span>
                    </div>
                    <div style={detailStyles.row}>
                      <span style={detailStyles.label}>👤 Rôle</span>
                      <span style={detailStyles.value}>{getRoleLabel(foundUser.role)}</span>
                    </div>
                  </div>

                  {/* Candidate Profile */}
                  {foundUser.candidateProfile && (
                    <>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#4930a3', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #e0e0ff' }}>
                        📋 Informations du Candidat
                      </div>
                      
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 20,
                        marginBottom: 24
                      }}>
                        <div style={detailStyles.row}>
                          <span style={detailStyles.label}>👤 Nom complet</span>
                          <span style={detailStyles.value}>
                            {foundUser.candidateProfile.firstName} {foundUser.candidateProfile.lastName}
                          </span>
                        </div>
                        <div style={detailStyles.row}>
                          <span style={detailStyles.label}>📍 Localisation</span>
                          <span style={detailStyles.value}>{foundUser.candidateProfile.locationName || 'Non définie'}</span>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 20,
                        marginBottom: 24
                      }}>
                        <div style={detailStyles.row}>
                          <span style={detailStyles.label}>💼 Poste recherché</span>
                          <span style={detailStyles.value}>{foundUser.candidateProfile.desiredJobTitle || 'Non défini'}</span>
                        </div>
                        <div style={detailStyles.row}>
                          <span style={detailStyles.label}>⭐ Expérience</span>
                          <span style={detailStyles.value}>
                            {foundUser.candidateProfile.experienceLevel 
                              ? getExperienceLevelLabel(foundUser.candidateProfile.experienceLevel)
                              : 'Non défini'}
                          </span>
                        </div>
                      </div>

                      <div style={detailStyles.row}>
                        <span style={detailStyles.label}>📝 Types de contrat souhaités</span>
                        <span style={detailStyles.value}>
                          {foundUser.candidateProfile.desiredContractTypes?.length 
                            ? foundUser.candidateProfile.desiredContractTypes.map(ct => getContractTypeLabel(ct)).join(', ')
                            : 'Non défini'}
                        </span>
                      </div>

                      {foundUser.candidateProfile.coverLetterText && (
                        <div style={{ ...detailStyles.row, marginTop: 20 }}>
                          <span style={detailStyles.label}>📄 Présentation</span>
                          <span style={{ ...detailStyles.value, whiteSpace: 'pre-wrap' }}>
                            {foundUser.candidateProfile.coverLetterText}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Recruiter Profile */}
                  {foundUser.recruiterProfile && (
                    <>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#4930a3', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #e0e0ff', marginTop: foundUser.candidateProfile ? 32 : 0 }}>
                        🏢 Informations du Recruteur
                      </div>
                      
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 20,
                        marginBottom: 24
                      }}>
                        <div style={detailStyles.row}>
                          <span style={detailStyles.label}>👤 Nom complet</span>
                          <span style={detailStyles.value}>
                            {foundUser.recruiterProfile.firstName} {foundUser.recruiterProfile.lastName}
                          </span>
                        </div>
                        <div style={detailStyles.row}>
                          <span style={detailStyles.label}>📍 Localisation</span>
                          <span style={detailStyles.value}>{foundUser.recruiterProfile.locationName || 'Non définie'}</span>
                        </div>
                        {foundUser.recruiterProfile.memberships?.[0]?.company && (
                          <>
                            <div style={detailStyles.row}>
                              <span style={detailStyles.label}>🏢 Entreprise</span>
                              <span style={detailStyles.value}>{foundUser.recruiterProfile.memberships[0].company.name}</span>
                            </div>
                            {foundUser.recruiterProfile.memberships[0].company.siret && (
                              <div style={detailStyles.row}>
                                <span style={detailStyles.label}>🔢 SIRET</span>
                                <span style={detailStyles.value}>{foundUser.recruiterProfile.memberships[0].company.siret}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div style={{ fontSize: 16, fontWeight: 600, color: '#666', marginTop: 28, marginBottom: 16 }}>
                        Recherche
                      </div>

                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 20,
                        marginBottom: 24
                      }}>
                        <div style={detailStyles.row}>
                          <span style={detailStyles.label}>🎯 Poste disponible</span>
                          <span style={detailStyles.value}>
                            {foundUser.recruiterProfile.searchDescription?.split('\n\n')[0] || 'Non défini'}
                          </span>
                        </div>
                        <div style={detailStyles.row}>
                          <span style={detailStyles.label}>⭐ Expérience requise</span>
                          <span style={detailStyles.value}>
                            {foundUser.recruiterProfile.desiredExperienceLevel 
                              ? getExperienceLevelLabel(foundUser.recruiterProfile.desiredExperienceLevel)
                              : 'Non défini'}
                          </span>
                        </div>
                      </div>

                      <div style={detailStyles.row}>
                        <span style={detailStyles.label}>📄 Types de contrat</span>
                        <span style={detailStyles.value}>
                          {foundUser.recruiterProfile.desiredContractTypes?.length 
                            ? foundUser.recruiterProfile.desiredContractTypes.map(ct => getContractTypeLabel(ct)).join(', ')
                            : 'Non défini'}
                        </span>
                      </div>

                      {foundUser.recruiterProfile.searchDescription && (
                        <div style={{ ...detailStyles.row, marginTop: 20 }}>
                          <span style={detailStyles.label}>📄 Présentation</span>
                          <span style={{ ...detailStyles.value, whiteSpace: 'pre-wrap' }}>
                            {foundUser.recruiterProfile.searchDescription.split('\n\n').slice(1).join('\n\n') || 'Non définie'}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  <div style={detailStyles.row}>
                    <span style={detailStyles.label}>📅 Date de création</span>
                    <span style={detailStyles.value}>
                      {foundUser.createdAt ? new Date(foundUser.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid #e0e0ff' }}>
                    <button
                      style={{ 
                        ...styles.smallButton, 
                        background: '#ccc', 
                        cursor: 'not-allowed',
                        opacity: 0.6
                      }}
                      disabled
                      title="Fonctionnalité à venir"
                    >
                      ✏️ Modifier (Prochainement)
                    </button>
                    <button
                      style={{ ...styles.smallButton, background: '#e53935' }}
                      onClick={async () => {
                        if (!foundUser) return;
                        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
                        try {
                          const token = localStorage.getItem('accessToken');
                          const res = await fetch(`/api/users/${foundUser.id}`, {
                            method: 'DELETE',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                            },
                          });
                          if (!res.ok) throw new Error('Erreur lors de la suppression');
                          refetchUsers();
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


        </div>
      </div>
    </div>
  );
}

// Component styles
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

// Table styles
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

// Detail view styles
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
