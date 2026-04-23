import { connectDB } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { sendEmail, resetCodeEmail } from "@/lib/email";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();
    if (!email) return apiError("Email is required");

    const user = await User.findOne({ email });
    if (!user) return apiError("No account with that email", 404);

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash("sha256").update(resetCode).digest("hex");

    user.passwordResetCode = hashedCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
    user.passwordResetVerified = false;
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        to: user.email,
        subject: "FreshCart Password Reset Code",
        html: resetCodeEmail(user.name, resetCode),
      });
    } catch (emailErr) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return apiError("Failed to send reset email. Try again later.", 500);
    }

    return apiSuccess(null, "Reset code sent to your email");
  } catch (err) {
    console.error(err);
    return apiError(err.message || "Server error", 500);
  }
}
