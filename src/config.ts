export const config = {
  developer: {
    name: "Hashim",
    fullName: "Mohammed Hashim Nilger",
    title: "Full-Stack Developer",
    description:
      "Full-Stack MERN Developer building modern web applications and AI-integrated tools. Passionate about clean code, great UX, and shipping real-world products.",
  },
  social: {
    github: "https://github.com/MohammedHashimNilger",
    email: "hashimrangrezz786@gmail.com",
    location: "Chittorgarh, Rajasthan, India",
  },
  about: {
    title: "About Me",
    description:
      "I am a B.Tech CSE student at Mewar University, Chittorgarh. I love building full-stack web applications with React, Node.js, MongoDB, Express, and TypeScript. I have worked on projects like an Exam Seating Management System and an AI-powered Resume Builder, and I enjoy creating real-world, production-ready products.",
  },
  experiences: [
    {
      position: "Full-Stack Developer (AI-Powered Projects)",
      company: "Personal Projects",
      period: "2026 - Present",
      location: "Chittorgarh, India",
      description:
        "Integrated AI APIs into full-stack applications and built intelligent tools. Currently focusing on creating AI-powered projects using MERN stack.",
      responsibilities: [
        "Integrating AI APIs with React and Node.js applications",
        "Building AI-powered features like ResumeCraft, AI Code Review, and more",
        "Deploying production-ready AI-integrated projects",
      ],
      technologies: [
        "Groq API",
        "MERN Stack",
        "LLaMA-3",
        "Vite",
        "React",
        "Node.js",
        "MongoDB",
        "Express",
      ],
    },
    {
      position: "Full-Stack Developer",
      company: "Personal Projects",
      period: "2025",
      location: "Chittorgarh, India",
      description:
        "Completed full-stack development by mastering backend technologies. Built end-to-end MERN applications including e-commerce platforms and management systems.",
      responsibilities: [
        "Building RESTful APIs with Express and Node.js",
        "Managing databases with MongoDB and Mongoose",
        "Developing responsive frontend with React and TypeScript",
        "Deploying full-stack applications on Vercel/Render",
      ],
      technologies: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "JavaScript",
        "TypeScript",
        "Vite",
      ],
    },
    {
      position: "Frontend Developer",
      company: "Self-Taught",
      period: "2024",
      location: "Chittorgarh, India",
      description:
        "Focused on frontend development. Built interactive user interfaces and learned modern web technologies.",
      responsibilities: [
        "Building responsive UIs with React and modern CSS",
        "Learning component architecture and state management",
        "Practising Git workflows and deployment",
      ],
      technologies: ["React", "HTML", "CSS", "JavaScript", "Git", "Vite"],
    },
    {
      position: "B.Tech Student",
      company: "Mewar University",
      period: "2023 - 2026",
      location: "Chittorgarh, India",
      description:
        "Started B.Tech in Computer Science and Engineering. Began coding journey and built foundation in programming fundamentals.",
      responsibilities: [
        "Focusing on Computer Science core subjects",
        "Learning programming fundamentals and data structures",
        "Exploring web development alongside academics",
      ],
      technologies: ["C", "Python", "DSA", "Computer Science Fundamentals"],
    },
  ],
  projects: [
    {
      id: 1,
      title: "ResumeCraft",
      category: "AI / Full Stack",
      technologies:
        "React, Node.js, MongoDB, Express, Groq API, LLaMA-3, JWT, PDF Export",
      image: "/images/resumecraft.png",
      live: "https://resume-craft-eight-alpha.vercel.app/",
      github: "https://github.com/MohammedHashimNilger/Resume_Craft",
      description:
        "An AI-powered resume builder using MERN stack and Groq's LLaMA-3 model. Features AI-generated resume content, real-time editing, JWT authentication, and one-click PDF download.",
    },
    {
      id: 3,
      title: "Exam Seating System",
      category: "Full Stack",
      technologies: "React, Supabase, Supabase Authentication",
      image: "/images/examseating.png",
      live: "https://seating-management-bay.vercel.app/signin",
      github: "https://github.com/MohammedHashimNilger/Seating-Management",
      description:
        "A React-based exam seating management system for universities. Features admin panel, automated seating allocation, authentication via Supabase Authentication.",
    },
    {
      id: 4,
      title: "AI Resume Analyzer",
      category: "AI / Full Stack",
      technologies: "React, Vite, Groq API, LLaMA-3.3-70b",
      image: "/images/ai_resume_analyzer.png",
      live: "https://ai-resume-analyzer-two-rust.vercel.app/",
      github: "https://github.com/MohammedHashimNilger/Ai-Resume-Analyzer",
      description:
        "An AI-powered resume analyzer using Edge Functions with Groq's LLaMA-3.3-70b. Provides intelligent resume feedback and ATS scoring with API keys secured server-side.",
    },
  ],
  contact: {
    email: "hashimrangrezz786@gmail.com",
    github: "https://github.com/MohammedHashimNilger",
    linkedin: "https://www.linkedin.com/in/mohammedhashimnilger/",
    resumecraftLive: "https://resume-craft-eight-alpha.vercel.app/",
    resumecraftGithub: "https://github.com/MohammedHashimNilger/Resume_Craft",
  },
  skills: {
    develop: {
      title: "FULL-STACK",
      description: "Building modern web apps from frontend to backend",
      details:
        "Developing full-stack MERN applications with React, Node.js, Express, and MongoDB. Integrating third-party APIs, payment gateways and AI services into production apps.",
      tools: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "TypeScript",
        "Vite",
        "Redux Toolkit",
        "JWT",
        "REST APIs",
        "PostgreSQL",
      ],
    },
    design: {
      title: "AI INTEGRATION",
      description: "Integrating AI into modern web applications",
      details:
        "Integrated the Groq API into web applications to build AI-powered features. Used Supabase for authentication, database management, and backend services while securely handling API requests and application data.",
      tools: ["Groq API", "Supabase", "React", "Node.js", "JavaScript"],
    },
  },
};
