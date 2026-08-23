import { money } from "../utils/formatters.js";

const METRIC_BORDERS = ["border-[#4b765c]", "border-[#f3c56b]", "border-[#7395a4]", "border-[#b8675c]"];

export function Metric({ label, value, trend, index = 0 }) {
  return (
    <div className={`bg-white border-t-[3px] min-h-[145px] p-5 ${METRIC_BORDERS[index % 4]}`}>
      <p className="text-[#74807b] text-[0.72rem] m-0">{label}</p>
      <strong className="block text-[1.8rem] tracking-[-0.06em] my-[18px_0_8px] font-extrabold text-[#202b27]">{value}</strong>
      <span className="text-[#4b765c] font-mono text-[0.65rem]">{trend}</span>
    </div>
  );
}

export function PanelTitle({ title, action, onClick }) {
  return (
    <div className="flex items-center justify-between border-b border-[#e5ebe7] mb-[9px] pb-[17px]">
      <h3 className="text-[1rem] font-bold m-0">{title}</h3>
      <button onClick={onClick} className="bg-transparent text-[#4b765c] text-[0.68rem] hover:underline">
        {action} ↗
      </button>
    </div>
  );
}

export function PaymentRow({ payment, manager, onPayment }) {
  const isPaid = payment.status === "paid";
  return (
    <div className="flex items-center gap-3 border-t border-[#e5ebe7] py-[14px]">
      <span className="w-[29px] h-[29px] rounded-full bg-[#f6e6cf] text-[#4b765c] flex items-center justify-center flex-shrink-0 font-mono text-[0.68rem] font-medium">
        {payment.tenantName?.[0]}
      </span>
      <div className="flex-1 min-w-0">
        <b className="text-[0.76rem] font-bold block">{manager ? payment.tenantName : payment.month}</b>
        <small className="text-[#74807b] block text-[0.72rem] mt-[5px]">
          {manager ? payment.month : `Due ${payment.dueDate}`}
        </small>
      </div>
      <strong className="text-[0.75rem] ml-auto font-bold">{money(payment.amount)}</strong>
      <button
        onClick={() => manager && onPayment(payment)}
        className={`rounded-full font-mono text-[0.62rem] font-medium px-[9px] py-[5px] capitalize ${
          isPaid ? "bg-[#e6f1e9] text-[#4b765c]" : "bg-[#fff0de] text-[#af7635]"
        }`}
      >
        {payment.status}
      </button>
    </div>
  );
}
