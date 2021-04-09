import { Document, Schema, model } from "mongoose";

export interface IUserDocument extends Document {
  // _id?: Types.ObjectId;
  avatar?: string;
  email: string;
  role?: string;
  status?: string;
  firstName: string;
  lastName: string;
  password: string;
  registered?: Date;
  token: string;
  emailReminders?: boolean;
}

// admin, staff, employee
const userSchema = new Schema<IUserDocument>({
  avatar: { type: String, default: "" },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  role: { type: String, default: "member" },
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

const UserModel = model("User", userSchema);

export default UserModel;
