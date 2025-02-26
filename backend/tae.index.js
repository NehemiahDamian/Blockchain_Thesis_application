import mongoose from "mongoose";

async function dropUniqueTokenIndex() {
  await mongoose.connect("mongodb://localhost:27017/thesis_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  try {
    await db.collection("users").dropIndex("uniqueToken_1");
    console.log("Dropped uniqueToken_1 index!");
  } catch (error) {
    console.error("Error dropping index:", error);
  }

  mongoose.connection.close();
}

dropUniqueTokenIndex();
