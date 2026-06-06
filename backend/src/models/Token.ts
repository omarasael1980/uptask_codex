import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Schema.Types.ObjectId;
  expiresAt: Date;
}
const tokenSchema = new Schema({
  token: { type: String, trim: true, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  expiresAt: { type: Date, default: Date.now(), expires: "10m" },
});

export default mongoose.model<IToken>("Token", tokenSchema);
