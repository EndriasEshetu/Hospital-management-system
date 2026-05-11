import { useState, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useDoctors } from "../hooks/usePatient";
import BookingModal from "../components/BookingModal";

// Setup the localizer for react-big-calendar
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const dayMap = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6
};

const BookingCalendar = () => {
  const { data: doctors = [], isLoading, isError } = useDoctors();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentView("day");
      } else {
        setCurrentView("week");
      }
    };
    handleResize(); // Set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate calendar events from the recurring weekly availability slots
  const events = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];

    const generatedEvents = [];
    const windowStart = new Date(currentDate);
    windowStart.setDate(windowStart.getDate() - 30);
    windowStart.setHours(0, 0, 0, 0);

    for (let i = 0; i < 90; i++) {
      const date = new Date(windowStart);
      date.setDate(windowStart.getDate() + i);
      const dayOfWeek = date.getDay();

      doctors.forEach((doctor) => {
        if (!doctor.availableDays || doctor.availableDays.length === 0) return;
        
        // check if this doctor is available on this day
        const isAvailable = doctor.availableDays.some(d => dayMap[d] === dayOfWeek);
        if (isAvailable) {
          // generate slots 
          [9, 11, 14, 16].forEach(hour => {
            const startDate = new Date(date);
            startDate.setHours(hour, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(hour + 1, 0, 0, 0);

            if (startDate > new Date()) {
              generatedEvents.push({
                title: "Dr. " + (doctor.userId?.name || "Unknown"),
                start: startDate,
                end: endDate,
                resource: {
                  doctorId: doctor.userId?._id,
                  doctorName: doctor.userId?.name,
                  startTime: `${hour.toString().padStart(2, '0')}:00`,
                  endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
                  dayOfWeek
                },
              });
            }
          });
        }
      });
    }

    return generatedEvents;
  }, [doctors, currentDate]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleView = (newView) => {
    setCurrentView(newView);
  };

  const handleSelectEvent = (event) => {
    if (event.start < new Date()) {
      alert("This time slot is in the past. Please select a future time slot.");
      return;
    }

    const dateStr = format(event.start, "yyyy-MM-dd");
    setSelectedSlot(event.resource);
    setSelectedDate(dateStr);
  };

  const eventStyleGetter = (event) => {
    const isPast = event.start < new Date();
    return {
      style: {
        backgroundColor: isPast ? "#4B5563" : "#10B981",
        borderColor: isPast ? "#374151" : "#059669",
        color: "white",
        borderRadius: "8px",
        fontSize: "0.85rem",
      },
    };
  };

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Book an Appointment
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Browse available time slots and click to book.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400 bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl">
          Loading available slots...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-400 bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl">
          Failed to load availability.
        </div>
      ) : (
        <div className="flex-1 bg-[#1f2937] p-2 md:p-4 rounded-2xl shadow-2xl border border-gray-800 text-gray-200 
          [&_.rbc-calendar]:text-gray-200 
          [&_.rbc-btn-group>button]:text-white 
          [&_.rbc-btn-group>button]:border-gray-700 
          [&_.rbc-btn-group>button:hover]:bg-gray-700 
          [&_.rbc-btn-group>.rbc-active]:bg-[#10b981] 
          [&_.rbc-btn-group>.rbc-active]:text-white 
          [&_.rbc-toolbar-label]:font-bold 
          [&_.rbc-toolbar-label]:text-white 
          [&_.rbc-toolbar]:flex-col md:[&_.rbc-toolbar]:flex-row [&_.rbc-toolbar]:gap-4
          [&_.rbc-header]:border-gray-700 [&_.rbc-header]:py-3 
          [&_.rbc-month-view]:border-gray-700 [&_.rbc-month-row]:border-gray-700 
          [&_.rbc-day-bg]:border-gray-700 [&_.rbc-off-range-bg]:bg-[#111827] 
          [&_.rbc-today]:bg-emerald-500/10 
          [&_.rbc-time-view]:border-gray-700 [&_.rbc-timeslot-group]:border-gray-700 
          [&_.rbc-time-content]:border-gray-700 [&_.rbc-time-header-content]:border-gray-700 
          [&_.rbc-day-slot_.rbc-time-slot]:border-gray-700/50">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            date={currentDate}
            onNavigate={handleNavigate}
            view={currentView}
            onView={handleView}
            views={["month", "week", "day"]}
            step={30}
            timeslots={2}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 21, 0, 0)}
          />
        </div>
      )}

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          selectedDate={selectedDate}
          onClose={() => {
            setSelectedSlot(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingCalendar;
