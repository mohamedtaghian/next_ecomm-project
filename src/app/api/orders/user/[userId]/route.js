import { connectDB } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/Product";
import "@/models/Category";
import "@/models/Brand";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    // Users can only see their own orders; admins can see anyone's
    if (auth.role !== "admin" && auth.userId !== params.userId) {
      return apiError("Unauthorized", 403);
    }

    const orders = await Order.find({ user: params.userId })
      .populate("cartItems.product", "title imageCover price category brand")
      .sort("-createdAt");

    return apiSuccess(orders);
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
