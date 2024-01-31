// Require necessary modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

// Create Express app
const app = express();

// Set up middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB!");
});
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Define routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1/user", userRouter);
// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
