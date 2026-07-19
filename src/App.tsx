import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import BookingForm from "./components/BookingForm";
import AdminPanel from "./components/AdminPanel";
import SocialLinks from "./components/SocialLinks";
import { CONTACT_INFO, WORKING_HOURS } from "./data";
import { Cog, Phone, Mail, Clock, MapPin, Compass, ArrowUp, ChevronRight, Instagram, Facebook, Video, Ghost } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import yellowRamTrxBackground from "./assets/images/yellow_ram_trx_no_words_facade_1783174842264.jpg";

export default function App() {
  const [currentTab, setCurrentTab] = useState("home");

  // Scroll back to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dynamically render current selected section/tab
  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return (
          <>
            <Hero 
              onBookClick={() => setCurrentTab("booking")} 
              onAboutClick={() => setCurrentTab("about")} 
            />
            <SocialLinks />
          </>
        );
      case "about":
        return <AboutUs />;
      case "booking":
        return <BookingForm />;
      case "admin":
        return <AdminPanel />;
      default:
        return (
          <>
            <Hero 
              onBookClick={() => setCurrentTab("booking")} 
              onAboutClick={() => setCurrentTab("about")} 
            />
            <SocialLinks />
          </>
        );
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0A0A0C] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#E31B23] selection:text-white bg-fixed bg-cover bg-center bg-no-repeat relative" 
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 12, 0.94), rgba(10, 10, 12, 0.98)), url('${yellowRamTrxBackground}')`
      }}
      id="main_app_layout"
    >
      
      {/* 1. Logo-Themed Navigation Header */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* 2. Dynamic Content Segment with slide-up transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Universal Pre-Footer: Logo / Quick-actions */}
      {currentTab !== "booking" && currentTab !== "admin" && (
        <div className="bg-[#0F0F14] border-t border-white/10 py-16" id="app_pre_footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Is Your Car Ready For Extreme Climate?
            </h3>
            <p className="text-sm text-white/60 max-w-lg mx-auto italic">
              Ensure your coolant flows, AC systems blow cold, and computer controllers show zero codes. Book your slot today!
            </p>
            <button
              onClick={() => {
                setCurrentTab("booking");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-[#E31B23] hover:bg-[#ff3b43] text-white text-xs font-black tracking-tighter uppercase rounded-lg transition-all shadow-[0_5px_15px_rgba(227,27,35,0.3)] cursor-pointer"
              id="pre_footer_book_btn"
            >
              <span>Schedule Service Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Elegant, Fully Detailed Logo Theme Footer */}
      <footer className="bg-[#070709]/95 text-white/50 border-t border-white/5 py-16 text-sm backdrop-blur-md" id="app_footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Logo, Slogan, and social gears */}
            <div className="space-y-4 col-span-1 md:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Cog className="w-8 h-8 text-[#E31B23] stroke-[1.5]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-wider text-white uppercase leading-none">EXPERTS</span>
                  <span className="text-[9px] text-[#E31B23] font-mono tracking-widest uppercase mt-0.5">AUTOMOTIVE</span>
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed pt-2">
                Doha&apos;s elite automotive service center matching brand dealership precision at independent workshop values.
              </p>
              
              {/* Footer Social Media links */}
              <div className="flex items-center space-x-2.5 pt-4" id="footer_socials_row">
                <div 
                  className="p-2 bg-white/5 border border-white/5 rounded-lg text-white/30 cursor-help"
                  title="Instagram (Coming Soon)"
                >
                  <Instagram className="w-4 h-4" />
                </div>
                <div 
                  className="p-2 bg-white/5 border border-white/5 rounded-lg text-white/30 cursor-help"
                  title="Snapchat (Coming Soon)"
                >
                  <Ghost className="w-4 h-4" />
                </div>
                <a 
                  href="https://www.facebook.com/share/1Cph5nrsUg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-[#E31B23] hover:text-white border border-white/5 hover:border-[#E31B23]/20 rounded-lg text-white/50 transition-all duration-300"
                  title="Follow us on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.tiktok.com/@experts.automotiv?_r=1&_t=ZS-97a5o5dh6Ie" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-[#E31B23] hover:text-white border border-white/5 hover:border-[#E31B23]/20 rounded-lg text-white/50 transition-all duration-300"
                  title="Follow us on TikTok"
                >
                  <Video className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links navigation */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest text-white uppercase border-b border-white/5 pb-2">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => { setCurrentTab("home"); scrollToTop(); }}
                    className="hover:text-[#E31B23] transition-colors cursor-pointer"
                  >
                    Home Operations
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab("booking"); scrollToTop(); }}
                    className="hover:text-[#E31B23] transition-colors font-bold text-white/80 cursor-pointer"
                  >
                    Schedule Service Appt
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab("about"); scrollToTop(); }}
                    className="hover:text-[#E31B23] transition-colors cursor-pointer"
                  >
                    About Experts
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab("admin"); scrollToTop(); }}
                    className="hover:text-[#E31B23] transition-colors text-white/30 cursor-pointer"
                  >
                    Operations Management
                  </button>
                </li>
              </ul>
            </div>

            {/* Branches / Location anchors */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest text-white uppercase border-b border-white/5 pb-2">
                Our Stations
              </h4>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#E31B23] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">Main Branch</span>
                    <a 
                      href="https://maps.app.goo.gl/UPrV7fg5f9HXbN9D7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-[#E31B23] transition-colors"
                    >
                      Street 8, qatar
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Direct Contacts & Shifts */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest text-white uppercase border-b border-white/5 pb-2">
                Help &amp; Operations
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#E31B23]" />
                  <a 
                    href="https://wa.me/97430038280" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#E31B23] transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#E31B23]" />
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors break-all">{CONTACT_INFO.email}</a>
                </li>
                <li className="flex items-start space-x-2 pt-2 text-[11px] text-white/30 leading-relaxed">
                  <Clock className="w-4 h-4 text-[#E31B23] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/50 font-semibold block">{WORKING_HOURS.days}</span>
                    <span>{WORKING_HOURS.morning} &amp; {WORKING_HOURS.evening}</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Lower Copyright Row */}
          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30" id="copyright_row">
            <div>
              &copy; {new Date().getFullYear()} Experts Automotive Center. All Rights Reserved. Doha, Qatar.
            </div>
            <button
              onClick={scrollToTop}
              className="p-2.5 bg-black/40 hover:bg-[#E31B23] text-white/40 hover:text-white border border-white/10 hover:border-[#E31B23] rounded-full transition-all cursor-pointer"
              title="Scroll back to top"
              id="footer_scroll_top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
