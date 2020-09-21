import mongoose, { ClientSession } from 'mongoose';
import config, { isProduction, isTesting, isDevelopment } from '../config';

const {
  DB_HOST,
  DB_HOST_LOCAL,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD
} = config;

async function startDB(): Promise<void> {
  const mongoUrl = isDevelopment
    ? `mongodb://${DB_HOST_LOCAL}:${DB_PORT}`
    : `mongodb+srv://${DB_HOST}`;
  await mongoose.connect(mongoUrl, {
    dbName: isTesting ? 'funankTestDB' : DB_NAME,
    user: isDevelopment ? '' : DB_USER,
    pass: isDevelopment ? '' : DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: !isProduction
  });
  console.log('Connected to MongoDB');
}

async function startTransaction(
  callback: (session: ClientSession) => Promise<any>
): Promise<void> {
  const session = await mongoose.startSession();
  await session.withTransaction(callback, { writeConcern: { wtimeout: 5000 } });
  session.endSession(error => {
    if (error) {
      console.error(error);
    }
  });
}

async function stopDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

export { startDB, stopDB, startTransaction };
