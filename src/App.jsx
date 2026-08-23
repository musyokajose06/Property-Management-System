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

const ICONS = { overview: "⌂", properties: "▦", tenants: "♙", inquiries: "◌", payments: "◈", leases: "▤" };
const navItems = [
  ["overview", "Overview"],
  ["properties", "Properties"],
  ["tenants", "Tenants"],
  ["inquiries", "Inquiries"],
  ["payments", "Payments"],
  ["leases", "Leases"],
];

function App() {
  const { session, loginAsManager, loginAsAdmin, loginAsTenant, logout } = useAuth();
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
  const tenants = manager ? data.tenants : data.tenants.filter((t) => t.id === session?.tenantId);
  const payments = manager ? data.payments : data.payments.filter((p) => p.tenantId === session?.tenantId);
  const inquiries = manager ? data.inquiries : data.inquiries.filter((i) => i.tenantId === session?.tenantId);
  const refresh = () => setVersion((v) => v + 1);

  const updatePayment = (payment) => {
    db.payments.save(
      data.payments.map((item) =>
        item.id === payment.id ? { ...item, status: item.status === "paid" ? "pending" : "paid" } : item
      )
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
      <Login
        onManager={loginAsManager}
        onAdmin={loginAsAdmin}
        onTenant={loginAsTenant}
        tenants={data.tenants}
      />
    );

  return (
    <div className="flex h-screen bg-[#f8faf8] overflow-hidden">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="w-[238px] flex-shrink-0 bg-[#f0f5f1] border-r border-[#e5ebe7] flex flex-col py-8 px-[22px] sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-[10px] text-[1.05rem] tracking-[-0.05em] mb-2">
          <b className="w-[33px] h-[33px] bg-[#4b765c] text-white flex items-center justify-center text-[1.2rem] font-bold flex-shrink-0">R</b>
          <strong className="font-extrabold">R3NT<span className="text-[#4b765c]">LEDGER</span></strong>
        </div>
        <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mt-16 mb-4 px-[11px]">
          PROPERTY OPERATIONS
        </p>
        <nav className="flex flex-col gap-[5px]">
          {navItems
            .filter(([id]) => manager || ["overview", "inquiries", "payments", "leases"].includes(id))
            .map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={
                  active === id
                    ? "flex items-center gap-[13px] px-3 py-3 rounded text-[0.82rem] text-left bg-white text-[#4b765c] font-bold transition-colors"
                    : "flex items-center gap-[13px] px-3 py-3 rounded text-[0.82rem] text-left text-[#718079] hover:bg-white hover:text-[#4b765c] transition-colors"
                }
              >
                <span className="text-[1.15rem] w-[18px] text-center">{ICONS[id]}</span>
                {label}
              </button>
            ))}
        </nav>
        <button
          onClick={logout}
          className="mt-auto bg-transparent text-[#74807b] text-[0.8rem] px-3 py-[10px] text-left hover:text-[#202b27] transition-colors"
        >
          ↪ Sign out
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between bg-[#f8faf8] border-b border-[#e5ebe7] flex-shrink-0" style={{ padding: "45px 6% 35px" }}>
          <div>
            <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mb-[13px]">
              {session.role.toUpperCase()} CONSOLE
            </p>
            <h1 className="text-[clamp(2rem,3vw,3.1rem)] tracking-[-0.06em] leading-[1.05] font-extrabold text-[#202b27] m-0">
              {active === "overview"
                ? `Good morning, ${session.name.split(" ")[0]}`
                : navItems.find(([id]) => id === active)?.[1]}
            </h1>
          </div>
          <div className="flex items-center gap-[10px] text-[0.78rem]">
            <span className="w-9 h-9 rounded-full bg-[#e3eee6] text-[#4b765c] flex items-center justify-center flex-shrink-0 font-mono text-[0.68rem] font-medium">
              {initials(session.name)}
            </span>
            <strong className="font-bold">
              {session.name}
              <small className="text-[#74807b] block text-[0.72rem] mt-[5px]">{session.role}</small>
            </strong>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {active === "overview" && (
            <Overview manager={manager} payments={payments} inquiries={inquiries} plans={data.plans} onNavigate={setActive} onPayment={updatePayment} />
          )}
          {active === "properties" && <Properties properties={data.properties} />}
          {active === "tenants" && <Tenants tenants={tenants} manager={manager} />}
          {active === "payments" && <Payments payments={payments} manager={manager} onPayment={updatePayment} />}
          {active === "leases" && <Leases tenants={tenants} manager={manager} />}
          {active === "inquiries" && <Inquiries inquiries={inquiries} manager={manager} onSubmit={addInquiry} />}
        </main>
      </div>

      {/* FAB */}
      {manager && (
        <button
          onClick={() => setShowNotice(true)}
          className="fixed bottom-7 right-8 bg-[#4b765c] text-white font-bold px-[18px] py-[14px] shadow-[0_8px_25px_#31584055] z-10 hover:bg-[#3d6050] transition-colors"
        >
          ＋ Post notice
        </button>
      )}

      {/* Notice Modal */}
      {showNotice && (
        <div className="fixed inset-0 bg-[#24372e88] flex items-center justify-center z-20">
          <form
            className="bg-white grid gap-[14px] max-w-[420px] w-[90%] p-[30px] relative"
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
              className="bg-transparent text-xl absolute right-[15px] top-[10px] text-[#74807b] hover:text-[#202b27]"
            >
              ×
            </button>
            <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium">NEW BROADCAST</p>
            <h2 className="text-[1.45rem] tracking-[-0.04em] font-bold m-0">Post a notice</h2>
            <input
              required
              placeholder="Notice title"
              className="bg-[#fafcfa] border border-[#dfe8e1] text-[#202b27] p-[13px] outline-[#4b765c]"
            />
            <textarea
              required
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="What should residents know?"
              className="bg-[#fafcfa] border border-[#dfe8e1] text-[#202b27] p-[13px] outline-[#4b765c] min-h-[110px] resize-y"
            />
            <button className="block bg-[#4b765c] text-white text-[0.75rem] font-bold px-[17px] py-[13px] text-center hover:bg-[#3d6050] transition-colors">
              Publish notice
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
