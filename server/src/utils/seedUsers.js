import mongoose from "mongoose";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

const DEMO_USERS = [
  {
    name: "EventSphere Administrator",
    email: "admin@eventsphere.local",
    password: "Admin@123",
    role: "ADMIN",
    city: "Mumbai",
  },
  {
    name: "DevSphere India Organizer",
    email: "organizer@eventsphere.local",
    password: "Organizer@123",
    role: "ORGANIZER",
    city: "Mumbai",
  },
  {
    name: "Aarav Mehta",
    email: "participant@eventsphere.local",
    password: "Participant@123",
    role: "PARTICIPANT",
    city: "Mumbai",
  },
];

const seedUsers = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${env.MONGO_URI}`);
    await mongoose.connect(env.MONGO_URI);

    console.log("Checking and seeding demo users (ADMIN, ORGANIZER, PARTICIPANT)...");

    for (const demoUser of DEMO_USERS) {
      const exists = await User.findOne({ email: demoUser.email });
      if (!exists) {
        // User.create triggers Mongoose pre-save hook to hash password with bcrypt
        const created = await User.create(demoUser);
        console.log(`  ✅ Created [${created.role}]: ${created.email} (ID: ${created.id})`);
      } else {
        console.log(`  ℹ️  [${exists.role}] already exists: ${exists.email} (ID: ${exists.id})`);
      }
    }

    console.log("[User Seeding Complete] All demo users verified in MongoDB.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[User Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
