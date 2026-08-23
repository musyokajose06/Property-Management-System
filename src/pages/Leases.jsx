import { initials } from "../utils/formatters.js";

export default function Leases({ tenants, manager }) {
  return (
    <div className="px-[6%] pb-[70px]">
      <div className="flex items-end justify-between mb-[19px]">
        <div>
          <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mb-[10px]">LEASE MANAGEMENT</p>
          <h2 className="text-[1.45rem] tracking-[-0.04em] font-bold m-0">Stay ahead of every renewal.</h2>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {tenants.map((tenant) => (
          <article
            key={tenant.id}
            className="bg-white p-[23px] flex items-center justify-between gap-3 border-t border-[#e5ebe7] first:border-t-0"
          >
            <div className="flex items-center gap-[10px]">
              <span className="w-9 h-9 rounded-full bg-[#e3eee6] text-[#4b765c] flex items-center justify-center flex-shrink-0 font-mono text-[0.68rem] font-medium">
                {initials(tenant.name)}
              </span>
              <span>
                <b className="text-[0.76rem] font-bold block">{tenant.name}</b>
                <small className="text-[#74807b] block text-[0.72rem] mt-[5px]">Unit {tenant.unit}</small>
              </span>
            </div>

            <div className="grid gap-[5px] ml-auto mr-[8%]">
              <small className="text-[#74807b] block text-[0.72rem]">Lease period</small>
              <b className="text-[0.76rem] font-bold">{tenant.leaseStart} — {tenant.leaseEnd}</b>
            </div>

            <span className="rounded-full bg-[#e6f1e9] text-[#4b765c] font-mono text-[0.62rem] font-medium px-[9px] py-[5px] capitalize">
              {tenant.leaseApproval}
            </span>

            {!manager && (
              <button className="bg-transparent text-[#4b765c] text-[0.72rem] font-bold py-[6px] hover:underline">
                Request edit ↗
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
