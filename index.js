require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const productRouter = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB!");
});
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to NMH API!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/product", productRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
