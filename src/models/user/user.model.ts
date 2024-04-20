import mongoose, { Schema, Document } from "mongoose";

// types
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

// message schema
const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: [true, "message content is required"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// user schema
const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
    minlength: [4, "username must at least 4 characters"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [4, "password must at least 4 characters"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [messageSchema],
});

// user model
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
