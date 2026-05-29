import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database from CV...')

  // Clear existing data
  await prisma.project.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.about.deleteMany()
  console.log('✓ Cleared existing records')

  // Projects
  await prisma.project.createMany({
    data: [
      {
        title: 'Dishoom University Web Platform',
        description: 'Built and optimized a scalable frontend system for Dishoom University, improving page load speed by 30% and significantly enhancing user engagement through modular React components.',
        tech: ['React', 'Next.js', 'TypeScript', 'CSS'],
        status: 'published',
        order: 1,
      },
      {
        title: 'Codeathon – The Big Alliance (Fitch Ratings)',
        description: 'Delivered a full-stack MVP for The Big Alliance in a 72-hour sprint. Optimized API queries and database performance using Next.js, TypeScript, Prisma, MySQL, and PayPal integration.',
        tech: ['Next.js', 'TypeScript', 'Prisma', 'MySQL', 'PayPal'],
        githubUrl: 'https://github.com/Shady-Prakash',
        status: 'published',
        order: 2,
      },
      {
        title: 'SpectraPass LLC – Multi-Portal System',
        description: 'Developed mass spectrometry-based testing portals (lab, admin, customer, enterprise) for airlines, universities, and hotels. Includes QR-based access management and vaccination tracking.',
        tech: ['React', 'Python', 'PostgreSQL', 'AWS'],
        status: 'published',
        order: 3,
      },
      {
        title: 'Reveiled – Bridal Peer-to-Peer Marketplace',
        description: 'Feature-rich e-commerce marketplace for sustainable bridal fashion resale. Delivered 24+ unique screens, high-fidelity prototypes, and scalable architecture promoting a circular economy.',
        tech: ['React', 'Python', 'PostgreSQL', 'AWS'],
        status: 'published',
        order: 4,
      },
      {
        title: 'Travel Websites',
        description: 'Delivered 10+ high-performance custom travel portals with responsive designs and SEO optimisation, improving booking conversion rates by 35% and boosting organic traffic.',
        tech: ['React', 'Next.js', 'Figma', 'SEO'],
        status: 'published',
        order: 5,
      },
      {
        title: 'Online Blood Bank Management System',
        description: 'Built a full platform connecting blood donors with hospitals, featuring integrated SMS notifications for real-time alerts and streamlined donor management.',
        tech: ['PHP', 'MySQL', 'JavaScript', 'AJAX'],
        status: 'published',
        order: 6,
      },
    ],
  })
  console.log('✓ Created 6 projects')

  // Experience
  await prisma.experience.createMany({
    data: [
      {
        company: 'Dishoom Limited',
        role: 'Frontend Developer (Contract)',
        period: 'May 2023 – Mar 2025',
        location: 'Shoreditch, London',
        description: [
          "Built and optimized a scalable frontend for Dishoom University's web platform, improving load speed by 30% and enhancing user engagement.",
          'Collaborated with design teams on design-to-production workflows to ensure seamless UI consistency.',
          'Delivered modular and reusable React components for long-term scalability.',
        ],
        status: 'published',
        order: 1,
      },
      {
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
        status: 'published',
        order: 2,
      },
      {
        company: 'Spyders Lab Private Limited',
        role: 'Frontend Developer / Designer',
        period: 'May 2018 – Aug 2021',
        location: 'Kathmandu, Nepal',
        description: [
          'Designed mockups and wireframes in Figma and translated them into production-ready code.',
          'Delivered 10+ custom travel websites, improving booking conversion rates by 35%.',
          'Implemented SEO-friendly architecture that significantly boosted organic traffic.',
        ],
        status: 'published',
        order: 3,
      },
      {
        company: 'NCT Soft Private Limited',
        role: 'Frontend Developer Intern → Frontend Developer',
        period: 'Dec 2016 – Apr 2018',
        location: 'Kathmandu, Nepal',
        description: [
          'Built an Online Blood Bank Management System with integrated SMS notifications for donors and hospitals.',
          'Reduced development cycle time by 15% through efficient team collaboration.',
          'Translated stakeholder requirements into actionable, production-ready solutions.',
        ],
        status: 'published',
        order: 4,
      },
    ],
  })
  console.log('✓ Created 4 experience entries')

  // About
  await prisma.about.create({
    data: {
      bio: [
        "I'm a Software Engineer with 4+ years of experience building dynamic, responsive, and scalable web applications — and an AI/ML enthusiast currently deep-diving into automation and Python.",
        "I've worked across startups and agencies — from building multi-portal enterprise systems at Gurzu Inc to delivering Dishoom University's web platform and shipping a full-stack MVP at Fitch Ratings in 72 hours.",
        "Pursuing a Master of IT in Artificial Intelligence at Macquarie University, Sydney. I'm passionate about exploring how AI and automation can reshape the way we build software.",
      ],
      skills: [
        { category: 'Frontend', items: ['JavaScript', 'TypeScript', 'ReactJS', 'Next.js', 'HTML/CSS', 'SCSS/SASS', 'Redux', 'TanStack Query'] },
        { category: 'Backend & Databases', items: ['Node.js', 'Express.js', 'Python', 'Prisma ORM', 'MongoDB', 'PostgreSQL', 'MySQL'] },
        { category: 'AI & Automation', items: ['Python', 'Automation', 'AI/ML', 'LLMs', 'Prompt Engineering', 'Scripting'] },
        { category: 'Tools & Platforms', items: ['Git', 'GitHub/GitLab', 'Figma', 'AWS', 'CI/CD', 'Jira', 'Webflow', 'WordPress'] },
      ],
      status: 'published',
    },
  })
  console.log('✓ Created about section')

  console.log('\n✅ Seed complete! All CV content is now live in MongoDB.')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
