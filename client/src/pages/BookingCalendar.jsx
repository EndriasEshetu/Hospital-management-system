import { useState, useMemo } from "react";
import { Search, Filter, Calendar as CalendarIcon, User, ChevronRight, LayoutGrid, List } from "lucide-react";
import { useDoctors, useBookAppointment } from "../hooks/usePatient";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import DoctorDetailsPanel from "../components/DoctorDetailsPanel";
import TimeSlotPicker from "../components/TimeSlotPicker";
import BookingSummary from "../components/BookingSummary";

const BookingCalendar = () => {
  const navigate = useNavigate();
  const { data: doctors = [], isLoading, isError } = useDoctors();
  const bookMutation = useBookAppointment();

  // Booking Flow State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState("");

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterSpec, setFilterSpec] = useState("All Specializations");

  // Get unique departments and specializations for filters
  const departments = useMemo(() => 
    ["All Departments", ...new Set(doctors.map(d => d.department).filter(Boolean))], 
    [doctors]
  );
  const specializations = useMemo(() => 
    ["All Specializations", ...new Set(doctors.map(d => d.specialization).filter(Boolean))], 
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const nameMatch = doc.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const deptMatch = filterDept === "All Departments" || doc.department === filterDept;
      const specMatch = filterSpec === "All Specializations" || doc.specialization === filterSpec;
      const isActive = doc.isActive !== false && doc.userId?.isActive !== false;
      return nameMatch && deptMatch && specMatch && isActive;
    });
  }, [doctors, searchQuery, filterDept, filterSpec]);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedTime(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    const dateTimeString = `${selectedDate}T${selectedTime}:00`;
    const appointmentDateTime = new Date(dateTimeString);

    bookMutation.mutate(
      {
        doctorId: selectedDoctor.userId?._id,
        appointmentDateTime,
        notes,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate("/patient/appointments");
          }, 2000);
        },
      }
    );
  };

  const resetFlow = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setNotes("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-gray-400 animate-pulse">Loading amazing doctors...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
        <p className="text-red-400 font-medium">Failed to load doctor availability. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Book an Appointment
          </h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            {selectedDoctor ? (
              <>
                <span className="hover:text-emerald-400 cursor-pointer transition-colors" onClick={resetFlow}>Doctors</span>
                <ChevronRight size={14} />
                <span className="text-emerald-400 font-medium">Dr. {selectedDoctor.userId?.name}</span>
              </>
            ) : (
              "Find the right specialist and schedule your visit in seconds."
            )}
          </p>
        </div>
      </div>

      {!selectedDoctor ? (
        <>
          {/* Filters Section */}
          <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search doctors by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="bg-[#111827] border border-gray-700 rounded-xl pl-10 pr-8 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500 appearance-none cursor-pointer min-w-[180px]"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Stethoscope size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={filterSpec}
                    onChange={(e) => setFilterSpec(e.target.value)}
                    className="bg-[#111827] border border-gray-700 rounded-xl pl-10 pr-8 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500 appearance-none cursor-pointer min-w-[180px]"
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <DoctorCard 
                  key={doc._id} 
                  doctor={doc} 
                  onSelect={handleSelectDoctor} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-[#1f2937] border border-dashed border-gray-800 rounded-2xl">
                <div className="inline-flex p-4 rounded-full bg-gray-800/50 text-gray-500 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-medium text-white">No doctors found</h3>
                <p className="text-gray-400 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-12">
          {/* Step 1 & 2: Doctor Details & Date Selection */}
          <DoctorDetailsPanel 
            doctor={selectedDoctor} 
            onBack={resetFlow}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />

          {/* Step 3: Time Selection */}
          {selectedDate && (
            <TimeSlotPicker 
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />
          )}

          {/* Step 4: Summary & Booking */}
          {selectedTime && (
            <div className="max-w-2xl mx-auto">
              {bookMutation.isSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-4">
                  <CheckCircle2 size={20} />
                  <p className="font-medium">Appointment booked successfully! Redirecting...</p>
                </div>
              )}
              {bookMutation.isError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-4">
                  <XCircle size={20} />
                  <p className="font-medium">{bookMutation.error.response?.data?.message || "Booking failed. Please try again."}</p>
                </div>
              )}
              
              <BookingSummary 
                doctor={selectedDoctor}
                date={selectedDate}
                time={selectedTime}
                notes={notes}
                setNotes={setNotes}
                onConfirm={handleConfirmBooking}
                isBooking={bookMutation.isPending}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Simple icon wrapper for the select components
const Stethoscope = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const XCircle = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const CheckCircle2 = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default BookingCalendar;

