require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const productRouter = require("./routes/productRoutes");

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

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URI,
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("message", (data) => {
    console.log("Received message:", data);
    // You can process the received message here and send a response back if needed

    // Example: Sending a response back to the client
    socket.emit("response", "Hello from the server!");
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
