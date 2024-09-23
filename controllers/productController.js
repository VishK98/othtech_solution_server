const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const addProduct = async (req, res) => {
  try {
    const { product, category, price, quantity, description } = req.body;

    if (!req.file) {
      return res.status(400).json("Image is required.");
    }

    const productExists = await Product.findOne({ product });
    if (productExists) {
      return res.status(400).json("Product already exists.");
    }

    const imageBuffer = req.file.buffer;
    const imageMimeType = req.file.mimetype;

    if (!imageMimeType.startsWith('image/')) {
      return res.status(400).json("Invalid image type.");
    }

    const newProduct = new Product({
      product,
      category,
      price,
      quantity,
      description,
      image: imageBuffer,        // Store image as buffer
      imageType: imageMimeType,   // Store the MIME type
      slug: product,              // Generate slug from the product name
    });

    await newProduct.save();

    const imageUrl = `${req.protocol}://${req.get('host')}/api/product/${newProduct._id}/image`;

    res.status(200).json({
      message: "Product has been saved.",
      product: {
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
    res.status(500).json({ error: error.message });
  }
};




const getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.image) {
      return res.status(404).json("Image not found.");
    }

    const imageType = product.imageType;
    console.log("Image Type:", imageType);  // Log the image type

    if (!imageType || !imageType.startsWith("image/")) {
      return res.status(400).json("Invalid image type.");
    }

    // Set the correct content type
    res.set("Content-Type", imageType);
    res.send(product.image);  // Send the image binary data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product, category, price, quantity, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { product, category, price, quantity, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json("Product not found");
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductImage
};
