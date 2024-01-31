const User = require("../models/User");

const generateUniqueUsername = async () => {
  let username = generateRandomUsername();

  // Check if the generated username already exists in the database
  let existingUser = await User.findOne({ username });
  let retryCount = 0;
  const maxRetryCount = 10;

  // Keep generating a new username until a unique one is found or the maximum retry count is reached
  while (existingUser && retryCount < maxRetryCount) {
    // Generate a new random username
    username = generateRandomUsername();
    existingUser = await User.findOne({ username });

    retryCount++;
  }

  if (existingUser) {
    throw new Error("Failed to generate a unique username");
  }

  return username;
};

const generateRandomUsername = () => {
  const randomString = Math.random().toString(36).substring(2, 8); // Generate a random alphanumeric string
  const username = `user_${randomString}`; // Prefix the username with "user_"

  return username;
};

module.exports = { generateUniqueUsername };
