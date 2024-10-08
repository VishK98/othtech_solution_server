const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const slugify = require("slugify"); // You can use this library for generating slugs

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Email address is invalid",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password should be at least 6 characters long"],
    },
    photo: {
      type: String,
      default: "https://robohash.org/default.png",
    },
    phone: {
      type: String,
      default: "+91",
    },
    bio: {
      type: String,
      maxLength: [250, "Bio should not be more than 250 characters long."],
      default: "bio",
    },
    isLoggedIn: {
      type: Boolean,
      default: false, // By default, user is not logged in when registered
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Pre-save hook to generate slug from name if not present
userSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
