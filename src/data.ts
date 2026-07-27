import { Branch, ServiceType } from "./types";
import yellowCorvetteRaw from "./assets/images/yellow_corvette_no_plate_1782747769365.jpg";
import ramBrakeRepair from "./assets/images/ram_brake_repair_1782984093047.jpg";
import whiteBmwRepair from "./assets/images/white_bmw_no_plate_1782747785182.jpg";
import mercedesSuvRepair from "./assets/images/mercedes_suv_no_plate_1782748101222.jpg";
import classicApacheRestoration from "./assets/images/classic_apache_no_plate_1782748118711.jpg";
import jeepSrtRepair from "./assets/images/jeep_srt_no_plate_1782748087086.jpg";
import mustangCoyoteDyno from "./assets/images/mustang_no_dyno_1782984106801.jpg";
import shelbyGT500Service from "./assets/images/mustang_no_guy_1782984119292.jpg";
import dodgeChallengerRepair from "./assets/images/challenger_empty_wall_1782984130165.jpg";
import dodgeRamTrxRepair from "./assets/images/dodge_ram_no_plate_1782748164514.jpg";

export const CONTACT_INFO = {
  phone: "+974 30038280",
  email: "expertsautomotive3@gmail.com",
};

export const WORKING_HOURS = {
  days: "Saturday – Thursday",
  morning: "8:30 AM – 1:00 PM",
  evening: "4:00 PM – 8:30 PM",
  closed: "Friday",
};

export const BRANCHES: Branch[] = [
  {
    id: "main",
    name: "Main Branch",
    address: "Street 8, qatar",
    mapsLink: "https://maps.app.goo.gl/UPrV7fg5f9HXbN9D7",
    description: "Our comprehensive, state-of-the-art diagnostic, overhaul, and engineering facility equipped for heavy engine, transmission, and electronic repairs.",
  }
];

export const SERVICE_CATEGORIES: { id: ServiceType; label: string; description: string; priceEstimate: string }[] = [
  {
    id: "Full Inspection & Diagnosis",
    label: "Full Inspection & Diagnosis",
    description: "Complete vehicle digital scanning, multi-point bumper-to-bumper checkup, and expert fault finding.",
    priceEstimate: "Comprehensive Report",
  },
  {
    id: "Quick Oil & Filter Service",
    label: "Quick Oil & Filter Service",
    description: "Premium synthetic oil replacement, high-performance filter installation, and fluid level top-off.",
    priceEstimate: "Fast-track Service",
  },
  {
    id: "Brakes & Suspension Repair",
    label: "Brakes & Suspension Repair",
    description: "Carbon-ceramic/metallic pad replacements, caliper servicing, disc resurfacing, and suspension alignment.",
    priceEstimate: "Expert Safety Tuning",
  },
  {
    id: "Engine Tune-up & Repair",
    label: "Engine Tune-up & Repair",
    description: "Spark plug replacements, fuel system purging, valve tuning, and full-scale electrical and mechanical repairs.",
    priceEstimate: "High-performance tuning",
  },
  {
    id: "AC & Cooling System Service",
    label: "AC & Cooling System Service",
    description: "Refrigerant refilling, condenser leak checks, cabin filter cleaning, and high-temperature cooling analysis.",
    priceEstimate: "Qatar Climate Prep",
  },
  {
    id: "Transmission Service",
    label: "Transmission Service",
    description: "Automatic/DCT clutch adjustments, transmission fluid changes, gear system overhauls, and shift optimization.",
    priceEstimate: "Precision Engineering",
  },
  {
    id: "Electrical Systems Diagnostic",
    label: "Electrical Systems Diagnostic",
    description: "Wiring harness inspection, starter/alternator repairs, battery diagnostics, and engine control unit reprogram.",
    priceEstimate: "Advanced Electronics",
  },
  {
    id: "Tire & Wheel Alignment",
    label: "Tire & Wheel Alignment",
    description: "Laser wheel alignment, digital tire balancing, and dynamic safety inspects to optimize high-speed control.",
    priceEstimate: "Optimal Road Grip",
  }
];

export const GALLERY_ITEMS = [
  {
    id: "img1",
    src: yellowCorvetteRaw,
    alt: "Yellow Chevrolet Corvette C7",
  },
  {
    id: "img2",
    src: ramBrakeRepair,
    alt: "Red Ram Pickup Brake & Mechanical Repair",
  },
  {
    id: "img3",
    src: whiteBmwRepair,
    alt: "White BMW M235i Convertible Repair",
  },
  {
    id: "img4",
    src: mercedesSuvRepair,
    alt: "Grey Mercedes-Benz SUV Fluid & Coolant Service",
  },
  {
    id: "img5",
    src: classicApacheRestoration,
    alt: "Classic Chevrolet Apache Restoration",
  },
  {
    id: "img6",
    src: jeepSrtRepair,
    alt: "Silver Jeep Grand Cherokee SRT Performance Tuning",
  },
  {
    id: "img7",
    src: mustangCoyoteDyno,
    alt: "Grey Ford Mustang Coyote V8 in Workshop",
  },
  {
    id: "img9",
    src: shelbyGT500Service,
    alt: "Blue Ford Mustang Shelby GT500 Precision Diagnostics",
  },
  {
    id: "img10",
    src: dodgeChallengerRepair,
    alt: "Red Dodge Challenger SRT Widebody Service",
  },
  {
    id: "img12",
    src: dodgeRamTrxRepair,
    alt: "Black Dodge Ram 1500 TRX Off-Road Diagnostics",
  }
];
