import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Ban, X, CheckCircle2, RefreshCw } from "lucide-react";
import {
  useAllDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeactivateDoctor,
  useReactivateDoctor,
} from "../hooks/useAdmin";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  specialization: "",
  department: "",
  availableDays: [],
};

const ManageDoctors = () => {
  const { data: doctors = [], isLoading, isError } = useAllDoctors();
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const deactivateMutation = useDeactivateDoctor();
  const reactivateMutation = useReactivateDoctor();

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredDoctors = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return doctors;

    return doctors.filter((doctor) => {
      const name = doctor.userId?.name || "";
      const email = doctor.userId?.email || "";
      const specialization = doctor.specialization || "";
      const department = doctor.department || "";
      return [name, email, specialization, department].some((value) =>
        value.toLowerCase().includes(needle),
      );
    });
  }, [doctors, query]);

  const openCreate = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      fullName: doctor.userId?.name || "",
      email: doctor.userId?.email || "",
      password: "",
      specialization: doctor.specialization || "",
      department: doctor.department || "",
      availableDays: doctor.availableDays || [],
    });
    setIsModalOpen(true);
  };

  const toggleDay = (day) => {
    setForm((current) => ({
      ...current,
      availableDays: current.availableDays.includes(day)
        ? current.availableDays.filter((value) => value !== day)
        : [...current.availableDays, day],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      fullName: form.fullName,
      email: form.email,
      specialization: form.specialization,
      department: form.department,
      availableDays: form.availableDays,
    };

    if (editingDoctor) {
      updateMutation.mutate(
        { id: editingDoctor._id, ...payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingDoctor(null);
          },
          onError: (error) => {
            alert(error.response?.data?.message || "Failed to update doctor");
          }
        },
      );
      return;
    }

    createMutation.mutate(
      { ...payload, password: form.password },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setForm(emptyForm);
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Failed to create doctor");
        }
      },
    );
  };

  const handleDeactivate = (doctor) => {
    if (
      window.confirm(`Deactivate Dr. ${doctor.userId?.name || "this doctor"}?`)
    ) {
      deactivateMutation.mutate(doctor._id, {
        onError: (error) => {
          alert(error.response?.data?.message || "Failed to deactivate doctor");
        }
      });
    }
  };

  const handleReactivate = (doctor) => {
    if (
      window.confirm(`Reactivate Dr. ${doctor.userId?.name || "this doctor"}?`)
    ) {
      reactivateMutation.mutate(doctor._id, {
        onError: (error) => {
          alert(error.response?.data?.message || "Failed to reactivate doctor");
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-400">Loading doctors...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-400">
        Failed to load doctors.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Manage Doctors
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Create, edit, and deactivate doctor accounts
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors shadow-lg"
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </div>

      <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-4 shadow-xl">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, specialization, or department"
            className="w-full bg-[#111827] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-[#1f2937] rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#111827] border-b border-gray-800">
                <th className="px-6 py-4 font-semibold text-gray-300">
                  Doctor
                </th>
                <th className="px-6 py-4 font-semibold text-gray-300">
                  Specialization
                </th>
                <th className="px-6 py-4 font-semibold text-gray-300">
                  Department
                </th>
                <th className="px-6 py-4 font-semibold text-gray-300">Days</th>
                <th className="px-6 py-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No doctors found.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => {
                  const isActive =
                    doctor.isActive !== false &&
                    doctor.userId?.isActive !== false;
                  return (
                    <tr
                      key={doctor._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">
                          {doctor.userId?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doctor.userId?.email || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-emerald-400">
                        {doctor.specialization || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {doctor.department || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {doctor.availableDays?.length
                          ? doctor.availableDays.join(", ")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${isActive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"}`}
                        >
                          {isActive ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Ban size={12} />
                          )}
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEdit(doctor)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#111827] text-gray-200 border border-gray-700 hover:border-gray-500"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          {isActive ? (
                            <button
                              onClick={() => handleDeactivate(doctor)}
                              disabled={deactivateMutation.isPending}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
                            >
                              <Ban size={14} />
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivate(doctor)}
                              disabled={reactivateMutation.isPending}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50"
                            >
                              <RefreshCw size={14} />
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-2xl bg-[#1f2937] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#111827]">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingDoctor ? "Edit Doctor" : "Create Doctor"}
                </h2>
                <p className="text-xs text-gray-400">
                  {editingDoctor
                    ? "Update account and profile details"
                    : "Create a new doctor account and profile"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Full Name</span>
                  <input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                  />
                </label>

                {!editingDoctor && (
                  <label className="space-y-2">
                    <span className="text-sm text-gray-300">Password</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                    />
                  </label>
                )}

                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Specialization</span>
                  <input
                    value={form.specialization}
                    onChange={(e) =>
                      setForm({ ...form, specialization: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm text-gray-300">Department</span>
                  <input
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-300">Available Days</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DAYS.map((day) => {
                    const checked = form.availableDays.includes(day);
                    return (
                      <label
                        key={day}
                        className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition-colors ${checked ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-[#111827] border-gray-700 text-gray-300"}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDay(day)}
                          className="mr-2 accent-emerald-500"
                        />
                        {day}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {editingDoctor ? "Save Changes" : "Create Doctor"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-[#111827] border border-gray-700 px-4 py-3 text-sm font-medium text-gray-200 hover:border-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
