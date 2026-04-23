import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, apiCreated } from "@/lib/apiResponse";
import Brand from "@/models/Brand";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const total = await Brand.countDocuments();
    const brands = await Brand.find()
      .sort("name")
      .skip(skip)
      .limit(limit);

    return apiSuccess({
      brands,
      metadata: {
        currentPage: page,
        numberOfPages: Math.ceil(total / limit),
        total,
      },
    });
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
    if (!name) return apiError("Brand name is required");

    const brand = await Brand.create({
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
      image,
    });
    return apiCreated(brand, "Brand created");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
