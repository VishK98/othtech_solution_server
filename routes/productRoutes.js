const express = require("express");
const router = express.Router();
const multer = require("multer"); // Ensure multer is required before use

// Import necessary controllers and middleware
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductImage
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware"); // Ensure you have this middleware defined

// Set up multer memory storage for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to add a new product with image upload
router.post("/create", upload.single("image"), protect, addProduct);

// Route to get all products
router.get("/all-products", getProducts);

// Route to get a specific product by ID
router.get("/:id", getProduct);

// Route to get the image of a product
router.get("/:id/image", getProductImage);

// Route to update a product (optionally with an image upload)
router.put("/update/:id", upload.single("image"), protect, updateProduct);

// Route to delete a product by ID
router.delete("/:id", protect, deleteProduct);

module.exports = router;
