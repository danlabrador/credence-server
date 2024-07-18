import { connect } from "mongoose";

const db = async () => {
  try {
    const {
      connection: { host },
    } = await connect(process.env.MONGODB_URI);
    console.log(`Database connection: ${host}`);
  } catch (error) {
    console.error("Database connection error: ", error);
    console.error("Stack trace: ", error.stack);
    process.exit(1);
  }
};

export default db;
