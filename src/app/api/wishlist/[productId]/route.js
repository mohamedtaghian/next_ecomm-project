import { connectDB } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import User from "@/models/User";
import "@/models/Product";
import "@/models/Category";
import "@/models/Brand";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $pull: { wishlist: params.productId } },
      { new: true }
    ).populate("wishlist", "title imageCover price ratingsAverage");

    return apiSuccess(
      { count: user.wishlist.length, data: user.wishlist },
      "Product removed from wishlist"
    );
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
