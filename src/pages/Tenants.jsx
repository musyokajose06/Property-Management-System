import { initials } from '../utils/formatters.js'

export default function Tenants({ tenants, manager }) {
  return <div className="content"><div className="section-heading"><div><p className="eyebrow">PEOPLE & LEASES</p><h2>{manager ? 'The people behind the doors.' : 'Your household profile.'}</h2></div>{manager && <button className="primary">＋ Add tenant</button>}</div><section className="panel table-panel"><div className="table-head"><span>Resident</span><span>Unit</span><span>Lease</span><span>Status</span></div>{tenants.map((tenant) => <div className="table-row" key={tenant.id}><div className="resident"><span className="avatar">{initials(tenant.name)}</span><span><b>{tenant.name}</b><small>{tenant.email}</small></span></div><span>{tenant.unit}</span><span>{tenant.leaseEnd}</span><span className="pill active">Active</span></div>)}</section></div>
}
