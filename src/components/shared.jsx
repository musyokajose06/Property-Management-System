import { money } from '../utils/formatters.js'

export function Metric({ label, value, trend }) {
  return <div className="metric"><p>{label}</p><strong>{value}</strong><span>{trend}</span></div>
}

export function PanelTitle({ title, action, onClick }) {
  return <div className="panel-title"><h3>{title}</h3><button onClick={onClick}>{action} ↗</button></div>
}

export function PaymentRow({ payment, manager, onPayment }) {
  return <div className="payment-row"><span className="payment-avatar">{payment.tenantName?.[0]}</span><div><b>{manager ? payment.tenantName : payment.month}</b><small>{manager ? payment.month : `Due ${payment.dueDate}`}</small></div><strong>{money(payment.amount)}</strong><button className={`pill ${payment.status}`} onClick={() => manager && onPayment(payment)}>{payment.status}</button></div>
}
