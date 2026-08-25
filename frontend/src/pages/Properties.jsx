const photoBg = [
  "bg-[#496c5b]",
  "bg-[#8d7161]",
  "bg-[#4a6880]",
  "bg-[#6b5c7a]",
];

export default function Properties({ properties }) {
  return (
    <div style={{ padding: "0 6% 70px" }}>
      <div className="mb-[19px] flex items-end justify-between">
        <div>
          <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            YOUR PORTFOLIO
          </p>
          <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">
            Properties at a glance.
          </h2>
        </div>
        <button className="block bg-[#4b765c] px-[17px] py-[13px] text-center text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]">
          ＋ Add property
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {properties.map((property, i) => (
          <article className="bg-white" key={property.id}>
            <div
              className={`flex h-[190px] items-start justify-between p-[18px] text-[3.5rem] font-extrabold tracking-[-0.12em] text-[#d9e9dd] ${photoBg[i % photoBg.length]}`}
            >
              {property.name.slice(0, 2).toUpperCase()}
              <small className="mt-1 block font-mono text-[0.6rem] font-normal tracking-[0.1em] text-white">
                ACTIVE
              </small>
            </div>
            <div className="flex items-start justify-between px-5 pb-[7px] pt-[18px]">
              <div>
                <h3 className="text-[1.1rem] font-bold">{property.name}</h3>
                <p className="mt-1 text-[0.7rem] text-[#74807b]">
                  {property.address}
                </p>
              </div>
              <span className="text-[0.7rem] text-[#74807b]">
                {property.units} units
              </span>
            </div>
            <div className="px-5 pb-[18px] pt-[7px] text-[0.7rem] text-[#74807b]">
              Occupancy
              <b className="float-right font-bold text-[#4b765c]">92%</b>
              <div className="mt-2 h-[5px] w-full overflow-hidden bg-[#edf1ee] clear-both">
                <span
                  className="block h-full bg-[#4b765c]"
                  style={{ width: "92%" }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
