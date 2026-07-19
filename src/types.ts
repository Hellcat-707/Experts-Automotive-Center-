export interface Booking {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  brand: string;
  model: string;
  year: number;
  serviceType: string;
  date: string;
  branch: string;
  notes: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export type ServiceType = 
  | "Full Inspection & Diagnosis"
  | "Quick Oil & Filter Service"
  | "Brakes & Suspension Repair"
  | "Engine Tune-up & Repair"
  | "AC & Cooling System Service"
  | "Transmission Service"
  | "Electrical Systems Diagnostic"
  | "Tire & Wheel Alignment";

export interface Branch {
  id: string;
  name: string;
  address: string;
  mapsLink: string;
  description: string;
}
