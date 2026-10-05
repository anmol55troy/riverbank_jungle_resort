import mongoose from 'mongoose'

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

const MONGODB_URI = process.env.DATABASE_URI

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URI environment variable inside .env')
}

let cached = global.mongooseConnection

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null }
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      autoIndex: false, // Don't alter existing production indexes
      autoCreate: false, // Don't alter existing collections
    }

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}
