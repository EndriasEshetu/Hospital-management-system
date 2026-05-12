const statusStyles = {
  Pending:   "bg-amber-900/30 text-amber-400 border border-amber-900/50",
  Confirmed: "bg-sky-900/30 text-sky-400 border border-sky-900/50",
  Completed: "bg-emerald-900/30 text-emerald-400 border border-emerald-900/50",
  Cancelled: "bg-red-900/30 text-red-400 border border-red-900/50",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
        statusStyles[status] ?? "bg-gray-800 text-gray-400 border border-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
