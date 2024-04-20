import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user/user.model";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  // connect db first
  await dbConnect();

  try {
    // access the request data
    const { username, email, password }: any = await request.json();

    // check if the user exists with [ the username and verfied true ]
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // check existing user by email
    const existingUserByEmail = await UserModel.findOne({ email });

    // generate verifyCode
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // check if existing user by email is verified or not
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User is already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // if existingUserByEmail is not verified then it must come to change password
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } else {
      // if not existing user then make entry in DB

      // hash password
      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = new UserModel({
        username: username,
        email: email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
      
    }

    // send verification email
    const emailResponse = await sendVerificationEmail({
      email,
      username,
      verifyCode,
    });

    console.log("email response", emailResponse)

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registerd successfully | Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register the user :: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register the user",
      },
      { status: 500 }
    );
  }
}

