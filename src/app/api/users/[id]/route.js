import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    const adminErr = requireAdmin(auth);
    if (adminErr) return adminErr;

    const user = await User.findById(params.id).select("-password");
    if (!user) return apiError("User not found", 404);
    return apiSuccess(user);
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

// Admin can update role or active status
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    const adminErr = requireAdmin(auth);
    if (adminErr) return adminErr;

    const { role, active } = await request.json();
    const update = {};
    if (role) update.role = role;
    if (active !== undefined) update.active = active;

    const user = await User.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return apiError("User not found", 404);
    return apiSuccess(user, "User updated");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

// Soft delete — set active: false
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    const adminErr = requireAdmin(auth);
    if (adminErr) return adminErr;

    const user = await User.findByIdAndUpdate(
      params.id,
      { active: false },
      { new: true }
    ).select("-password");

    if (!user) return apiError("User not found", 404);
    return apiSuccess(user, "User deactivated");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
