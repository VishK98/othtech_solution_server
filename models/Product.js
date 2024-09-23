const mongoose = require("mongoose");
const createSlug = require("../utils/createSlug");

const productSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: [true, "Product is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    description: {
      type: String,
      required: [true, "Product details is required"],
    },
    image: {
      type: Buffer,         // Store image as a Buffer
      required: true,       // Image is required
    },
    imageType: {
      type: String,         // Store MIME type as a String (e.g., 'image/jpeg')
      required: true,
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  const slug = createSlug(this.slug);
  this.slug = slug;
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
