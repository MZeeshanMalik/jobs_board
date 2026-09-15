import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

export async function connectDB() {
  // Return cached connection if exists
  if (cached.conn) {
    console.log("Using cached connection");
    return cached.conn;
  }

  // Create new connection if no promise exists
  if (!cached.promise) {
    console.log("Creating new connection...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        family: 4,
        // Optional: Add these for better reliability
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      })
      .then((mongoose) => {
        console.log("✅ Database connected successfully");
        console.log(`📊 Database: ${mongoose.connection.db?.databaseName}`);
        console.log(`🔄 ReadyState: ${mongoose.connection.readyState}`);
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ Database connection failed:", error);
        cached.promise = null; // Reset promise on error
        throw error;
      });
  }

  // Wait for connection
  cached.conn = await cached.promise;
  global.mongooseCache = cached;

  // Log connection events
  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ Database disconnected");
    cached.conn = null;
    cached.promise = null;
  });

  mongoose.connection.on("error", (error) => {
    console.error("❌ Database error:", error);
  });

  return cached.conn;
}

// Optional: Add a disconnect helper
export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("Database disconnected");
  }
}
