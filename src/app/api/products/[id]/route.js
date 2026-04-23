import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import Product from "@/models/Product";
import "@/models/Category";
import "@/models/Brand";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id)
      .populate("category", "name _id")
      .populate("brand", "name _id");

    if (!product) return apiError("Product not found", 404);
    return apiSuccess(product);
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
    if (body.title) body.slug = body.title.toLowerCase().replace(/ /g, "-");

    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name")
      .populate("brand", "name");

    if (!product) return apiError("Product not found", 404);
    return apiSuccess(product, "Product updated");
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

    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return apiError("Product not found", 404);
    return apiSuccess(null, "Product deleted");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
