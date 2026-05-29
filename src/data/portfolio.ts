import type { Project, Experience, Skill } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    title: 'Dishoom University Web Platform',
    description:
      'Built and optimized a scalable frontend system for Dishoom University, improving page load speed by 30% and significantly enhancing user engagement through modular React components.',
    tech: ['React', 'Next.js', 'TypeScript', 'CSS'],
  },
  {
    id: '2',
    title: 'Codeathon – The Big Alliance (Fitch Ratings)',
    description:
      'Delivered a full-stack MVP for The Big Alliance in a 72-hour sprint. Optimized API queries and database performance using Next.js, TypeScript, Prisma, MySQL, and PayPal integration.',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'MySQL', 'PayPal'],
    githubUrl: '#',
  },
  {
    id: '3',
    title: 'SpectraPass LLC – Multi-Portal System',
    description:
      'Developed mass spectrometry-based testing portals (lab, admin, customer, enterprise) for airlines, universities, and hotels. Includes QR-based access management and vaccination tracking.',
    tech: ['React', 'Python', 'PostgreSQL', 'AWS'],
  },
  {
    id: '4',
    title: 'Reveiled – Bridal Peer-to-Peer Marketplace',
    description:
      'Feature-rich e-commerce marketplace for sustainable bridal fashion resale. Delivered 24+ unique screens, high-fidelity prototypes, and scalable architecture promoting a circular economy.',
    tech: ['React', 'Python', 'PostgreSQL', 'AWS'],
  },
  {
    id: '5',
    title: 'Travel Websites',
    description:
      'Delivered 10+ high-performance custom travel portals with responsive designs and SEO optimisation, improving booking conversion rates by 35% and boosting organic traffic.',
    tech: ['React', 'Next.js', 'Figma', 'SEO'],
  },
  {
    id: '6',
    title: 'Online Blood Bank Management System',
    description:
      'Built a full platform connecting blood donors with hospitals, featuring integrated SMS notifications for real-time alerts and streamlined donor management.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'AJAX'],
  },
]

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Dishoom Limited',
    role: 'Frontend Developer (Contract)',
    period: 'May 2023 – Mar 2025',
    location: 'Shoreditch, London',
    description: [
      "Built and optimized a scalable frontend for Dishoom University's web platform, improving load speed by 30% and enhancing user engagement.",
      'Collaborated with design teams on design-to-production workflows to ensure seamless UI consistency.',
      'Delivered modular and reusable React components for long-term scalability.',
    ],
  },
  {
    id: '2',
    company: 'Gurzu Inc',
    role: 'Software Engineer',
    period: 'Aug 2021 – Jan 2023',
    location: 'Lalitpur, Nepal',
    description: [
      'Developed and integrated multi-portal applications (lab, admin, customer, enterprise) for SpectraPass LLC, streamlining mass spectrometry workflows.',
      'Built and deployed an enterprise-level vaccination tracking tool, generating additional revenue streams.',
      'Engineered IoT integrations to process and display health and fitness metrics in real-time.',
      'Designed and developed Reveiled, a peer-to-peer bridal marketplace with 24+ unique screens and scalable architecture.',
      'Optimized UX for a peer-to-peer wedding marketplace, increasing engagement by 40%.',
    ],
  },
  {
    id: '3',
    company: 'Spyders Lab Private Limited',
    role: 'Frontend Developer / Designer',
    period: 'May 2018 – Aug 2021',
    location: 'Kathmandu, Nepal',
    description: [
      'Designed mockups and wireframes in Figma and translated them into production-ready code.',
      'Delivered 10+ custom travel websites, improving booking conversion rates by 35%.',
      'Implemented SEO-friendly architecture that significantly boosted organic traffic.',
    ],
  },
  {
    id: '4',
    company: 'NCT Soft Private Limited',
    role: 'Frontend Developer Intern → Frontend Developer',
    period: 'Dec 2016 – Apr 2018',
    location: 'Kathmandu, Nepal',
    description: [
      'Built an Online Blood Bank Management System with integrated SMS notifications for donors and hospitals.',
      'Reduced development cycle time by 15% through efficient team collaboration.',
      'Translated stakeholder requirements into actionable, production-ready solutions.',
    ],
  },
]

export const skills: Skill[] = [
  {
    category: 'Frontend',
    items: ['JavaScript', 'TypeScript', 'ReactJS', 'Next.js', 'HTML/CSS', 'SCSS/SASS', 'Redux', 'TanStack Query'],
  },
  {
    category: 'Backend & Databases',
    items: ['Node.js', 'Express.js', 'Python', 'Prisma ORM', 'MongoDB', 'PostgreSQL', 'MySQL'],
  },
  {
    category: 'AI & Automation',
    items: ['Python', 'Automation', 'AI/ML', 'LLMs', 'Prompt Engineering', 'Scripting'],
  },
  {
    category: 'Tools & Platforms',
    items: ['Git', 'GitHub/GitLab', 'Figma', 'AWS', 'CI/CD', 'Jira', 'Webflow', 'WordPress'],
  },
]
