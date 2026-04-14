import React, { createContext, useContext, useState, useCallback } from 'react';

interface Admin {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, adminData: Admin) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('admin_token');
  });

  const login = useCallback((newToken: string, adminData: Admin) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AdminContext.Provider value={{
      admin,
      token,
      isAuthenticated: !!token && !!admin,
      login,
      logout
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Export as default for lazy loading
export default AdminProvider;
