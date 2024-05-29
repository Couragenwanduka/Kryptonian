import mongoose, { Document, Model, Schema } from "mongoose";

interface FileDocument extends Document {
  title: string;
  file: Buffer;
  createdAt: Date;
}

const fileSchema = new mongoose.Schema<FileDocument>({
  title: {
    type: String,
    required: true,
  },
  file: {
    type: Buffer,
    required: true,
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
    required: true,
  },
  files: {
    type: [fileSchema],
    default: [],
  },
});

const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);

export default User;
