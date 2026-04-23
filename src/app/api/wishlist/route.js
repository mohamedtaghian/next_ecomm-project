import { connectDB } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import User from "@/models/User";
import "@/models/Product";
import "@/models/Category";
import "@/models/Brand";

export async function GET(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const user = await User.findById(auth.userId).populate(
      "wishlist",
      "title imageCover price ratingsAverage category brand quantity"
    );

    return apiSuccess({
      count: user.wishlist.length,
      data: user.wishlist,
    });
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const { productId } = await request.json();
    if (!productId) return apiError("productId is required");

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate("wishlist", "title imageCover price ratingsAverage");

    return apiSuccess(
      { count: user.wishlist.length, data: user.wishlist },
      "Product added to wishlist"
    );
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
