import { useState } from "react";
import { initials } from "../utils/formatters.js";

export default function Notices({ notices, manager, tenants = [], onPost }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all"); // "all" | "specific"
  const [selected, setSelected] = useState([]);

  function toggleTenant(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (audience === "specific" && selected.length === 0) return;
    onPost({ title, body, recipients: audience === "all" ? "all" : selected });
    setTitle("");
    setBody("");
    setAudience("all");
    setSelected([]);
    setOpen(false);
  }

  const inputCls =
    "w-full rounded-2xl border border-[#dfe8e1] bg-[#fafcfa] px-4 py-[11px] text-[0.85rem] text-[#202b27] outline-none focus:border-[#4b765c] focus:ring-2 focus:ring-[#4b765c]/20";

  return (
    <div className="px-4 pb-[70px] pt-4 md:px-[6%] md:pt-0">
      <div className="mb-[19px] flex items-end justify-between">
        <div>
          <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            NOTICE BOARD
          </p>
          <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">
            {manager ? "Broadcast to residents." : "Latest from management."}
          </h2>
        </div>
        {manager && (
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-[#4b765c] px-[17px] py-[11px] text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]"
          >
            ＋ Post notice
          </button>
        )}
      </div>

      {notices.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#dfe8e1] py-16 text-center text-[0.85rem] text-[#92a09a]">
          No notices for you yet.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {notices.map((n, i) => {
          const isAll = n.recipients === "all";
          const recipientNames = !isAll && Array.isArray(n.recipients)
            ? tenants.filter((t) => n.recipients.includes(t.id)).map((t) => t.name)
            : [];

          return (
            <article key={n.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#e9f1eb] font-mono text-[0.7rem] font-bold text-[#4b765c]">
                    {String(notices.length - i).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[1rem] font-bold tracking-[-0.02em] text-[#202b27]">
                      {n.title}
                    </h3>
                    <p className="mt-[2px] font-mono text-[0.63rem] text-[#92a09a]">
                      {n.date} · {n.author}
                    </p>
                  </div>
                </div>

                {/* Recipients tag — only managers see the full breakdown */}
                {manager && (
                  <span className={`flex-shrink-0 rounded-full px-3 py-1 font-mono text-[0.58rem] font-semibold ${isAll ? "bg-[#e9f1eb] text-[#4b765c]" : "bg-[#fff0de] text-[#b07d2e]"}`}>
                    {isAll ? "All tenants" : `${recipientNames.length} tenant${recipientNames.length !== 1 ? "s" : ""}`}
                  </span>
                )}
              </div>

              <p className="mt-4 border-t border-[#f0f5f1] pt-4 text-[0.85rem] leading-[1.7] text-[#74807b]">
                {n.body}
              </p>

              {/* Recipient list for manager */}
              {manager && !isAll && recipientNames.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recipientNames.map((name) => (
                    <span key={name} className="flex items-center gap-1 rounded-full border border-[#e5ebe7] bg-[#f8faf8] px-3 py-1 text-[0.68rem] font-medium text-[#74807b]">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#4b765c] font-mono text-[0.5rem] text-white">
                        {initials(name)}
                      </span>
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Post notice modal */}
      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#24372e88]">
          <form
            onSubmit={handleSubmit}
            className="no-scrollbar relative flex max-h-[90vh] w-[90%] max-w-[460px] flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-[30px] shadow-xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-[15px] top-[10px] bg-transparent text-xl text-[#74807b] hover:text-[#202b27]"
            >
              ×
            </button>
            <p className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
              NEW BROADCAST
            </p>
            <h2 className="text-[1.35rem] font-bold tracking-[-0.04em]">Post a notice</h2>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]">Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Water Maintenance" className={inputCls} />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]">Message</label>
              <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="What should residents know?" rows={3} className={`${inputCls} resize-none`} />
            </div>

            {/* Audience toggle */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]">Send to</label>
              <div className="grid grid-cols-2 gap-2">
                {[["all", "All tenants"], ["specific", "Specific tenants"]].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { setAudience(val); setSelected([]); }}
                    className={`rounded-xl border py-[9px] text-[0.75rem] font-semibold transition-colors ${
                      audience === val
                        ? "border-[#4b765c] bg-[#4b765c] text-white"
                        : "border-[#dfe8e1] bg-[#fafcfa] text-[#74807b] hover:border-[#4b765c] hover:text-[#4b765c]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tenant checklist */}
            {audience === "specific" && (
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.12em] text-[#74807b]">
                  Choose tenants {selected.length > 0 && <span className="text-[#4b765c]">({selected.length} selected)</span>}
                </label>
                <div className="flex flex-col gap-2 rounded-2xl border border-[#dfe8e1] bg-[#fafcfa] p-3">
                  {tenants.length === 0 && (
                    <p className="text-center text-[0.75rem] text-[#92a09a]">No tenants found.</p>
                  )}
                  {tenants.map((t) => {
                    const checked = selected.includes(t.id);
                    return (
                      <label
                        key={t.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-[10px] transition-colors ${
                          checked ? "border-[#4b765c] bg-[#edf5ef]" : "border-transparent hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTenant(t.id)}
                          className="accent-[#4b765c]"
                        />
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#e3eee6] font-mono text-[0.6rem] font-bold text-[#4b765c]">
                          {initials(t.name)}
                        </span>
                        <span className="text-[0.82rem] font-medium text-[#202b27]">{t.name}</span>
                        <span className="ml-auto text-[0.7rem] text-[#92a09a]">Unit {t.unit || "—"}</span>
                      </label>
                    );
                  })}
                </div>
                {audience === "specific" && selected.length === 0 && (
                  <p className="text-[0.68rem] text-[#c0392b]">Select at least one tenant.</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={audience === "specific" && selected.length === 0}
              className="w-full rounded-xl bg-[#4b765c] py-[13px] text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050] disabled:opacity-50"
            >
              Publish notice →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
