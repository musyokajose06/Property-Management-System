import { initials } from "../utils/formatters.js";

export default function Tenants({ tenants, manager }) {
  return (
    <div className="px-[6%] pb-[70px]">
      <div className="flex items-end justify-between mb-[19px]">
        <div>
          <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mb-[10px]">PEOPLE & LEASES</p>
          <h2 className="text-[1.45rem] tracking-[-0.04em] font-bold m-0">
            {manager ? "The people behind the doors." : "Your household profile."}
          </h2>
        </div>
        {manager && (
          <button className="block bg-[#4b765c] text-white text-[0.75rem] font-bold px-[17px] py-[13px] text-center hover:bg-[#3d6050] transition-colors">
            ＋ Add tenant
          </button>
        )}
      </div>

      <section className="bg-white p-[23px] overflow-x-auto">
        {/* Table head */}
        <div className="grid gap-[18px] text-[#a0aaa4] font-mono text-[0.62rem] tracking-[0.08em] uppercase pb-3 border-b border-[#e5ebe7] min-w-[650px]" style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1fr" }}>
          <span>Resident</span>
          <span>Unit</span>
          <span>Lease End</span>
          <span>Status</span>
        </div>
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="grid gap-[18px] items-center border-t border-[#e5ebe7] py-[14px] min-w-[650px]"
            style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1fr" }}
          >
            <div className="flex items-center gap-[10px]">
              <span className="w-9 h-9 rounded-full bg-[#e3eee6] text-[#4b765c] flex items-center justify-center flex-shrink-0 font-mono text-[0.68rem] font-medium">
                {initials(tenant.name)}
              </span>
              <span className="min-w-0">
                <b className="text-[0.76rem] font-bold block">{tenant.name}</b>
                <small className="text-[#74807b] block text-[0.72rem] mt-[5px]">{tenant.email}</small>
              </span>
            </div>
            <span className="text-sm text-[#202b27]">{tenant.unit}</span>
            <span className="text-sm text-[#202b27]">{tenant.leaseEnd}</span>
            <span className="rounded-full bg-[#e6f1e9] text-[#4b765c] font-mono text-[0.62rem] font-medium px-[9px] py-[5px] capitalize w-fit">
              Active
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
