import React, { useState } from "react";
import { Calendar, Phone, Car, User, Settings, FileText, Send, CheckCircle2, AlertTriangle, ChevronRight, Mail, MapPin } from "lucide-react";
import { SERVICE_CATEGORIES, BRANCHES, CONTACT_INFO } from "../data";
import { ServiceType } from "../types";

export default function BookingForm() {
  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [date, setDate] = useState("");
  const [branchId, setBranchId] = useState("main");
  const [notes, setNotes] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredBooking, setRegisteredBooking] = useState<any | null>(null);

  // Get today's date in YYYY-MM-DD format to disable past dates
  const todayStr = new Date().toISOString().split("T")[0];

  // Year Selection Options (from next year down to 1980)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1980 + 2 }, (_, i) => String(currentYear + 1 - i));

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!fullName.trim()) return setError("Full Name is required.");
    if (!phoneNumber.trim()) return setError("Phone Number is required.");
    if (!email.trim()) return setError("Email Address is required.");
    if (!brand.trim()) return setError("Car Brand is required.");
    if (!model.trim()) return setError("Car Model is required.");
    if (!year) return setError("Please select your Car Year.");
    if (!serviceType) return setError("Please select a Service Type.");
    if (!date) return setError("Please specify an Appointment Date.");
    if (!branchId) return setError("Please select a Branch location.");

    setLoading(true);

    const selectedBranchName = BRANCHES.find((b) => b.id === branchId)?.name || branchId;

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          email,
          brand,
          model,
          year: parseInt(year),
          serviceType,
          date,
          branch: selectedBranchName,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An error occurred during registration.");
      }

      setRegisteredBooking(result.booking);
      setSuccess(true);
      
      // Clear form inputs
      setFullName("");
      setPhoneNumber("");
      setEmail("");
      setBrand("");
      setModel("");
      setYear("");
      setServiceType("");
      setDate("");
      setNotes("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-generate direct mailto URL to expertsautomotive3@gmail.com
  const getMailtoLink = (booking: any) => {
    if (!booking) return "";
    const subject = encodeURIComponent(`[SERVICE BOOKING] ${booking.brand} ${booking.model} - ${booking.fullName}`);
    const bodyText = `New Service Booking Request:
----------------------------------------
Customer Details:
- Name: ${booking.fullName}
- Phone: ${booking.phoneNumber}
- Email: ${booking.email || "N/A"}

Vehicle Details:
- Brand: ${booking.brand}
- Model: ${booking.model}
- Year: ${booking.year}

Appointment Details:
- Selected Branch: ${booking.branch}
- Service Required: ${booking.serviceType}
- Date: ${booking.date}

Additional Notes:
${booking.notes || "None"}

----------------------------------------
Submitted on: ${new Date(booking.createdAt).toLocaleDateString()}`;

    return `mailto:expertsautomotive3@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  return (
    <div className="bg-[#0A0A0C] text-[#E0E0E0] py-24 border-b border-white/10 font-sans" id="booking_form_section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16" id="booking_form_header">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-2 h-6 bg-[#E31B23] rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Book a Service
            </h2>
          </div>
          <p className="text-white/70 italic text-sm max-w-xl text-center">
            Complete your vehicle and appointment details below to request a service slot. Our team will verify and contact you immediately.
          </p>
        </div>

        {/* Success / Confirmation State Screen */}
        {success && registeredBooking ? (
          <div className="bg-gradient-to-br from-[#16161D] to-[#0F0F14] border border-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl text-center space-y-6 relative overflow-hidden" id="booking_success_screen">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E31B23]/10 blur-[60px] rounded-full"></div>
            
            <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-[#E31B23]/10 border border-[#E31B23] animate-pulse relative z-10">
              <CheckCircle2 className="w-12 h-12 text-[#E31B23]" />
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Booking Registered!</h3>
              <p className="text-white/70 text-sm max-w-lg mx-auto">
                Thank you, <span className="text-white font-bold">{registeredBooking.fullName}</span>. Your service slot request has been recorded in our local database with Booking ID: <span className="text-[#E31B23] font-mono font-black">{registeredBooking.id}</span>.
              </p>
            </div>

            {/* Structured Receipt Info */}
            <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-left max-w-xl mx-auto space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-white/10 pb-3">
                <div>
                  <p className="text-white/40 uppercase font-mono tracking-wider font-bold">Vehicle</p>
                  <p className="text-white font-bold mt-1">{registeredBooking.year} {registeredBooking.brand} {registeredBooking.model}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase font-mono tracking-wider font-bold">Service Requested</p>
                  <p className="text-[#E31B23] font-black mt-1 uppercase tracking-wider">{registeredBooking.serviceType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-white/40 uppercase font-mono tracking-wider font-bold">Date of Arrival</p>
                  <p className="text-white font-bold mt-1">{registeredBooking.date}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase font-mono tracking-wider font-bold">Target Station</p>
                  <p className="text-white font-bold mt-1">{registeredBooking.branch}</p>
                </div>
              </div>
            </div>

            {/* Email send actions */}
            <div className="space-y-4 max-w-xl mx-auto pt-4 relative z-10">
              <div className="p-4 bg-[#E31B23]/5 border border-[#E31B23]/20 rounded-xl text-xs text-white/70 text-center leading-relaxed italic">
                <AlertTriangle className="w-5 h-5 text-[#E31B23] mx-auto mb-2" />
                To ensure your booking details are processed directly and instantly by our shop, click below to send them via email to <span className="text-white font-bold">expertsautomotive3@gmail.com</span>:
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={getMailtoLink(registeredBooking)}
                  className="px-6 py-4 bg-[#E31B23] hover:bg-[#ff3b43] text-white font-black text-xs uppercase tracking-tighter rounded-lg transition-all shadow-[0_5px_20px_rgba(227,27,35,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
                  id="direct_mailto_action_btn"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Direct Email Notification</span>
                </a>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setRegisteredBooking(null);
                  }}
                  className="px-6 py-4 bg-[#16161D] hover:bg-white/5 text-white font-bold text-xs uppercase tracking-widest rounded-lg border border-white/10 transition-all cursor-pointer"
                  id="book_another_button"
                >
                  Book Another Vehicle
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Booking Entry Form */
          <form 
            onSubmit={handleSubmit} 
            className="bg-gradient-to-br from-[#16161D] to-[#0F0F14] border border-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl space-y-8 relative overflow-hidden"
            id="service_booking_form"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E31B23]/5 blur-[60px] rounded-full pointer-events-none"></div>

            {error && (
              <div className="p-4 bg-red-950/40 border-l-4 border-[#E31B23] text-red-400 text-sm flex items-center space-x-2 rounded-r-lg" id="booking_form_error">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Grid 1: Customer Info */}
            <div className="space-y-6 relative z-10">
              <h3 className="text-base font-bold uppercase tracking-widest text-white/90 border-b border-white/5 pb-3 flex items-center space-x-2">
                <User className="w-4 h-4 text-[#E31B23]" />
                <span>1. Customer Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="customer_name" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                    Full Name <span className="text-[#E31B23]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      id="customer_name"
                      placeholder="e.g. Ahmad Al-Kuwari"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="customer_phone" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                    Phone Number <span className="text-[#E31B23]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="tel"
                      id="customer_phone"
                      placeholder="e.g. +974 30038280"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="customer_email" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                    Email Address <span className="text-[#E31B23]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      id="customer_email"
                      placeholder="e.g. customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Vehicle Info */}
            <div className="space-y-6 relative z-10">
              <h3 className="text-base font-bold uppercase tracking-widest text-white/90 border-b border-white/5 pb-3 flex items-center space-x-2">
                <Car className="w-4 h-4 text-[#E31B23]" />
                <span>2. Vehicle Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="car_brand" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                    Car Brand <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    id="car_brand"
                    placeholder="e.g. Porsche, Toyota"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="car_model" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                    Car Model <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    id="car_model"
                    placeholder="e.g. 911 Carrera, Land Cruiser"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="car_year" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                    Car Year <span className="text-[#E31B23]">*</span>
                  </label>
                  <select
                    id="car_year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors text-white/70"
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y} className="bg-[#16161D] text-white">{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Grid 3: Service details */}
            <div className="space-y-6 relative z-10">
              <h3 className="text-base font-bold uppercase tracking-widest text-white/90 border-b border-white/5 pb-3 flex items-center space-x-2">
                <Settings className="w-4 h-4 text-[#E31B23]" />
                <span>3. Appointment Settings</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="service_type" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                    Service Required <span className="text-[#E31B23]">*</span>
                  </label>
                  <select
                    id="service_type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors text-white/70"
                    required
                  >
                    <option value="">Select Service Type</option>
                    {SERVICE_CATEGORIES.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#16161D] text-white">{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bring_date" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                    Date of Arrival <span className="text-[#E31B23]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="date"
                      id="bring_date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>


            </div>

            {/* Grid 4: Additional Notes */}
            <div className="space-y-6 relative z-10">
              <h3 className="text-base font-bold uppercase tracking-widest text-white/90 border-b border-white/5 pb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#E31B23]" />
                <span>4. Additional Notes &amp; Symptoms</span>
              </h3>

              <div className="space-y-2">
                <label htmlFor="booking_notes" className="block text-xs font-bold tracking-wider text-white/40 uppercase">
                  Describe symptoms, noise, or special directions (Optional)
                </label>
                <textarea
                  id="booking_notes"
                  rows={4}
                  placeholder="e.g. High whistling noise when braking at high speeds, AC blowing slightly warm air during afternoon shifts..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
              <div className="text-xs text-white/40 max-w-md text-center sm:text-left leading-relaxed italic">
                By submitting this request, your appointment will be registered instantly in our system. You will receive an automated confirmation sheet.
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-8 py-4 bg-[#E31B23] hover:bg-[#ff3b43] text-white font-black uppercase tracking-tighter text-xs rounded-lg transition-all flex items-center justify-center space-x-2 shadow-[0_5px_20px_rgba(227,27,35,0.3)] cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5 active:translate-y-0"
                }`}
                id="booking_submit_button"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Register Booking</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
