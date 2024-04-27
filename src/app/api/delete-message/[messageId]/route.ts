import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user/user.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  
  { params }: { params: { messageId: string } }
) {
  // db connect first
  await dbConnect();

  // check user is authenticated or not
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!user || !session) {
    return Response.json(
      {
        success: false,
        message: "You are not authenticated",
      },
      { status: 400 }
    );
  }

  const messageId = params.messageId;

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: { messages: { _id: messageId } },
      }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Already deleted or message not fount",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Message delete error :: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to delete message ",
      },
      { status: 500 }
    );
  }
}
