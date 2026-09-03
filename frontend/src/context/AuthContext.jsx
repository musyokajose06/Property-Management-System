import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../store/data.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "rl.session";
const USERS_KEY = "rl.users";

const SEED_USERS = [
  {
    id: "a1",
    role: "admin",
    name: "Site Admin",
    email: "admin@r3ntledger.com",
    password: "admin123",
  },
  {
    id: "m1",
    role: "manager",
    name: "Joseph Musyoka",
    email: "manager@r3ntledger.com",
    password: "manager123",
  },
  {
    id: "t1",
    role: "tenant",
    name: "John Tenant",
    email: "john@r3ntledger.com",
    password: "tenant123",
    tenantId: "t1",
    unit: "A1",
  },
  {
    id: "t2",
    role: "tenant",
    name: "Mary Tenant",
    email: "mary@r3ntledger.com",
    password: "tenant123",
    tenantId: "t2",
    unit: "B2",
  },
];

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
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

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  // Returns null on success, error string on failure
  function login(email, password) {
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );
    if (!user) return "Invalid email or password.";
    const { password: _, ...safe } = user;
    setSession(safe);
    return null;
  }

  // Returns null on success, error string on failure
  function register(name, email, password, role, tenantFields = {}) {
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
      return "An account with this email already exists.";
    const id = `${role[0]}${Date.now()}`;
    const newUser = { id, role, name, email, password, ...(role === "tenant" ? { tenantId: id, unit: tenantFields.unit || "" } : {}) };
    setUsers((prev) => [...prev, newUser]);

    // Write tenant record into rl_tenants so it shows up for managers
    if (role === "tenant") {
      const existing = db.tenants.getAll();
      db.tenants.save([
        ...existing,
        {
          id,
          name,
          email,
          unit: tenantFields.unit || "",
          propertyId: tenantFields.propertyId || "",
          leaseStart: tenantFields.leaseStart || "",
          leaseEnd: tenantFields.leaseEnd || "",
          leaseStatus: "active",
          leaseApproval: "pending",
        },
      ]);
    }

    const { password: _, ...safe } = newUser;
    setSession(safe);
    return null;
  }

  function logout() {
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
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
