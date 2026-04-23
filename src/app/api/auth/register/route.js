import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { apiSuccess, apiError, apiCreated } from "@/lib/apiResponse";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, rePassword, phone } = body;

    if (!name || !email || !password || !rePassword || !phone) {
      return apiError("All fields are required");
    }
    if (password !== rePassword) {
      return apiError("Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiError("Email already in use", 409);
    }

    const user = await User.create({ name, email, password, phone });
    const token = signToken({ id: user._id, role: user.role });

    return apiCreated(
      { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } },
      "Registration successful"
    );
  } catch (err) {
    console.error(err);
    return apiError(err.message || "Registration failed", 500);
  }
}
