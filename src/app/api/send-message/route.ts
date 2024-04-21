import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user/user.model";

export async function POST(request: Request): Promise<Response> {
  // connect database
  await dbConnect();

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username: username });

    // check if the user doesn't exists
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // check if the user doesn't accept messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    // add messages to the user
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to send message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}
