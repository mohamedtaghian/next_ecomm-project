import { connectDB } from "@/lib/db";
import { authenticate, requireAdmin } from "@/lib/auth";
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

    const order = await Order.findById(params.id)
      .populate("user", "name email")
      .populate("cartItems.product", "title imageCover price category brand");

    if (!order) return apiError("Order not found", 404);
    if (auth.role !== "admin" && order.user._id.toString() !== auth.userId) {
      return apiError("Unauthorized", 403);
    }

    return apiSuccess(order);
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

    const { status, isPaid, isDelivered } = await request.json();
    const update = {};
    if (status) update.status = status;
    if (isPaid !== undefined) {
      update.isPaid = isPaid;
      if (isPaid) update.paidAt = new Date();
    }
    if (isDelivered !== undefined) {
      update.isDelivered = isDelivered;
      if (isDelivered) update.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(params.id, update, { new: true })
      .populate("user", "name email")
      .populate("cartItems.product", "title imageCover");

    if (!order) return apiError("Order not found", 404);
    return apiSuccess(order, "Order updated");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
