import React from "react";
import { Instagram, Facebook, Video, ArrowUpRight, MessageCircle, Ghost } from "lucide-react";
import { motion } from "motion/react";

export default function SocialLinks() {
  const socials = [
    {
      id: "instagram",
      name: "Instagram",
      handle: "@eac.qa",
      url: "https://www.instagram.com/eac.qa?igsh=MWk5N3N0d2lsb2x0bw%3D%3D&utm_source=qr",
      description: "Watch daily stories of supercar maintenance, engine builds, and diagnostics in action.",
      icon: Instagram,
      colorClass: "hover:border-[#E1306C]/40 group-hover:text-[#E1306C] text-[#E1306C]/80",
      glowColor: "rgba(225,48,108,0.15)",
      badge: "Official Page"
    },
    {
      id: "snapchat",
      name: "Snapchat",
      handle: "@eac.qa",
      url: "https://snapchat.com/t/woEsmmAQ",
      description: "Discover behind-the-scenes garage moments and real-time repair highlights on Snapchat.",
      icon: Ghost,
      colorClass: "hover:border-[#FFFC00]/40 group-hover:text-[#FFFC00] text-[#FFFC00]/80",
      glowColor: "rgba(255,252,0,0.1)",
      badge: "Snapchat Lens"
    },
    {
      id: "tiktok",
      name: "TikTok",
      handle: "@eac.qa",
      url: "https://www.tiktok.com/@eac.qa?_r=1&_t=ZS-98Lqznep4vl",
      description: "Catch short-form videos showing deep computer diagnostics and before-after transformations.",
      icon: Video,
      colorClass: "hover:border-[#00f2fe]/40 group-hover:text-[#00f2fe] text-[#00f2fe]/80",
      glowColor: "rgba(0,242,254,0.15)",
      badge: "Viral Shorts"
    },
    {
      id: "facebook",
      name: "Facebook",
      handle: "Experts Automotive Center",
      url: "https://www.facebook.com/share/1Cph5nrsUg/",
      description: "Read client testimonials, book service alerts, and find official announcements and branches.",
      icon: Facebook,
      colorClass: "hover:border-[#1877F2]/40 group-hover:text-[#1877F2] text-[#1877F2]/80",
      glowColor: "rgba(24,119,242,0.15)",
      badge: "Business Page"
    }
  ];

  return (
    <div className="bg-[#0A0A0C] text-[#E0E0E0] py-24 border-b border-white/10 font-sans" id="social_connect_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col items-center mb-16 text-center" id="social_connect_header">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-2 h-6 bg-[#E31B23] rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              CONNECT WITH EXPERTS
            </h2>
          </div>
          <p className="text-white/70 italic text-sm max-w-2xl font-sans">
            Follow our garages, view our live workshop reels, and chat with our team on Qatar&apos;s leading social networks.
          </p>
        </div>

        {/* Bento Grid layout of Socials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" id="socials_bento_grid">
          {socials.map((platform) => {
            const Icon = platform.icon;
            
            const cardContent = (
              <>
                {/* Dynamic Subtle Hover Glow effect */}
                <div 
                  className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: platform.glowColor }}
                />

                <div>
                  {/* Top row: Platform Brand Icon & Status badge */}
                  <div className="flex items-center justify-between mb-8">
                    <div className={`p-4 bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 group-hover:scale-105 ${platform.colorClass}`}>
                      <Icon className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    
                    <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-white/5 text-white/50 border border-white/5 px-2.5 py-1 rounded-full">
                      {platform.badge}
                    </span>
                  </div>

                  {/* Brand and handle details */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                      <span>{platform.name}</span>
                      {platform.url && (
                        <ArrowUpRight className="w-4 h-4 text-[#E31B23] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      )}
                    </h3>
                    <p className="text-xs font-mono text-[#E31B23]">
                      {platform.handle}
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed pt-3">
                      {platform.description}
                    </p>
                  </div>
                </div>

                {/* Bottom interactive action line */}
                <div className="mt-10 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                  <span>{platform.url ? "Follow Garage Page" : "Launching Soon"}</span>
                  {platform.url && <span className="text-[#E31B23] text-[10px] tracking-tight group-hover:translate-x-1 transition-transform">→</span>}
                </div>
              </>
            );

            if (platform.url) {
              return (
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={platform.id}
                  className="group bg-[#111115] border border-white/5 hover:border-white/10 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
                  }}
                  id={`social_card_${platform.id}`}
                >
                  {cardContent}
                </a>
              );
            } else {
              return (
                <div
                  key={platform.id}
                  className="group bg-[#111115] border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden opacity-60 hover:opacity-85 select-none"
                  style={{
                    boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
                  }}
                  id={`social_card_${platform.id}`}
                >
                  {cardContent}
                </div>
              );
            }
          })}
        </div>

        {/* WhatsApp direct floating action placeholder section */}
        <div className="mt-16 bg-gradient-to-r from-[#1E1E26] to-[#111115] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6" id="socials_whatsapp_box">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3.5 bg-green-950/20 border border-green-900/40 text-green-400 rounded-xl">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Need Instantly Swift Assistance?</h4>
              <p className="text-xs text-white/60">Our mechanics and consultants are active on WhatsApp 24/7 during business hours.</p>
            </div>
          </div>
          <a
            href="https://wa.me/97430038280"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#E31B23] hover:bg-[#ff3b43] text-white text-xs font-black tracking-wider uppercase rounded-lg transition-all shadow-[0_4px_12px_rgba(227,27,35,0.3)] shrink-0 cursor-pointer"
            id="whatsapp_direct_social_link"
          >
            Chat With Advisor
          </a>
        </div>

      </div>
    </div>
  );
}
