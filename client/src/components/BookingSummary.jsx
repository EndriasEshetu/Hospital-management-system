import { format } from "date-fns";
import { CheckCircle2, User, Calendar, Clock, Building2, FileText, Loader2 } from "lucide-react";

const BookingSummary = ({ doctor, date, time, notes, setNotes, onConfirm, isBooking }) => {
  const formattedDate = date ? format(new Date(date), "PPP") : "";
  const formattedTime = time ? (time.split(":")[0] > 12 ? `${time.split(":")[0] - 12}:${time.split(":")[1]} PM` : `${time} AM`) : "";

  return (
    <div className="bg-[#1f2937] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-emerald-600 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <CheckCircle2 size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Confirm Appointment</h3>
          <p className="text-emerald-100 text-xs">Please review your booking details</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#111827] text-emerald-500/70 shrink-0 mt-1">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Doctor</p>
                <p className="text-white font-semibold">Dr. {doctor.userId?.name}</p>
                <p className="text-xs text-gray-400">{doctor.specialization}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#111827] text-emerald-500/70 shrink-0 mt-1">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Department</p>
                <p className="text-white font-semibold">{doctor.department}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#111827] text-emerald-500/70 shrink-0 mt-1">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Date</p>
                <p className="text-white font-semibold">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#111827] text-emerald-500/70 shrink-0 mt-1">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Time</p>
                <p className="text-white font-semibold">{time}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider">
            <FileText size={14} className="text-emerald-500/70" />
            Reason for Visit / Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us briefly why you're booking this appointment..."
            className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500 min-h-[100px] resize-none"
          />
        </div>

        <button
          onClick={onConfirm}
          disabled={isBooking}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
        >
          {isBooking ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm & Book Appointment"
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
