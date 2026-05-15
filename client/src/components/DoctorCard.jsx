import { User, Stethoscope, Building2, Calendar, CheckCircle2 } from "lucide-react";

const DoctorCard = ({ doctor, onSelect }) => {
  const name = doctor.userId?.name || "Unknown Doctor";
  const specialization = doctor.specialization || "General Physician";
  const department = doctor.department || "General Medicine";
  const availableDays = doctor.availableDays || [];
  const isActive = doctor.isActive !== false && doctor.userId?.isActive !== false;

  return (
    <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-emerald-900/10 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
          <User size={24} />
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${isActive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"}`}>
          <CheckCircle2 size={12} />
          {isActive ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
            Dr. {name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <Stethoscope size={14} className="text-emerald-500/70" />
            <span>{specialization}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Building2 size={14} className="text-emerald-500/70" />
          <span>{department}</span>
        </div>

        <div className="pt-3 border-t border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Available:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableDays.length > 0 ? (
              availableDays.map((day) => (
                <span key={day} className="px-2 py-0.5 rounded-md bg-[#111827] text-gray-400 text-[10px] font-medium border border-gray-800">
                  {day.substring(0, 3)}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-600 italic">No days set</span>
            )}
          </div>
        </div>

        <button
          onClick={() => onSelect(doctor)}
          disabled={!isActive}
          className="w-full mt-4 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
