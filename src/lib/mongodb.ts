import mongoose from "mongoose";
import dns from "dns";

// Ensure Node can resolve MongoDB SRV records when the local DNS resolver (e.g. 127.0.0.1) does not support SRV lookups
try {
  const currentServers = dns.getServers();
  if (currentServers.length === 1 && currentServers[0] === "127.0.0.1") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
} catch {
  // Ignore DNS config errors in edge/browser environments
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB with connection caching to avoid leaking pools
 * across Next.js App Router serverless invocations and hot reloads.
 * 
 * In production: Throws an explicit error if MONGODB_URI is missing or unreachable.
 * In development/test: Returns null if MONGODB_URI is missing, allowing local dev fallbacks.
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const isProduction = process.env.NODE_ENV === "production" && process.env.ALLOW_IN_MEMORY_TEST !== "true";
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    if (isProduction) {
      throw new Error("MONGODB_URI environment variable is missing in production.");
    }
    return null;
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch {
      // Ignore in non-Node environments
    }

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err: any) {
    cached.promise = null;
    cached.conn = null;

    const errMsg = err?.message || String(err);
    console.error("MongoDB Atlas connection error:", errMsg);

    if (
      errMsg.includes("whitelist") ||
      errMsg.includes("SSL alert number 80") ||
      errMsg.includes("tlsv1 alert internal error") ||
      err?.name === "MongooseServerSelectionError"
    ) {
      console.error(
        "\n================================================================================" +
        "\n[ACTION REQUIRED] MongoDB Atlas Connection Blocked:" +
        "\nYour current IP address is not whitelisted on MongoDB Atlas Network Access." +
        "\nGo to MongoDB Atlas -> Network Access -> Add IP Address -> Add Current IP Address." +
        "\n================================================================================\n"
      );
    }

    throw new Error(`Database connection failed: ${errMsg}`);
  }
}
