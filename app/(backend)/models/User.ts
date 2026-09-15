/* eslint-disable @typescript-eslint/no-explicit-any */
// models/User.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IStore extends Document {
  name: string;
  email: string;
  phoneHash: string;
  phoneSalt: string;
  address?: string;
  isActive?: boolean;
  createdAt: Date;
  storeId?: mongoose.Types.ObjectId; // FIX: Change from string to ObjectId
  password: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: "user" | "admin" | "super_admin";
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  passwordChangedAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

const UserSchema: Schema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneHash: { type: String, required: true, unique: true, select: false }, // FIX: Add select false
    phoneSalt: { type: String, select: false }, // ADD THIS
    address: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store" }, // FIX: ObjectId type
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // ADD THIS - never return password by default
    },
    passwordChangedAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        // @ts-expect-error – we know these fields exist at runtime
        delete ret.password;
        // @ts-expect-error – we know these fields exist at runtime
        delete ret.phoneHash;
        // @ts-expect-error – we know these fields exist at runtime
        delete ret.phoneSalt;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  },
);

// ✅ FIXED: Pre-save middleware with proper next handling
UserSchema.pre("save", async function (this: any) {
  // Only run this when password is modified
  if (!this.isModified("password")) return;

  // Actually hash the password
  this.password = await bcrypt.hash(this.password as string, 12);
  this.passwordChangedAt = new Date(Date.now() - 1000);
});

// ✅ FIXED: Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ FIXED: Check if password was changed after JWT was issued
UserSchema.methods.passwordChangedAfter = function (
  JWTTimestamp: number,
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// ✅ FIXED: Create password reset token
UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return resetToken;
};
// ✅ Generate API key for new users
UserSchema.pre("save", async function (this: any) {
  if (!this.apiKey) {
    this.apiKey = this.generateApiKey();
  }
});

// ✅ Generate API key method
UserSchema.methods.generateApiKey = function (): string {
  const prefix = "frgk_";
  const random = crypto.randomBytes(32).toString("hex");
  return `${prefix}${random}`;
};

// ✅ Verify API key method
UserSchema.methods.verifyApiKey = function (apiKey: string): boolean {
  return this.apiKey === apiKey;
};

// ✅ Regenerate API key
UserSchema.methods.regenerateApiKey = function (): string {
  this.apiKey = this.generateApiKey();
  this.apiKeyCreatedAt = new Date();
  return this.apiKey;
};

const User = mongoose.models.User || mongoose.model<IStore>("User", UserSchema);
export default User;
