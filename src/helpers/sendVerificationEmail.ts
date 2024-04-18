import { resend } from "@/lib/resend";
import EmailTemplate from "../../email/Email-Template";
import { ApiResponse } from "@/types/ApiResponse";

// types
interface SendVerificationEmailProps {
  email: string;
  username: string;
  verifyCode: string;
}

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: SendVerificationEmailProps): Promise<ApiResponse> {
  try {
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Genuine Feedback | Email verification",
      react: EmailTemplate({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification Email sent successfully",
      data: emailResponse,
    };
  } catch (emailError) {
    console.log("Failed to send verification email :: ", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
