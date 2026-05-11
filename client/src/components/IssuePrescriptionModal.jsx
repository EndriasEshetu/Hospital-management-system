import { useState } from "react";
import { useCreatePrescription } from "../hooks/useDoctor";
import { Plus, Trash2 } from "lucide-react";

const IssuePrescriptionModal = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", instructions: "" }
  ]);
  
  const createPrescriptionMutation = useCreatePrescription();

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "", instructions: "" }]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty medicines
    const validMedicines = medicines.filter(m => m.name.trim() !== "");
    
    if (validMedicines.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }

    createPrescriptionMutation.mutate(
      {
        patientId: appointment.patientId._id,
        appointmentId: appointment._id,
        medicines: validMedicines,
      },
      {
        onSuccess: () => {
          setTimeout(onClose, 1000);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm py-8 overflow-y-auto">
      <div className="bg-[#1f2937] rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-gray-700 my-auto">
        <div className="px-6 py-4 bg-emerald-600 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white tracking-wide">Issue Prescription</h2>
          <button onClick={handleAddMedicine} className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
            <Plus size={14} /> Add Med
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {createPrescriptionMutation.isSuccess && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
              ✅ Prescription issued successfully!
            </div>
          )}

          {createPrescriptionMutation.isError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {createPrescriptionMutation.error.response?.data?.message || "Failed to issue prescription"}
            </div>
          )}

          <div className="bg-[#111827] p-4 rounded-lg border border-gray-800 text-sm sticky top-0 z-10">
            <span className="text-gray-400">Patient: </span>
            <span className="font-medium text-white">{appointment.patientId?.name}</span>
          </div>

          <div className="space-y-4">
            {medicines.map((med, index) => (
              <div key={index} className="p-4 bg-[#111827] border border-gray-800 rounded-lg relative">
                {medicines.length > 1 && (
                  <button type="button" onClick={() => handleRemoveMedicine(index)} className="absolute top-3 right-3 text-gray-500 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      required
                      placeholder="Amoxicillin"
                      className="w-full px-3 py-2 bg-[#1f2937] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                      required
                      placeholder="500mg"
                      className="w-full px-3 py-2 bg-[#1f2937] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleChange(index, 'duration', e.target.value)}
                      required
                      placeholder="7 Days"
                      className="w-full px-3 py-2 bg-[#1f2937] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Instructions</label>
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => handleChange(index, 'instructions', e.target.value)}
                      placeholder="Take after meals"
                      className="w-full px-3 py-2 bg-[#1f2937] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-[#1f2937] pb-2">
            <button
              type="submit"
              disabled={createPrescriptionMutation.isPending || createPrescriptionMutation.isSuccess}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {createPrescriptionMutation.isPending ? "Issuing..." : "Issue Prescription"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={createPrescriptionMutation.isPending}
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

export default IssuePrescriptionModal;
