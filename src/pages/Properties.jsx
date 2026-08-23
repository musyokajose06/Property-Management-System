const PHOTO_COLORS = ["bg-[#496c5b]", "bg-[#8d7161]", "bg-[#4a6880]", "bg-[#6b5c7a]"];

export default function Properties({ properties }) {
  return (
    <div className="px-[6%] pb-[70px]">
      <div className="flex items-end justify-between mb-[19px]">
        <div>
          <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mb-[10px]">YOUR PORTFOLIO</p>
          <h2 className="text-[1.45rem] tracking-[-0.04em] font-bold m-0">Properties at a glance.</h2>
        </div>
        <button className="block bg-[#4b765c] text-white text-[0.75rem] font-bold px-[17px] py-[13px] text-center hover:bg-[#3d6050] transition-colors">
          ＋ Add property
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {properties.map((property, i) => (
          <article className="bg-white" key={property.id}>
            <div className={`flex h-[190px] items-start justify-between p-[18px] text-[3.5rem] font-extrabold tracking-[-0.12em] text-[#d9e9dd] ${PHOTO_COLORS[i % PHOTO_COLORS.length]}`}>
              {property.name.slice(0, 2).toUpperCase()}
              <small className="text-white font-mono text-[0.6rem] tracking-[0.1em] font-normal text-[0.6rem] mt-1">ACTIVE</small>
            </div>
            <div className="flex items-start justify-between px-5 pt-[18px] pb-[7px]">
              <div>
                <h3 className="text-[1.1rem] font-bold m-0">{property.name}</h3>
                <p className="text-[#74807b] text-[0.7rem] m-0 mt-1">{property.address}</p>
              </div>
              <span className="text-[#74807b] text-[0.7rem]">{property.units} units</span>
            </div>
            <div className="px-5 pt-[7px] pb-[18px] text-[0.7rem] text-[#74807b]">
              Occupancy <b className="float-right text-[#4b765c] font-bold">92%</b>
              <div className="bg-[#edf1ee] h-[5px] overflow-hidden w-full mt-2 clear-both">
                <span className="bg-[#4b765c] block h-full" style={{ width: "92%" }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
