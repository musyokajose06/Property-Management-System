import { useState } from 'react'
import './App.css'
import { useAuth } from './context/AuthContext.jsx'
import { db, seedData } from './store/data.js'
import toast, { Toaster } from 'react-hot-toast'
import Login from './components/Login.jsx'
import { initials } from './utils/formatters.js'
import Overview from './pages/Overview.jsx'
import Properties from './pages/Properties.jsx'
import Tenants from './pages/Tenants.jsx'
import Payments from './pages/Payments.jsx'
import Leases from './pages/Leases.jsx'
import Inquiries from './pages/Inquiries.jsx'

const navItems = [['overview', 'Overview'], ['properties', 'Properties'], ['tenants', 'Tenants'], ['inquiries', 'Inquiries'], ['payments', 'Payments'], ['leases', 'Leases']]
function App() {
  const { session, loginAsManager, loginAsAdmin, loginAsTenant, logout } = useAuth()
  const [active, setActive] = useState('overview')
  const [, setVersion] = useState(0)
  const [showNotice, setShowNotice] = useState(false)
  const [notice, setNotice] = useState('')
  seedData()
  const data = { properties: db.properties.getAll(), tenants: db.tenants.getAll(), inquiries: db.inquiries.getAll(), warnings: db.warnings.getAll(), payments: db.payments.getAll(), plans: db.plans.getAll() }
  const manager = session?.role === 'manager' || session?.role === 'admin'
  const tenants = manager ? data.tenants : data.tenants.filter((item) => item.id === session?.tenantId)
  const payments = manager ? data.payments : data.payments.filter((item) => item.tenantId === session?.tenantId)
  const inquiries = manager ? data.inquiries : data.inquiries.filter((item) => item.tenantId === session?.tenantId)
  const refresh = () => setVersion((value) => value + 1)
  const updatePayment = (payment) => { db.payments.save(data.payments.map((item) => item.id === payment.id ? { ...item, status: item.status === 'paid' ? 'pending' : 'paid' } : item)); refresh(); toast.success('Payment status updated') }
  const addInquiry = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); db.inquiries.save([{ id: `i${Date.now()}`, tenantId: session.tenantId, tenantName: session.name, subject: form.get('subject'), message: form.get('message'), date: new Date().toISOString().slice(0, 10), status: 'open' }, ...data.inquiries]); event.currentTarget.reset(); refresh(); toast.success('Inquiry sent to your manager') }
  if (!session) return <Login onManager={loginAsManager} onAdmin={loginAsAdmin} onTenant={loginAsTenant} tenants={data.tenants} />
  return <div className="app-shell"><Toaster position="top-right" /><aside className="sidebar"><div className="brand"><b>R</b><strong>R3NT<span>LEDGER</span></strong></div><p className="eyebrow">PROPERTY OPERATIONS</p><nav>{navItems.filter(([id]) => manager || ['overview', 'inquiries', 'payments', 'leases'].includes(id)).map(([id, label]) => <button className={active === id ? 'nav-item active' : 'nav-item'} key={id} onClick={() => setActive(id)}><span>{id === 'overview' ? '⌂' : id === 'properties' ? '▦' : id === 'tenants' ? '♙' : id === 'inquiries' ? '◌' : id === 'payments' ? '◈' : '▤'}</span>{label}</button>)}</nav><button className="logout" onClick={logout}>↪ Sign out</button></aside><main className="main"><header><div><p className="eyebrow">{session.role.toUpperCase()} CONSOLE</p><h1>{active === 'overview' ? `Good morning, ${session.name.split(' ')[0]}` : navItems.find(([id]) => id === active)?.[1]}</h1></div><div className="user-chip"><span className="avatar">{initials(session.name)}</span><strong>{session.name}<small>{session.role}</small></strong></div></header>{active === 'overview' && <Overview manager={manager} payments={payments} inquiries={inquiries} plans={data.plans} onNavigate={setActive} onPayment={updatePayment} />}{active === 'properties' && <Properties properties={data.properties} />}{active === 'tenants' && <Tenants tenants={tenants} manager={manager} />}{active === 'payments' && <Payments payments={payments} manager={manager} onPayment={updatePayment} />}{active === 'leases' && <Leases tenants={tenants} manager={manager} />}{active === 'inquiries' && <Inquiries inquiries={inquiries} manager={manager} onSubmit={addInquiry} />}</main>{manager && <button className="floating-action" onClick={() => setShowNotice(true)}>＋ Post notice</button>}{showNotice && <div className="modal-backdrop"><form className="modal" onSubmit={(event) => { event.preventDefault(); setShowNotice(false); setNotice(''); toast.success('Notice published') }}><button type="button" className="modal-close" onClick={() => setShowNotice(false)}>×</button><p className="eyebrow">NEW BROADCAST</p><h2>Post a notice</h2><input required placeholder="Notice title" /><textarea required value={notice} onChange={(event) => setNotice(event.target.value)} placeholder="What should residents know?" /><button className="primary">Publish notice</button></form></div>}</div>
}

export default App
