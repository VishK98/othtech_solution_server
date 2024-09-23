const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./database/connect");
const errorHandler = require("./middleware/errorsMiddleware");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config({ path: ".env" });

const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS Configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins for testing
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Connect to the database
connectDB();

// Root route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/users", require("./routes/userRoutes")); // User-related routes
app.use("/api/category", require("./routes/categoryRoutes")); // Category-related routes
app.use("/api/product", require("./routes/productRoutes")); // Product-related routes\


// Error handling middleware
app.use(errorHandler);

// Define the port
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
