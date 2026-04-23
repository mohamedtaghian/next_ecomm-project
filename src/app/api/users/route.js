import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import User from "@/models/User";

// GET all users (admin only)
export async function GET(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    const adminErr = requireAdmin(auth);
    if (adminErr) return adminErr;

    const users = await User.find().select("-password").sort("-createdAt");
    return apiSuccess(users);
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
