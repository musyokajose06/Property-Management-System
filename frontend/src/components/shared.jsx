import { money } from "../utils/formatters.js";

const borderColors = [
  "border-t-[#4b765c]",
  "border-t-[#f3c56b]",
  "border-t-[#7395a4]",
  "border-t-[#b8675c]",
];

export function Metric({ label, value, trend, index = 0 }) {
  return (
    <div
      className={`min-h-[145px] border-t-[3px] bg-white p-5 ${borderColors[index % 4]}`}
    >
      <p className="text-[0.72rem] text-[#74807b]">{label}</p>
      <strong className="my-[18px] block text-[1.8rem] font-extrabold leading-none tracking-[-0.06em] text-[#202b27]">
        {value}
      </strong>
      <span className="font-mono text-[0.65rem] text-[#4b765c]">{trend}</span>
    </div>
  );
}

export function PanelTitle({ title, action, onClick }) {
  return (
    <div className="mb-[9px] flex items-center justify-between border-b border-[#e5ebe7] pb-[17px]">
      <h3 className="text-[1rem] font-bold">{title}</h3>
      <button
        onClick={onClick}
        className="bg-transparent text-[0.68rem] text-[#4b765c] hover:underline"
      >
        {action} ↗
      </button>
    </div>
  );
}

export function PaymentRow({ payment, manager, onPayment }) {
  const isPaid = payment.status === "paid";
  return (
    <div className="flex items-center gap-3 border-t border-[#e5ebe7] py-[14px]">
      <span className="flex h-[29px] w-[29px] flex-shrink-0 items-center justify-center rounded-full bg-[#f6e6cf] font-mono text-[0.68rem] font-medium text-[#4b765c]">
        {payment.tenantName?.[0]}
      </span>
      <div className="min-w-0 flex-1">
        <b className="block text-[0.76rem] font-bold">
          {manager ? payment.tenantName : payment.month}
        </b>
        <small className="mt-[5px] block text-[0.72rem] text-[#74807b]">
          {manager ? payment.month : `Due ${payment.dueDate}`}
        </small>
      </div>
      <strong className="ml-auto text-[0.75rem] font-bold">
        {money(payment.amount)}
      </strong>
      <button
        onClick={() => manager && onPayment(payment)}
        className={`rounded-full px-[9px] py-[5px] font-mono text-[0.62rem] font-medium capitalize ${
          isPaid ? "bg-[#e6f1e9] text-[#4b765c]" : "bg-[#fff0de] text-[#af7635]"
        }`}
      >
        {payment.status}
      </button>
    </div>
  );
}
