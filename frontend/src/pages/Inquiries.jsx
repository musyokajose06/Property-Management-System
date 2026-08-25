export default function Inquiries({ inquiries, manager, onSubmit }) {
  return (
    <div style={{ padding: "0 6% 70px" }}>
      <div className="mb-[19px] flex items-end justify-between">
        <div>
          <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            CONVERSATIONS
          </p>
          <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">
            {manager ? "Listen, then act." : "Speak with your manager."}
          </h2>
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: manager ? "1fr" : "1.5fr 1fr" }}
      >
        {/* Inquiry list */}
        <section className="bg-white p-[23px]">
          {inquiries.length === 0 && (
            <p className="text-[0.75rem] text-[#74807b]">No inquiries yet.</p>
          )}
          {inquiries.map((item) => (
            <div
              key={item.id}
              className="mb-5 flex justify-between border-b border-[#e5ebe7] pb-5 last:mb-0 last:border-b-0 last:pb-0"
            >
              <div>
                <span
                  className={`rounded-full px-[9px] py-[5px] font-mono text-[0.62rem] font-medium capitalize ${
                    item.status === "open"
                      ? "bg-[#fff0de] text-[#af7635]"
                      : "bg-[#e6f1e9] text-[#4b765c]"
                  }`}
                >
                  {item.status}
                </span>
                <h3 className="mb-[6px] mt-[11px] text-[1rem] font-bold">
                  {item.subject}
                </h3>
                <p className="text-[0.75rem] text-[#74807b]">{item.message}</p>
              </div>
              <small className="ml-4 flex-shrink-0 text-right text-[0.72rem] text-[#74807b]">
                {item.tenantName}
                <br />
                {item.date}
              </small>
            </div>
          ))}
        </section>

        {/* Submit form — tenants only */}
        {!manager && (
          <form
            onSubmit={onSubmit}
            className="flex h-fit flex-col gap-[14px] bg-white p-[23px]"
          >
            <p className="font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
              NEW MESSAGE
            </p>
            <h3 className="mb-1 text-[1.1rem] font-bold">Send an inquiry</h3>
            <input
              required
              name="subject"
              placeholder="Subject"
              className="border border-[#dfe8e1] bg-[#fafcfa] p-[13px] text-[#202b27] outline-[#4b765c]"
            />
            <textarea
              required
              name="message"
              placeholder="Tell us what is happening..."
              className="min-h-[110px] resize-y border border-[#dfe8e1] bg-[#fafcfa] p-[13px] text-[#202b27] outline-[#4b765c]"
            />
            <button className="block bg-[#4b765c] px-[17px] py-[13px] text-center text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]">
              Send inquiry ↗
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
