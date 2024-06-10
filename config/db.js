const mongoose = require("mongoose");

const connectDb = () => {

    mongoose
      .connect(
        process.env.MONGODB_URL,
      )
      .then(() =>
        console.log("✔ Database connected successfully!")
      )
      .catch((err) => console.error("Could not connect to MongoDB.. ", err));
  };

  module.exports = connectDb;