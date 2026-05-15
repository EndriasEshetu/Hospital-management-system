import { Clock } from "lucide-react";
import { isSameDay, parse, isAfter } from "date-fns";

const TimeSlotPicker = ({ selectedDate, selectedTime, onSelectTime, availability = [] }) => {
  // Default slots if no specific availability is defined
  const defaultSlots = [
    { id: "09:00", label: "09:00 AM" },
    { id: "10:00", label: "10:00 AM" },
    { id: "11:00", label: "11:00 AM" },
    { id: "12:00", label: "12:00 PM" },
    { id: "14:00", label: "02:00 PM" },
    { id: "15:00", label: "03:00 PM" },
    { id: "16:00", label: "04:00 PM" },
    { id: "17:00", label: "05:00 PM" },
  ];

  // Logic to get slots for the selected day
  const getSlotsForDay = () => {
    if (!selectedDate) return [];
    
    const dayNum = new Date(selectedDate).getDay();
    
    // Rule check: Does this doctor have ANY custom availability defined?
    const hasAnyCustomAvailability = availability.length > 0;
    
    if (hasAnyCustomAvailability) {
      // ONLY use custom slots for this specific day
      const daySlots = availability.filter(a => a.dayOfWeek === dayNum && a.isAvailable);
      
      const generatedSlots = [];
      daySlots.forEach(slot => {
        const startHour = parseInt(slot.startTime.split(":")[0]);
        const endHour = parseInt(slot.endTime.split(":")[0]);
        
        for (let h = startHour; h < endHour; h++) {
          const timeStr = `${h.toString().padStart(2, "0")}:00`;
          const label = h < 12 ? `${h}:00 AM` : h === 12 ? `12:00 PM` : `${h - 12}:00 PM`;
          generatedSlots.push({ id: timeStr, label });
        }
      });
      return generatedSlots.sort((a, b) => a.id.localeCompare(b.id));
    } else {
      // Fallback to defaults
      return defaultSlots;
    }
  };

  const slots = getSlotsForDay();

  const now = new Date();
  const isToday = selectedDate && isSameDay(new Date(selectedDate), now);

  return (
    <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={20} className="text-emerald-500" />
        <h3 className="text-lg font-bold text-white">Select Time Slot</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.id;
          
          // Disable if it's today and the time has passed
          let isPast = false;
          if (isToday) {
            const slotTime = parse(slot.id, "HH:mm", new Date(selectedDate));
            isPast = !isAfter(slotTime, now);
          }

          return (
            <button
              key={slot.id}
              disabled={isPast}
              onClick={() => onSelectTime(slot.id)}
              className={`py-3 px-2 rounded-xl border text-sm font-semibold transition-all ${
                isSelected
                  ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/40"
                  : isPast
                  ? "bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed opacity-40"
                  : "bg-[#111827] border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
              }`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;

