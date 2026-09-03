import { useState } from "react";
import { initials } from "../utils/formatters.js";

function EditLeaseModal({ tenant, properties, onSave, onClose }) {
  const [propertyId, setPropertyId] = useState(tenant.propertyId || "");
  const [unit, setUnit] = useState(tenant.unit || "");
  const [leaseStart, setLeaseStart] = useState(tenant.leaseStart || "");
  const [leaseEnd, setLeaseEnd] = useState(tenant.leaseEnd || "");
  const [leaseStatus, setLeaseStatus] = useState(tenant.leaseStatus || "active");

  function handleSubmit(e) {
    e.preventDefault();
    onSave(tenant.id, { propertyId, unit, leaseStart, leaseEnd, leaseStatus });
    onClose();
  }

  const inputCls = "rounded-xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[11px] text-[0.85rem] text-[#202b27] outline-none focus:border-[#4b765c] focus:ring-2 focus:ring-[#4b765c]/20 w-full";
  const labelCls = "font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#24372e88]">
      <form
        onSubmit={handleSubmit}
        className="relative grid w-[90%] max-w-[460px] gap-4 rounded-2xl bg-white p-[30px] shadow-xl"
      >
        <button type="button" onClick={onClose} className="absolute right-[15px] top-[10px] bg-transparent text-xl text-[#74807b] hover:text-[#202b27]">×</button>

        <p className={labelCls}>EDIT LEASE</p>
        <h2 className="text-[1.35rem] font-bold tracking-[-0.04em]">Update your lease</h2>

        {/* Property */}
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Property</label>
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

        {/* Unit */}
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Unit number</label>
          <input
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g. A1"
            className={inputCls}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Lease start</label>
            <input type="date" required value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Lease end</label>
            <input type="date" required value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Lease status</label>
          <div className="grid grid-cols-3 gap-2">
            {["active", "pending", "expired"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setLeaseStatus(s)}
                className={`rounded-xl border py-[9px] text-[0.75rem] font-semibold capitalize transition-colors ${
                  leaseStatus === s
                    ? "border-[#4b765c] bg-[#4b765c] text-white"
                    : "border-[#dfe8e1] bg-[#fafcfa] text-[#74807b] hover:border-[#4b765c] hover:text-[#4b765c]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="mt-1 w-full rounded-xl bg-[#4b765c] py-[13px] text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]">
          Save changes →
        </button>
      </form>
    </div>
  );
}

export default function Leases({ tenants, manager, properties = [], onUpdateLease }) {
  const [editing, setEditing] = useState(null);

  return (
    <div style={{ padding: "0 6% 70px" }}>
      <div className="mb-[19px]">
        <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
          LEASE MANAGEMENT
        </p>
        <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">Stay ahead of every renewal.</h2>
      </div>

      <div className="flex flex-col gap-3">
        {tenants.map((tenant) => {
          const property = properties.find((p) => p.id === tenant.propertyId);
          const statusColor =
            tenant.leaseStatus === "active" ? "bg-[#e6f1e9] text-[#4b765c]"
            : tenant.leaseStatus === "expired" ? "bg-[#fdecea] text-[#c0392b]"
            : "bg-[#fff0de] text-[#b07d2e]";

          return (
            <article key={tenant.id} className="rounded-2xl bg-white p-[23px] shadow-sm">
              <div className="flex items-center justify-between gap-3">
                {/* Avatar + name */}
                <div className="flex items-center gap-[10px]">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e3eee6] font-mono text-[0.68rem] font-medium text-[#4b765c]">
                    {initials(tenant.name)}
                  </span>
                  <span>
                    <b className="block text-[0.76rem] font-bold">{tenant.name}</b>
                    <small className="mt-[3px] block text-[0.72rem] text-[#74807b]">Unit {tenant.unit || "—"}</small>
                  </span>
                </div>

                {/* Property */}
                <div className="hidden flex-col gap-[3px] sm:flex">
                  <small className="text-[0.68rem] text-[#92a09a]">Property</small>
                  <b className="text-[0.76rem] font-semibold text-[#202b27]">{property ? property.name : <span className="text-[#c0392b]">Not assigned</span>}</b>
                </div>

                {/* Lease period */}
                <div className="hidden flex-col gap-[3px] md:flex">
                  <small className="text-[0.68rem] text-[#92a09a]">Lease period</small>
                  <b className="text-[0.76rem] font-semibold">
                    {tenant.leaseStart || "—"} → {tenant.leaseEnd || "—"}
                  </b>
                </div>

                {/* Status + action */}
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-[9px] py-[5px] font-mono text-[0.62rem] font-medium capitalize ${statusColor}`}>
                    {tenant.leaseStatus || "—"}
                  </span>
                  {!manager && (
                    <button
                      onClick={() => setEditing(tenant)}
                      className="rounded-xl border border-[#4b765c] px-3 py-[6px] text-[0.72rem] font-bold text-[#4b765c] transition-colors hover:bg-[#4b765c] hover:text-white"
                    >
                      Edit lease
                    </button>
                  )}
                </div>
              </div>

              {/* Property detail band — shown when assigned */}
              {property && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f4f8f5] px-4 py-3 text-[0.72rem] text-[#74807b]">
                  <span className="text-[#4b765c]">▦</span>
                  <span>{property.name}</span>
                  <span className="mx-1 text-[#c5d0c8]">·</span>
                  <span>{property.address}</span>
                  <span className="mx-1 text-[#c5d0c8]">·</span>
                  <span>{property.units} total units</span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {editing && (
        <EditLeaseModal
          tenant={editing}
          properties={properties}
          onSave={onUpdateLease}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
