import React, { createContext, useContext } from 'react';
import Auth0 from 'react-native-auth0';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '../constants/auth0Config';

const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });

const Auth0Context = createContext(auth0);

export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({ children }: { children: React.ReactNode }) => (
  <Auth0Context.Provider value={auth0}>{children}</Auth0Context.Provider>
);