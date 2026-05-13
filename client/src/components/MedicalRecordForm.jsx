import { useState } from "react";
import { useCreateMedicalRecord } from "../hooks/useDoctor";
import { X, ClipboardList, Plus, Trash2, Save } from "lucide-react";

const MedicalRecordForm = ({ appointment, onClose }) => {
  const [formData, setFormData] = useState({
    symptoms: [""],
    diagnosis: "",
    notes: ""
  });

  const createMutation = useCreateMedicalRecord();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymptomChange = (index, value) => {
    const newSymptoms = [...formData.symptoms];
    newSymptoms[index] = value;
    setFormData(prev => ({ ...prev, symptoms: newSymptoms }));
  };

  const addSymptom = () => {
    setFormData(prev => ({ ...prev, symptoms: [...prev.symptoms, ""] }));
  };

  const removeSymptom = (index) => {
    const newSymptoms = formData.symptoms.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, symptoms: newSymptoms }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.diagnosis || !formData.notes) {
      alert("Diagnosis and Clinical Notes are required.");
      return;
    }

    createMutation.mutate({
      appointmentId: appointment._id,
      patientId: appointment.patientId?._id,
      symptoms: formData.symptoms.filter(s => s.trim() !== ""),
      diagnosis: formData.diagnosis,
      notes: formData.notes
    }, {
      onSuccess: () => {
        alert("Medical record created successfully!");
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1f2937] rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden border border-gray-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#1a2332]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList size={20} className="text-blue-400" />
            Create Medical Record
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[#111827] rounded-xl border border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-400">
                {appointment.patientId?.name?.[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Patient</p>
                <p className="text-white font-bold">{appointment.patientId?.name}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                Symptoms
                <button 
                  type="button" 
                  onClick={addSymptom}
                  className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/20 transition-all border border-blue-500/20"
                >
                  <Plus size={10} className="inline mr-1" /> Add Symptom
                </button>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.symptoms.map((symptom, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={symptom}
                      onChange={(e) => handleSymptomChange(index, e.target.value)}
                      placeholder={`Symptom ${index + 1}`}
                      className="flex-1 bg-[#111827] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                    {formData.symptoms.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeSymptom(index)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Diagnosis *</label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                required
                placeholder="Enter final diagnosis"
                className="w-full bg-[#111827] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Clinical Notes *</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Detailed clinical observations and advice..."
                className="w-full bg-[#111827] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                {createMutation.isPending ? "Saving..." : "Save Record"}
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

export default MedicalRecordForm;
