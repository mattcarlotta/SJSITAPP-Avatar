import { Schema, model } from "mongoose";

// admin, staff, employee
const userSchema = new Schema({
  avatar: { type: String, default: "" },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  role: { type: String, default: "employee" },
  status: { type: String, default: "active" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  registered: {
    type: Date,
    required: true
  },
  token: { type: String, unique: true },
  emailReminders: { type: Boolean, default: true }
});

export default model("User", userSchema);
