import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import Brand from "@/models/Brand";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const brand = await Brand.findById(params.id);
    if (!brand) return apiError("Brand not found", 404);
    return apiSuccess(brand);
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

    const brand = await Brand.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!brand) return apiError("Brand not found", 404);
    return apiSuccess(brand, "Brand updated");
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

    const brand = await Brand.findByIdAndDelete(params.id);
    if (!brand) return apiError("Brand not found", 404);
    return apiSuccess(null, "Brand deleted");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
