// models/User.js
import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  resources: { type: [ResourceSchema], default: [] },
});

const AchievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  date: Date,
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
      phone: { type: String },
        gender: { type: String, enum: ["male", "female", "other"] }, // <- new

    district: { type: String },   // new
  state: { type: String },      // new
  country: { type: String }, 
  dob: { type: Date },
  bio: { type: String },
  theme: { type: String, default: "light" },
    skills: { type: [SkillSchema], default: [] },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    achievements: { type: [AchievementSchema], default: [] },
    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
