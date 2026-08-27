import { useState } from "react";
import "./App.css";
import { useAuth } from "./context/AuthContext.jsx";
import { db, seedData } from "./store/data.js";
import toast, { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import { initials } from "./utils/formatters.js";
import Overview from "./pages/Overview.jsx";
import Properties from "./pages/Properties.jsx";
import Tenants from "./pages/Tenants.jsx";
import Payments from "./pages/Payments.jsx";
import Leases from "./pages/Leases.jsx";
import Inquiries from "./pages/Inquiries.jsx";

const ICONS = {
  overview: "⌂",
  properties: "▦",
  tenants: "♙",
  inquiries: "◌",
  payments: "◈",
  leases: "▤",
};

const navItems = [
  ["overview", "Overview"],
  ["properties", "Properties"],
  ["tenants", "Tenants"],
  ["inquiries", "Inquiries"],
  ["payments", "Payments"],
  ["leases", "Leases"],
];

function App() {
  const { session, logout } = useAuth();
  const [active, setActive] = useState("overview");
  const [, setVersion] = useState(0);
  const [showNotice, setShowNotice] = useState(false);
  const [notice, setNotice] = useState("");
  seedData();

  const data = {
    properties: db.properties.getAll(),
    tenants: db.tenants.getAll(),
    inquiries: db.inquiries.getAll(),
    warnings: db.warnings.getAll(),
    payments: db.payments.getAll(),
    plans: db.plans.getAll(),
  };

  const manager = session?.role === "manager" || session?.role === "admin";
  const tenants = manager
    ? data.tenants
    : data.tenants.filter((t) => t.id === session?.tenantId);
  const payments = manager
    ? data.payments
    : data.payments.filter((p) => p.tenantId === session?.tenantId);
  const inquiries = manager
    ? data.inquiries
    : data.inquiries.filter((i) => i.tenantId === session?.tenantId);
  const refresh = () => setVersion((v) => v + 1);

  const updatePayment = (payment) => {
    db.payments.save(
      data.payments.map((item) =>
        item.id === payment.id
          ? { ...item, status: item.status === "paid" ? "pending" : "paid" }
          : item,
      ),
    );
    refresh();
    toast.success("Payment status updated");
  };

  const addInquiry = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    db.inquiries.save([
      {
        id: `i${Date.now()}`,
        tenantId: session.tenantId,
        tenantName: session.name,
        subject: form.get("subject"),
        message: form.get("message"),
        date: new Date().toISOString().slice(0, 10),
        status: "open",
      },
      ...data.inquiries,
    ]);
    e.currentTarget.reset();
    refresh();
    toast.success("Inquiry sent to your manager");
  };

  if (!session)
    return (
      <Login />
    );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8faf8]">
      <Toaster position="top-right" className="mb-6" />

      {/* Sidebar */}
      <aside className="flex h-screen w-[238px] flex-shrink-0 flex-col overflow-y-auto border-r border-[#e5ebe7] bg-[#f0f5f1] px-[22px] py-8">
        <div className="mb-2 flex items-center gap-[10px] text-[1.05rem] tracking-[-0.05em]">
          <b className="flex h-[33px] w-[33px] flex-shrink-0 items-center justify-center bg-[#4b765c] text-[1.2rem] font-bold text-white">
            R
          </b>
          <strong className="font-extrabold">
            R3NT<span className="text-[#4b765c]">LEDGER</span>
          </strong>
        </div>
        <p className="mb-4 mt-16 px-[11px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
          PROPERTY OPERATIONS
        </p>
        <nav className="flex flex-col gap-[5px]">
          {navItems
            .filter(
              ([id]) =>
                manager ||
                ["overview", "inquiries", "payments", "leases"].includes(id),
            )
            .map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={
                  active === id
                    ? "flex items-center gap-[13px] rounded px-3 py-3 text-left text-[0.82rem] font-bold text-[#4b765c] transition-colors bg-white"
                    : "flex items-center gap-[13px] rounded px-3 py-3 text-left text-[0.82rem] text-[#718079] transition-colors hover:bg-white hover:text-[#4b765c]"
                }
              >
                <span className="w-[18px] text-center text-[1.15rem]">
                  {ICONS[id]}
                </span>
                {label}
              </button>
            ))}
        </nav>
        <button
          onClick={logout}
          className="mt-auto bg-transparent px-3 py-[10px] text-left text-[0.8rem] text-[#74807b] transition-colors hover:text-[#202b27]"
        >
          ↪ Sign out
        </button>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className="flex flex-shrink-0 items-center justify-between border-b border-[#e5ebe7] bg-[#f8faf8]"
          style={{ padding: "45px 6% 35px" }}
        >
          <div>
            <p className="mb-[13px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
              {session.role.toUpperCase()} CONSOLE
            </p>
            <h1 className="text-[clamp(2rem,3vw,3.1rem)] font-extrabold leading-[1.05] tracking-[-0.06em] text-[#202b27]">
              {active === "overview"
                ? `Good morning, ${session.name.split(" ")[0]}`
                : navItems.find(([id]) => id === active)?.[1]}
            </h1>
          </div>
          <div className="flex items-center gap-[10px] text-[0.78rem]">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e3eee6] font-mono text-[0.68rem] font-medium text-[#4b765c]">
              {initials(session.name)}
            </span>
            <strong className="font-bold">
              {session.name}
              <small className="mt-[5px] block text-[0.72rem] text-[#74807b]">
                {session.role}
              </small>
            </strong>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {active === "overview" && (
            <Overview
              manager={manager}
              payments={payments}
              inquiries={inquiries}
              plans={data.plans}
              onNavigate={setActive}
              onPayment={updatePayment}
            />
          )}
          {active === "properties" && (
            <Properties properties={data.properties} />
          )}
          {active === "tenants" && (
            <Tenants tenants={tenants} manager={manager} />
          )}
          {active === "payments" && (
            <Payments
              payments={payments}
              manager={manager}
              onPayment={updatePayment}
            />
          )}
          {active === "leases" && (
            <Leases tenants={tenants} manager={manager} />
          )}
          {active === "inquiries" && (
            <Inquiries
              inquiries={inquiries}
              manager={manager}
              onSubmit={addInquiry}
            />
          )}
        </main>
      </div>

      {/* FAB */}
      {manager && (
        <button
          onClick={() => setShowNotice(true)}
          className="fixed bottom-7 right-8 z-10 bg-[#4b765c] px-[18px] py-[14px] font-bold text-white shadow-[0_8px_25px_#31584055] transition-colors hover:bg-[#3d6050]"
        >
          ＋ Post notice
        </button>
      )}

      {/* Notice modal */}
      {showNotice && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#24372e88]">
          <form
            className="relative grid w-[90%] max-w-[420px] gap-[14px] bg-white p-[30px]"
            onSubmit={(e) => {
              e.preventDefault();
              setShowNotice(false);
              setNotice("");
              toast.success("Notice published");
            }}
          >
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              className="absolute right-[15px] top-[10px] bg-transparent text-xl text-[#74807b] hover:text-[#202b27]"
            >
              ×
            </button>
            <p className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
              NEW BROADCAST
            </p>
            <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">
              Post a notice
            </h2>
            <input
              required
              placeholder="Notice title"
              className="border border-[#dfe8e1] bg-[#fafcfa] p-[13px] text-[#202b27] outline-[#4b765c]"
            />
            <textarea
              required
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="What should residents know?"
              className="min-h-[110px] resize-y border border-[#dfe8e1] bg-[#fafcfa] p-[13px] text-[#202b27] outline-[#4b765c]"
            />
            <button className="block bg-[#4b765c] px-[17px] py-[13px] text-center text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]">
              Publish notice
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
