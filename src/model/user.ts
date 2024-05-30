import mongoose, { Document, Model, Schema } from "mongoose";

interface FileDocument extends Document {
  title: string;
  data: Buffer;
  mimeType:string;
  size: number;
  createdAt: Date;
}

const fileSchema = new mongoose.Schema<FileDocument>({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
  },
  mimeType:{
   type: String,
  },
  size: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isConfirmed: boolean;
  apiKey: string;
  files: FileDocument[];
}

const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  apiKey: {
    type: String,
    default:null,
    
  },
  files: {
    type: [fileSchema],
    default: [],
  },
});

const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);

export default User;
