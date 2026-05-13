import { useState, useEffect } from "react";
import { usePatientProfile, useUpdatePatientProfile } from "../hooks/usePatient";
import { User, Mail, Phone, MapPin, Hash, UserCircle, Droplets, Save, Edit3 } from "lucide-react";

const PatientProfile = () => {
  const { data: profile, isLoading, isError } = usePatientProfile();
  const updateMutation = useUpdatePatientProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age || "",
        gender: profile.gender || "",
        bloodGroup: profile.bloodGroup || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      },
    });
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading profile...</div>;
  if (isError) return <div className="text-center py-20 text-red-400">Failed to load profile.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Personal Profile</h1>
          <p className="text-gray-400 mt-2">Manage your health information and contact details</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all font-medium"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="p-1 bg-emerald-500 rounded-full text-emerald-950">
            <Hash size={14} />
          </div>
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-[#1f2937] rounded-2xl border border-gray-800 p-6 shadow-xl sticky top-8 text-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/20">
              <User size={48} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{profile.userId?.name}</h2>
            <p className="text-emerald-400 text-sm font-medium mt-1">Patient</p>
            <div className="mt-6 pt-6 border-t border-gray-800 space-y-4 text-left">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} />
                <span className="truncate">{profile.userId?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Hash size={16} />
                <span>ID: {profile.patientId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#1f2937] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-[#1a2332]">
              <h3 className="text-lg font-semibold text-white">Health Information</h3>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <UserCircle size={14} /> Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                    placeholder="Enter your age"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <User size={14} /> Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Droplets size={14} /> Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <MapPin size={14} /> Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all resize-none"
                  placeholder="Enter your full address"
                />
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all border border-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
