import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user/user.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(reqest: Request, { params }: { params: { messageId: string } }) {
  const messageId = params.messageId;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User
  
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

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
    // console.log("Message delete error :: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to delete message ",
      },
      { status: 500 }
    );
  }
}
