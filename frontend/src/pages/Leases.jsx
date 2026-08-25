import { initials } from "../utils/formatters.js";

export default function Leases({ tenants, manager }) {
  return (
    <div style={{ padding: "0 6% 70px" }}>
      <div className="mb-[19px] flex items-end justify-between">
        <div>
          <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            LEASE MANAGEMENT
          </p>
          <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">
            Stay ahead of every renewal.
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {tenants.map((tenant) => (
          <article
            key={tenant.id}
            className="flex items-center justify-between gap-3 bg-white p-[23px]"
          >
            <div className="flex items-center gap-[10px]">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e3eee6] font-mono text-[0.68rem] font-medium text-[#4b765c]">
                {initials(tenant.name)}
              </span>
              <span>
                <b className="block text-[0.76rem] font-bold">{tenant.name}</b>
                <small className="mt-[5px] block text-[0.72rem] text-[#74807b]">
                  Unit {tenant.unit}
                </small>
              </span>
            </div>

            <div className="ml-auto mr-[8%] grid gap-[5px]">
              <small className="block text-[0.72rem] text-[#74807b]">
                Lease period
              </small>
              <b className="text-[0.76rem] font-bold">
                {tenant.leaseStart} — {tenant.leaseEnd}
              </b>
            </div>

            <span className="rounded-full bg-[#e6f1e9] px-[9px] py-[5px] font-mono text-[0.62rem] font-medium capitalize text-[#4b765c]">
              {tenant.leaseApproval}
            </span>

            {!manager && (
              <button className="bg-transparent py-[6px] text-[0.72rem] font-bold text-[#4b765c] hover:underline">
                Request edit ↗
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
