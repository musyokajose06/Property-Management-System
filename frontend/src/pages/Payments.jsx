import { money } from "../utils/formatters.js";

export default function Payments({ payments, manager, onPayment }) {
  return (
    <div style={{ padding: "0 6% 70px" }}>
      <div className="mb-[19px] flex items-end justify-between">
        <div>
          <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            FINANCIALS
          </p>
          <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">
            {manager ? "A clear view of every balance." : "Your payment trail."}
          </h2>
        </div>
        <button className="block border border-[#cad5ce] bg-transparent px-[17px] py-[13px] text-center text-[0.75rem] font-bold text-[#202b27] transition-colors hover:bg-[#f0f5f1]">
          Export report ↓
        </button>
      </div>

      <section className="overflow-x-auto bg-white p-[23px]">
        <div
          className="grid min-w-[650px] gap-[18px] border-b border-[#e5ebe7] pb-3 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-[#a0aaa4]"
          style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1fr" }}
        >
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
              className="grid min-w-[650px] items-center gap-[18px] border-t border-[#e5ebe7] py-[14px]"
              style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1fr" }}
            >
              <div className="flex items-center gap-[10px]">
                <span className="flex h-[29px] w-[29px] flex-shrink-0 items-center justify-center rounded-full bg-[#f6e6cf] font-mono text-[0.68rem] font-medium text-[#4b765c]">
                  {payment.tenantName?.[0]}
                </span>
                <span className="min-w-0">
                  <b className="block text-[0.76rem] font-bold">
                    {manager ? payment.tenantName : "Rent payment"}
                  </b>
                  <small className="mt-[5px] block text-[0.72rem] text-[#74807b]">
                    Due {payment.dueDate}
                  </small>
                </span>
              </div>
              <span className="text-sm text-[#202b27]">{payment.month}</span>
              <strong className="text-[0.75rem] font-bold">
                {money(payment.amount)}
              </strong>
              <button
                onClick={() => manager && onPayment(payment)}
                className={`w-fit rounded-full px-[9px] py-[5px] font-mono text-[0.62rem] font-medium capitalize transition-opacity ${
                  isPaid
                    ? "bg-[#e6f1e9] text-[#4b765c]"
                    : "bg-[#fff0de] text-[#af7635]"
                } ${manager ? "cursor-pointer hover:opacity-75" : "cursor-default"}`}
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
