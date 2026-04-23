import { connectDB } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import "@/models/Category";
import "@/models/Brand";

export async function GET(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const cart = await Cart.findOne({ user: auth.userId }).populate(
      "cartItems.product",
      "title imageCover price ratingsAverage category brand quantity"
    );

    if (!cart) {
      return apiSuccess({
        cartId: null,
        numOfCartItems: 0,
        data: { products: [], totalCartPrice: 0 },
      });
    }

    return apiSuccess({
      cartId: cart._id,
      numOfCartItems: cart.cartItems.length,
      data: {
        products: cart.cartItems,
        totalCartPrice: cart.totalCartPrice,
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
    if (auth.error) return auth.error;

    const { productId } = await request.json();
    if (!productId) return apiError("productId is required");

    const product = await Product.findById(productId);
    if (!product) return apiError("Product not found", 404);

    let cart = await Cart.findOne({ user: auth.userId });

    if (!cart) {
      cart = await Cart.create({
        user: auth.userId,
        cartItems: [{ product: productId, price: product.price, count: 1 }],
      });
    } else {
      const existingItem = cart.cartItems.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.count += 1;
      } else {
        cart.cartItems.push({ product: productId, price: product.price, count: 1 });
      }
      await cart.save();
    }

    await cart.populate("cartItems.product", "title imageCover price ratingsAverage category brand quantity");

    return apiSuccess(
      {
        cartId: cart._id,
        numOfCartItems: cart.cartItems.length,
        data: { products: cart.cartItems, totalCartPrice: cart.totalCartPrice },
      },
      "Product added to cart"
    );
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    await Cart.findOneAndDelete({ user: auth.userId });
    return apiSuccess(null, "Cart cleared");
  } catch (err) {
    return apiError(err.message || "Server error", 500);
  }
}
