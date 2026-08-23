import { money } from "../utils/formatters.js";

export default function Payments({ payments, manager, onPayment }) {
  return (
    <div className="px-[6%] pb-[70px]">
      <div className="flex items-end justify-between mb-[19px]">
        <div>
          <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mb-[10px]">FINANCIALS</p>
          <h2 className="text-[1.45rem] tracking-[-0.04em] font-bold m-0">
            {manager ? "A clear view of every balance." : "Your payment trail."}
          </h2>
        </div>
        <button className="block bg-transparent border border-[#cad5ce] text-[#202b27] text-[0.75rem] font-bold px-[17px] py-[13px] text-center hover:bg-[#f0f5f1] transition-colors">
          Export report ↓
        </button>
      </div>

      <section className="bg-white p-[23px] overflow-x-auto">
        <div className="grid gap-[18px] text-[#a0aaa4] font-mono text-[0.62rem] tracking-[0.08em] uppercase pb-3 border-b border-[#e5ebe7] min-w-[650px]" style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1fr" }}>
          <span>Resident</span>
          <span>Period</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {payments.map((payment) => {
          const isPaid = payment.status === "paid";
          return (
            <div
              key={payment.id}
              className="grid gap-[18px] items-center border-t border-[#e5ebe7] py-[14px] min-w-[650px]"
              style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1fr" }}
            >
              <div className="flex items-center gap-[10px]">
                <span className="w-[29px] h-[29px] rounded-full bg-[#f6e6cf] text-[#4b765c] flex items-center justify-center flex-shrink-0 font-mono text-[0.68rem] font-medium">
                  {payment.tenantName?.[0]}
                </span>
                <span className="min-w-0">
                  <b className="text-[0.76rem] font-bold block">{manager ? payment.tenantName : "Rent payment"}</b>
                  <small className="text-[#74807b] block text-[0.72rem] mt-[5px]">Due {payment.dueDate}</small>
                </span>
              </div>
              <span className="text-sm text-[#202b27]">{payment.month}</span>
              <strong className="text-[0.75rem] font-bold">{money(payment.amount)}</strong>
              <button
                onClick={() => manager && onPayment(payment)}
                className={`rounded-full font-mono text-[0.62rem] font-medium px-[9px] py-[5px] capitalize w-fit ${
                  isPaid ? "bg-[#e6f1e9] text-[#4b765c]" : "bg-[#fff0de] text-[#af7635]"
                } ${manager ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
              >
                {payment.status}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
