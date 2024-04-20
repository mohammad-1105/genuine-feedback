import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request): Promise<Response> {
  await dbConnect();

  try {
    // access query from URL
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // Zod validation

    const result = usernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingUserWithVerifiedEmail = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserWithVerifiedEmail) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error on checking unique username :: ", error);
    return Response.json(
      {
        success: false,
        message: "Error on checking unique username",
      },
      { status: 500 }
    );
  }
}
