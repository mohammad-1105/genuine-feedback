import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request): Promise<Response> {
  // connect to databse
  await dbConnect();

  // get session
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized | You are not logged in",
      },
      { status: 401 }
    );
  }

  const user = session?.user as User;
  const userId = user.id;

  try {
    const { acceptMessage } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find the user to update message accept status",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message accepting status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating message accepting status ", error);
    return Response.json(
      {
        success: false,
        message: "Error updating message accepting status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<Response> {
  // connect database
  await dbConnect();

  // getSession
  const session = await getServerSession(authOptions);

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized | You are not logged in",
      },
      { status: 401 }
    );
  }

  const user = session?.user as User;
  const userId = user?._id;

  try {
    // find and check user message accepting status
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
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
        message: "user found with message accepting status",
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to retrieve message accepting status", error);
    return Response.json(
      {
        success: false,
        message: "Failed to retrieve message accepting status",
      },
      { status: 500 }
    );
  }
}
