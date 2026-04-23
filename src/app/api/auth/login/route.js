import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return apiError("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return apiError("Invalid email or password", 401);
    }

    if (!user.active) {
      return apiError("Your account has been deactivated. Contact support.", 403);
    }

    const token = signToken({ id: user._id, role: user.role });

    return apiSuccess(
      { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } },
      "Login successful"
    );
  } catch (err) {
    console.error(err);
    return apiError(err.message || "Login failed", 500);
  }
}
