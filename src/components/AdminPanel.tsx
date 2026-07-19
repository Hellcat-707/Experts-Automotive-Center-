import React, { useState, useEffect } from "react";
import { 
  Search, 
  Calendar, 
  RefreshCw, 
  Phone, 
  Clock, 
  FileText, 
  Check, 
  Ban, 
  CheckSquare, 
  Trash2, 
  MapPin, 
  Tag,
  Share2,
  ExternalLink,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Mail
} from "lucide-react";
import { Booking } from "../types";
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  createBookingsSpreadsheet, 
  checkSpreadsheetExists, 
  syncBookingsToSheet 
} from "../lib/googleSheets";

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  // Google Sheets state
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [sheetId, setSheetId] = useState<string | null>(localStorage.getItem("google_sheets_id"));
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Initialize Auth listener to persist Google Sheets access token session
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Could not retrieve bookings.");
      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load bookings database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Google Sheets integration actions
  const handleGoogleSignIn = async () => {
    setSyncError(null);
    setSyncSuccess(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setSyncSuccess(`Signed in as ${result.user.email}. Ready to sync!`);
      }
    } catch (err: any) {
      console.error(err);
      setSyncError(err.message || "Failed to authenticate with Google.");
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setGoogleToken(null);
      setSyncSuccess("Disconnected Google Sheets integration.");
    } catch (err: any) {
      setSyncError(err.message || "Failed to disconnect.");
    }
  };

  const handleCreateSheet = async () => {
    if (!googleToken) {
      setSyncError("Please sign in with Google first.");
      return;
    }
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);
    try {
      const newSheetId = await createBookingsSpreadsheet(googleToken);
      localStorage.setItem("google_sheets_id", newSheetId);
      setSheetId(newSheetId);
      
      // Auto-sync existing bookings immediately to populate Sheet
      if (bookings.length > 0) {
        await syncBookingsToSheet(googleToken, newSheetId, bookings);
        setSyncSuccess("Created 'Experts Automotive Bookings' and synced all active bookings!");
      } else {
        setSyncSuccess("Successfully created Google Sheet in your Drive!");
      }
    } catch (err: any) {
      console.error(err);
      setSyncError(err.message || "Failed to create Google Sheet.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncBookings = async () => {
    if (!googleToken || !sheetId) {
      setSyncError("Google Sheets integration is not configured yet.");
      return;
    }
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);
    try {
      const exists = await checkSpreadsheetExists(googleToken, sheetId);
      if (!exists) {
        throw new Error("Connected Spreadsheet is no longer accessible. Try creating a new one.");
      }
      await syncBookingsToSheet(googleToken, sheetId, bookings);
      setSyncSuccess("All bookings successfully synchronized to your Google Sheet!");
    } catch (err: any) {
      console.error(err);
      setSyncError(err.message || "Synchronization failed.");
    } finally {
      setSyncing(false);
    }
  };

  // Update booking status with automatic real-time Sheets sync
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      
      const data = await res.json();
      
      // Update local state cleanly
      const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b));
      setBookings(updated);

      // Set the success message from the server
      setSyncSuccess(data.message || `Booking ${id} status updated to ${newStatus}.`);

      // Auto-sync in background if Sheets is connected
      if (googleToken && sheetId) {
        try {
          await syncBookingsToSheet(googleToken, sheetId, updated);
          setSyncSuccess((prev) => prev ? `${prev} (Auto-synced to Google Sheet)` : `Booking ${id} status updated and auto-synced to Google Sheet!`);
        } catch (syncErr) {
          console.warn("Auto-sync background error:", syncErr);
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Delete booking with automatic real-time Sheets sync
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking? This action is irreversible.")) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete booking.");
      
      // Remove from local state
      const updated = bookings.filter((b) => b.id !== id);
      setBookings(updated);

      // Auto-sync in background if Sheets is connected
      if (googleToken && sheetId) {
        try {
          await syncBookingsToSheet(googleToken, sheetId, updated);
          setSyncSuccess(`Booking ${id} deleted and auto-synced to Google Sheet!`);
        } catch (syncErr) {
          console.warn("Auto-sync background error:", syncErr);
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Filter & Search logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phoneNumber.includes(searchTerm) ||
      b.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesBranch = branchFilter === "All" || b.branch.includes(branchFilter);

    return matchesSearch && matchesStatus && matchesBranch;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-950/20 text-yellow-400 border-yellow-900/40";
      case "Confirmed":
        return "bg-green-950/20 text-green-400 border-green-900/40";
      case "Completed":
        return "bg-blue-950/20 text-blue-400 border-blue-900/40";
      case "Cancelled":
        return "bg-[#E31B23]/10 text-[#E31B23] border-[#E31B23]/20";
      default:
        return "bg-white/5 text-white/60 border-white/10";
    }
  };

  return (
    <div className="bg-[#0A0A0C] text-[#E0E0E0] py-24 min-h-[85vh] font-sans" id="admin_dashboard_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/10 pb-8" id="admin_header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#E31B23] font-mono text-xs tracking-[0.4em] uppercase font-bold">GARAGE OPERATIONS BACKOFFICE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Booking Management</h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1">
              Active tracking of all scheduled maintenance and repair services across Doha branches.
            </p>
          </div>
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="px-5 py-3 bg-[#16161D] hover:bg-white/5 text-white font-bold text-xs uppercase tracking-widest border border-white/10 transition-all rounded-lg flex items-center space-x-2 shrink-0 shadow-sm"
            id="admin_refresh_btn"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Reload Database</span>
          </button>
        </div>

        {/* Google Sheets Integration Card */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 md:p-8 mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6" id="google_sheets_sync_card">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-[#E31B23] rounded-full animate-pulse" />
              <h3 className="text-base font-black tracking-tight text-white uppercase flex items-center gap-2">
                Google Sheets Sync Center
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Connect your Google account to automatically push and sync all vehicle repair bookings directly to Google Sheets in real-time. Perfect for spreadsheet management and offline backup.
            </p>

            {/* Success and Error Feedback bars */}
            {syncSuccess && (
              <div className="flex items-center gap-2 bg-green-950/20 border border-green-900/40 text-green-400 p-3 rounded-lg text-xs" id="sync_success_banner">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{syncSuccess}</span>
              </div>
            )}
            {syncError && (
              <div className="flex items-center gap-2 bg-[#E31B23]/10 border border-[#E31B23]/20 text-[#E31B23] p-3 rounded-lg text-xs" id="sync_error_banner">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{syncError}</span>
              </div>
            )}
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {!googleUser ? (
              <button
                onClick={handleGoogleSignIn}
                className="inline-flex items-center justify-center space-x-3 px-6 py-3.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold tracking-wider uppercase rounded-lg transition-all shadow-[0_4px_12px_rgba(255,255,255,0.05)] cursor-pointer"
                id="google_signin_btn"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>Connect Google Sheets</span>
              </button>
            ) : (
              <div className="flex flex-col gap-4 w-full sm:w-auto">
                {/* Linked Google Profile info */}
                <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/5 p-3 rounded-lg" id="google_user_profile">
                  <div className="flex items-center gap-2">
                    {googleUser.photoURL ? (
                      <img src={googleUser.photoURL} alt={googleUser.displayName} className="w-6 h-6 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#E31B23] text-white font-black text-[10px] flex items-center justify-center">
                        {googleUser.email ? googleUser.email[0].toUpperCase() : "G"}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-bold leading-none">{googleUser.displayName || "Admin Account"}</span>
                      <span className="text-white/40 text-[9px] font-mono leading-none mt-1">{googleUser.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleSignOut}
                    className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-[#E31B23] transition-colors cursor-pointer"
                    title="Disconnect Google Account"
                    id="google_logout_btn"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Operations */}
                <div className="flex flex-wrap items-center gap-3">
                  {!sheetId ? (
                    <button
                      onClick={handleCreateSheet}
                      disabled={syncing}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#E31B23] hover:bg-[#ff3b43] disabled:bg-[#E31B23]/50 text-white text-xs font-black tracking-wider uppercase rounded-lg transition-all shadow-[0_5px_15px_rgba(227,27,35,0.3)] cursor-pointer"
                      id="create_sheet_btn"
                    >
                      <Share2 className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                      <span>{syncing ? "Creating..." : "Create Spreadsheet"}</span>
                    </button>
                  ) : (
                    <>
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${sheetId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#16161D] hover:bg-white/5 border border-white/10 text-white text-xs font-bold tracking-wider uppercase rounded-lg transition-all"
                        id="open_sheet_link"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#E31B23]" />
                        <span>Open Google Sheet</span>
                      </a>

                      <button
                        onClick={handleSyncBookings}
                        disabled={syncing}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#E31B23] hover:bg-[#ff3b43] disabled:bg-[#E31B23]/50 text-white text-xs font-black tracking-wider uppercase rounded-lg transition-all shadow-[0_5px_15px_rgba(227,27,35,0.3)] cursor-pointer"
                        id="manual_sync_btn"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                        <span>{syncing ? "Syncing..." : "Sync Bookings"}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Database Search & Filter Controls bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" id="admin_filters_bar">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or car brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#E31B23] transition-colors"
              id="admin_search_input"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-white/80 focus:outline-none focus:border-[#E31B23] transition-colors"
              id="admin_status_filter"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Validation</option>
              <option value="Confirmed">Confirmed Slots</option>
              <option value="Completed">Ready for Pickup / Done</option>
              <option value="Cancelled">Cancelled Requests</option>
            </select>
          </div>

        </div>

        {/* Active Database List view */}
        {loading ? (
          <div className="py-20 flex flex-col justify-center items-center space-y-4" id="admin_loading_indicator">
            <div className="w-12 h-12 border-4 border-[#E31B23] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold tracking-widest text-white/40 uppercase font-mono">Synchronizing database...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/20 border border-red-900/40 p-8 text-center rounded-2xl text-red-400 text-sm max-w-xl mx-auto" id="admin_error_box">
            <p className="font-bold uppercase tracking-wide mb-2">Sync Error</p>
            <p>{error}</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-[#16161D] border border-white/5 p-16 text-center text-white/40 rounded-2xl" id="admin_empty_state">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="font-black uppercase text-xs tracking-widest text-white/60">No Bookings Found</p>
            <p className="text-sm text-white/40 mt-1 italic">There are no slots matched by your current filters or search terms.</p>
          </div>
        ) : (
          /* Bookings Stack List */
          <div className="space-y-4" id="admin_bookings_list">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-gradient-to-r from-[#16161D] to-[#0F0F14] border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:border-white/10 transition-all duration-200"
                id={`admin_booking_row_${b.id}`}
              >
                {/* Left: General Booking Details info */}
                <div className="space-y-3 w-full lg:max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[#E31B23] font-mono text-xs font-extrabold bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg">
                      {b.id}
                    </span>
                    <span className={`text-[10px] font-bold font-mono tracking-wider border px-2.5 py-0.5 rounded-full uppercase ${getStatusBadgeClass(b.status)}`}>
                      {b.status === "Completed" ? "Ready for Pickup" : b.status}
                    </span>
                    <span className="text-xs text-white/40 font-mono">
                      Received: {new Date(b.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider font-bold">Customer</p>
                      <p className="text-base font-bold text-white mt-0.5 flex items-center space-x-2">
                        <span>{b.fullName}</span>
                      </p>
                      <a 
                        href={`tel:${b.phoneNumber}`} 
                        className="text-xs text-[#E31B23] font-bold flex items-center space-x-1 hover:underline mt-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{b.phoneNumber}</span>
                      </a>
                      {b.email && (
                        <a 
                          href={`mailto:${b.email}`} 
                          className="text-xs text-white/50 flex items-center space-x-1 hover:underline mt-1"
                        >
                          <Mail className="w-3.5 h-3.5 text-white/40 shrink-0" />
                          <span className="font-mono text-[11px] truncate">{b.email}</span>
                        </a>
                      )}
                    </div>

                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider font-bold">Vehicle</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {b.year} {b.brand} {b.model}
                      </p>
                      <p className="text-xs mt-1 flex items-center space-x-1.5 font-bold text-[#E31B23] uppercase tracking-wider">
                        <Tag className="w-3.5 h-3.5 shrink-0" />
                        <span>{b.serviceType}</span>
                      </p>
                    </div>
                  </div>

                  {/* Appt particulars (Branch, date, description) */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                    <div className="text-white/60 flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-white/30 shrink-0" />
                      <span className="font-bold text-white">{b.branch}</span>
                    </div>
                    <div className="text-white/60 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-white/30 shrink-0" />
                      <span>Bring Date: <strong className="text-[#E31B23]">{b.date}</strong></span>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-white/60 flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                      <p className="italic">{b.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right: Actions menu to confirm/cancel/complete or delete */}
                <div className="flex flex-wrap lg:flex-col gap-2 justify-end w-full lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/30 block lg:text-right w-full mb-1">
                    Update Status
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 w-full">
                    {/* Confirm Button */}
                    {b.status !== "Confirmed" && b.status !== "Completed" && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, "Confirmed")}
                        className="p-2 bg-black/40 hover:bg-green-950/30 text-white/60 hover:text-green-400 border border-white/10 hover:border-green-900/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 flex-1 transition-colors"
                        title="Confirm Slot"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm</span>
                      </button>
                    )}

                    {/* Complete Button */}
                    {b.status === "Confirmed" && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, "Completed")}
                        className="p-2 bg-black/40 hover:bg-blue-950/30 text-white/60 hover:text-blue-400 border border-white/10 hover:border-blue-900/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 flex-1 transition-colors"
                        title="Mark Service Completed & Notify Customer for Pickup"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Ready & Notify</span>
                      </button>
                    )}

                    {/* Cancel Button */}
                    {b.status !== "Cancelled" && b.status !== "Completed" && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, "Cancelled")}
                        className="p-2 bg-black/40 hover:bg-red-950/30 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-900/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 flex-1 transition-colors"
                        title="Cancel Booking"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* Reset to Pending button if cancel/done */}
                    {(b.status === "Cancelled" || b.status === "Completed") && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, "Pending")}
                        className="p-2 bg-black/40 hover:bg-yellow-950/30 text-white/60 hover:text-yellow-400 border border-white/10 hover:border-yellow-900/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 flex-1 transition-colors"
                        title="Reset to Pending"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reopen</span>
                      </button>
                    )}

                    {/* Permanent Delete */}
                    <button
                      onClick={() => handleDeleteBooking(b.id)}
                      className="p-2 bg-black/40 hover:bg-[#E31B23] text-white/40 hover:text-white border border-white/10 hover:border-[#E31B23] rounded-lg text-xs transition-all duration-200 flex justify-center items-center"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
