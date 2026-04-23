import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, apiCreated } from "@/lib/apiResponse";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort("name");
    return apiSuccess(categories);
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    const adminErr = requireAdmin(auth);
    if (adminErr) return adminErr;

    const { name, image } = await request.json();
    if (!name) return apiError("Category name is required");

    const category = await Category.create({
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
      image,
    });
    return apiCreated(category, "Category created");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
