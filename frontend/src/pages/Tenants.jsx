import { initials } from "../utils/formatters.js";

export default function Tenants({ tenants, manager }) {
  return (
    <div style={{ padding: "0 6% 70px" }}>
      <div className="mb-[19px] flex items-end justify-between">
        <div>
          <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            PEOPLE & LEASES
          </p>
          <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">
            {manager
              ? "The people behind the doors."
              : "Your household profile."}
          </h2>
        </div>
        {manager && (
          <button className="block bg-[#4b765c] px-[17px] py-[13px] text-center text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]">
            ＋ Add tenant
          </button>
        )}
      </div>

      <section className="overflow-x-auto bg-white p-[23px]">
        {/* Head */}
        <div
          className="grid min-w-[650px] gap-[18px] border-b border-[#e5ebe7] pb-3 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-[#a0aaa4]"
          style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1fr" }}
        >
          <span>Resident</span>
          <span>Unit</span>
          <span>Lease End</span>
          <span>Status</span>
        </div>
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="grid min-w-[650px] items-center gap-[18px] border-t border-[#e5ebe7] py-[14px]"
            style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1fr" }}
          >
            <div className="flex items-center gap-[10px]">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e3eee6] font-mono text-[0.68rem] font-medium text-[#4b765c]">
                {initials(tenant.name)}
              </span>
              <span className="min-w-0">
                <b className="block text-[0.76rem] font-bold">{tenant.name}</b>
                <small className="mt-[5px] block text-[0.72rem] text-[#74807b]">
                  {tenant.email}
                </small>
              </span>
            </div>
            <span className="text-sm text-[#202b27]">{tenant.unit}</span>
            <span className="text-sm text-[#202b27]">{tenant.leaseEnd}</span>
            <span className="w-fit rounded-full bg-[#e6f1e9] px-[9px] py-[5px] font-mono text-[0.62rem] font-medium capitalize text-[#4b765c]">
              Active
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
