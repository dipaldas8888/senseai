export interface WorkExperience {
  jobTitle: string;
  company: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  grade?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  keyStrengths: string[];
  certifications: Certification[];
  targetRole: string;
}

export type TemplateId = "classic" | "modern" | "minimal";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  accent: string; // CSS color for preview card border
}

export const TEMPLATES: Template[] = [
  { id: "classic", name: "Classic", description: "Clean single-column, ATS-friendly", accent: "#6366f1" },
  { id: "modern", name: "Modern", description: "Dark header bar, bold typography", accent: "#0ea5e9" },
  { id: "minimal", name: "Minimal", description: "Ultra-clean with thin dividers", accent: "#10b981" },
];

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

export const EMPTY_EXPERIENCE: WorkExperience = {
  jobTitle: "", company: "", location: "",
  startMonth: "", startYear: "", endMonth: "", endYear: "",
  current: false, description: "",
};

export const EMPTY_EDUCATION: Education = {
  degree: "", institution: "", location: "",
  startYear: "", endYear: "", grade: "",
};

export const EMPTY_CERTIFICATION: Certification = {
  name: "", issuer: "", year: "",
};

export const DEFAULT_FORM: ResumeFormData = {
  fullName: "", email: "", phone: "", location: "",
  linkedin: "", website: "", summary: "",
  experience: [{ ...EMPTY_EXPERIENCE }],
  education: [{ ...EMPTY_EDUCATION }],
  skills: [], keyStrengths: [], certifications: [],
  targetRole: "",
};
