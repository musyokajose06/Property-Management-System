const get = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) || fb } catch { return fb } }
const set = (key, val) => localStorage.setItem(key, JSON.stringify(val))

export const seedData = () => {
  if (localStorage.getItem('rl_seeded')) return
  set('rl_properties', [
    { id: 'p1', name: 'Sunset Apartments', address: '123 Sunset Blvd', units: 10, managerId: 'm1' },
    { id: 'p2', name: 'Green Valley', address: '456 Valley Rd', units: 8, managerId: 'm1' },
  ])
  set('rl_tenants', [
    { id: 't1', name: 'John Tenant', email: 'tenant1@r3nt.com', unit: 'A1', propertyId: 'p1', leaseStart: '2024-01-01', leaseEnd: '2025-12-01', leaseStatus: 'active', leaseApproval: 'approved' },
    { id: 't2', name: 'Mary Tenant', email: 'tenant2@r3nt.com', unit: 'B2', propertyId: 'p1', leaseStart: '2024-03-01', leaseEnd: '2025-03-01', leaseStatus: 'active', leaseApproval: 'approved' },
  ])
  set('rl_inquiries', [
    { id: 'i1', tenantId: 't1', tenantName: 'John Tenant', subject: 'Water leak', message: 'Leak in unit A1', date: '2025-01-10', status: 'open' },
  ])
  set('rl_warnings', [
    { id: 'w1', target: 't1', targetName: 'John Tenant', message: 'Noise complaint', date: '2025-01-15', isGlobal: false },
    { id: 'w2', target: 'all', targetName: 'All Tenants', message: 'Rent due reminder', date: '2025-01-20', isGlobal: true },
  ])
  set('rl_payments', [
    { id: 'pay1', tenantId: 't1', tenantName: 'John Tenant', amount: 1200, dueDate: '2025-02-01', status: 'paid', month: 'February 2025' },
    { id: 'pay2', tenantId: 't2', tenantName: 'Mary Tenant', amount: 1100, dueDate: '2025-02-01', status: 'pending', month: 'February 2025' },
  ])
  set('rl_plans', [
    { id: 'pl1', tenantId: 't1', tenantName: 'John Tenant', amount: 1200, frequency: 'monthly', nextDue: '2025-03-01' },
    { id: 'pl2', tenantId: 't2', tenantName: 'Mary Tenant', amount: 1100, frequency: 'monthly', nextDue: '2025-03-01' },
  ])
  set('rl_seeded', true)
}

export const db = {
  properties: { getAll: () => get('rl_properties', []), save: v => set('rl_properties', v) },
  tenants:    { getAll: () => get('rl_tenants', []),    save: v => set('rl_tenants', v) },
  inquiries:  { getAll: () => get('rl_inquiries', []),  save: v => set('rl_inquiries', v) },
  warnings:   { getAll: () => get('rl_warnings', []),   save: v => set('rl_warnings', v) },
  payments:   { getAll: () => get('rl_payments', []),   save: v => set('rl_payments', v) },
  plans:      { getAll: () => get('rl_plans', []),      save: v => set('rl_plans', v) },
}
