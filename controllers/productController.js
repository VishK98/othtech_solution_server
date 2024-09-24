const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// Add product
const addProduct = async (req, res) => {
  try {
    const { product, category, price, quantity, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "Image is required." });
    }

    const productExists = await Product.findOne({ product });
    if (productExists) {
      return res.status(400).json({ status: false, message: "Product already exists." });
    }

    const imageBuffer = req.file.buffer;
    const imageMimeType = req.file.mimetype;

    if (!imageMimeType.startsWith('image/')) {
      return res.status(400).json({ status: false, message: "Invalid image type." });
    }

    const newProduct = new Product({
      product,
      category,
      price,
      quantity,
      description,
      image: imageBuffer,
      imageType: imageMimeType,
      slug: product,
    });

    await newProduct.save();

    const imageUrl = `${req.protocol}://${req.get('host')}/api/product/${newProduct._id}/image`;

    res.status(200).json({
      status: true,
      message: "Product has been saved.",
      data: {
        id: newProduct._id,
        product: newProduct.product,
        category: newProduct.category,
        price: newProduct.price,
        quantity: newProduct.quantity,
        description: newProduct.description,
        imageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get product image
const getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.image) {
      return res.status(404).json({ status: false, message: "Image not found." });
    }

    const imageType = product.imageType;
    if (!imageType || !imageType.startsWith("image/")) {
      return res.status(400).json({ status: false, message: "Invalid image type." });
    }

    res.set("Content-Type", imageType);
    res.send(product.image);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithImageLinks = products.map((product) => ({
      id: product._id,
      product: product.product,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      imageUrl: `${req.protocol}://${req.get('host')}/api/product/${product._id}/image`,
    }));

    res.status(200).json({
      status: true,
      data: productsWithImageLinks,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found." });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/api/product/${req.params.id}/image`;
    const { image, ...productWithoutImage } = product._doc;

    res.status(200).json({
      status: true,
      data: {
        ...productWithoutImage,
        imageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { product, category, price, quantity, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { product, category, price, quantity, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    res.status(200).json({
      status: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
};
