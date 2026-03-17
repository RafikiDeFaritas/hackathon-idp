import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserConnecte, connexion, deconnexion, estConnecte } from '../api/user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Au démarrage, on relit l'utilisateur depuis le token en localStorage
  useEffect(() => {
    if (estConnecte()) {
      setUser(getUserConnecte());
    }
  }, []);

  const login = async (formData) => {
    await connexion(formData);
    setUser(getUserConnecte());
  };

  const logout = () => {
    deconnexion();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
