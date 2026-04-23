import { authenticate } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const user = await User.findById(auth.userId);
    if (!user) return apiError("User not found", 404);

    return apiSuccess({ decoded: { id: user._id, role: user.role } });
  } catch (err) {
    return apiError("Token verification failed", 401);
  }
}
