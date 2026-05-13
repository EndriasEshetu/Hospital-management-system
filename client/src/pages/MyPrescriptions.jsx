import { useMyPrescriptions } from "../hooks/usePatient";

const MyPrescriptions = () => {
  const { data: prescriptions = [], isLoading, isError } = useMyPrescriptions();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">My Prescriptions</h1>
        <p className="text-sm text-gray-400 mt-1">
          View your prescribed medications and instructions
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading your prescriptions...</div>
      ) : isError ? (
        <div className="text-center py-16 text-red-400">Failed to load prescriptions.</div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-[#1f2937] rounded-xl shadow-xl border border-gray-800">
          <p className="text-gray-300 text-lg">No prescriptions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 p-5">
              <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400">
                    Prescription
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Dr. {prescription.doctorId?.userId?.name || "Unknown Doctor"}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-4">
                {prescription.medicines && prescription.medicines.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Medicines:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {prescription.medicines.map((med, idx) => (
                        <div key={idx} className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                          <p className="text-emerald-400 font-medium">{med.name}</p>
                          <p className="text-sm text-gray-400 mt-1">Dosage: {med.dosage}</p>
                          <p className="text-sm text-gray-400">Duration: {med.duration}</p>
                          {med.instructions && (
                            <p className="text-xs text-gray-500 mt-2 italic">"{med.instructions}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-800/50 flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Prescribed on {new Date(prescription.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;
