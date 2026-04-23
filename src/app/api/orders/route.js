import { connectDB } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { apiSuccess, apiError, apiCreated } from "@/lib/apiResponse";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import User from "@/models/User";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";
import "@/models/Category";
import "@/models/Brand";

// GET /api/orders - admin gets all orders
export async function GET(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    let orders;
    if (auth.role === "admin") {
      orders = await Order.find()
        .populate("user", "name email")
        .populate("cartItems.product", "title imageCover")
        .sort("-createdAt");
    } else {
      orders = await Order.find({ user: auth.userId })
        .populate("cartItems.product", "title imageCover price category brand")
        .sort("-createdAt");
    }

    return apiSuccess(orders);
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

// POST /api/orders - place cash order (cartId in body)
export async function POST(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const { cartId, shippingAddress } = await request.json();
    if (!cartId || !shippingAddress) {
      return apiError("cartId and shippingAddress are required");
    }

    const cart = await Cart.findById(cartId).populate("cartItems.product");
    if (!cart) return apiError("Cart not found", 404);
    if (cart.user.toString() !== auth.userId) return apiError("Unauthorized", 403);

    const taxPrice = 0;
    const shippingPrice = 0;
    const totalOrderPrice = cart.totalCartPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: auth.userId,
      cartItems: cart.cartItems.map((item) => ({
        product: item.product._id,
        count: item.count,
        price: item.price,
      })),
      shippingAddress,
      taxPrice,
      shippingPrice,
      totalOrderPrice,
      paymentMethodType: "cash",
      isPaid: false,
    });

    // Decrement stock
    await Promise.all(
      cart.cartItems.map((item) =>
        Product.findByIdAndUpdate(item.product._id, {
          $inc: { quantity: -item.count, sold: item.count },
        })
      )
    );

    // Clear cart
    await Cart.findByIdAndDelete(cartId);

    // Send confirmation email (non-blocking)
    try {
      const user = await User.findById(auth.userId);
      await sendEmail({
        to: user.email,
        subject: "FreshCart Order Confirmation",
        html: orderConfirmationEmail(user.name, order),
      });
    } catch (_) {}

    const populated = await order.populate("cartItems.product", "title imageCover category brand");
    return apiCreated(
      { status: "success", data: populated },
      "Order placed successfully"
    );
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
