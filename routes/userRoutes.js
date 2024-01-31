const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/userController");
const { asyncHandler } = require("../utils/asyncHandler");
const { generateUniqueUsername } = require("../utils/uniqueUsername");
const User = require("../models/User");

userRouter.post(
  "/authcheck",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Email already exists, send a response indicating that the email is taken
      return res.status(200).json({user: existingUser});
    }

    // Generate a unique username
    const username = await generateUniqueUsername();

    // Create a new user with the unique username and provided email
    const newUser = new User({
      username,
      email,
    });
    // Save the new user to the database
    await newUser.save();
    res.status(200).json({user: newUser});
  })
);

// POST /users - Create a new user
userRouter.post("/", UserController.createUser);

// GET /users/:id - Get user by ID
userRouter.get("/:id", UserController.getUserById);

// PUT /users/:id - Update user by ID
userRouter.put("/:id", UserController.updateUserById);

// DELETE /users/:id - Delete user by ID
userRouter.delete("/:id", UserController.deleteUserById);

module.exports = userRouter;
