import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]">
      {children}
    </label>
  );
}

function TextInput({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{label}</FieldLabel>
      <input
        {...props}
        className="w-full rounded-2xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[13px] text-[0.85rem] text-[#202b27] shadow-sm outline-none transition-all focus:border-[#4b765c] focus:ring-2 focus:ring-[#4b765c]/20"
      />
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          required
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-2xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[13px] pr-[46px] text-[0.85rem] text-[#202b27] shadow-sm outline-none transition-all focus:border-[#4b765c] focus:ring-2 focus:ring-[#4b765c]/20"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-[14px] top-1/2 -translate-y-1/2 rounded-full p-1 text-[#92a09a] transition-colors hover:bg-[#e9f1eb] hover:text-[#4b765c]"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

function SignIn() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const error = login(email.trim(), password);
    setLoading(false);
    if (error) toast.error(error);
    else toast.success("Welcome back!");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <TextInput label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@r3ntledger.com" />
      <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button type="submit" disabled={loading} className="mt-2 w-full rounded-2xl bg-[#4b765c] py-[13px] text-[0.75rem] font-bold text-white shadow-sm transition-colors hover:bg-[#3d6050] disabled:opacity-60">
        {loading ? "Signing in…" : "Sign in →"}
      </button>

      <div className="mt-1 rounded-2xl border border-[#dfe8e1] bg-white p-4 shadow-sm">
        <p className="mb-2 font-mono text-[0.6rem] font-medium uppercase tracking-[0.12em] text-[#92a09a]">Demo credentials</p>
        <table className="w-full text-[0.72rem] text-[#74807b]">
          <tbody>
            {[
              ["Admin", "admin@r3ntledger.com", "admin123"],
              ["Manager", "manager@r3ntledger.com", "manager123"],
              ["Tenant (John)", "john@r3ntledger.com", "tenant123"],
              ["Tenant (Mary)", "mary@r3ntledger.com", "tenant123"],
            ].map(([role, e, p]) => (
              <tr key={role} className="cursor-pointer hover:text-[#4b765c]" onClick={() => { setEmail(e); setPassword(p); }}>
                <td className="py-[3px] pr-3 font-semibold text-[#202b27]">{role}</td>
                <td className="pr-3">{e}</td>
                <td className="font-mono">{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[0.65rem] text-[#a0aaa4]">Click a row to auto-fill.</p>
      </div>
    </form>
  );
}

function SignUp() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [propertyId, setPropertyId] = useState("");
  const [unit, setUnit] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [loading, setLoading] = useState(false);

  // Read properties directly from localStorage (seeded before login)
  const properties = (() => { try { return JSON.parse(localStorage.getItem("rl_properties")) || []; } catch { return []; } })();

  function handleSubmit(e) {
    e.preventDefault();
    if (role === "tenant" && !propertyId) { toast.error("Please select a property."); return; }
    setLoading(true);
    const error = register(name.trim(), email.trim(), password, role, { propertyId, unit, leaseStart, leaseEnd });
    setLoading(false);
    if (error) toast.error(error);
    else toast.success(`Welcome, ${name.split(" ")[0]}!`);
  }

  const inputCls = "w-full rounded-2xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[13px] text-[0.85rem] text-[#202b27] shadow-sm outline-none transition-all focus:border-[#4b765c] focus:ring-2 focus:ring-[#4b765c]/20";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <TextInput label="Full name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
      <TextInput label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {/* Role selector */}
      <div className="flex flex-col gap-1">
        <FieldLabel>I am a…</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {["tenant", "manager"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-2xl border py-[11px] text-[0.78rem] font-semibold capitalize shadow-sm transition-colors ${
                role === r
                  ? "border-[#4b765c] bg-[#4b765c] text-white"
                  : "border-[#dfe8e1] bg-[#fafcfa] text-[#74807b] hover:border-[#4b765c] hover:text-[#4b765c]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Tenant-only fields */}
      {role === "tenant" && (
        <>
          <div className="flex flex-col gap-1">
            <FieldLabel>Property</FieldLabel>
            <select
              required
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className={inputCls}
            >
              <option value="">— Select a property —</option>
              {properties.filter((p) => p.active !== false).map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.address}</option>
              ))}
            </select>
          </div>

          <TextInput
            label="Unit number"
            type="text"
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g. A1"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <FieldLabel>Lease start</FieldLabel>
              <input type="date" required value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Lease end</FieldLabel>
              <input type="date" required value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} className={inputCls} />
            </div>
          </div>
        </>
      )}

      <button type="submit" disabled={loading} className="mt-2 w-full rounded-2xl bg-[#4b765c] py-[13px] text-[0.75rem] font-bold text-white shadow-sm transition-colors hover:bg-[#3d6050] disabled:opacity-60">
        {loading ? "Creating account…" : "Create account →"}
      </button>
    </form>
  );
}

export default function Login() {
  const [tab, setTab] = useState("signin");

  return (
    <main className="grid h-screen grid-cols-2 overflow-hidden bg-[#e9f1eb]">
      {/* Left panel */}
      <div className="no-scrollbar flex max-h-screen flex-col justify-center overflow-y-auto px-[8%] py-[5%]">
        {/* Brand */}
        <div className="mb-2 flex items-center gap-[10px] text-[1.05rem] tracking-[-0.05em]">
          <b className="flex h-[33px] w-[33px] flex-shrink-0 items-center justify-center rounded-xl bg-[#4b765c] text-[1.2rem] font-bold text-white">R</b>
          <strong className="font-extrabold">R3NT<span className="text-[#4b765c]">LEDGER</span></strong>
        </div>

        {/* <p className="mb-[18px] mt-[18px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
          PROPERTY OPERATIONS, REFINED
        </p> */}

        <h1 className="max-w-[500px] text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.06em] text-[#202b27]">
          Everything under one roof.
        </h1>

        <p className="mb-[24px] mt-[16px] max-w-[390px] text-[0.9rem] leading-[1.7] text-[#74807b]">
          {tab === "signin" ? "Sign in to access your workspace." : "Create an account to get started."}
        </p>

        {/* Tab toggle */}
        <div className="mb-2 flex rounded-2xl border border-[#dfe8e1] bg-white p-1 shadow-sm">
          {[["signin", "Sign in"], ["signup", "Sign up"]].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 rounded-xl py-[9px] text-[0.78rem] font-semibold transition-colors ${
                tab === key ? "bg-[#4b765c] text-white shadow-sm" : "text-[#74807b] hover:text-[#4b765c]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "signin" ? <SignIn /> : <SignUp />}
      </div>

      {/* Right art panel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#365849] to-[#91ad96] p-[10%] after:absolute after:left-[23%] after:top-[18%] after:h-[65%] after:w-[51%] after:-skew-x-[14deg] after:border after:border-white/35 after:content-['']">
        <div className="absolute bottom-[12%] z-10 text-white">
          <span className="font-mono text-[1.5rem]">01</span>
          <strong className="mt-[15px] block text-[3.5rem] font-extrabold leading-[1] tracking-[-0.07em]">
            A better rhythm<br />for every resident.
          </strong>
        </div>
      </div>
    </main>
  );
}
