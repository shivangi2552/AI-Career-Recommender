// backend/models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  platform: { type: String },
  link: { type: String },
});

export default mongoose.model("Course", courseSchema);
