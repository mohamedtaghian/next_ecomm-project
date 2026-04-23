import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, apiCreated } from "@/lib/apiResponse";
import Product from "@/models/Product";
// Must import these so Mongoose registers the schemas before .populate() runs
import "@/models/Category";
import "@/models/Brand";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "40");
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    const categoryId = searchParams.get("category[in]") || searchParams.get("category");
    const brandId = searchParams.get("brand");
    const keyword = searchParams.get("keyword");

    if (categoryId) filter.category = categoryId;
    if (brandId) filter.brand = brandId;
    if (keyword) filter.title = { $regex: keyword, $options: "i" };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("brand", "name")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");

    return apiSuccess({
      products,
      metadata: {
        currentPage: page,
        numberOfPages: Math.ceil(total / limit),
        limit,
        total,
      },
    });
  } catch (err) {
    console.error(err);
    return apiError(err.message || "Server error", 500);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    const adminErr = requireAdmin(auth);
    if (adminErr) return adminErr;

    const body = await request.json();
    const { title, description, price, priceAfterDiscount, quantity, imageCover, images, category, brand } = body;

    if (!title || !description || !price || quantity === undefined || !imageCover || !category) {
      return apiError("title, description, price, quantity, imageCover, category are required");
    }

    const product = await Product.create({
      title,
      slug: title.toLowerCase().replace(/ /g, "-"),
      description,
      price,
      priceAfterDiscount,
      quantity,
      imageCover,
      images: images || [],
      category,
      brand,
    });

    const populated = await product.populate(["category", "brand"]);
    return apiCreated(populated, "Product created");
  } catch (err) {
    console.error(err);
    return apiError(err.message || "Server error", 500);
  }
}
