import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Calendar,
  Bell,
  Shield,
  LayoutDashboard,
  User,
  Settings,
  Clock,
  CheckCircle,
  FileText,
  Activity,
  Users,
  Stethoscope,
  Database,
  Lock,
  ArrowRight,
} from "lucide-react";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#21486b]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Smart Healthcare <br />
                <span className="text-blue-400">Management Platform</span>
              </h1>

              <p className="text-lg text-blue-100/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                A complete hospital management platform for patients, doctors, and administrators. 
                Manage appointments, doctor schedules, patient records, and healthcare operations 
                in one secure, unified system.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a
                  href="/login"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1"
                >
                  <User size={18} />
                  Login
                </a>

                <a
                  href="/register"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1"
                >
                  <CheckCircle size={18} />
                  Register
                </a>
              </div>

              {/* MINI FEATURES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <FeatureMiniCard
                  icon={<FileText size={22} />}
                  title="Patient Records"
                  desc="Digital health history."
                  color="bg-emerald-500/20"
                />
                <FeatureMiniCard
                  icon={<Clock size={22} />}
                  title="Doctor Scheduling"
                  desc="Real-time availability."
                  color="bg-blue-500/20"
                />
                <FeatureMiniCard
                  icon={<Lock size={22} />}
                  title="Secure Data"
                  desc="HIPAA compliant safety."
                  color="bg-purple-500/20"
                />
              </div>
            </div>

            {/* RIGHT MOCKUP */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-[40px] blur-3xl"></div>
              <div className="relative bg-[#1f2937] border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
                <div className="grid grid-cols-[220px_1fr] h-full">
                  {/* Sidebar */}
                  <div className="border-r border-white/10 p-5 bg-black/20">
                    <div className="flex items-center gap-2 mb-10 px-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <Activity size={18} className="text-white" />
                      </div>
                      <span className="font-bold text-white text-sm">HealthFlow</span>
                    </div>
                    
                    <div className="space-y-1">
                      <MockNavItem icon={<LayoutDashboard size={18} />} active>Dashboard</MockNavItem>
                      <MockNavItem icon={<User size={18} />}>Profile</MockNavItem>
                      <MockNavItem icon={<Calendar size={18} />}>Book Appointment</MockNavItem>
                      <MockNavItem icon={<Clock size={18} />}>My Appointments</MockNavItem>
                      <MockNavItem icon={<FileText size={18} />}>My Records</MockNavItem>
                      <MockNavItem icon={<Stethoscope size={18} />}>My Prescriptions</MockNavItem>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="p-8 bg-[#111827]">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-white">Hospital Dashboard</h3>
                        <p className="text-xs text-gray-500 mt-1">Daily operations overview</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700"></div>
                    </div>

                    <div className="space-y-4">
                      <ActivityCard
                        icon={<Users size={16} />}
                        title="New Patient Registered"
                        time="Just now"
                        color="bg-blue-500/20 text-blue-400"
                      />
                      <ActivityCard
                        icon={<Calendar size={16} />}
                        title="Doctor Availability Updated"
                        time="10 mins ago"
                        color="bg-purple-500/20 text-purple-400"
                      />
                      <ActivityCard
                        icon={<CheckCircle size={16} />}
                        title="Appointment Confirmed"
                        time="25 mins ago"
                        color="bg-emerald-500/20 text-emerald-400"
                      />
                      <ActivityCard
                        icon={<FileText size={16} />}
                        title="Medical Record Added"
                        time="1 hour ago"
                        color="bg-blue-500/20 text-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="py-12 border-y border-white/5 bg-[#14314f]/30">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value="250+" label="Patients Served" />
              <StatCard value="40+" label="Specialist Doctors" />
              <StatCard value="500+" label="Appointments" />
              <StatCard value="24/7" label="Emergency Support" />
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-[#14314f]/60 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">
                Everything Needed for Modern Hospital Operations
              </h2>
              <p className="text-lg text-blue-100/70">
                Our comprehensive platform streamlines every aspect of hospital management, 
                from patient check-in to clinical documentation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users />}
                title="Manage Patients"
                desc="Comprehensive patient profiles, history tracking, and demographic management."
              />
              <FeatureCard
                icon={<Clock />}
                title="Doctor Scheduling"
                desc="Manage complex shifts, leave requests, and real-time clinic availability."
              />
              <FeatureCard
                icon={<Calendar />}
                title="Appointment Management"
                desc="Intelligent booking system with automated reminders and waitlist support."
              />
              <FeatureCard
                icon={<FileText />}
                title="Medical Records"
                desc="Secure digital records for diagnoses, lab results, and clinical notes."
              />
              <FeatureCard
                icon={<LayoutDashboard />}
                title="Admin Dashboard"
                desc="Full visibility into hospital metrics, staff performance, and patient flow."
              />
              <FeatureCard
                icon={<Database />}
                title="Centralized Operations"
                desc="Keep all hospital data synchronized across departments and devices."
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-[40px] p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Start Managing Your Hospital <br /> Smarter Today
              </h2>
              <p className="text-blue-100/90 text-lg mb-10 max-w-xl mx-auto">
                Join our network of modern healthcare providers and experience 
                the future of clinical management.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/register"
                  className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started for Free
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const FeatureMiniCard = ({ icon, title, desc, color }) => (
  <div className="flex gap-4 items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
    <div className={`p-3 rounded-xl ${color} text-white shrink-0`}>{icon}</div>
    <div>
      <h4 className="text-white font-semibold text-sm">{title}</h4>
      <p className="text-xs text-blue-100/60 mt-1">{desc}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition group">
    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-blue-100/70 leading-relaxed">{desc}</p>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
    <p className="text-4xl font-black text-white mb-2">{value}</p>
    <p className="text-sm font-medium text-blue-400 uppercase tracking-widest">{label}</p>
  </div>
);

const MockNavItem = ({ icon, children, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer transition-colors ${
      active
        ? "bg-blue-500/20 text-blue-400"
        : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
    }`}
  >
    <div className="shrink-0">{icon}</div>
    <span className="text-xs font-medium">{children}</span>
  </div>
);

const ActivityCard = ({ icon, title, time, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-all cursor-default">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-white text-sm font-medium truncate">{title}</h4>
      <p className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-wider">{time}</p>
    </div>
  </div>
);

export default Homepage;
