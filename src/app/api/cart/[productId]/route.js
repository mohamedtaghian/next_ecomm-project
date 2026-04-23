import { connectDB } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import Cart from "@/models/Cart";
import "@/models/Product";
import "@/models/Category";
import "@/models/Brand";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const { count } = await request.json();
    if (!count || count < 1) return apiError("Count must be at least 1");

    const cart = await Cart.findOne({ user: auth.userId });
    if (!cart) return apiError("Cart not found", 404);

    const item = cart.cartItems.find(
      (i) => i.product.toString() === params.productId
    );
    if (!item) return apiError("Item not in cart", 404);

    item.count = count;
    await cart.save();
    await cart.populate("cartItems.product", "title imageCover price ratingsAverage category brand quantity");

    return apiSuccess({
      cartId: cart._id,
      numOfCartItems: cart.cartItems.length,
      data: { products: cart.cartItems, totalCartPrice: cart.totalCartPrice },
    }, "Cart updated");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const cart = await Cart.findOne({ user: auth.userId });
    if (!cart) return apiError("Cart not found", 404);

    cart.cartItems = cart.cartItems.filter(
      (i) => i.product.toString() !== params.productId
    );
    await cart.save();
    await cart.populate("cartItems.product", "title imageCover price ratingsAverage category brand quantity");

    return apiSuccess({
      cartId: cart._id,
      numOfCartItems: cart.cartItems.length,
      data: { products: cart.cartItems, totalCartPrice: cart.totalCartPrice },
    }, "Item removed");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
