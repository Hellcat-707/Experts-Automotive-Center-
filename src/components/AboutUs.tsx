import React from "react";
import { CheckCircle2, Award, Shield, Cpu, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import expertsAutomotiveFacade from "../assets/images/experts_real_facade_1783007471474.jpg";

export default function AboutUs() {
  const values = [
    {
      icon: Cpu,
      title: "State-of-the-Art Diagnostics",
      desc: "We utilize advanced, dealer-level digital diagnostic computers and scanning systems to pinpoint automotive electrical and mechanical faults immediately."
    },
    {
      icon: Shield,
      title: "Qatar Climate Engineering",
      desc: "Specialized tuning for local climate demands, ensuring your radiators, engines, cabin AC systems, and oil viscosity are fully prepared for extreme summer temperatures."
    },
    {
      icon: Award,
      title: "Elite Certified Technicians",
      desc: "Our workshop is staffed by certified, highly experienced mechanics who treat every vehicle with the utmost precision, from sport coupes to daily SUVs."
    }
  ];

  return (
    <div className="bg-[#0A0A0C] text-[#E0E0E0] py-24 border-b border-white/10 font-sans" id="about_us_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-16 justify-center" id="about_header">
          <div className="w-2 h-6 bg-[#E31B23] rounded-full"></div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            About Experts Automotive Center
          </h2>
        </div>

        {/* Narrative & Image Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about_narrative_grid">
          
          {/* Narrative Content */}
          <div className="space-y-6" id="about_narrative_text">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
              We Don&apos;t Just Service Cars. <br />
              <span className="text-[#E31B23]">We Master Precision.</span>
            </h3>
            
            <p className="text-white/70 text-sm sm:text-base leading-relaxed italic">
              At Experts Automotive Center, we have established our reputation as Doha&apos;s leading independent garage facility. Operating from our premium headquarters, we offer a standard of excellence that rivals certified brand dealerships, combined with personalized customer service and transparent rates.
            </p>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Whether you are scheduling deep electronic diagnostics or bringing your car to our <span className="text-[#E31B23] font-semibold">Main Branch</span> in the Industrial Area for regular fast-track servicing, our technical experts combine years of hands-on experience with modern automotive scanners to deliver flawless results.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#E31B23] shrink-0" />
                <span className="text-sm font-semibold text-white/80">100% Transparent Diagnostic Reports &amp; Invoicing</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#E31B23] shrink-0" />
                <span className="text-sm font-semibold text-white/80">Genuine OEM-spec Filters, Fluids, and Mechanical Spares</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#E31B23] shrink-0" />
                <span className="text-sm font-semibold text-white/80">Swift Service Turnaround to Minimize Your Downtime</span>
              </div>
            </div>
          </div>

          {/* Premium Image with Accent Border */}
          <div className="relative group" id="about_image_wrapper">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#E31B23] to-white/10 rounded-2xl blur opacity-25 group-hover:opacity-45 transition duration-1000" />
            <div className="relative bg-[#16161D] border border-white/10 p-2 rounded-2xl overflow-hidden">
              <img
                src={expertsAutomotiveFacade}
                alt="Experts Automotive Center Workshop Facade in Doha, Qatar"
                className="w-full h-auto rounded-xl object-cover filter brightness-100 transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
                id="about_story_image"
              />
              <div className="absolute bottom-6 right-6 bg-[#E31B23] text-white font-black tracking-widest text-[10px] uppercase py-2 px-4 rounded transition-all shadow-lg">
                DOHA, QATAR
              </div>
            </div>
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24" id="about_features_grid">
          {values.map((v, i) => (
            <div 
              key={i} 
              className="bg-[#16161D]/90 border border-white/5 rounded-2xl p-8 hover:border-[#E31B23]/30 transition-all duration-300 relative overflow-hidden group shadow-xl backdrop-blur-sm"
              id={`about_value_card_${i}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E31B23]/5 blur-[60px] rounded-full pointer-events-none" />
              <div className="p-3 bg-[#E31B23]/10 border border-[#E31B23]/20 rounded-xl w-fit mb-6">
                <v.icon className="w-6 h-6 text-[#E31B23]" />
              </div>
              <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-3 group-hover:text-[#E31B23] transition-colors">
                {v.title}
              </h4>
              <p className="text-sm text-white/60 leading-relaxed italic">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
