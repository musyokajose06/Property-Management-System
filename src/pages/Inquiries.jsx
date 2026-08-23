export default function Inquiries({ inquiries, manager, onSubmit }) {
  return (
    <div className="px-[6%] pb-[70px]">
      <div className="flex items-end justify-between mb-[19px]">
        <div>
          <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mb-[10px]">CONVERSATIONS</p>
          <h2 className="text-[1.45rem] tracking-[-0.04em] font-bold m-0">
            {manager ? "Listen, then act." : "Speak with your manager."}
          </h2>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: manager ? "1fr" : "1.5fr 1fr" }}>
        {/* Inquiry list */}
        <section className="bg-white p-[23px]">
          {inquiries.length === 0 && (
            <p className="text-[#74807b] text-[0.75rem]">No inquiries yet.</p>
          )}
          {inquiries.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-[#e5ebe7] pb-5 mb-5 last:border-b-0 last:mb-0 last:pb-0">
              <div>
                <span className={`rounded-full font-mono text-[0.62rem] font-medium px-[9px] py-[5px] capitalize ${
                  item.status === "open" ? "bg-[#fff0de] text-[#af7635]" : "bg-[#e6f1e9] text-[#4b765c]"
                }`}>
                  {item.status}
                </span>
                <h3 className="text-[1rem] font-bold mt-[11px] mb-[6px]">{item.subject}</h3>
                <p className="text-[#74807b] text-[0.75rem] m-0">{item.message}</p>
              </div>
              <small className="text-[#74807b] block text-[0.72rem] mt-[5px] text-right flex-shrink-0 ml-4">
                {item.tenantName}<br />{item.date}
              </small>
            </div>
          ))}
        </section>

        {/* Submit form — tenants only */}
        {!manager && (
          <form onSubmit={onSubmit} className="bg-white p-[23px] flex flex-col gap-[14px] h-fit">
            <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium">NEW MESSAGE</p>
            <h3 className="text-[1.1rem] font-bold m-0 mb-1">Send an inquiry</h3>
            <input
              required
              name="subject"
              placeholder="Subject"
              className="bg-[#fafcfa] border border-[#dfe8e1] text-[#202b27] p-[13px] outline-[#4b765c]"
            />
            <textarea
              required
              name="message"
              placeholder="Tell us what is happening..."
              className="bg-[#fafcfa] border border-[#dfe8e1] text-[#202b27] p-[13px] outline-[#4b765c] min-h-[110px] resize-y"
            />
            <button className="block bg-[#4b765c] text-white text-[0.75rem] font-bold px-[17px] py-[13px] text-center hover:bg-[#3d6050] transition-colors">
              Send inquiry ↗
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
