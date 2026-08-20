import { initials } from '../utils/formatters.js'

export default function Leases({ tenants, manager }) {
  return <div className="content"><div className="section-heading"><div><p className="eyebrow">LEASE MANAGEMENT</p><h2>Stay ahead of every renewal.</h2></div></div>{tenants.map((tenant) => <article className="panel lease-card" key={tenant.id}><div className="resident"><span className="avatar">{initials(tenant.name)}</span><span><b>{tenant.name}</b><small>Unit {tenant.unit}</small></span></div><div><small>Lease period</small><b>{tenant.leaseStart} — {tenant.leaseEnd}</b></div><span className="pill active">{tenant.leaseApproval}</span>{!manager && <button className="text-button">Request edit ↗</button>}</article>)}</div>
}
