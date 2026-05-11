import { useState } from "react";
import { useCreateMedicalRecord } from "../hooks/useDoctor";

const AddRecordModal = ({ appointment, onClose }) => {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  
  const createRecordMutation = useCreateMedicalRecord();

  const handleSubmit = (e) => {
    e.preventDefault();
    createRecordMutation.mutate(
      {
        patientId: appointment.patientId._id,
        appointmentId: appointment._id,
        symptoms: symptoms.split(",").map(s => s.trim()).filter(s => s),
        diagnosis,
        notes,
      },
      {
        onSuccess: () => {
          setTimeout(onClose, 1000);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1f2937] rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-gray-700">
        <div className="px-6 py-4 bg-blue-600">
          <h2 className="text-lg font-bold text-white tracking-wide">Add Medical Record</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {createRecordMutation.isSuccess && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
              ✅ Medical record added successfully!
            </div>
          )}

          {createRecordMutation.isError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {createRecordMutation.error.response?.data?.message || "Failed to add record"}
            </div>
          )}

          <div className="bg-[#111827] p-4 rounded-lg border border-gray-800 text-sm">
            <span className="text-gray-400">Patient: </span>
            <span className="font-medium text-white">{appointment.patientId?.name}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Symptoms (comma-separated)</label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Fever, Cough, Headache"
              className="w-full px-3 py-2 bg-[#111827] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#111827] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Clinical Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-[#111827] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={createRecordMutation.isPending || createRecordMutation.isSuccess}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {createRecordMutation.isPending ? "Saving..." : "Save Record"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={createRecordMutation.isPending}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;
