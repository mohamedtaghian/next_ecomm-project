import { connectDB } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(request) {
  try {
    await connectDB();
    const { resetCode } = await request.json();
    if (!resetCode) return apiError("Reset code is required");

    const hashedCode = crypto.createHash("sha256").update(resetCode).digest("hex");

    const user = await User.findOne({
      passwordResetCode: hashedCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return apiError("Invalid or expired reset code", 400);

    user.passwordResetVerified = true;
    await user.save({ validateBeforeSave: false });

    return apiSuccess(null, "Code verified");
  } catch (err) {
    console.error(err);
    return apiError(err.message || "Server error", 500);
  }
}
