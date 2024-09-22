const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      "mongodb+srv://visheshkumar41:BwnxVrz3tkBnI90T@cluster0.fozhk6m.mongodb.net/Inventory-Management",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex:true,
        // useFindAndModify:false,
      }
    );
    console.log("connected to database.");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
