import { Metric, PanelTitle, PaymentRow } from "../components/shared.jsx";
import { money } from "../utils/formatters.js";

export default function Overview({ manager, payments, inquiries, plans, onNavigate, onPayment }) {
  const paid = payments.filter((item) => item.status === "paid").length;
  const outstanding = payments
    .filter((item) => item.status !== "paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const paidPct = Math.round((paid / Math.max(payments.length, 1)) * 100);

  return (
    <div className="px-[6%] pb-[70px]">
      {/* Welcome band */}
      <div className="flex items-center justify-between bg-[#dcebe0] px-[22px] py-[19px] mb-[23px]">
        <div>
          <span className="text-[#4b765c] text-[0.75rem] mr-[7px]">●</span>
          Portfolio snapshot
          <p className="text-[#708178] text-[0.71rem] mt-[6px] m-0">Tuesday, 20 August 2026</p>
        </div>
        <span className="text-[0.72rem] text-[#4b765c]">
          {manager ? "All properties reporting normally" : "Your home, at a glance"} ↗
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-[54px]">
        <Metric index={0} label={manager ? "Total collected" : "Paid this cycle"} value={money(payments.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0))} trend="+8.4%" />
        <Metric index={1} label={manager ? "Outstanding" : "Next payment"} value={manager ? money(outstanding) : money(plans[0]?.amount || 0)} trend={manager ? "2 due soon" : "Due 01 Mar"} />
        <Metric index={2} label={manager ? "Occupancy" : "Lease status"} value={manager ? "92%" : "Active"} trend={manager ? "18 / 20 units" : "Until Dec 2025"} />
        <Metric index={3} label={manager ? "Open inquiries" : "My inquiries"} value={inquiries.filter((i) => i.status === "open").length} trend="Needs attention" />
      </div>

      {/* Section heading */}
      <div className="flex items-end justify-between mb-[19px]">
        <div>
          <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mb-[10px]">RECENT ACTIVITY</p>
          <h2 className="text-[1.45rem] tracking-[-0.04em] font-bold m-0">
            {manager ? "Keep the building moving." : "Your account, in focus."}
          </h2>
        </div>
        <button onClick={() => onNavigate("payments")} className="bg-transparent text-[#4b765c] text-[0.72rem] font-bold py-[6px] hover:underline">
          View payments ↗
        </button>
      </div>

      {/* Dashboard grid */}
      <div className="grid gap-[14px]" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        {/* Payment panel */}
        <section className="bg-white p-[23px]">
          <PanelTitle title={manager ? "Payment pulse" : "Payment history"} action="See all" onClick={() => onNavigate("payments")} />
          <div className="flex items-center gap-[18px] py-[18px]">
            <strong className="w-20 h-20 rounded-full border-[8px] border-[#deede2] border-r-[#4b765c] flex items-center justify-center text-[1.1rem] font-bold flex-shrink-0">
              {paidPct}%
            </strong>
            <div className="flex-1">
              <b className="text-[0.76rem] font-bold">{paid} of {payments.length} payments received</b>
              <p className="text-[#74807b] text-[0.69rem] my-[5px_0_12px] m-0 mt-1 mb-3">Keep collections on track with timely updates.</p>
              <div className="bg-[#edf1ee] h-[5px] overflow-hidden w-full">
                <span className="bg-[#4b765c] block h-full" style={{ width: `${paidPct}%` }} />
              </div>
            </div>
          </div>
          {payments.slice(0, 3).map((payment) => (
            <PaymentRow key={payment.id} payment={payment} manager={manager} onPayment={onPayment} />
          ))}
        </section>

        {/* Accent panel */}
        <section className="bg-white p-[23px]">
          <p className="text-[#92a09a] font-mono text-[0.63rem] tracking-[0.15em] uppercase font-medium mb-3">NEXT UP</p>
          <h3 className="text-[1rem] font-bold m-0 mb-3">
            {manager ? "Keep residents informed." : "Rent, without the guesswork."}
          </h3>
          <p className="text-[#74807b] text-[0.75rem] mb-5 m-0">
            {manager
              ? "Send a broadcast to everyone in the portfolio when something changes."
              : "Your next payment is lined up and your lease is in good standing."}
          </p>
          <button
            onClick={() => onNavigate(manager ? "inquiries" : "payments")}
            className="block bg-[#4b765c] text-white text-[0.75rem] font-bold px-[17px] py-[13px] text-center w-full hover:bg-[#3d6050] transition-colors"
          >
            {manager ? "View inquiries ↗" : "View payment plan ↗"}
          </button>
        </section>
      </div>
    </div>
  );
}
