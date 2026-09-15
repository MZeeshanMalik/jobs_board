/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jwt from "jsonwebtoken";
import User from "../models/User";

/* -------------------------- ENV VARIABLES -------------------------- */
const JWT_SECRET: string = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/* `expiresIn` may be a string (e.g. "7d") or a number of seconds   */
const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN ?? "7d";

/* -------------------------- Payload interface -------------------------- */
export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  storeId?: string;
  role: string;
}

/* -------------------------- Signing options -------------------------- */
const signOptions: jwt.SignOptions = {
  expiresIn: JWT_EXPIRES_IN, // ✅ number | string
  issuer: process.env.JWT_ISSUER ?? "Fraudhawkai",
};

/* -------------------------- Exported helpers -------------------------- */
export const signToken = (payload: JWTPayload): string => {
  // All three arguments now match the correct overload
  const data = jwt.sign(payload, JWT_SECRET, signOptions);
  return data;
};

// export const verifyToken = async (
//   token: string,
// ): Promise<JWTPayload | null> => {
//   try {
//     const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
//     return payload;
//   } catch {
//     return null;
//   }
// };
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    // Note: jwt.verify is synchronous
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    // `decode` returns `null | string | object`; we assert our shape
    return jwt.decode(token) as JWTPayload | null;
  } catch {
    return null;
  }
};
