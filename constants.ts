
import { Resume, Template } from './types';

export const SENIORITY_LEVELS = ["Intern", "Entry", "Mid", "Senior", "Lead", "Manager", "Director", "VP", "CXO"];
export const JOB_FAMILIES = ["Software & IT", "Data & Analytics", "Product & Program", "Design & Creative", "Sales & Marketing", "Customer Success & Support", "Finance & Accounting", "HR & Talent", "Operations & Supply Chain", "Core Engineering", "Healthcare & Life Sciences", "Education & Training", "Legal & Compliance", "Admin & Office"];
export const REMOTE_PREFERENCES = ["Remote", "Hybrid", "Onsite"];
export const LANGUAGE_PROFICIENCY = ["Basic", "Conversational", "Professional", "Native"];

export const JOB_FAMILY_TEMPLATE_MAP: { [key: string]: Template } = {
  "Software & IT": "B",
  "Data & Analytics": "B",
  "Product & Program": "C",
  "Sales & Marketing": "C",
  "Healthcare & Life Sciences": "A",
  "Education & Training": "A",
  "Legal & Compliance": "A",
};

export const TARGET_ROLE_SUGGESTIONS: { [key: string]: string[] } = {
  "Software & IT": ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "QA Automation Engineer", "Site Reliability Engineer (SRE)", "IT Support Specialist", "Systems Administrator", "Cloud Engineer"],
  "Data & Analytics": ["Data Scientist", "Data Analyst", "Data Engineer", "Business Intelligence (BI) Analyst", "Machine Learning Engineer", "Database Administrator"],
  "Product & Program": ["Product Manager", "Technical Program Manager (TPM)", "Project Manager", "Program Manager", "Scrum Master", "Agile Coach"],
  "Design & Creative": ["UX/UI Designer", "Product Designer", "Graphic Designer", "User Researcher", "Content Strategist", "Motion Designer"],
  "Sales & Marketing": ["Account Executive", "Sales Development Representative (SDR)", "Marketing Manager", "Digital Marketing Specialist", "SEO Specialist", "Content Marketer", "Social Media Manager"],
  "Customer Success & Support": ["Customer Success Manager", "Technical Support Engineer", "Customer Support Representative", "Implementation Specialist"],
  "Finance & Accounting": ["Accountant", "Financial Analyst", "Controller", "Auditor", "Bookkeeper"],
  "HR & Talent": ["Human Resources (HR) Generalist", "Talent Acquisition Specialist", "Recruiter", "HR Manager", "Compensation & Benefits Analyst"],
  "Operations & Supply Chain": ["Operations Manager", "Supply Chain Analyst", "Logistics Coordinator", "Purchasing Manager"],
  "Core Engineering": ["Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Chemical Engineer"],
  "Healthcare & Life Sciences": ["Registered Nurse (RN)", "Medical Assistant", "Lab Technician", "Clinical Research Coordinator", "Pharmacist"],
  "Education & Training": ["Teacher", "Instructional Designer", "Corporate Trainer", "Academic Advisor"],
  "Legal & Compliance": ["Paralegal", "Compliance Officer", "Legal Assistant", "Contract Manager"],
  "Admin & Office": ["Executive Assistant", "Office Manager", "Administrative Assistant", "Receptionist"],
};


export const INITIAL_RESUME_DATA: Resume = {
    avatar_url: '',
    full_name: '',
    email: '',
    phone: '',
    country: 'India',
    target_role_title: '',
    job_family: 'Software & IT',
    summary: '',
    work_experience: [],
    education: [],
    skills_core: [],
    skills_tools: [],
    skills_soft: [],
    projects: [],
    certifications: [],
    awards: [],
    publications: [],
    volunteering: [],
    languages: [],
};


export const SAMPLE_RESUME_DATA: Resume = {
  avatar_url: '',
  full_name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  city: "Bengaluru",
  country: "India",
  linkedin_url: "https://www.linkedin.com/in/johndoe",
  portfolio_url: "https://github.com/johndoe",
  target_role_title: "Senior QA Automation Engineer",
  job_family: "Software & IT",
  seniority_level: "Senior",
  summary: "Accomplished QA Automation Engineer with over 8 years of experience in designing, developing, and implementing robust testing frameworks for complex web applications. Proven ability to reduce regression testing cycles by 35% and improve defect detection rates through strategic automation. Expert in JavaScript, Cypress, and Playwright, with a strong background in CI/CD pipeline integration.",
  skills_core: ["JavaScript", "TypeScript", "Cypress", "Playwright", "Selenium", "TestCafe"],
  skills_tools: ["Jenkins", "Docker", "AWS", "Git", "JIRA", "Postman"],
  skills_soft: ["Agile Methodologies", "Team Leadership", "Problem Solving", "Communication"],
  work_experience: [{
    title: "Senior QA Automation Engineer",
    employer: "Acme Innovations",
    location: "Bengaluru, India",
    start_date: "Jan 2021",
    end_date: "Present",
    achievements: [
      "Led the design and implementation of a new Cypress-based E2E testing framework for a flagship product, automating over 160 critical regression test cases and reducing the release cycle by 35%.",
      "Engineered a dynamic test data generation system, cutting down test setup time by 50% and enabling more comprehensive scenario coverage.",
      "Established and enforced coding standards for test automation, improving code maintainability and onboarding efficiency for new team members.",
      "Implemented a flaky-test triage process that lowered false-positive test failures by over 42%, increasing developer confidence in the CI pipeline."
    ],
    tech_stack: ["Cypress", "TypeScript", "Jenkins", "Docker"]
  }, {
    title: "QA Engineer",
    employer: "Tech Solutions Inc.",
    location: "Pune, India",
    start_date: "Jun 2016",
    end_date: "Dec 2020",
    achievements: [
      "Developed and maintained automated test scripts using Selenium WebDriver and Java, increasing test coverage by 80% over two years.",
      "Collaborated in a cross-functional Agile team, participating in sprint planning and providing continuous feedback on user stories.",
      "Performed API testing using Postman, identifying critical backend bugs before they reached production."
    ],
    tech_stack: ["Selenium", "Java", "JIRA", "Postman"]
  }],
  education: [{
    degree: "Bachelor of Technology (B.Tech)",
    discipline: "Computer Science and Engineering",
    institution: "National Institute of Technology, Trichy",
    graduation_date: "May 2016",
  }],
  projects: [],
  certifications: [],
  awards: [],
  publications: [],
  volunteering: [],
  languages: [{language: "English", proficiency: "Professional"}],
};
