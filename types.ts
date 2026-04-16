
export interface WorkItem {
  title: string;
  employer: string;
  location?: string;
  start_date: string;
  end_date?: string;
  achievements?: string[];
  tech_stack?: string[];
}

export interface Project {
  name: string;
  link?: string;
  description?: string[];
  tech_stack?: string[];
}

export interface Education {
  degree: string;
  discipline?: string;
  institution?: string;
  graduation_date?: string;
  gpa?: string;
  coursework_highlights?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  show_credential_id?: boolean;
  show_credential_url?: boolean;
}

export interface Language {
  language: string;
  proficiency?: 'Basic' | 'Conversational' | 'Professional' | 'Native';
}

export interface Award {
  name?: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface Publication {
    title?: string;
    venue?: string;
    link?: string;
    date?: string;
    highlight?: string;
}

export interface Volunteering {
    name?: string;
    organization?: string;
    date?: string;
    description?: string;
}

export interface Resume {
  avatar_url?: string;
  full_name: string;
  email: string;
  phone: string;
  city?: string;
  state_region?: string;
  country: string;
  linkedin_url?: string;
  portfolio_url?: string;
  personal_site_url?: string;
  target_role_title: string;
  seniority_level?: 'Intern' | 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Manager' | 'Director' | 'VP' | 'CXO';
  job_family: 'Software & IT' | 'Data & Analytics' | 'Product & Program' | 'Design & Creative' | 'Sales & Marketing' | 'Customer Success & Support' | 'Finance & Accounting' | 'HR & Talent' | 'Operations & Supply Chain' | 'Core Engineering' | 'Healthcare & Life Sciences' | 'Education & Training' | 'Legal & Compliance' | 'Admin & Office';
  role_keywords?: string[];
  summary: string;
  work_experience: WorkItem[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  skills_core: string[];
  skills_tools: string[];
  skills_soft: string[];
  awards: Award[];
  publications: Publication[];
  volunteering: Volunteering[];
  languages: Language[];
  work_authorization?: string;
  clearance?: string;
  relocation?: boolean;
  remote_preference?: 'Remote' | 'Hybrid' | 'Onsite';
}

export type Template = 'A' | 'B' | 'C' | 'D';

export const TEMPLATE_OPTIONS: { value: Template; label: string }[] = [
  { value: 'A', label: 'Classic ATS' },
  { value: 'B', label: 'Tech Impact' },
  { value: 'C', label: 'Modern Pro' },
  { value: 'D', label: 'Prime ATS' },
];
