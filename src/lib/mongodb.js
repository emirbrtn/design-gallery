import "server-only";
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = process.env.MONGODB_DB_NAME || "harun-design-studio";

if (!uri) {
  throw new Error("DATABASE_URL eksik.");
}

const globalForMongo = globalThis;

let client = globalForMongo.mongoClient;

if (!client) {
  client = new MongoClient(uri);

  if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClient = client;
  }
}

export async function getDesignCollection() {
  await client.connect();
  return client.db(dbName).collection("designs");
}

export function serializeDesign(design) {
  return {
    id: design._id.toString(),
    title: design.title,
    category: design.category,
    image: design.image,
    createdAt: design.createdAt,
  };
}
