const express = require("express");
const productRouter = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product-images",
    format: (req, file) => {
      const fileExtension = file.originalname.split(".").pop();
      return fileExtension;
    },
    public_id: (req, file) => file.originalname,
  },
});
const upload = multer({ storage: cloudinaryStorage });

// Create a new product
productRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, options, category } = req.body;

    console.log(req.body)

    // Create product object
    const product = new Product({
      name,
      price,
      description,
      options,
      category,
      imageSrc: req.file.path,
      imageAlt: req.file.originalname,
    });

    // Save the product to the database
    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Get all products
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

// Get a single product by ID
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});

// Update a product by ID
productRouter.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, options, category, stock } = req.body;

    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product properties
    product.name = name;
    product.price = price;
    product.description = description;
    product.options = options;
    product.category = category;
    product.stock = stock;

    if (req.file) {
      // Delete current image from Cloudinary
      if (product.imageSrc) {
        const publicId = product.imageSrc.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Update product image properties
      product.imageSrc = req.file.path;
      product.imageAlt = req.file.originalname;
    }

    // Save the updated product to the database
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product by ID
productRouter.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = productRouter;
