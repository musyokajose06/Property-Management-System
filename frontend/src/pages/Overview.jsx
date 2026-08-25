import { Metric, PanelTitle, PaymentRow } from "../components/shared.jsx";
import { money } from "../utils/formatters.js";

export default function Overview({
  manager,
  payments,
  inquiries,
  plans,
  onNavigate,
  onPayment,
}) {
  const paid = payments.filter((item) => item.status === "paid").length;
  const outstanding = payments
    .filter((item) => item.status !== "paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const paidPct = Math.round((paid / Math.max(payments.length, 1)) * 100);

  return (
    <div className="pb-[70px]" style={{ padding: "0 6% 70px" }}>
      {/* Welcome band */}
      <div className="mb-[23px] flex items-center justify-between bg-[#dcebe0] px-[22px] py-[19px]">
        <div>
          <span className="mr-[7px] text-[0.75rem] text-[#4b765c]">●</span>
          Portfolio snapshot
          <p className="mt-[6px] text-[0.71rem] text-[#708178]">
            Tuesday, 20 August 2026
          </p>
        </div>
        <span className="text-[0.72rem] text-[#4b765c]">
          {manager
            ? "All properties reporting normally"
            : "Your home, at a glance"}{" "}
          ↗
        </span>
      </div>

      {/* Metrics */}
      <div className="mb-[54px] grid grid-cols-4 gap-3">
        <Metric
          index={0}
          label={manager ? "Total collected" : "Paid this cycle"}
          value={money(
            payments
              .filter((i) => i.status === "paid")
              .reduce((s, i) => s + i.amount, 0),
          )}
          trend="+8.4%"
        />
        <Metric
          index={1}
          label={manager ? "Outstanding" : "Next payment"}
          value={manager ? money(outstanding) : money(plans[0]?.amount || 0)}
          trend={manager ? "2 due soon" : "Due 01 Mar"}
        />
        <Metric
          index={2}
          label={manager ? "Occupancy" : "Lease status"}
          value={manager ? "92%" : "Active"}
          trend={manager ? "18 / 20 units" : "Until Dec 2025"}
        />
        <Metric
          index={3}
          label={manager ? "Open inquiries" : "My inquiries"}
          value={inquiries.filter((i) => i.status === "open").length}
          trend="Needs attention"
        />
      </div>

      {/* Section heading */}
      <div className="mb-[19px] flex items-end justify-between">
        <div>
          <p className="mb-[10px] font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            RECENT ACTIVITY
          </p>
          <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">
            {manager ? "Keep the building moving." : "Your account, in focus."}
          </h2>
        </div>
        <button
          onClick={() => onNavigate("payments")}
          className="bg-transparent py-[6px] text-[0.72rem] font-bold text-[#4b765c] hover:underline"
        >
          View payments ↗
        </button>
      </div>

      {/* Dashboard grid */}
      <div
        className="grid gap-[14px]"
        style={{ gridTemplateColumns: "1.3fr 1fr" }}
      >
        {/* Payment panel */}
        <section className="bg-white p-[23px]">
          <PanelTitle
            title={manager ? "Payment pulse" : "Payment history"}
            action="See all"
            onClick={() => onNavigate("payments")}
          />
          <div className="flex items-center gap-[18px] py-[18px]">
            <strong className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-[8px] border-[#deede2] border-r-[#4b765c] text-[1.1rem] font-bold">
              {paidPct}%
            </strong>
            <div className="flex-1">
              <b className="text-[0.76rem] font-bold">
                {paid} of {payments.length} payments received
              </b>
              <p className="mb-3 mt-1 text-[0.69rem] text-[#74807b]">
                Keep collections on track with timely updates.
              </p>
              <div className="h-[5px] w-full overflow-hidden bg-[#edf1ee]">
                <span
                  className="block h-full bg-[#4b765c]"
                  style={{ width: `${paidPct}%` }}
                />
              </div>
            </div>
          </div>
          {payments.slice(0, 3).map((payment) => (
            <PaymentRow
              key={payment.id}
              payment={payment}
              manager={manager}
              onPayment={onPayment}
            />
          ))}
        </section>

        {/* Accent panel */}
        <section className="bg-white p-[23px]">
          <p className="mb-3 font-mono text-[0.63rem] font-medium uppercase tracking-[0.15em] text-[#92a09a]">
            NEXT UP
          </p>
          <h3 className="mb-3 text-[1rem] font-bold">
            {manager
              ? "Keep residents informed."
              : "Rent, without the guesswork."}
          </h3>
          <p className="mb-5 text-[0.75rem] text-[#74807b]">
            {manager
              ? "Send a broadcast to everyone in the portfolio when something changes."
              : "Your next payment is lined up and your lease is in good standing."}
          </p>
          <button
            onClick={() => onNavigate(manager ? "inquiries" : "payments")}
            className="block w-full bg-[#4b765c] px-[17px] py-[13px] text-center text-[0.75rem] font-bold text-white transition-colors hover:bg-[#3d6050]"
          >
            {manager ? "View inquiries ↗" : "View payment plan ↗"}
          </button>
        </section>
      </div>
    </div>
  );
}
