export default function Login({ onManager, onAdmin, onTenant, tenants }) {
  return (
    <main className="grid grid-cols-2 h-screen overflow-hidden bg-[#e9f1eb]">
      {/* Left panel */}
      <div className="flex flex-col justify-center px-[8%] py-[5%] max-w-[500px] overflow-y-auto max-h-screen">
        <div className="flex items-center gap-[10px] text-[1.05rem] tracking-[-0.05em]">
          <b className="w-[33px] h-[33px] bg-[#4b765c] text-white flex items-center justify-center text-[1.2rem] font-bold">R</b>
          <strong className="font-extrabold">R3NT<span className="text-[#4b765c]">LEDGER</span></strong>
        </div>
        <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mt-[18px] mb-[18px]">
          PROPERTY OPERATIONS, REFINED
        </p>
        <h1 className="text-[clamp(3rem,5vw,5.5rem)] tracking-[-0.06em] leading-[1.05] font-extrabold text-[#202b27] m-0 max-w-[500px]">
          Everything under one roof.
        </h1>
        <p className="text-[#74807b] text-[0.9rem] leading-[1.7] mt-[26px] mb-[32px] max-w-[390px]">
          A calm, clear workspace for the people who manage homes and the people who live in them.
        </p>
        <button
          onClick={onManager}
          className="block bg-[#4b765c] text-white text-[0.75rem] font-bold px-[17px] py-[13px] text-center mt-[10px] w-full hover:bg-[#3d6050] transition-colors"
        >
          Enter manager workspace →
        </button>
        <button
          onClick={onAdmin}
          className="block bg-transparent border border-[#cad5ce] text-[#202b27] text-[0.75rem] font-bold px-[17px] py-[13px] text-center mt-[10px] w-full hover:bg-[#e9f1eb] transition-colors"
        >
          Preview admin access
        </button>
        <select
          defaultValue=""
          onChange={(e) => e.target.value && onTenant(e.target.value)}
          className="bg-[#fafcfa] border border-[#dfe8e1] text-[#202b27] p-[13px] outline-[#4b765c] mt-[10px] w-full"
        >
          <option value="">Enter as a tenant...</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name} · unit {tenant.unit}
            </option>
          ))}
        </select>
        <small className="text-[#74807b] block text-[0.72rem] mt-[25px]">
          Demo environment · data is stored locally in your browser
        </small>
      </div>

      {/* Right art panel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#365849] to-[#91ad96] p-[10%] after:content-[''] after:absolute after:border after:border-white/35 after:h-[65%] after:left-[23%] after:top-[18%] after:skew-x-[-14deg] after:w-[51%]">
        <div className="absolute bottom-[12%] text-white z-10">
          <span className="font-mono text-[0.75rem]">01</span>
          <strong className="block text-[2.5rem] tracking-[-0.07em] leading-[1] mt-[15px] font-extrabold">
            A better rhythm<br />for every resident.
          </strong>
        </div>
      </div>
    </main>
  );
}
