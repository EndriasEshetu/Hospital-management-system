import { useState } from "react";
import { useCreatePrescription } from "../hooks/useDoctor";
import { X, FilePlus, Plus, Trash2, Pill, Save } from "lucide-react";

const PrescriptionForm = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", instructions: "" }
  ]);

  const createMutation = useCreatePrescription();

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "", instructions: "" }]);
  };

  const removeMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const isValid = medicines.every(med => med.name && med.dosage && med.duration);
    if (!isValid) {
      alert("Medicine name, dosage, and duration are required for all entries.");
      return;
    }

    createMutation.mutate({
      appointmentId: appointment._id,
      patientId: appointment.patientId?._id,
      medicines
    }, {
      onSuccess: () => {
        alert("Prescription issued successfully!");
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1f2937] rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden border border-gray-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#1a2332]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FilePlus size={20} className="text-purple-400" />
            Issue Digital Prescription
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[85vh]">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[#111827] rounded-xl border border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl font-bold text-purple-400">
                {appointment.patientId?.name?.[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Patient</p>
                <p className="text-white font-bold">{appointment.patientId?.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Medications</label>
                <button 
                  type="button" 
                  onClick={addMedicine}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-500/20 transition-all border border-purple-500/20"
                >
                  <Plus size={14} /> Add Medicine
                </button>
              </div>

              <div className="space-y-4">
                {medicines.map((med, index) => (
                  <div key={index} className="p-5 bg-[#111827] rounded-xl border border-gray-800 relative group animate-in slide-in-from-right-4 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Medicine Name *</label>
                        <div className="relative">
                          <Pill size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                            placeholder="e.g. Paracetamol"
                            className="w-full bg-[#1f2937] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Dosage *</label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                          placeholder="e.g. 500mg, 1 tablet"
                          className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Duration *</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                          placeholder="e.g. 5 days, 1 week"
                          className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Instructions</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)}
                        placeholder="e.g. After meals, twice daily"
                        className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      />
                    </div>

                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all scale-0 group-hover:scale-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-800">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                {createMutation.isPending ? "Issuing..." : "Issue Prescription"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all border border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
