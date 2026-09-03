import { useState } from "react";
import { initials } from "../utils/formatters.js";

const photoBg = ["bg-[#496c5b]", "bg-[#8d7161]", "bg-[#4a6880]", "bg-[#6b5c7a]"];

function DetailDrawer({ property, tenants, colorClass, onClose }) {
  const occupied = tenants.filter((t) => t.propertyId === property.id);
  const occupiedCount = occupied.length;
  const totalUnits = property.units;
  const vacantCount = Math.max(0, totalUnits - occupiedCount);
  const pct = totalUnits > 0 ? Math.round((occupiedCount / totalUnits) * 100) : 0;

  // Build unit grid: occupied slots first, then vacant
  const unitSlots = Array.from({ length: totalUnits }, (_, i) => occupied[i] || null);

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#24372e66]" onClick={onClose} />

      {/* Drawer */}
      <aside className="no-scrollbar relative z-10 flex h-full w-[420px] flex-col overflow-y-auto bg-white shadow-2xl">
        {/* Header band */}
        <div className={`flex-shrink-0 p-7 pb-6 ${colorClass}`}>
          <div className="flex items-start justify-between">
            <span className="text-[3rem] font-extrabold tracking-[-0.1em] text-white/30">
              {property.name.slice(0, 2).toUpperCase()}
            </span>
            <button
              onClick={onClose}
              className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            >
              ✕
            </button>
          </div>
          <h2 className="mt-3 text-[1.4rem] font-extrabold leading-tight tracking-[-0.04em] text-white">
            {property.name}
          </h2>
          <p className="mt-1 text-[0.78rem] text-white/70">{property.address}</p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 font-mono text-[0.58rem] font-semibold tracking-[0.08em] ${property.active !== false ? "bg-white/20 text-white" : "bg-black/20 text-white/60"}`}>
            {property.active !== false ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        <div className="flex flex-col gap-6 p-7">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Total units", totalUnits],
              ["Occupied", occupiedCount],
              ["Vacant", vacantCount],
            ].map(([label, val]) => (
              <div key={label} className="rounded-2xl border border-[#e5ebe7] bg-[#f8faf8] p-4 text-center">
                <p className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[#202b27]">{val}</p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-[#92a09a]">{label}</p>
              </div>
            ))}
          </div>

          {/* Occupancy bar */}
          <div>
            <div className="mb-2 flex justify-between text-[0.72rem] text-[#74807b]">
              <span>Occupancy rate</span>
              <b className="font-bold text-[#4b765c]">{pct}%</b>
            </div>
            <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#edf1ee]">
              <span
                className="block h-full rounded-full bg-[#4b765c] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Unit grid */}
          <div>
            <p className="mb-3 font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#92a09a]">
              Unit breakdown
            </p>
            <div className="grid grid-cols-4 gap-2">
              {unitSlots.map((tenant, i) => (
                <div
                  key={i}
                  title={tenant ? tenant.name : "Vacant"}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center ${
                    tenant
                      ? "border-[#c8dece] bg-[#edf5ef]"
                      : "border-[#e5ebe7] bg-[#f8faf8]"
                  }`}
                >
                  {tenant ? (
                    <>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4b765c] font-mono text-[0.6rem] font-bold text-white">
                        {initials(tenant.name)}
                      </span>
                      <span className="mt-1 w-full truncate text-[0.6rem] font-semibold text-[#202b27]">
                        {tenant.unit || `U${i + 1}`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[1.1rem] text-[#c5d0c8]">○</span>
                      <span className="mt-1 text-[0.6rem] text-[#a0aaa4]">Vacant</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tenant list */}
          {occupied.length > 0 && (
            <div>
              <p className="mb-3 font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#92a09a]">
                Current tenants
              </p>
              <div className="flex flex-col gap-2">
                {occupied.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-xl border border-[#e5ebe7] bg-[#f8faf8] px-4 py-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e3eee6] font-mono text-[0.65rem] font-bold text-[#4b765c]">
                      {initials(t.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[0.82rem] font-semibold text-[#202b27]">{t.name}</p>
                      <p className="text-[0.7rem] text-[#74807b]">Unit {t.unit || "—"}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-[#e6f1e9] px-2 py-[2px] font-mono text-[0.58rem] font-semibold text-[#4b765c]">
                      {t.leaseStatus || "active"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function Properties({ properties, tenants = [], onAdd }) {
  const [addOpen, setAddOpen] = useState(false);
  const [active, setActive] = useState(true);
  const [selected, setSelected] = useState(null);

  function handleSubmit(e) {
    const closed = onAdd(e);
    if (closed) { setAddOpen(false); setActive(true); }
  }

  const selectedIndex = selected ? properties.findIndex((p) => p.id === selected.id) : -1;

  return (
    <div style={{ padding: "0 6% 70px" }}>
      <div className="mb-[19px] flex items-end justify-between">
        <div>
          <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            YOUR PORTFOLIO
          </p>
          <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">Properties at a glance.</h2>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="rounded-xl bg-[#4b765c] px-[17px] py-[11px] text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]"
        >
          ＋ Add property
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {properties.map((property, i) => {
          const occupied = tenants.filter((t) => t.propertyId === property.id).length;
          const pct = property.units > 0 ? Math.round((occupied / property.units) * 100) : 0;
          return (
            <article
              key={property.id}
              className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
              onClick={() => setSelected(property)}
            >
              <div className={`flex h-[190px] items-start justify-between p-[18px] text-[3.5rem] font-extrabold tracking-[-0.12em] text-[#d9e9dd] ${photoBg[i % photoBg.length]}`}>
                {property.name.slice(0, 2).toUpperCase()}
                <span className={`mt-1 rounded-full px-3 py-1 font-mono text-[0.58rem] font-semibold tracking-[0.08em] ${property.active !== false ? "bg-white/20 text-white" : "bg-black/20 text-white/70"}`}>
                  {property.active !== false ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="flex items-start justify-between px-5 pb-[7px] pt-[18px]">
                <div>
                  <h3 className="text-[1.1rem] font-bold">{property.name}</h3>
                  <p className="mt-1 text-[0.7rem] text-[#74807b]">{property.address}</p>
                </div>
                <span className="text-[0.7rem] text-[#74807b]">{property.units} units</span>
              </div>
              <div className="px-5 pb-[18px] pt-[7px] text-[0.7rem] text-[#74807b]">
                Occupancy
                <b className="float-right font-bold text-[#4b765c]">{pct}%</b>
                <div className="clear-both mt-2 h-[5px] w-full overflow-hidden rounded-full bg-[#edf1ee]">
                  <span className="block h-full rounded-full bg-[#4b765c]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Detail drawer */}
      {selected && (
        <DetailDrawer
          property={selected}
          tenants={tenants}
          colorClass={photoBg[selectedIndex % photoBg.length]}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Add property modal */}
      {addOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#24372e88]">
          <form
            onSubmit={handleSubmit}
            className="relative grid w-[90%] max-w-[440px] gap-4 rounded-2xl bg-white p-[30px] shadow-xl"
          >
            <button type="button" onClick={() => setAddOpen(false)} className="absolute right-[15px] top-[10px] bg-transparent text-xl text-[#74807b] hover:text-[#202b27]">×</button>
            <p className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">NEW PROPERTY</p>
            <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">Add a property</h2>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]">Property name</label>
              <input name="name" required placeholder="e.g. Sunset Apartments" className="rounded-xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[11px] text-[0.85rem] text-[#202b27] outline-none focus:border-[#4b765c] focus:ring-2 focus:ring-[#4b765c]/20" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]">Number of units</label>
              <input name="units" type="number" min="1" required placeholder="e.g. 12" className="rounded-xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[11px] text-[0.85rem] text-[#202b27] outline-none focus:border-[#4b765c] focus:ring-2 focus:ring-[#4b765c]/20" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]">Area / Location</label>
              <input name="address" required placeholder="e.g. Westlands, Nairobi" className="rounded-xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[11px] text-[0.85rem] text-[#202b27] outline-none focus:border-[#4b765c] focus:ring-2 focus:ring-[#4b765c]/20" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[11px]">
              <span className="text-[0.85rem] font-medium text-[#202b27]">Active status</span>
              <input type="hidden" name="active" value={String(active)} />
              <button type="button" onClick={() => setActive((v) => !v)} className={`relative h-6 w-11 rounded-full transition-colors ${active ? "bg-[#4b765c]" : "bg-[#dfe8e1]"}`}>
                <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${active ? "left-[22px]" : "left-[3px]"}`} />
              </button>
            </div>
            <button type="submit" className="mt-1 w-full rounded-xl bg-[#4b765c] py-[13px] text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]">
              Save property →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
