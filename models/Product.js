const mongoose = require("mongoose");
const createSlug = require("../utils/createSlug");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    productType: {
      type: String,
      required: [true, "Product type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    description: {
      type: String,
      required: [true, "Product details are required"],
    },
    productUnit: {
      type: String,
      required: [true, "Product unit is required"],
    },
    productPrice: {
      type: Number,
      required: [true, "Product price is required"],
    },
    discount: {
      type: Number,
      default: 0,  // Optional: set a default value for discount
    },
    stockAlert: {
      type: Number,
      required: [true, "Stock alert quantity is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    productCode: {
      type: String,
      unique: true,
    },
    image: {
      type: Buffer,
      required: true,
    },
    imageType: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

// Middleware to generate slug and productCode
productSchema.pre("save", async function (next) {
  const slug = createSlug(this.productName);
  this.slug = slug;

  // Generate a unique product code
  const productCode = `PRD-${Math.floor(100000 + Math.random() * 900000)}`;  // Generate a random 6-digit code
  const productExists = await this.constructor.findOne({ productCode });

  // Ensure that productCode is unique
  if (!productExists) {
    this.productCode = productCode;
  } else {
    this.productCode = `PRD-${Math.floor(100000 + Math.random() * 900000)}`;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
