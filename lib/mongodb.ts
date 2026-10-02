import {
  MongoClient,
  GridFSBucket,
  Db,
} from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error(
    "DATABASE_URL is not defined."
  );
}

const globalForMongo = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
  mongoDb: Db | undefined;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

export async function getMongoDb() {
  if (!globalForMongo.mongoDb) {
    await client.connect();

    globalForMongo.mongoDb = client.db();
  }

  return globalForMongo.mongoDb;
}

export async function getGridFSBucket() {
  const db = await getMongoDb();

  return new GridFSBucket(db, {
    bucketName: "ganeshaImages",
  });
}