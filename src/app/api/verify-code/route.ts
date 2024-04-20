import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user/user.model";

export async function POST(request: Request): Promise<Response> {
  // connect db first
  await dbConnect();

  try {
    const { username, code } = await request.json();

    // decode username if coming from URL
    const decodeUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodeUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }
    // check the verifyCode and verifyExpiry are valid or not
    const isVerifyCodeValid = user.verifyCode === code;
    const isVerifyCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    // if both are valid then store in db and make user verified
    if (isVerifyCodeValid && isVerifyCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    }
    // if verify time expired
    else if (!isVerifyCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired | Please signup again to get new code",
        },
        { status: 400 }
      );
    }
    // if incorrect verify code
    else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
