import React from "react";
import { Phone, Mail, Clock, MapPin, Calendar, Compass, ArrowRight, ExternalLink, Cog } from "lucide-react";
import { BRANCHES, CONTACT_INFO, WORKING_HOURS } from "../data";
import { motion } from "motion/react";
import yellowRamTrxBackground from "../assets/images/yellow_ram_trx_no_words_facade_1783174842264.jpg";

interface HeroProps {
  onBookClick: () => void;
  onAboutClick: () => void;
}

export default function Hero({ onBookClick, onAboutClick }: HeroProps) {
  return (
    <div className="bg-[#0A0A0C] text-[#E0E0E0] flex flex-col font-sans" id="app_hero_section">
      {/* 1. Main Hero Presentation Banner */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={yellowRamTrxBackground}
            alt="Experts Automotive Center Garage Banner"
            className="w-full h-full object-cover opacity-70 filter brightness-[0.9] scale-102"
            referrerPolicy="no-referrer"
            id="hero_bg_image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C]/50 via-transparent to-[#0A0A0C]/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-16 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Logo Gear Emblem */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex justify-center items-center"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              {/* Outer Gear Outline representation using styling */}
              <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-2 border-2 border-[#E31B23] rounded-full" />
              <div className="absolute inset-4 bg-[#0F0F12]/90 rounded-full shadow-inner flex flex-col items-center justify-center border border-white/10">
                <span className="text-[#E31B23] font-black text-[11px] tracking-widest uppercase">EXPERTS</span>
                <span className="text-white text-[8px] tracking-[0.25em] uppercase">AUTO</span>
              </div>
            </div>
          </motion.div>

          {/* Core Brand Headlines */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-tight"
            id="hero_main_title"
          >
            <span className="text-white block">EXPERTS</span>
            <span className="text-[#E31B23] block mt-1">AUTOMOTIVE CENTER</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 max-w-2xl text-sm sm:text-base text-white/70 italic font-sans leading-relaxed"
            id="hero_sub_title"
          >
            Precision engineering, state-of-the-art computer diagnostics, and reliable maintenance. 
            Keep your high-performance or luxury vehicle running in perfect Qatar climate conditions.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            id="hero_cta_actions"
          >
            <button
              onClick={onBookClick}
              className="px-8 py-4 bg-[#E31B23] hover:bg-[#ff3b43] text-white font-black uppercase tracking-tighter text-xs rounded transition-all duration-300 shadow-[0_5px_20px_rgba(227,27,35,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
              id="hero_cta_book"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={onAboutClick}
              className="px-8 py-4 bg-[#16161D]/80 hover:bg-white/5 text-white font-bold tracking-widest text-xs uppercase rounded border border-white/10 transition-all duration-300 cursor-pointer"
              id="hero_cta_about"
            >
              Explore Our Facility
            </button>
          </motion.div>
        </div>
      </div>

      {/* 2. Branches, Working Hours & Contacts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full" id="branches_info_grid_container">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-2 h-6 bg-[#E31B23] rounded-full"></div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white" id="hero_branches_heading">
            STATIONS &amp; OPERATION HOURS
          </h2>
        </div>

        {/* 2 Grid layout: Main Branch, Working hours + contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Main Branch */}
          <div className="bg-[#16161D]/90 border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300 group shadow-md backdrop-blur-sm" id="branch_card_main">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-[#E31B23]/10 border border-[#E31B23]/20 rounded-xl">
                  <Cog className="w-6 h-6 text-[#E31B23]" />
                </div>
                <span className="text-[10px] font-mono tracking-widest bg-white/5 text-white/50 border border-white/10 px-2 py-1 rounded">HEADQUARTERS</span>
              </div>
              
              <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#E31B23] transition-colors">Main Branch</h3>
              <p className="text-sm text-white/70 italic mt-4 leading-relaxed">
                Our central service headquarters, engineered for complete electronic diagnosis, transmission tuning, and heavy mechanical repair works.
              </p>
              
              <div className="mt-6 flex items-start space-x-3 text-sm text-neutral-300">
                <MapPin className="w-5 h-5 text-[#E31B23]/70 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Main Facility - Industrial area</p>
                  <p className="text-xs text-white/40 mt-1">Street 8, qatar</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://maps.app.goo.gl/UPrV7fg5f9HXbN9D7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-black/40 hover:bg-[#E31B23] text-[#E31B23] hover:text-white border border-[#E31B23]/30 hover:border-[#E31B23] text-xs font-black tracking-widest uppercase transition-all duration-300 rounded cursor-pointer"
                id="main_branch_maps_btn"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            </div>
          </div>

          {/* Operations Hours and Contacts Card */}
          <div className="bg-gradient-to-b from-[#1E1E26]/95 to-[#16161D]/95 border-l-4 border-[#E31B23] rounded-r-2xl border-t border-r border-b border-white/5 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-sm" id="branch_card_hours">
            {/* Ambient Red glow background effect */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#E31B23]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white border-b border-white/10 pb-4 mb-6 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#E31B23]" />
                <span>Working Hours</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-white/40 uppercase tracking-wider font-bold">Operation Days:</span>
                  <span className="font-bold text-white text-xs">{WORKING_HOURS.days}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-white/40 uppercase tracking-wider font-bold">Morning Shift:</span>
                  <span className="font-bold text-white text-xs">{WORKING_HOURS.morning}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-white/40 uppercase tracking-wider font-bold">Evening Shift:</span>
                  <span className="font-bold text-white text-xs">{WORKING_HOURS.evening}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2">
                  <span className="text-white/40 uppercase tracking-wider font-bold">Weekend / Holiday:</span>
                  <span className="font-black text-[#E31B23] uppercase text-[10px] tracking-widest font-mono bg-white/5 px-2 py-0.5 rounded border border-[#E31B23]/20">{WORKING_HOURS.closed} Closed</span>
                </div>
              </div>

              <h3 className="text-lg font-bold uppercase tracking-tight text-white border-b border-white/10 pb-4 mt-8 mb-6 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-[#E31B23]" />
                <span>Contact Details</span>
              </h3>

              <div className="space-y-4">
                <a
                  href="https://wa.me/97430038280"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded bg-black/40 border border-white/10 hover:border-[#E31B23]/40 transition-colors group cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#E31B23] group-hover:scale-110 transition-transform" />
                  <div className="text-xs">
                    <p className="text-white/40 uppercase tracking-wider font-bold">Call / WhatsApp Support</p>
                    <p className="text-sm font-bold text-white mt-0.5">{CONTACT_INFO.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center space-x-3 p-3 rounded bg-black/40 border border-white/10 hover:border-[#E31B23]/40 transition-colors group cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#E31B23] group-hover:scale-110 transition-transform" />
                  <div className="text-xs">
                    <p className="text-white/40 uppercase tracking-wider font-bold">Email Enquiries</p>
                    <p className="text-sm font-bold text-[#E31B23] mt-0.5 break-all truncate">{CONTACT_INFO.email}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
