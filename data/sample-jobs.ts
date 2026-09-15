// data/sample-jobs.ts
import { JobPost } from "@/types/job";

export const sampleJobs: JobPost[] = [
  {
    _id: "1",
    title: "Senior Frontend Engineer",
    contentJson: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                text: "We are looking for a Senior Frontend Engineer to join our growing team. You will be responsible for building scalable, high-performance web applications using React and Next.js.",
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "root",
      },
    }),
    companyName: "TechNova Labs",
    companyLogoUrl: "https://via.placeholder.com/100?text=TN",
    companyUrl: "https://technova.example.com",
    jobLocationType: "HYBRID",
    locations: [
      {
        city: "Karachi",
        region: "Sindh",
        country: "PK",
      },
    ],
    employmentType: "FULL_TIME",
    experienceLevel: "senior",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL"],
    salary: {
      type: "range",
      currency: "PKR",
      unit: "MONTH",
      minAmount: 250000,
      maxAmount: 400000,
    },
    datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://technova.example.com/apply",
    metaDescription:
      "Join TechNova Labs as a Senior Frontend Engineer. Build scalable React and Next.js applications with a talented team.",
    slug: "senior-frontend-engineer-technova-labs",
    status: "published",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Backend Developer (Node.js)",
    contentJson: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                text: "Design and build RESTful and GraphQL APIs using Node.js, Express, and MongoDB. Work closely with frontend and DevOps teams.",
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "root",
      },
    }),
    companyName: "CloudPeak Systems",
    jobLocationType: "REMOTE",
    locations: [],
    applicantLocationRequirement: "Must be based in Pakistan",
    employmentType: "FULL_TIME",
    experienceLevel: "mid",
    skills: ["Node.js", "Express", "MongoDB", "Redis", "Docker"],
    salary: {
      type: "range",
      currency: "USD",
      unit: "MONTH",
      minAmount: 2000,
      maxAmount: 3500,
    },
    datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://cloudpeak.example.com/careers/backend",
    metaDescription:
      "Remote Backend Developer role at CloudPeak Systems. Build scalable APIs with Node.js and MongoDB.",
    slug: "backend-developer-cloudpeak-systems",
    status: "published",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Product Designer",
    contentJson: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                text: "We are seeking a creative Product Designer to shape user experiences across our web and mobile products. You will own the design process from research to high-fidelity prototypes.",
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "root",
      },
    }),
    companyName: "PixelWorks Studio",
    companyLogoUrl: "https://via.placeholder.com/100?text=PW",
    jobLocationType: "ON_SITE",
    locations: [
      {
        city: "Lahore",
        region: "Punjab",
        country: "PK",
      },
    ],
    employmentType: "FULL_TIME",
    experienceLevel: "mid",
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
    salary: {
      type: "fixed",
      currency: "PKR",
      unit: "MONTH",
      amount: 180000,
    },
    datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://pixelworks.example.com/jobs/designer",
    metaDescription:
      "Product Designer position at PixelWorks Studio in Lahore. Shape UX for web and mobile products.",
    slug: "product-designer-pixelworks-studio",
    status: "published",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "DevOps Engineer",
    contentJson: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                text: "Manage and improve our CI/CD pipelines, cloud infrastructure, and monitoring systems on AWS. Automate everything.",
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "root",
      },
    }),
    companyName: "ScaleForge",
    jobLocationType: "HYBRID",
    locations: [
      {
        city: "Islamabad",
        region: "Islamabad Capital Territory",
        country: "PK",
      },
    ],
    employmentType: "CONTRACTOR",
    experienceLevel: "senior",
    skills: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Linux"],
    salary: {
      type: "hourly",
      currency: "USD",
      unit: "HOUR",
      amount: 45,
    },
    datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://scaleforge.example.com/apply/devops",
    metaDescription:
      "DevOps Engineer contract role at ScaleForge. Manage AWS infrastructure and CI/CD pipelines.",
    slug: "devops-engineer-scaleforge",
    status: "published",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Junior React Developer",
    contentJson: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                text: "Start your career with us! Work alongside senior engineers to build modern web applications using React and TypeScript.",
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "root",
      },
    }),
    companyName: "BrightCode",
    jobLocationType: "REMOTE",
    locations: [],
    applicantLocationRequirement: "Open worldwide",
    employmentType: "INTERN",
    experienceLevel: "entry",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    salary: {
      type: "fixed",
      currency: "USD",
      unit: "MONTH",
      amount: 500,
    },
    datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://brightcode.example.com/intern",
    metaDescription:
      "Remote Junior React Developer internship at BrightCode. Perfect for entry-level developers.",
    slug: "junior-react-developer-brightcode",
    status: "published",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Mobile Engineer (React Native)",
    contentJson: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                text: "Build cross-platform mobile apps with React Native. Collaborate with designers and backend engineers to ship features fast.",
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "root",
      },
    }),
    companyName: "Appverse",
    jobLocationType: "ON_SITE",
    locations: [
      {
        city: "Faisalabad",
        region: "Punjab",
        country: "PK",
      },
    ],
    employmentType: "FULL_TIME",
    experienceLevel: "mid",
    skills: ["React Native", "TypeScript", "Redux", "iOS", "Android"],
    salary: {
      type: "range",
      currency: "PKR",
      unit: "MONTH",
      minAmount: 150000,
      maxAmount: 250000,
    },
    datePosted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://appverse.example.com/jobs/mobile",
    metaDescription:
      "Mobile Engineer role at Appverse in Faisalabad. Build React Native apps for iOS and Android.",
    slug: "mobile-engineer-appverse",
    status: "published",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "7",
    title: "Data Scientist",
    contentJson: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                text: "Analyze large datasets, build ML models, and deliver insights that drive product decisions.",
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "root",
      },
    }),
    companyName: "DataMinds AI",
    jobLocationType: "REMOTE",
    locations: [],
    applicantLocationRequirement: "Must be able to work in PKT timezone",
    employmentType: "FULL_TIME",
    experienceLevel: "senior",
    skills: ["Python", "TensorFlow", "SQL", "Pandas", "Machine Learning"],
    salary: {
      type: "range",
      currency: "USD",
      unit: "MONTH",
      minAmount: 3000,
      maxAmount: 5000,
    },
    datePosted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://dataminds.example.com/careers/ds",
    metaDescription:
      "Remote Data Scientist position at DataMinds AI. Build ML models and drive insights.",
    slug: "data-scientist-dataminds-ai",
    status: "published",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
