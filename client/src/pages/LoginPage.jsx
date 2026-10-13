import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth, DEMO_CREDENTIALS } from "../context/AuthContext";
import { useApp } from "../hooks/useApp";
import {
  Lock,
  Mail,
  User,
  Shield,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/Button";

export function LoginPage() {
  const { login, register, quickLogin, user, isAuthenticated, logout } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  const [submitting, setSubmitting] = useState(false);
  const [demoRoleLoading, setDemoRoleLoading] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("PARTICIPANT");
  const [regCity, setRegCity] = useState("Mumbai");

  const redirectAfterLogin = (role) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }

    if (role === "ADMIN") {
      navigate("/dashboard/admin");
    } else if (role === "ORGANIZER") {
      navigate("/dashboard/organizer");
    } else {
      navigate("/dashboard/participant");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    const result = await login(loginEmail, loginPassword);
    setSubmitting(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user.name}! (${result.user.role})`, "success");
      redirectAfterLogin(result.user.role);
    } else {
      setErrorMessage(result.message || "Invalid credentials. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    const result = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      city: regCity,
    });
    setSubmitting(false);

    if (result.success) {
      showToast(`Account created successfully! Logged in as ${result.user.name}.`, "success");
      redirectAfterLogin(result.user.role);
    } else {
      setErrorMessage(result.message || "Registration failed. Check your details.");
    }
  };

  const handleDemoLogin = async (roleKey) => {
    setErrorMessage("");
    setDemoRoleLoading(roleKey);

    const result = await quickLogin(roleKey);
    setDemoRoleLoading(null);

    if (result.success) {
      showToast(`Logged in with demo credentials as ${result.user.name} (${result.user.role})`, "success");
      redirectAfterLogin(result.user.role);
    } else {
      setErrorMessage(result.message || "Demo login failed. Make sure backend is running & seeded.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" /> Practical 6: Secure JWT Authentication & RBAC
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Event<span className="text-indigo-600">Sphere</span> Authentication Portal
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Role-Based Access Control powered by JSON Web Tokens and bcryptjs. Authenticate to manage events, venues, and registrations.
          </p>
        </div>

        {/* Current Active Session Banner (if logged in) */}
        {isAuthenticated && user && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-indigo-600 font-medium">Currently Authenticated</p>
                <h4 className="text-sm font-bold text-slate-900">
                  {user.name} <span className="text-xs px-2 py-0.5 rounded bg-indigo-200 text-indigo-800 font-semibold">{user.role}</span>
                </h4>
                <p className="text-xs text-slate-500">{user.email} • {user.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => redirectAfterLogin(user.role)}
              >
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => {
                  logout();
                  showToast("Signed out successfully.", "info");
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 1-Click Demo Logins for Faculty Demonstration */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">1-Click Demo Profiles</h2>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Quickly switch between seeded roles to test Practical 6 authorization rules & permissions.
            </p>

            <div className="space-y-3">
              {/* Admin Card */}
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-900">Admin</span>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono font-bold">ADMIN</span>
                    </div>
                    <p className="text-xs text-slate-500">{DEMO_CREDENTIALS.ADMIN.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={demoRoleLoading !== null}
                  onClick={() => handleDemoLogin("ADMIN")}
                  className="text-xs bg-white text-purple-700 border-purple-300 hover:bg-purple-600 hover:text-white"
                >
                  {demoRoleLoading === "ADMIN" ? "Signing in..." : "Login"}
                </Button>
              </div>

              {/* Organizer Card */}
              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-900">Organizer</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold">ORGANIZER</span>
                    </div>
                    <p className="text-xs text-slate-500">{DEMO_CREDENTIALS.ORGANIZER.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={demoRoleLoading !== null}
                  onClick={() => handleDemoLogin("ORGANIZER")}
                  className="text-xs bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-600 hover:text-white"
                >
                  {demoRoleLoading === "ORGANIZER" ? "Signing in..." : "Login"}
                </Button>
              </div>

              {/* Participant Card */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900">Participant</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">PARTICIPANT</span>
                    </div>
                    <p className="text-xs text-slate-500">{DEMO_CREDENTIALS.PARTICIPANT.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={demoRoleLoading !== null}
                  onClick={() => handleDemoLogin("PARTICIPANT")}
                  className="text-xs bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-600 hover:text-white"
                >
                  {demoRoleLoading === "PARTICIPANT" ? "Signing in..." : "Login"}
                </Button>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Security Architecture:</p>
              <p>• Passwords hashed with bcryptjs salt (10 rounds)</p>
              <p>• JWT signed with HS256 algorithm</p>
              <p>• Tokens transmitted via <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code></p>
            </div>
          </div>

          {/* Right Column: Custom Login & Registration Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMessage("");
                }}
                className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all ${
                  activeTab === "login"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign In with Credentials
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setErrorMessage("");
                }}
                className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all ${
                  activeTab === "register"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  disabled={submitting}
                >
                  {submitting ? "Signing in..." : "Sign In with JWT"}
                </Button>
              </form>
            )}

            {/* Registration Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahul Patil"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. rahul.patil@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password (Min. 6 chars, 1 letter & 1 number)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="e.g. Rahul@123"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Role
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="PARTICIPANT">PARTICIPANT</option>
                      <option value="ORGANIZER">ORGANIZER</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-0.5">Admin accounts require seed setup</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        placeholder="Mumbai"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-3"
                  disabled={submitting}
                >
                  {submitting ? "Registering..." : "Create Account & Get JWT"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
