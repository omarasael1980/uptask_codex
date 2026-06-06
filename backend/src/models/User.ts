import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  confirmed: boolean;
}
const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: { type: String, trim: true, required: true },
  name: { type: String, trim: true, required: true },
  confirmed: { type: Boolean, trim: true, default: false },
});

export default mongoose.model<IUser>("User", userSchema);
