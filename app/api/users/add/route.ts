import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";

const dbName = process.env.MONGODB_DB_NAME;
const usersCollection = process.env.MONGODB_USERS_COLLECTION;

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const user: any = body;

    // Validate input
    if (!user.name || !user.phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get the MongoDB client and database
    const client = await clientPromise;
    const db = client.db(dbName); // Replace with your database name
    const collection = db.collection(usersCollection as string); // Replace with your collection name

    // Insert the user into the database
    const result = await collection.insertOne(user);

    return NextResponse.json(
      { message: "User saved successfully", userId: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Error saving user" }, { status: 500 });
  }
}
