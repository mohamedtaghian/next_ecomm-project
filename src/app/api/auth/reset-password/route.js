import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import User from "@/models/User";

export async function PUT(request) {
  try {
    await connectDB();
    const { email, newPassword } = await request.json();
    if (!email || !newPassword) return apiError("Email and new password are required");

    const user = await User.findOne({ email });
    if (!user) return apiError("No account with that email", 404);
    if (!user.passwordResetVerified) return apiError("Reset code not verified", 400);

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    const token = signToken({ id: user._id, role: user.role });
    return apiSuccess({ token }, "Password reset successfully");
  } catch (err) {
    console.error(err);
    return apiError(err.message || "Server error", 500);
  }
}
