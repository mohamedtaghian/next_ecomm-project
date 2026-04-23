import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import Category from "@/models/Category";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const category = await Category.findById(params.id);
    if (!category) return apiError("Category not found", 404);
    return apiSuccess(category);
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    const adminErr = requireAdmin(auth);
    if (adminErr) return adminErr;

    const body = await request.json();
    if (body.name) body.slug = body.name.toLowerCase().replace(/ /g, "-");

    const category = await Category.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!category) return apiError("Category not found", 404);
    return apiSuccess(category, "Category updated");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    const adminErr = requireAdmin(auth);
    if (adminErr) return adminErr;

    const category = await Category.findByIdAndDelete(params.id);
    if (!category) return apiError("Category not found", 404);
    return apiSuccess(null, "Category deleted");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
