import { useMyRecords } from "../hooks/usePatient";

const MyRecords = () => {
  const { data: records = [], isLoading, isError } = useMyRecords();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">My Medical Records</h1>
        <p className="text-sm text-gray-400 mt-1">
          View your clinical history and notes
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading your records...</div>
      ) : isError ? (
        <div className="text-center py-16 text-red-400">Failed to load records.</div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-[#1f2937] rounded-xl shadow-xl border border-gray-800">
          <p className="text-gray-300 text-lg">No medical records found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record._id} className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 p-5">
              <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Diagnosis: {record.diagnosis || "Pending"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Dr. {record.doctorId?.userId?.name || "Unknown Doctor"}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-3">
                {record.symptoms && record.symptoms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Symptoms:</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {record.symptoms.join(", ")}
                    </p>
                  </div>
                )}
                {record.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Clinical Notes:</h4>
                    <p className="text-sm text-gray-400 mt-1 bg-[#111827] p-3 rounded-lg border border-gray-800">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecords;
