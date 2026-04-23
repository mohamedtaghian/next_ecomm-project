import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
    },
    slug: { type: String, lowercase: true },
    image: String,
  },
  { timestamps: true }
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
export default Brand;
