import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    organizerId: {
      type: String,
      default: "org-001",
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, "Organizer name is required"],
      trim: true,
    },
    organizerRole: {
      type: String,
      enum: {
        values: ["ORGANIZER", "VERIFIED ORGANIZER", "ADMIN"],
        message: "{VALUE} is not a valid organizer role",
      },
      default: "ORGANIZER",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Technology",
          "Design",
          "Hackathons",
          "Career",
          "Startups",
          "Cybersecurity",
          "Cloud & DevOps",
          "Cultural",
          "Sports",
          "Other",
        ],
        message: "{VALUE} is not a supported event category",
      },
      default: "Technology",
    },
    city: {
      type: String,
      required: [true, "City is required"],
      default: "Mumbai",
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    banner: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    },
    venue: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
      trim: true,
    },
    time: {
      type: String,
      default: "10:00 AM - 05:00 PM IST",
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Seat capacity is required"],
      min: [1, "Capacity must be at least 1 person"],
      default: 100,
    },
    registered: {
      type: Number,
      default: 0,
      min: [0, "Registered count cannot be negative"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["PUBLISHED", "PENDING_APPROVAL", "CANCELLED", "DRAFT"],
        message: "{VALUE} is not a valid status",
      },
      default: "PENDING_APPROVAL",
    },
    approvalStatus: {
      type: String,
      enum: {
        values: ["PENDING", "APPROVED", "REJECTED"],
        message: "{VALUE} is not a valid approval status",
      },
      default: "PENDING",
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

// Index for search optimization
eventSchema.index({ title: "text", description: "text", venue: "text", city: "text" });

export const Event = mongoose.model("Event", eventSchema);
