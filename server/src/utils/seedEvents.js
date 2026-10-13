import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "../models/Event.js";

dotenv.config();

const SEED_EVENTS = [
  {
    title: "India AI & Full Stack Summit 2026",
    organizerId: "org-001",
    organizer: "DevSphere India Community",
    organizerRole: "VERIFIED ORGANIZER",
    category: "Technology",
    city: "Mumbai",
    description:
      "India's premier developer conference on agentic AI, modern full-stack architectures, Next.js/React engineering, and scalable cloud deployments.",
    banner:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    venue: "Jio World Convention Centre - Hall 3",
    location: "Bandra Kurla Complex (BKC), Mumbai, Maharashtra",
    date: "15 Sep 2026",
    time: "09:30 AM - 05:30 PM IST",
    capacity: 350,
    registered: 280,
    price: 499,
    status: "PUBLISHED",
    approvalStatus: "APPROVED",
    tags: ["Artificial Intelligence", "React", "Full Stack", "Mumbai Tech"],
    featured: true,
  },
  {
    title: "Mumbai UI/UX DesignMatrix Masterclass",
    organizerId: "org-001",
    organizer: "DesignCraft Mumbai",
    organizerRole: "ORGANIZER",
    category: "Design",
    city: "Mumbai",
    description:
      "A hands-on masterclass covering modern design systems, micro-interactions, Indian vernacular UX patterns, and Figma-to-React component workflows.",
    banner:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    venue: "VESIT Auditorium & Innovation Lab",
    location: "Chembur, Mumbai, Maharashtra",
    date: "22 Sep 2026",
    time: "10:00 AM - 04:00 PM IST",
    capacity: 120,
    registered: 95,
    price: 0,
    status: "PUBLISHED",
    approvalStatus: "APPROVED",
    tags: ["UI/UX", "Tailwind CSS", "Figma", "VESIT Chembur"],
    featured: true,
  },
  {
    title: "HackMaharashtra 2026: 36-Hour Hackathon",
    organizerId: "org-002",
    organizer: "Maharashtra Student Tech Network",
    organizerRole: "VERIFIED ORGANIZER",
    category: "Hackathons",
    city: "Pune",
    description:
      "State-level inter-college hackathon building real-world solutions across FinTech, AgriTech, Smart Mobility, and Cybersecurity defense.",
    banner:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    venue: "COEP Technological University Auditorium",
    location: "Shivajinagar, Pune, Maharashtra",
    date: "05 Oct 2026",
    time: "08:00 AM (36 Hrs) IST",
    capacity: 250,
    registered: 250,
    price: 0,
    status: "PUBLISHED",
    approvalStatus: "APPROVED",
    tags: ["Hackathon", "Open Source", "Pune Tech", "Students"],
    featured: true,
  },
  {
    title: "Bengaluru CloudNative & DevOps Conclave",
    organizerId: "org-003",
    organizer: "CloudNative India",
    organizerRole: "ORGANIZER",
    category: "Technology",
    city: "Bengaluru",
    description:
      "Deep dive into Docker containerization, Kubernetes cluster management, CI/CD automated deployment pipelines, and microservices architecture.",
    banner:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    venue: "NIMHANS Convention Centre",
    location: "Hosur Road, Bengaluru, Karnataka",
    date: "18 Oct 2026",
    time: "09:00 AM - 05:00 PM IST",
    capacity: 400,
    registered: 240,
    price: 799,
    status: "PUBLISHED",
    approvalStatus: "APPROVED",
    tags: ["Docker", "DevOps", "Kubernetes", "Bengaluru"],
    featured: true,
  },
  {
    title: "Campus Placement & DSA Sprint Bootcamp",
    organizerId: "org-001",
    organizer: "CodeVanguard Mumbai",
    organizerRole: "VERIFIED ORGANIZER",
    category: "Career",
    city: "Mumbai",
    description:
      "Intensive 2-day technical interview preparation covering Data Structures & Algorithms, System Design fundamentals, and live mock interviews.",
    banner:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    venue: "VJTI Quadrangle & Seminar Hall 1",
    location: "Matunga, Mumbai, Maharashtra",
    date: "02 Nov 2026",
    time: "10:00 AM - 05:00 PM IST",
    capacity: 180,
    registered: 145,
    price: 299,
    status: "PUBLISHED",
    approvalStatus: "APPROVED",
    tags: ["Placements", "DSA", "Engineering", "VJTI Matunga"],
    featured: false,
  },
  {
    title: "Indian Startup & Founder Pitch Conclave",
    organizerId: "org-004",
    organizer: "Mumbai Founders Network",
    organizerRole: "ORGANIZER",
    category: "Startups",
    city: "Mumbai",
    description:
      "Early-stage Indian founders connect with Mumbai angel investors, venture capital networks, and tech mentors for seed round opportunities.",
    banner:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    venue: "Bombay Exhibition Centre (NESCO), Hall 4",
    location: "Goregaon East, Mumbai, Maharashtra",
    date: "14 Nov 2026",
    time: "09:30 AM - 06:00 PM IST",
    capacity: 300,
    registered: 110,
    price: 1499,
    status: "PENDING_APPROVAL",
    approvalStatus: "PENDING",
    tags: ["Startups", "Venture Capital", "Founders", "Mumbai"],
    featured: false,
  },
  {
    title: "CyberSecShield India: Ethical Hacking Workshop",
    organizerId: "org-002",
    organizer: "CyberDefenders India",
    organizerRole: "VERIFIED ORGANIZER",
    category: "Cybersecurity",
    city: "Delhi NCR",
    description:
      "Hands-on defensive security, OWASP top 10 vulnerability patching, JWT authentication defense, and Indian cyber law compliance.",
    banner:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    venue: "India Expo Mart, Convention Suite B",
    location: "Knowledge Park II, Greater Noida, Uttar Pradesh",
    date: "28 Nov 2026",
    time: "10:00 AM - 04:30 PM IST",
    capacity: 200,
    registered: 80,
    price: 499,
    status: "PENDING_APPROVAL",
    approvalStatus: "PENDING",
    tags: ["Cybersecurity", "Ethical Hacking", "InfoSec", "Delhi NCR"],
    featured: false,
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventsphere";
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log("Cleaning existing events collection...");
    await Event.deleteMany({});

    console.log(`Inserting ${SEED_EVENTS.length} Indian EventSphere events...`);
    const createdEvents = await Event.insertMany(SEED_EVENTS);

    console.log(`[Seed Success] Successfully inserted ${createdEvents.length} events into MongoDB!`);
    createdEvents.forEach((evt, idx) => {
      console.log(`  ${idx + 1}. [${evt.approvalStatus}] ${evt.title} (${evt.city}) - ID: ${evt._id}`);
    });

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
