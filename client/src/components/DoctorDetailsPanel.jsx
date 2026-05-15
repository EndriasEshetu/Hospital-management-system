import { ArrowLeft, User, Stethoscope, Building2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";

const DoctorDetailsPanel = ({ doctor, onBack, selectedDate, onSelectDate }) => {
  const name = doctor.userId?.name || "Unknown Doctor";
  const specialization = doctor.specialization || "General Physician";
  const department = doctor.department || "General Medicine";
  const availableDays = doctor.availableDays || [];

  // Logic to find available dates for the next 14 days
  const getNextAvailableDates = () => {
    const dates = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dayName = format(date, "EEEE");
      
      if (availableDays.includes(dayName)) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = getNextAvailableDates();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to doctors
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Doctor Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <User size={48} />
              </div>
              <h2 className="text-xl font-bold text-white">Dr. {name}</h2>
              <p className="text-emerald-400 font-medium">{specialization}</p>
              <p className="text-sm text-gray-400 mt-1">{department}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="p-2 rounded-lg bg-[#111827] text-emerald-500/70">
                  <CalendarIcon size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Service Days</p>
                  <p className="mt-0.5">{availableDays.join(", ") || "No fixed days"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="p-2 rounded-lg bg-[#111827] text-emerald-500/70">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Next Available</p>
                  <p className="mt-0.5">{availableDates.length > 0 ? format(availableDates[0], "PPP") : "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Date Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarIcon size={20} className="text-emerald-500" />
                Select Appointment Date
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableDates.map((date) => {
                const isSelected = selectedDate && isSameDay(date, new Date(selectedDate));
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => onSelectDate(format(date, "yyyy-MM-dd"))}
                    className={`p-4 rounded-xl border flex flex-col items-center transition-all ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/40 scale-[1.02]"
                        : "bg-[#111827] border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${isSelected ? "text-emerald-100" : "text-gray-500"}`}>
                      {format(date, "EEE")}
                    </span>
                    <span className="text-lg font-bold my-0.5">
                      {format(date, "dd")}
                    </span>
                    <span className={`text-xs ${isSelected ? "text-emerald-100" : "text-gray-400"}`}>
                      {format(date, "MMM")}
                    </span>
                  </button>
                );
              })}
              {availableDates.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 bg-[#111827] rounded-xl border border-dashed border-gray-800">
                  No available dates found for this doctor in the coming weeks.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPanel;
