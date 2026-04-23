import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  count: { type: Number, default: 1 },
  price: Number,
  color: String,
});

const cartSchema = new mongoose.Schema(
  {
    cartItems: [cartItemSchema],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    coupon: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate total
cartSchema.pre("save", function (next) {
  this.totalCartPrice = this.cartItems.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
  next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
