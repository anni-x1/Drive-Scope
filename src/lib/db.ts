import mongoose from "mongoose";
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const cache = (globalThis as typeof globalThis & { mongooseCache?: Cache }).mongooseCache ?? { conn: null, promise: null };
(globalThis as typeof globalThis & { mongooseCache?: Cache }).mongooseCache = cache;
export async function connectDb() {
  const uri = process.env.MONGODB_URI ?? "";
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName: "drivescope",
      maxPoolSize: 5,
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
