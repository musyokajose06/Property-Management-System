export default function Login({ onManager, onAdmin, onTenant, tenants }) {
  return (
    <main className="grid h-screen grid-cols-2 overflow-hidden bg-[#e9f1eb]">
      {/* Left panel */}
      <div className="flex max-h-screen flex-col justify-center overflow-y-auto px-[8%] py-[5%]">
        <div className="mb-2 flex items-center gap-[10px] text-[1.05rem] tracking-[-0.05em]">
          <b className="flex h-[33px] w-[33px] flex-shrink-0 items-center justify-center bg-[#4b765c] text-[1.2rem] font-bold text-white">
            R
          </b>
          <strong className="font-extrabold">
            R3NT<span className="text-[#4b765c]">LEDGER</span>
          </strong>
        </div>
        <p className="mb-[18px] mt-[18px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
          PROPERTY OPERATIONS, REFINED
        </p>
        <h1 className="max-w-[500px] text-[clamp(3rem,5vw,5.5rem)] font-extrabold leading-[1.05] tracking-[-0.06em] text-[#202b27]">
          Everything under one roof.
        </h1>
        <p className="mb-[32px] mt-[26px] max-w-[390px] text-[0.9rem] leading-[1.7] text-[#74807b]">
          A calm, clear workspace for the people who manage homes and the people
          who live in them.
        </p>
        <button
          onClick={onManager}
          className="mt-[10px] block w-full bg-[#4b765c] px-[17px] py-[13px] text-center text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]"
        >
          Enter manager workspace →
        </button>
        <button
          onClick={onAdmin}
          className="mt-[10px] block w-full border border-[#cad5ce] bg-transparent px-[17px] py-[13px] text-center text-[0.75rem] font-bold text-[#202b27] transition-colors hover:bg-[#dce8de]"
        >
          Preview admin access
        </button>
        <select
          defaultValue=""
          onChange={(e) => e.target.value && onTenant(e.target.value)}
          className="mt-[10px] w-full border border-[#dfe8e1] bg-[#fafcfa] p-[13px] text-[#202b27] outline-[#4b765c]"
        >
          <option value="">Enter as a tenant...</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name} · unit {tenant.unit}
            </option>
          ))}
        </select>
        <small className="mt-[25px] block text-[0.72rem] text-[#74807b]">
          Demo environment · data is stored locally in your browser
        </small>
      </div>

      {/* Right art panel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#365849] to-[#91ad96] p-[10%] after:absolute after:left-[23%] after:top-[18%] after:h-[65%] after:w-[51%] after:-skew-x-[14deg] after:border after:border-white/35 after:content-['']">
        <div className="absolute bottom-[12%] z-10 text-white">
          <span className="font-mono text-[0.75rem]">01</span>
          <strong className="mt-[15px] block text-[2.5rem] font-extrabold leading-[1] tracking-[-0.07em]">
            A better rhythm
            <br />
            for every resident.
          </strong>
        </div>
      </div>
    </main>
  );
}
