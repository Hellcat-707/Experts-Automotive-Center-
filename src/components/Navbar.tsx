import React, { useState } from "react";
import { Cog, Menu, X, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "booking", label: "Book Service" },
    { id: "about", label: "About Us" },
    { id: "admin", label: "Management", icon: ShieldAlert },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0F0F12]/85 border-b border-white/10 backdrop-blur-md" id="app_navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand matching the image */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => handleNavClick("home")}
            id="navbar_logo_container"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="text-neutral-400 group-hover:text-[#E31B23] transition-colors duration-300"
              >
                <Cog className="w-9 h-9 stroke-[1.5]" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-[#E31B23] rounded-full shadow-[0_0_8px_#E31B23]" />
              </div>
            </div>
            
            <div className="flex flex-col select-none">
              <div className="font-sans font-black text-base tracking-tighter uppercase leading-none">
                <span className="text-white">EXPERTS </span>
                <span className="text-[#E31B23]">AUTOMOTIVE</span>
              </div>
              <span className="text-[9px] text-white/40 font-mono tracking-[0.2em] uppercase mt-1">
                CENTER
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" id="desktop_nav_links">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav_link_${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center space-x-1.5 cursor-pointer ${
                  currentTab === item.id
                    ? "text-[#E31B23] bg-white/5 border border-[#E31B23]/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5 text-[#E31B23]/80" />}
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => handleNavClick("booking")}
              className="ml-4 px-5 py-2 bg-[#E31B23] hover:bg-[#ff3b43] text-white text-[10px] font-black tracking-wider uppercase rounded transition-all duration-300 shadow-[0_0_15px_rgba(227,27,35,0.35)] cursor-pointer"
              id="nav_book_button"
            >
              Book Appt
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden" id="mobile_menu_trigger_container">
            <button
              id="mobile_menu_toggle_button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/60 hover:text-white hover:bg-white/5 border border-white/10"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="md:hidden bg-[#0F0F12] border-b border-white/10 px-2 pt-2 pb-4 space-y-1 sm:px-3" id="mobile_nav_panel">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile_nav_link_${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                currentTab === item.id
                  ? "text-[#E31B23] bg-white/5 border-l-4 border-[#E31B23]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 text-[#E31B23]" />}
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-4 px-4">
            <button
              onClick={() => handleNavClick("booking")}
              className="w-full py-3 bg-[#E31B23] hover:bg-[#ff3b43] text-white text-xs font-black tracking-widest uppercase rounded transition-all text-center shadow-[0_0_15px_rgba(227,27,35,0.35)] cursor-pointer"
              id="mobile_nav_book_button"
            >
              Book Service Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
