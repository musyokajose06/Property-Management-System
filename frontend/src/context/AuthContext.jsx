import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../store/data.js";

// Mock auth: there is no backend yet, so "logging in" just picks a role
// (and, for tenants, which tenant record you are) and stores it in
// localStorage. Swapping this for real JWT/session auth later only
// touches this file — every page reads the role through useAuth().
const AuthContext = createContext(null);
const STORAGE_KEY = "keystone.session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  function loginAsManager() {
    setSession({ role: "manager", name: "Joseph Musyoka" });
  }

  function loginAsAdmin() {
    setSession({ role: "admin", name: "Site Admin" });
  }

  function loginAsTenant(tenantId) {
    const tenant = db.tenants.getAll().find((t) => t.id === tenantId);
    if (!tenant) return;
    setSession({ role: "tenant", tenantId: tenant.id, name: tenant.name });
  }

  function logout() {
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, loginAsManager, loginAsAdmin, loginAsTenant, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}