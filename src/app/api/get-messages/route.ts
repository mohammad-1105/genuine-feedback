import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  // connect database
  await dbConnect();

  // get session
  const session = await getServerSession(authOptions);

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized | You are not logged In",
      },
      { status: 401 }
    );
  }

  const user = session?.user as User;
  // by default userId is string because it was converted when inserting userId into token in the './auth/[...nextauth]/options.ts'
  // to use mongoDB aggregation framework convert userId into mongoDB ObjectID because aggregation framework only work directly in mongoDB it doesn't need mongoose wrapper

  const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
    user?._id
  );

  try {
    // write aggregation pipeline
    const user = await UserModel.aggregate([
      // 1st stage // match user with userId
      { $match: { _id: userId } },
      // 2nd stage // unwind the array of messages
      { $unwind: "$messages" },
      // 3rd stage // sort with latest message at the top
      { $sort: { "messages.createdAt": -1 } },
      // 4th stage // group all message and push into the messages array
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get messages :: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get messages",
      },
      { status: 500 }
    );
  }
}
